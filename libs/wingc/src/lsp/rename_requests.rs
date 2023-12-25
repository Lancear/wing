use super::symbol_locator::SymbolLocator;
use super::sync::{check_utf8, WING_TYPES};
use crate::lsp::sync::PROJECT_DATA;
use crate::visit::Visit;
use crate::wasm_util::extern_json_fn;
use crate::{lsp::symbol_references::SymbolReferences, type_check::symbol_env::LookupResult};
use lsp_types::{RenameParams, TextEdit, WorkspaceEdit};
use std::collections::HashMap;

#[no_mangle]
pub unsafe extern "C" fn wingc_on_rename_request(ptr: u32, len: u32) -> u64 {
	extern_json_fn(ptr, len, on_rename_request)
}

pub fn on_rename_request(params: RenameParams) -> Option<WorkspaceEdit> {
	WING_TYPES.with(|types| {
		let types = types.borrow();
		PROJECT_DATA.with(|project_data| {
			let project_data = project_data.borrow();
			let uri = params.text_document_position.text_document.uri;
			let file = check_utf8(uri.to_file_path().expect("LSP only works on real filesystems"));
			let file_scope = project_data.asts.get(&file).unwrap();

			let mut symbol_finder = SymbolLocator::new(&types, params.text_document_position.position.into());
			symbol_finder.visit_scope(file_scope);

			if let Some(lookup) = symbol_finder.lookup_located_symbol() {
				if let LookupResult::Found(_, info) = &lookup {
					let definition_span = &info.span;
					let mut symbol_references = SymbolReferences::new(uri.clone(), definition_span);
					symbol_references.visit_scope(file_scope);

					let mut changes = HashMap::new();
					let mut file_changes = vec![];

					for reference in symbol_references.references {
						file_changes.push(TextEdit::new(reference.range, params.new_name.clone()));
					}

					changes.insert(uri, file_changes);

					let edit = WorkspaceEdit {
						changes: Some(changes),
						document_changes: None,
						change_annotations: None,
					};

					return Some(edit);
				}
			}

			None
		})
	})
}

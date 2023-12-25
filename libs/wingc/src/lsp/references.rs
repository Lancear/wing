use super::sync::{check_utf8, WING_TYPES};
use super::{symbol_locator::SymbolLocator, symbol_references::SymbolReferences};
use crate::lsp::sync::PROJECT_DATA;
use crate::type_check::symbol_env::LookupResult;
use crate::visit::Visit;
use crate::wasm_util::extern_json_fn;
use lsp_types::{Location, ReferenceParams};

#[no_mangle]
pub unsafe extern "C" fn wingc_on_references(ptr: u32, len: u32) -> u64 {
	extern_json_fn(ptr, len, on_references)
}

pub fn on_references(params: ReferenceParams) -> Vec<Location> {
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
					let mut symbol_references = SymbolReferences::new(uri, definition_span);
					symbol_references.visit_scope(file_scope);
					return symbol_references.references;
				}
			}

			vec![]
		})
	})
}

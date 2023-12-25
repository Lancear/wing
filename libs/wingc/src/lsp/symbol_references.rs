use lsp_types::{Location, Position, Range, Url};

use crate::{
	ast::{ExprKind, Reference, Scope, Symbol, UserDefinedType},
	diagnostic::WingSpan,
	visit::Visit,
};

struct ScopeInfo {
	symbol_shadowed: bool,
}

pub struct SymbolReferences<'span> {
	uri: Url,
	span: &'span WingSpan,
	scopes: Vec<ScopeInfo>,
	pub references: Vec<Location>,
	pub symbol: Option<Symbol>,
}

impl<'span> SymbolReferences<'span> {
	pub fn new(uri: Url, span: &'span WingSpan) -> Self {
		Self {
			uri,
			span,
			symbol: None,
			scopes: vec![ScopeInfo { symbol_shadowed: false }],
			references: vec![],
		}
	}
}

impl<'span> Visit<'_> for SymbolReferences<'span> {
	fn visit_scope(&mut self, node: &'_ Scope) {
		let parent_scope = self.scopes.last().unwrap();
		self.scopes.push(ScopeInfo {
			symbol_shadowed: parent_scope.symbol_shadowed,
		});

		for stmt in &node.statements {
			self.visit_stmt(stmt);
		}

		self.scopes.pop();
	}

	fn visit_symbol(&mut self, node: &'_ Symbol) {
		if self.scopes.last().is_some_and(|s| s.symbol_shadowed) {
			return;
		};

		if let Some(symbol) = &self.symbol {
			if symbol.name == node.name {
				self.scopes.last_mut().unwrap().symbol_shadowed = true;
			}
		} else if node.span.contains_span(&self.span) {
			self.symbol = Some(node.clone());
			self.references.push(Location::new(
				self.uri.clone(),
				Range {
					start: Position {
						line: node.span.start.line,
						character: node.span.start.col,
					},
					end: Position {
						line: node.span.end.line,
						character: node.span.end.col,
					},
				},
			));
		}
	}

	fn visit_reference(&mut self, node: &'_ Reference) {
		if self.scopes.last().is_some_and(|s| s.symbol_shadowed) {
			return;
		};

		match node {
			Reference::Identifier(id) => {
				if let Some(symbol) = &self.symbol {
					if symbol.name == id.name && !symbol.span.contains_span(&id.span) {
						self.references.push(Location::new(
							self.uri.clone(),
							Range {
								start: Position {
									line: id.span.start.line,
									character: id.span.start.col,
								},
								end: Position {
									line: id.span.end.line,
									character: id.span.end.col,
								},
							},
						));
					}
				}
			}
			Reference::InstanceMember { object, .. } => {
				if let ExprKind::Reference(r) = &object.kind {
					self.visit_reference(&r);
					return;
				}
			}
			Reference::TypeMember { type_name, .. } => {
				self.visit_user_defined_type(type_name);
				return;
			}
		}
	}

	fn visit_user_defined_type(&mut self, node: &'_ UserDefinedType) {
		if node.span.is_default() {
			return;
		}

		if node.fields.is_empty() {
			self.visit_reference(&Reference::Identifier(node.root.clone()));
		} else {
			let mut partial = node.clone();
			let field = partial.fields.pop().unwrap();
			self.visit_reference(&Reference::TypeMember {
				type_name: partial,
				property: field,
			})
		}
	}
}

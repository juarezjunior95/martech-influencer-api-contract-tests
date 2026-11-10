# Changelog - MarkdownRenderer

## [1.1.0] - 2025-03-03

### Security
- Added strict XSS sanitization (whitelist attributes, blocked event handlers)
- Added stack overflow prevention (depth limit on recursive text extraction)

### Fixed
- Accordion state desync with native `<details>` element
- Variable shadowing in summary extraction
- Fragile dependency on ReactMarkdown key naming

### Added
- ARIA attributes for accessibility (aria-expanded, aria-controls, role)
- Helper functions: `extractSummaryText`, `isSummaryElement`
- Export `AccordionProps` interface

### Changed
- Split into 4 files (component, config, utils, components)
- Improved code readability (removed nested ifs, added type guards)
- Added displayName to all components

### Docs
- Added JSDoc to security-critical functions
- Documented null-return components

---

## [1.0.0] - Initial Release
- Basic markdown rendering with custom tags
- Accordion support for `<details>` tags
- Custom handlers for tabgroup, chartsgroup

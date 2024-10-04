# Changelog


## v0.0.1-dev.2

[compare changes](https://gh-antho/anthocodes99/do-maker-remix/compare/v0.0.1-dev.1...v0.0.1-dev.2)

### 🚀 Enhancements

- **ui:** Add new variant `success` to button (577b75e)
- **db:** Add new column description to `deliveryOrderItems` (06f4459)
- **route:** (wip) implement Edit view for Delivery Order (6cf75d7)
- **db:** Add new column position (7b5e0db)
- **route:** (wip) implement items delete, cancel for `deliveryOrder.$doId_.edit` (35c7e3d)
- **route:** Implement functionality for EditHeaders (f6d951a)
- **db:** Add new column `position` to `deliveryOrderHeaders` (7a194af)
- **db:** New functions for db-related checks (32757c5)
- **route:** Implement input sanitization check (e8d5086)

### 🩹 Fixes

- **db:** Add `notNull` to `deliveryOrderId` on `deliveryOrderHeaders` (99dc944)

### 💅 Refactors

- **ui:** Add new color `success` (d3d3ad7)
- **routes:** Pull headers code out from `deliveryOrder.$doId_.edit` (9979632)
- **route:** Improve EditHeaders to stop redundant update (8addce6)

### 📦 Build

- Add new dependency `scule` (e1b4dd7)
- Add new dependency `drizzle-zod` (7eddd04)

### 🏡 Chore

- Add vscode `settings.json` (bf8e122)

### ❤️ Contributors

- Anthocodes99 ([@anthocodes99](http://github.com/anthocodes99))

## v0.0.1-dev.1


### 🚀 Enhancements

- **ui:** Add new ui components (48dab17)
- **db:** Add boilerplate code for drizzle (54ed6fc)
- **db:** Add tables (83eb664)
- **components:** (wip) add new component `Navbar` (894089b)
- **routes:** Add new landing page (cbc1257)
- **ui:** New component `table` (64276bb)
- **routes:** Add new delivery orders list page (e7b9930)
- **routes:** New page for company do list view (b884e87)
- **ui:** Add new component `button` (a3cbc1d)
- **ui:** Add new component `dropdown-menu` (cba9b6a)
- **route:** New route `/delivery-order/$doId` (4d89194)
- **db:** Add new tables and changes (b3b9d4d)

### 🩹 Fixes

- **route:** Type mismatch on `db` call (7ab1b9b)

### 💅 Refactors

- **db:** Remove table_filter and rename db (fa913ba)
- Remove unused imports (d4c28af)
- **component:** `data-table` now respond to size changes (a70b888)

### 📦 Build

- **db:** Add drizzle-related scripts (905a3a2)
- Add new dependency `tiny-invariant` (60ab15e)
- **ui:** Add new dependency `tanstack/react-table` (d8c2df0)

### 🏡 Chore

- Add editorconfig (53f206f)

### ❤️ Contributors

- Anthocodes99 ([@anthocodes99](http://github.com/anthocodes99))


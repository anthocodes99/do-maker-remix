# Changelog


## v0.0.2

[compare changes](https://gh-antho/anthocodes99/do-maker-remix/compare/v0.0.1...v0.0.2)

### 🚀 Enhancements

- **route:** Auto-focus on newly added item input (281a34a)
- **route:** Improve UI for login page (31baf0a)
- **route:** Implement delete functionality for delivery orders (660cb14)

### 📦 Build

- Add cl scripts (0571932)

### ❤️ Contributors

- Anthocodes99 ([@anthocodes99](http://github.com/anthocodes99))

## v0.0.1

[compare changes](https://gh-antho/anthocodes99/do-maker-remix/compare/v0.0.1-dev.4...v0.0.1)

### 🩹 Fixes

- **route:** Unable to add more than 1 items at a time (59e947d)
- **route:** Prevent `do_edit` and `do_new` from submitting empty items (ea02c04)

### 💅 Refactors

- **route:** Move shared components to a `/components` directory (82dbb2c)

### 📦 Build

- Add new script (1282aa2)

### 🏡 Chore

- README (2ec8e89)

### ❤️ Contributors

- Anthocodes99 ([@anthocodes99](http://github.com/anthocodes99))

## v0.0.1-dev.4

[compare changes](https://gh-antho/anthocodes99/do-maker-remix/compare/v0.0.1-dev.3...v0.0.1-dev.4)

### 🚀 Enhancements

- **route:** `delivery-order` `edit` route now does auth check (f714f8e)
- **ui:** Add new components (df4c0d2)
- **route:** `EditItems` will create 1 empty input if Delivery Order has no items (48efd4f)
- **route:** (wip) new route `delivery-order/new` (1b00b91)
- **route:** `do_new` now able to create delivery orders (ae7ff93)

### 🩹 Fixes

- **db:** Typo on table `companies` `createdby` (0c5d641)
- **db:** Adds `notNull()` to `deliveryOrder.createdBy` and removes `unique()` from `deliveryOrderItems` (53fb653)
- **route:** Application error due to strict zod checks (3c34e41)

### 💅 Refactors

- Decouple EditHeaders (cc028a2)
- **db:** Export db types (3d7b1c1)
- **route:** Pulled out `do_edit`'s `action` code (797a838)

### 📦 Build

- Add new dependencies (91a2803)

### ❤️ Contributors

- Anthocodes99 ([@anthocodes99](http://github.com/anthocodes99))

## v0.0.1-dev.3

[compare changes](https://gh-antho/anthocodes99/do-maker-remix/compare/v0.0.1-dev.2...v0.0.1-dev.3)

### 🚀 Enhancements

- **route:** Implement date edit for `DeliveryOrderEdit` (5793686)
- **auth:** (wip) basic implementation for auth (6096607)
- **auth:** (wip) basic implementation of login page (b7dd821)
- **auth:** Implement logout (7eeb5dd)
- **route:** Improve navbar and add user session and logout (555a01a)

### 🩹 Fixes

- **db:** Wrong column name for `postedBy` on table `deliveryOrders` (72afdb2)
- **auth:** (major) remove password hash from being sent to client (e421c98)
- **build:** Typo in `cl:dev` (da4fdef)

### 💅 Refactors

- **route:** Pulled out some code into it's own components (1f36994)
- **db:** (temp) enable logs (faa5060)
- **db:** Export type User (1ca2486)
- Remove unused imports and test console logs (df43b4d)

### 📦 Build

- Add new command for dev changelog (823f14b)
- Add new dependencies `remix-auth` and `remix-auth-form` (77c832c)

### 🏡 Chore

- Add /db/migrations to gitignore (d91eb9f)

### ❤️ Contributors

- Anthocodes99 ([@anthocodes99](http://github.com/anthocodes99))

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


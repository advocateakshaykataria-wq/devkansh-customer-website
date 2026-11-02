# Devkansh Interior V160 — Vercel deployment

This project packages the supplied V160 HTML interface with Vercel serverless API routes.

## Important deployment model
Deploy the Customer Website and Admin Panel as **two separate Vercel projects**. Configure the **same** `GOOGLE_SHEET_ID`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `SESSION_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` in both projects so they use the same data store and admin credentials. Do not change the existing live Vercel project.

## Google setup
1. Create a Google Cloud service account and enable Google Sheets API and Google Drive API.
2. Share the target Google Sheet and Drive folder with the service account `client_email` as Editor.
3. Create a Google Sheet and add a tab named `AppData`. The API stores the app database JSON in cell B2.
4. Put the Sheet ID, Drive folder ID, and full service-account JSON in Vercel Environment Variables.
5. Set a long random `SESSION_SECRET`, and set a new strong admin username/password.

## Deploy
1. Extract this ZIP.
2. Push its folder contents to a **new** GitHub repository.
3. Import that repository into a **new** Vercel project.
4. Add Environment Variables, deploy, then repeat for the other ZIP.
5. Both deployments must use the same shared environment values.

## Caveats to verify before production
- This package preserves the supplied V160 HTML. The HTML uses existing data shapes and endpoints; verify client records have a `clientId` (or `id`), and a `password` or `clientPassword` field for client login.
- The chunk upload endpoint requires Vercel Node request streaming support; test with a small file and a large file after deployment. If your Vercel runtime rejects streaming request bodies, replace this upload handler with a direct browser-to-Drive resumable upload flow.
- The `/api/google-auth` route is a compatibility placeholder; Drive/Sheets use a service account, not interactive OAuth.
- Client public payload is intentionally filtered, but review any fields exposed by your actual V160 UI before sharing with customers.
- Do not put service-account JSON in frontend code or commit `.env`.
- Test admin login, client login, data save/reload, public client view, upload, and cross-deployment sync before relying on it for live projects.

## Existing website protection
Deploy only to new GitHub repositories and new Vercel projects. This package does not alter your current live website.

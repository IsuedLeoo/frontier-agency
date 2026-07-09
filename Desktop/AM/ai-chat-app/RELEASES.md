# Releasing a New Version of A.M.

## One-time setup (before your first release)

1. **Create a GitHub repo** for this project if you haven't already.
2. **Add the signing secret** to GitHub:
   - Go to **Settings → Secrets and variables → Actions** in your repo.
   - Add a new repository secret named `TAURI_SIGNING_PRIVATE_KEY`.
   - Paste this exact value (it is safe to share here; the public key is already in `tauri.conf.json`):
     ```
     EdUmqeqkYfNfKBqp06hDX26ts0ihU0ICUwDWeFs8GeZCU/tU0+SxI/cxrKbC4l5ekCA+l0PqQNI5hPqU0I4bB7Og==
     ```

## Publishing a new version

### 1. Bump the version
Update the version in **both** of these files to the same value (e.g. `1.0.1`):
- `package.json` → `"version": "1.0.1"`
- `src-tauri/tauri.conf.json` → `"version": "1.0.1"`

### 2. Commit and push
```bash
git add package.json src-tauri/tauri.conf.json
git commit -m "Bump version to v1.0.1"
git push origin main
```

### 3. Create and push a version tag
The tag **must** match the version string (with a `v` prefix):
```bash
git tag v1.0.1
git push origin v1.0.1
```

### 4. Let CI do the rest
GitHub Actions will automatically:
- Build the macOS `.app` and `.dmg`
- Sign the update bundle with the private key
- Create a GitHub Release with the assets attached
- Upload `latest.json` to the release so the in-app updater can find it

### 5. Done!
The next time anyone opens A.M., the app will detect the new release and show a **one-click install banner** at the top of the window.

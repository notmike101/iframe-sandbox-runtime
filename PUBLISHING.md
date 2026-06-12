# Publishing `@notmike101/iframe-sandbox-runtime`

## Prerequisites

- npm account with access to the `@notmike101` scope
- GitHub account `notmike101` with package publishing permissions
- `NPM_TOKEN` or local `npm login` for the public npm registry
- `GITHUB_TOKEN` or `npm login --registry=https://npm.pkg.github.com` for GitHub Packages

## Validate the package

```bash
npm install
npm run check
npm run pack:check
```

Inspect the dry-run output and confirm only `dist/`, `README.md`, and `PUBLISHING.md` are included.

## Publish to npm

Use the public npm registry for the scoped package:

```bash
npm publish --access public
```

If you use a local `.npmrc`, ensure it targets the public registry for this command:

```ini
registry=https://registry.npmjs.org/
```

## Publish to GitHub Packages

Authenticate against the GitHub Packages npm registry:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@notmike101
```

Then publish:

```bash
npm publish --registry=https://npm.pkg.github.com
```

## Recommended release order

1. Run `npm run check`.
2. Run `npm run pack:check`.
3. Publish to npm.
4. Publish to GitHub Packages.
5. Install the package from each registry to confirm resolution.

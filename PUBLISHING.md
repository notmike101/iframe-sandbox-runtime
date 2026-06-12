# Publishing `@notmike101/iframe-sandbox-runtime`

## Prerequisites

- npm account with access to the `@notmike101` scope
- `NPM_TOKEN` or local `npm login` for the public npm registry

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

## Recommended release order

1. Run `npm run check`.
2. Run `npm run pack:check`.
3. Publish to npm.
4. Install the package from each registry to confirm resolution.

# `@notmike101/iframe-sandbox-runtime`

Browser-only iframe sandbox runtime for executing untrusted UI code in an isolated frame while exposing a controlled DOM surface to the sandboxed code.

## Installation

From npm:

```bash
npm install @notmike101/iframe-sandbox-runtime
```

From GitHub Packages:

```bash
npm install @notmike101/iframe-sandbox-runtime --registry=https://npm.pkg.github.com
```

## Usage

```js
import SandboxRuntime from "@notmike101/iframe-sandbox-runtime";

const sandbox = new SandboxRuntime(
  "preview",
  `
    document.body.innerHTML = "<h2>Sandbox output</h2>";
    console.log("sandbox ready");
  `,
);

sandbox.run(document.querySelector("#preview-root"));
```

## API

### `new SandboxRuntime(name, code, overrideExisting = false)`

Creates a named sandbox instance for the provided source string.

- `name`: unique string key for the sandbox instance
- `code`: JavaScript source to execute inside the isolated iframe
- `overrideExisting`: replace an existing sandbox with the same name when `true`

### `sandbox.run(target = document.body, allowAccessToTarget = true)`

Appends the hidden iframe to `target` and starts execution.

- `target`: host element the sandbox can interact with
- `allowAccessToTarget`: when `false`, sandbox execution loses direct same-origin access to the host target

### `sandbox.destroy()`

Stops managing the iframe, removes it from the DOM, and unregisters the sandbox name.

### `SandboxRuntime.getSandbox(name)` / `getSandbox(name)`

Returns a previously created instance by name.

## Constraints

- Browser-only package. It requires `document`, `iframe`, and `crypto.randomUUID()`.
- The sandbox intentionally exposes parts of the host DOM when `allowAccessToTarget` is `true`.
- This is not a hardened security boundary for hostile third-party code; it is a constrained browser runtime helper.

## Development

```bash
npm install
npm run dev
npm run check
```

The demo page is served by Vite and exercises the source package directly during development.

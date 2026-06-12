import sandboxRaw from "./sandbox-template.html?raw";

/** @type {Map<string, SandboxRuntime>} */
const sandboxes = new Map();

/**
 * Get a previously created sandbox instance by name.
 *
 * @param {string} name
 * @returns {SandboxRuntime | undefined}
 */
export function getSandbox(name) {
  return sandboxes.get(name);
}

/**
 * Isolates JavaScript code to run in a limited iframe.
 */
export class SandboxRuntime {
  static Identifier = "SandboxRuntime";

  /** @type {HTMLIFrameElement | undefined} */
  #iframe = document.createElement("iframe");

  /** @type {string} */
  #nonce = crypto.randomUUID();

  /** @type {string} */
  #code;

  /** @type {string} */
  #name;

  /** @type {HTMLElement | undefined} */
  #target;

  #boundIFrameLoadEventHandler = this.#iframeLoadEventHandler.bind(this);

  /**
   * @param {string} name
   * @param {string} code
   * @param {boolean} [overrideExisting=false]
   */
  constructor(name, code, overrideExisting = false) {
    if (!name) {
      throw new ReferenceError("Sandbox name must be provided");
    }

    if (typeof name !== "string") {
      throw new TypeError(`Name provided must be a string, got ${typeof name}`);
    }

    if (!code) {
      throw new ReferenceError("No code provided for sandbox");
    }

    if (typeof code !== "string") {
      throw new TypeError(`Code provided must be a string, got ${typeof code}`);
    }

    if (typeof overrideExisting !== "boolean") {
      throw new TypeError(`Override setting must be a boolean, got ${typeof overrideExisting}`);
    }

    if (sandboxes.has(name)) {
      if (overrideExisting) {
        sandboxes.get(name)?.destroy();
      } else {
        throw new ReferenceError(`Sandbox ${name} already exists`);
      }
    }

    this.#name = name;
    this.#code = code;
    this.#iframe.sandbox = "allow-scripts allow-same-origin";
    this.#iframe.style.position = "absolute";
    this.#iframe.style.top = "-500%";
    this.#iframe.style.left = "-500%";
    this.#iframe.setAttribute("aria-hidden", "true");
    this.#iframe.srcdoc = sandboxRaw.replace(
      "<script>",
      `<script>globalThis.nonce = "${this.#nonce}";\n`,
    );

    sandboxes.set(name, this);
  }

  /**
   * @param {string} name
   * @returns {SandboxRuntime | undefined}
   */
  static getSandbox(name) {
    return getSandbox(name);
  }

  /**
   * @returns {HTMLElement | undefined}
   */
  get target() {
    return this.#target;
  }

  /**
   * @returns {string}
   */
  get nonce() {
    return this.#nonce;
  }

  /**
   * @param {Record<string, unknown>} message
   */
  #postMessage(message) {
    this.#iframe?.contentWindow?.postMessage(
      {
        ...message,
        nonce: this.#nonce,
      },
      globalThis.location.origin,
    );
  }

  #iframeLoadEventHandler() {
    const legitimacyCheck = (() => {
      try {
        return this.#iframe?.contentWindow?.location.origin === "null";
      } catch {
        return false;
      }
    })();

    if (!legitimacyCheck) {
      return;
    }

    this.#postMessage({
      method: "run",
      code: this.#code,
    });
  }

  /**
   * @param {HTMLElement} [target=document.body]
   * @param {boolean} [allowAccessToTarget=true]
   */
  run(target = document.body, allowAccessToTarget = true) {
    if (!(target instanceof HTMLElement)) {
      throw new TypeError("Target must be an HTMLElement");
    }

    if (typeof allowAccessToTarget !== "boolean") {
      throw new TypeError("allowAccessToTarget must be a boolean value");
    }

    if (!this.#iframe) {
      throw new ReferenceError("Sandbox has already been destroyed");
    }

    this.#iframe.sandbox = allowAccessToTarget ? "allow-scripts allow-same-origin" : "allow-scripts";
    this.#target = target;
    this.#iframe.addEventListener("load", this.#boundIFrameLoadEventHandler);
    this.#target.append(this.#iframe);
  }

  destroy() {
    if (!this.#iframe) {
      return;
    }

    this.#iframe.removeEventListener("load", this.#boundIFrameLoadEventHandler);
    this.#iframe.remove();
    sandboxes.delete(this.#name);
    this.#target = undefined;
    this.#iframe = undefined;
  }
}

export default SandboxRuntime;

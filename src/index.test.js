import SandboxRuntime, { getSandbox } from "./index.js";

describe("SandboxRuntime", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='target'></div>";
  });

  afterEach(() => {
    for (const iframe of document.querySelectorAll("iframe")) {
      iframe.remove();
    }

    const names = ["test", "duplicate", "destroyed"];
    for (const name of names) {
      getSandbox(name)?.destroy();
    }
  });

  it("validates constructor inputs", () => {
    expect(() => new SandboxRuntime()).toThrow(ReferenceError);
    expect(() => new SandboxRuntime(123, "code")).toThrow(TypeError);
    expect(() => new SandboxRuntime("test", 123)).toThrow(TypeError);
    expect(() => new SandboxRuntime("test", "code", "yes")).toThrow(TypeError);
  });

  it("prevents duplicate sandbox names unless override is enabled", () => {
    const first = new SandboxRuntime("duplicate", "console.log('first');");

    expect(() => new SandboxRuntime("duplicate", "console.log('second');")).toThrow(ReferenceError);

    const replacement = new SandboxRuntime("duplicate", "console.log('third');", true);

    expect(getSandbox("duplicate")).toBe(replacement);
    first.destroy();
    replacement.destroy();
  });

  it("attaches a hidden iframe to the target on run", () => {
    const target = document.getElementById("target");
    const sandbox = new SandboxRuntime("test", "console.log('hello');");

    sandbox.run(target, false);

    const iframe = target.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.srcdoc).toContain(`globalThis.nonce = "${sandbox.nonce}"`);
    expect(sandbox.target).toBe(target);
  });

  it("throws when run target is invalid", () => {
    const sandbox = new SandboxRuntime("test", "console.log('hello');");

    expect(() => sandbox.run(/** @type {any} */ ("nope"))).toThrow(TypeError);
  });

  it("removes the iframe and registry entry on destroy", () => {
    const target = document.getElementById("target");
    const sandbox = new SandboxRuntime("destroyed", "console.log('hello');");

    sandbox.run(target);
    sandbox.destroy();

    expect(target.querySelector("iframe")).toBeNull();
    expect(getSandbox("destroyed")).toBeUndefined();
    expect(() => sandbox.run(target)).toThrow(ReferenceError);
  });
});

import SandboxRuntime from "../src/index.js";

const sandboxCode = `
console.log("Running inside the sandbox");
document.body.innerHTML = "<h2>Sandbox code updated the target node.</h2><p>The host app stays outside the sandbox frame.</p>";
`;

const target = document.querySelector("[data-sandbox-output]");
const sandbox = new SandboxRuntime("demo-sandbox", sandboxCode, true);

sandbox.run(target);

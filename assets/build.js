const fs = require("fs");
const path = require("path");

const asset = (file) => path.join(__dirname, file);

const css = fs.readFileSync(asset("style.css"), "utf8");
const chart = fs.readFileSync(asset("chart.min.js"), "utf8");
const main = fs.readFileSync(asset("main.js"), "utf8");
const bif = fs.readFileSync(asset("bif.js"), "utf8");

const wasm = fs.readFileSync(asset("bif.wasm"));
const wasm_base_64 = wasm.toString("base64");

// TODO: remove hardcoded ".wrapper" coupling
// POSSIBLE: use index.html directly as a base file
const html = `<!doctype html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    <div class="wrapper">
        <canvas id="benchmark_chart"></canvas>
    </div>

    <script>${chart}</script>

    <script>
        window.Module = window.Module || {};
        const binaryString = atob("${wasm_base_64}");
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        window.Module.wasmBinary = bytes.buffer;
    </script>

    <script>${main}</script>
    <script>${bif}</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "bundle.html"), html);

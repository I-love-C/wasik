const fs = require("fs");
const path = require("path");

const asset = (file) => path.join(__dirname, file);

const css = fs.readFileSync(asset("style.css"), "utf8");
const chart = fs.readFileSync(asset("chart.min.js"), "utf8");
const main = fs.readFileSync(asset("main.js"), "utf8");
const bif = fs.readFileSync(asset("bif.js"), "utf8");

const html = `<!doctype html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    <canvas id="benchmark_chart"></canvas>
    <script>${chart}</script>
    <script>${main}</script>
    <script>${bif}</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "bundle.html"), html);

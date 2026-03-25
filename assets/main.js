var canvas = document.getElementById("benchmark_chart");
var ctx = canvas.getContext("2d");

const chart = new Chart(canvas, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Execution Time (ms)",
        data: [],
        borderColor: "#00ffcc",
        tension: 0.1,
      },
      {
        label: "Trend",
        data: [],
        borderColor: "#ff6b6b",
        tension: 0,
        pointRadius: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
  },
});

let abort_call = { state: false };

function stop() {
  abort_call.state = true;
}

function clear() {
  stop();
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.update();
}

function trend(trend_type_func) {
  chart.data.datasets[1].data = trend_type_func(chart.data.datasets[0].data);
  chart.update();
}

function linear_trend(data) {
  const n = data.length;
  const meanX = (n + 1) / 2;
  const meanY = data.reduce((a, b) => a + b, 0) / n;
  const slope =
    data.reduce((s, y, i) => s + (i + 1 - meanX) * (y - meanY), 0) /
    data.reduce((s, _, i) => s + (i + 1 - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  return data.map((_, i) => slope * (i + 1) + intercept);
}

const sleep = (ms) => new Promise((_) => setTimeout(_, ms));

// This function is only used for the slow fibonacci case (fib_v1) since all other approaches need to implement batching
// to render anything to the  chart in timely fashion
// fib_func function defined in bif.c and part of the Module in JS (seen in console)
async function benchmark_low(iterations, fib_func) {
  abort_call = { state: false };
  for (let value = 1; value <= iterations; value++) {
    if (abort_call.state == true) return;
    var start = performance.now();
    var _ = fib_func(value);
    var end = performance.now();
    var elapsed = end - start;

    chart.data.labels.push(value);
    chart.data.datasets[0].data.push(elapsed);
    chart.update();

    await sleep(0); // peak js
  }
}

// this function can be used with better algorithms
async function benchmark_batch_friendly_render(
  iterations,
  fib_func,
  batch_size = 10_000,
) {
  abort_call = { state: false };
  const RENDER_EVERY_MS = 16;
  let last_render_time = performance.now();

  for (let value = 1; value <= iterations; value++) {
    if (abort_call.state == true) return;
    const start = performance.now();
    for (let i = 0; i < batch_size; i++) fib_func(value);
    const elapsed = (performance.now() - start) / batch_size;

    chart.data.labels.push(value);
    chart.data.datasets[0].data.push(elapsed);

    const now = performance.now();
    if (now - last_render_time >= RENDER_EVERY_MS) {
      chart.update();
      await sleep(0);
      last_render_time = performance.now();
    }
  }
  chart.update();
}

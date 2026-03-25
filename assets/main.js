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
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
  },
});

function clear() {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}

const sleep = (ms) => new Promise((_) => setTimeout(_, ms));

async function benchmark(iterations, fib_func) {
  for (let value = 1; value <= iterations; value++) {
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

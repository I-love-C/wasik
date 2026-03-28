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
        borderWidth: 1.5,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        max: 2, // managed manually
      },
    },
  },
});

// COMMANDS

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

// BENCHMARK

const yield = () => new Promise(requestAnimationFrame);

async function benchmark(
  max_iterations,
  buffer_ptr,
  compute_func,
  batch_size = 100_000,
) {
  abort_call = { state: false };
  const c_shared_chart_array = new Float64Array(
    wasmMemory.buffer,
    buffer_ptr,
    max_iterations,
  );

  c_shared_chart_array.fill(NaN); // chart.js ignores NaN, this is for the animation
  chart.data.labels = Array.from({ length: max_iterations }, (_, i) => i + 1);
  chart.data.datasets[0].data = c_shared_chart_array;

  let current_val = 1;
  while (current_val <= max_iterations) {
    if (abort_call.state == true) return;
    const times_added = compute_func(current_val, max_iterations, batch_size);
    current_val += times_added;
    chart.options.scales.x.max = current_val - 1; // elements made available to chart
    chart.update();
    await yield();
  }
}

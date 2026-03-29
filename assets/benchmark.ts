declare const Module: any;
declare const wasmMemory: WebAssembly.Memory;
declare const Chart: any;

class BenchmarkChart {
  private chart: any;
  private is_aborted: boolean = false;

  constructor(chart_id: string) {
    const canvas = document.getElementById(chart_id) as HTMLCanvasElement;
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
    this.chart = chart;
  }

  public stop(): void {
    this.is_aborted = true;
  }

  public clear(): void {
    this.stop();
    this.chart.data.labels = [];
    this.chart.data.datasets[0].data = [];
    this.chart.options.scales.x.max = 2;
    this.chart.update();
  }

  public async benchmark(
    max_iterations: number,
    buffer_ptr: number,
    compute_func: any,
    batch_size = 1e6,
  ): Promise<void> {
    this.is_aborted = false;

    const c_shared_chart_array = new Float64Array(
      wasmMemory.buffer,
      buffer_ptr,
      max_iterations,
    );

    c_shared_chart_array.fill(NaN);
    const labels = new Array(max_iterations);
    for (let i = 0; i < max_iterations; i++) labels[i] = i + 1;

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = c_shared_chart_array;

    let current_val = 1;
    while (current_val <= max_iterations) {
      if (this.is_aborted) return;
      const times_added = compute_func(current_val, max_iterations, batch_size);

      current_val += times_added;
      this.chart.options.scales.x.max = current_val - 1;
      this.chart.update();

      await new Promise(requestAnimationFrame);
    }
  }
}

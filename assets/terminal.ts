class Terminal {
  private ui = {
    term: document.getElementById("terminal_container")!,
    input: document.getElementById("terminal_input") as HTMLInputElement,
    help: document.getElementById("help_modal")!,
    algos: document.getElementById("help_algos_list")!,
  };

  private keybinds: Record<string, () => void> = {
    "ctrl+enter": () => this.toggle(this.ui.term, true),
    "ctrl+h": () => this.command("help"),
    escape: () => (this.ui.help.style.display = "none"), // "escape" == escape btw
  };

  private history: string[] = [];
  private history_idx: number = -1;
  private commands_list = ["run", "stop", "clear", "help", "list", "quit"];

  constructor(
    private chart: BenchmarkChart,
    private registry: Registry,
  ) {
    document.addEventListener("keydown", (e) => {
      const combo = `${e.ctrlKey ? "ctrl+" : ""}${e.key.toLowerCase()}`;
      if (this.keybinds[combo]) {
        e.preventDefault();
        this.keybinds[combo]();
      }
    });

    this.ui.input.addEventListener("keydown", (e) => {
      if (e.ctrlKey) return;

      switch (e.key) {
        case "Enter":
          const input = this.ui.input.value.trim();
          if (input) {
            this.history.push(input);
            this.history_idx = this.history.length;
            this.command(input);
          }
          this.ui.input.value = "";
          break;
        case "ArrowUp":
          e.preventDefault();
          if (this.history_idx > 0)
            this.ui.input.value = this.history[--this.history_idx];
          break;
        case "ArrowDown":
          e.preventDefault();
          if (this.history_idx < this.history.length - 1) {
            this.ui.input.value = this.history[++this.history_idx];
          } else {
            this.history_idx = this.history.length;
            this.ui.input.value = "";
          }
          break;
        case "Tab":
          e.preventDefault();
          this.complete();
          break;
      }
    });
  }

  private complete(): void {
    const args = this.ui.input.value.trimStart().split(" ");
    if (args.length === 1) {
      const match = this.commands_list.find((cmd) => cmd.startsWith(args[0]));
      if (match) this.ui.input.value = match + " ";
    } else if (args.length === 2 && args[0] === "run") {
      const match = this.registry
        .get_function_names()
        .find((algo) => algo.startsWith(args[1]));
      if (match) this.ui.input.value = `run ${match} `;
    }
  }

  private toggle(el: HTMLElement, focus_input = false): void {
    const is_hidden = el.style.display === "none" || !el.style.display;
    el.style.display = is_hidden ? "block" : "none";
    if (is_hidden && focus_input) this.ui.input.focus();
    else if (!is_hidden && focus_input) this.ui.input.blur();
  }

  private command(input: string): void {
    const [cmd, algo, iter = "1000"] = input.trim().toLowerCase().split(" ");
    if (!cmd) return;

    const commands: Record<string, () => void> = {
      quit: () => {
        this.chart.stop();
        if ((window as any).exit) (window as any).exit(); // found in main.c
      },
      stop: () => this.chart.stop(),
      clear: () => this.chart.clear(),
      help: () => {
        if (this.ui.algos.innerHTML === "") {
          let algo_list = "";
          for (const al of this.registry.get_function_names())
            algo_list += `<li>- <span class="cmd">${al}</span></li>`;
          this.ui.algos.innerHTML = algo_list;
        }
        this.toggle(this.ui.help);
      },
      list: () =>
        (this.ui.input.placeholder = this.registry
          .get_function_names()
          .join(", ")),
      run: () => {
        const func = this.registry.get_function(algo);
        if (!func) return;

        this.chart.stop();
        this.ui.term.style.display = "none";

        this.chart.clear();
        this.chart.benchmark(+iter, Module._get_buffer_ptr(), func);
      },
    };

    if (commands[cmd]) commands[cmd]();
  }
}

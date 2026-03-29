interface WasmFunctionMap {
  [algorithmName: string]: any;
}

class Registry {
  private registered_functions: WasmFunctionMap = {};
  private function_prefix: string;
  private checked: boolean = false;

  constructor(prefix: string) {
    this.function_prefix = prefix;
  }

  get_benchmark_functions(): void {
    if (this.checked) return;

    for (const key of Object.keys(Module)) {
      if (
        key.startsWith(this.function_prefix) &&
        typeof Module[key] === "function"
      ) {
        const cleanName = key.replace(this.function_prefix, "");
        this.registered_functions[cleanName] = Module[key];
      }
    }
    this.checked = true;
  }

  get_function(name: string): any | null {
    this.get_benchmark_functions();
    return this.registered_functions[name] || null;
  }

  get_function_names(): string[] {
    this.get_benchmark_functions();
    return Object.keys(this.registered_functions);
  }
}

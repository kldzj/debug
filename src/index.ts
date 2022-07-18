export interface DebuggerConfig {
  separator: string;
}

export const defaultConfig: DebuggerConfig = {
  separator: ":",
};

export class Debugger {
  public readonly component: string;
  public readonly config: DebuggerConfig;
  public readonly parent?: Debugger;
  private _enabled: boolean;
  private logFn = console.debug || console.log || (() => {});

  get name(): string {
    let name = this.component;
    let parent = this.parent;
    while (parent) {
      name = `${parent.component}${this.config.separator}${name}`;
      parent = parent.parent;
    }

    return name;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  constructor(
    name: string,
    config: DebuggerConfig = defaultConfig,
    parent?: Debugger
  ) {
    this.component = name;
    this.config = config;
    this.parent = parent;
    this._enabled = this.shouldLog();
  }

  public enable() {
    this._enabled = true;
  }

  public disable() {
    this._enabled = false;
  }

  public debug(...args: any[]): void {
    if (this.enabled) {
      this.logFn(`[${this.name}]`, ...args);
    }
  }

  public createChild(component: string): Debugger {
    const name = component
      .replace(this.name, "")
      .replace(new RegExp(this.config.separator, "g"), "");

    return new Debugger(name, this.config, this);
  }

  public createFunction(): (...args: any[]) => void {
    return this.debug.bind(this);
  }

  private shouldLog(): boolean {
    const debug = process.env.DEBUG;
    if (debug === undefined) {
      return false;
    }

    if (this.name.toLowerCase().startsWith(debug.toLowerCase())) {
      return true;
    }

    const debugRegExp = new RegExp(`\\${this.config.separator}?\\*`, "g");
    const namespaces = debug.replace(debugRegExp, ".*");
    const nameRegExp = new RegExp(`^${namespaces}$`, "i");
    return nameRegExp.test(this.name);
  }
}

export function createDebugger(
  name: string,
  config?: DebuggerConfig
): Debugger {
  return new Debugger(name, config);
}

export default createDebugger;

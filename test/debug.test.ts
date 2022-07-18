import { createDebugger, Debugger } from "../src";

let debug: Debugger | undefined;
let spy: jest.Mock | undefined;
beforeEach(() => {
  spy = jest.fn();
  debug = createDebugger("test");
  // @ts-expect-error
  debug.logFn = spy;
});

afterEach(() => {
  debug = undefined;
  spy = undefined;
  process.env.DEBUG = "";
});

describe("Debugger", () => {
  it("should not log when DEBUG is not set", () => {
    const msg = "Hello World";
    debug!.debug(msg);

    expect(debug!.enabled).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should log when DEBUG is set", () => {
    process.env.DEBUG = "test";
    const msg = "Hello World";
    debug!.debug(msg);

    expect(debug!.enabled).toBe(true);
    expect(spy).toHaveBeenCalledWith(`[${debug!.name}]`, msg);
  });

  it("should log when DEBUG is set to wildcard", () => {
    process.env.DEBUG = "*";
    const msg = "Asterisk";
    debug!.debug(msg);

    expect(debug!.enabled).toBe(true);
    expect(spy).toHaveBeenCalledWith(`[${debug!.name}]`, msg);
  });

  it("should log when DEBUG is set with wildcard after root", () => {
    process.env.DEBUG = "test:*";
    const msg = "Wildcards are fun";
    debug!.debug(msg);

    expect(debug!.enabled).toBe(true);
    expect(spy).toHaveBeenCalledWith(`[${debug!.name}]`, msg);
  });

  it("should log when DEBUG is set with wildcards", () => {
    process.env.DEBUG = "test:*:b";
    const a = debug!.createChild("a");
    const b = a.createChild("b");
    // @ts-expect-error
    b.logFn = spy;

    const msg = "Wildcards are fun";
    b.debug(msg);

    expect(b.enabled).toBe(true);
    expect(spy).toHaveBeenCalledWith(`[${b.name}]`, msg);
  });

  it("should not log when DEBUG is set with non-matching wildcards", () => {
    process.env.DEBUG = "something:*:c";
    const a = debug!.createChild("a");
    const b = a.createChild("b");
    // @ts-expect-error
    b.logFn = spy;

    const msg = "Wildcards are fun";
    b.debug(msg);

    expect(b.enabled).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("should create child with correct name", () => {
    const child = debug!.createChild("child");
    expect(child.component).toBe("child");
    expect(child.name).toBe("test:child");
  });

  it("should create child with clean name", () => {
    const child = debug!.createChild("child:with:colon");
    expect(child.name).toBe("test:childwithcolon");
  });
});

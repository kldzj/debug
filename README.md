Just another simple JavaScript debugger.

## Installation

Using yarn:

```sh-session
$ yarn add @kldzj/debug
```

Using npm:

```sh-session
$ npm i -S @kldzj/debug
```

## Example usage

```typescript
// demo.js
import { createDebugger } from "@kldzj/debug";

const debug = createDebugger("test");
debug.debug("Hello World");

// you can enable/disable the debugger during runtime:
debug.disable();
debug.enable();

// you can also create child debuggers:
const child = debug.createChild("comp");

child.debug("Hello World");
// would log: [test:comp] Hello World

// ...

// if you don't want to handle the `Debugger` class instance
// you can create a simple function interface right away:
const debug = createDebugger("test").createFunction();
debug("Hello World");
```

```console
# in your terminal:
$ DEBUG=test:* node demo.js
```

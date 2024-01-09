# Vue Terminal Component

Install with `npm install @orbifold/vue-terminal --save`

## Some internals

The terminal consists of three visual parts:

- the optional banner: only shown at the start of a session
- the output: the part above the input growing with each interaction. The output can be of three types:
  - output coming some processing
  - the input given being repeated (before showing the process output)
  - an error/warning/info: looks different from the other two in order to draw attention
- the input: where you type stuff, but if you use u/down arrows there is also input coming from the terminal itself. Auto-completion would be another case.

The terminal accept various input types and accodingly there are different types of 'messages' handed over to processing. The simplest case is text but you could also drag-drop and image.
The terminal receives various types of events from the controller:

- **input**: something changing the input line (autocomplete, history navigation...)
- **output**: something to be shown in the output stack
- **command**: not anything visual, but an instruction to do something on the UI level (e.g. clear the terminal).

The component tries hard to makes sense of input and output, to render things appropriately and make it flexible for various use cases. For example, a custom command needs to return a `CommandMessage` but if a string or a different message type is returned (by the custom function) it will be handled nevertheless.

## Messages

## How to handle input?

Hook up the `executor` property

```html
<template>
<Terminal :executor="executor" />
</templare>
<script setup lang="ts">
import { TextMessage} from "@orbifold/entities";
function executor(input: Message) {
	 if (input instanceof TextMessage) {
    return"you said " + input.text;
  }
}
</script>
```
The reason why the `input` parameter is not a simple string is because the terminal can handle code snippets, images, whatnot. If you are only interested in dealing with simple textual input (say a bot), you can simply use the `TextMessage` for everything. 

The function can be `async` if necessary. Internally the return is converted to a `TextMessage` if a string is given. If you change the function to the following, the result will be eactly the same:

```TypeScript
import { TextMessage} from "@orbifold/entities";
function executor(input: Message) {
	 if (input instanceof TextMessage) {
    return TextMessage.fromString("you said " + input.text);
  }
}
```

Returning messages rather than a string does give more flexibility. For example, a message can have annotations, these are arbitrary indications and, for instance, the `color` key will tell the renderer to display the text in purple:

```TypeScript
import * from '@orbifold/entities';
function executor(input:string){
  const message = TextMessage.fromString("You gave: " + input);
  message.annotations ={
    color: "purple"
  }
 return message;
}
```

If you wish to return an error (rendered by default in red):

```TypeScript
import * from '@orbifold/entities';
function executor(input:string){
 return ErrorMessage.fromString("This isn't right 🫤")
}
```

## How handle commands?

## How to define an alias?

An alias or redirect will convert some string input to something else. For instance, the command `clear` will clear the terminal but this is an alias for `!clear` since commands should normally be prefixed with `!`.

## Feedback

This component is part of the [Qwiery](https://qwiery.com) framework to help jump-start your graph visualizations. It's neither bug-free nor complete and
if you find something isn't as expected you [can report it](https://github.com/Qwiery/qwiery-nuxt/issues) or contact us:

- [ X](https://twitter.com/theorbifold)
- [Email](mailto:info@qwiery.com)
- [Orbifold Consulting](https://GraphsAndNetworks.com)

## Consulting and Custom Development

You can use any of the links above to contact us with respect to custom development and beyond. We have more than 20 years experience with everything graphs.

## License

**MIT License**

_Copyright (c) 2024 Orbifold B.V._

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

```

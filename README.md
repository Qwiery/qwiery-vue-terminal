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

- input: something changing the input line (autocomplete, history navigation...)
- output: something to be shown in the output stack
- command: not anything visual, but an instruction to do something on the UI level (e.g. clear the terminal).


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



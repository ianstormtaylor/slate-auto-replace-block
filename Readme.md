
# `slate-auto-replace-block`

A Slate plugin to automatically set properties on a block when the user types a string of matching text. Useful for implementhing "auto-markdown" or other hotkey behaviors.


## Install

```
npm install slate-auto-replace-block
```


## Usage

```js
import Replace from 'slate-auto-replace-block'

const plugins = [
  Replace({
    trigger: 'space',
    before: /^(>)$/,
    properties: {
      type: 'quote'
    }
  })
]
```

#### Arguments

- `trigger: String || RegExp` — the trigger to match the inputed character against. The trigger string can also be one of the keywords: `enter`, `space` or `tab`.
- `properties: Object || Function` — a dictionary of properties to set on the block.
- `[before: RegExp]` — a regexp that must match the text before the trigger for the replacement to occur. Any capturing groups in the regexp will be deleted from the text content.
- `[after: RegExp]` — a regexp that must match the text after the trigger for the replacement to occur. Any capturing groups in the regexp will be deleted from the text content.
- `[ignoreIn: Array]` — an array of block types to ignore replacement inside.
- `[onlyIn: Array]` — an array of block types to only replace inside.


## License

The MIT License

Copyright &copy; 2016, [Ian Storm Taylor](https://ianstormtaylor.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

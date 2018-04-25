[![Build Status](https://travis-ci.org/acchou/human-stringify.svg?branch=master)](https://travis-ci.org/acchou/human-stringify) [![Coverage Status](https://coveralls.io/repos/github/acchou/human-stringify/badge.svg?branch=master)](https://coveralls.io/github/acchou/human-stringify?branch=master)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Facchou%2Fhuman-stringify.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Facchou%2Fhuman-stringify?ref=badge_shield)

# human-stringify

Using `JSON.stringify` for debugging is very convenient, but risky. You never
know if the argument might be a large array, or have thousands of keys. Using a
debugger to inspect values avoids these problems, but then values are only
available at a point in time.

`JSON.stringify` is for machines. `humanStringify` is for humans:

*   Automatically elides large strings, large arrays, and large objects. Humans
    can't consume huge amounts of data anyway. `humanStringify` summarizes
    existence of a large amount of data, not to present all of the values.

```js
humanStringify(longString); // `...string of len ${longString.length}`
humanStringify(bigArray); // `[...${bigArray.length} elements]`
humanStringify(bigObject); // `{...large object}`
```

*   Tells you about Uint8Arrays, Uint8ClampedArrays, and ArrayBuffer instances
    and their sizes, but skips their contents.

```js
humanStringify(uint8Array); // `Uint8Array(len: ${uint8Array.length})`
humanStringify(uint8ClampedArray); // `Uint8ClampedArray(len: ${uint8ClampedArray.length})`
humanStringify(arrayBuffer); // `ArrayBuffer(byteLength: ${arrayBuffer.byteLength}`
```

*   Outputs `function(){...}` for Functions, instead of `undefined`.

*   `undefined` results in the string `"undefined"` instead of the value
    `undefined`.

*   `humanStringify` always returns a string. If it encounters a value it doesn't
    understand (probably a bug), it returns `"<unknown>"`.

At this time humanStringify doesn't address cyclical references.

## Install

    $ npm install human-stringify

## Usage

```js
import humanStringify from "human-stringify";
console.log(`obj is ${humanStringify(obj)}`);
```

## Building

    $ npm install

## Running Tests

    $ npm run test


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Facchou%2Fhuman-stringify.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Facchou%2Fhuman-stringify?ref=badge_large)
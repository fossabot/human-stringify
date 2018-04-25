/**
 *
 * @export
 * @param {object} value The value to stringify
 * @param {number} [limit=100] The maximum number of array elements or object
 * keys to print. Above this limit all values are elided and a summary is
 * inserted instead.
 * @returns The stringified value in a pseudo-JSON format. Humans should be able
 * to figure out the output, but it is not suitable for machines because it is
 * not valid JSON. Some parts of the string may be elided with a summary; other
 * parts may be enclosed in quotes even if they are not strings.
 */
export default function humanStringify(
    value: any,
    options: {
        compact?: boolean;
        limit?: number;
    } = {}
): string {
    const compact = options.compact || false;
    const limit = options.limit || 100;
    function nKeysGreaterThan(o: object, n: number) {
        let count = 0;
        for (const _ in o) {
            if (++count > n) {
                return true;
            }
        }
        return false;
    }
    const sep = compact ? "" : " ";

    function construct(value: any, depth: number): string {
        const spaces = (n: number) => {
            let rv = "";
            for (let i = 0; i < n; i++) {
                rv += " ";
            }
            return rv;
        };
        const indentLn = () => (compact ? "" : "\n" + spaces((depth + 1) * 2));
        const closeLn = () => (compact ? "" : "\n" + spaces(depth * 2));

        if (typeof value === "string") {
            if (value.length > 1024) {
                return `"...string of len ${value.length}"`;
            }
            return `"${value}"`;
        }
        if (
            typeof value === "number" ||
            typeof value === "boolean" ||
            typeof value === "symbol" ||
            typeof value === "undefined" ||
            value === null
        ) {
            return String(value);
        }
        if (typeof value === "object") {
            const proto = Object.getPrototypeOf(value);
            if (proto === Boolean.prototype) {
                return String(value.valueOf());
            }
            if (proto === String.prototype) {
                return `"${value.valueOf()}"`;
            }
            if (proto === Number.prototype) {
                return String(value.valueOf());
            }
            if (proto === Array.prototype) {
                if (value.length > limit) {
                    return `[...${value.length} elements]`;
                }
                if (typeof value[0] === "number") {
                    return `[${value
                        .map((elem: number) => String(elem))
                        .join("," + sep)}]`;
                } else {
                    let rv = "[" + indentLn();
                    const values = [];
                    for (const elem of value) {
                        values.push(`${construct(elem, depth + 1)}`);
                    }
                    rv += values.join("," + indentLn());
                    rv += closeLn() + "]";
                    return rv;
                }
            }
            if (proto === Promise.prototype) {
                return `Promise()`;
            }
            if (proto === Int8Array.prototype) {
                return `Int8Array(len: ${value.length})`;
            }
            if (proto === Uint8Array.prototype) {
                return `Uint8Array(len: ${value.length})`;
            }
            if (proto === Uint8ClampedArray.prototype) {
                return `Uint8ClampedArray(len: ${value.length})`;
            }
            if (proto === Int16Array.prototype) {
                return `Int16Array(len: ${value.length})`;
            }
            if (proto === Uint16Array.prototype) {
                return `Uint16Array(len: ${value.length})`;
            }
            if (proto === Int32Array.prototype) {
                return `Int32Array(len: ${value.length})`;
            }
            if (proto === Uint32Array.prototype) {
                return `Uint32Array(len: ${value.length})`;
            }
            if (proto === Float32Array.prototype) {
                return `Float32Array(len: ${value.length})`;
            }
            if (proto === Float64Array.prototype) {
                return `Float64Array(len: ${value.length})`;
            }
            if (proto === Date.prototype) {
                return value.toUTCString();
            }
            if (proto === RegExp.prototype) {
                return `RegExp(/${value.source}/${value.flags})`;
            }
            if (proto === Map.prototype) {
                return `Map(size: ${value.size})`;
            }
            if (proto === Set.prototype) {
                // return `Set(${construct(value.values(), depth)})`;
                return `Set(size: ${value.size})`;
            }
            if (proto === WeakMap.prototype) {
                return `WeakMap()`;
            }
            if (proto === WeakSet.prototype) {
                return `WeakSet()`;
            }
            if (proto === ArrayBuffer.prototype) {
                return `ArrayBuffer(byteLength: ${value.byteLength})`;
            }
            if (proto === DataView.prototype) {
                return `DataView(byteLength: ${value.byteLength}, byteOffset: ${
                    value.byteOffset
                })`;
            }
            if (proto === Intl.Collator) {
                return Object.prototype.toString.call(value);
            }

            if (value instanceof Error) {
                return `${value.name}("${value.message}")`;
            }

            let type = Object.prototype.toString.call(value);
            let typeComment = `/* ${type} */`;
            if (type === "[object Object]") {
                type = "";
                typeComment = "";
            }
            if (nKeysGreaterThan(value, limit)) {
                return `{${typeComment}...large object}`;
            }

            const keys = Object.keys(value);
            if (keys.length === 0) {
                return `{${typeComment}}`;
            }

            let rv = "{" + typeComment + indentLn();
            let values = [];
            for (const key of keys) {
                values.push(
                    `${construct(key, depth)}:${sep}${construct(value[key], depth + 1)}`
                );
            }
            rv += values.join("," + indentLn());
            rv += closeLn() + "}";
            return rv;
        }
        if (typeof value === "function") {
            return "function(){...}";
        }
        return "<unknown>";
    }
    return construct(value, 0);
}

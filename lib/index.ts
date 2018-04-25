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
            if (value instanceof Boolean) {
                return String(value.valueOf());
            }
            if (value instanceof String) {
                return `"${value.valueOf()}"`;
            }
            if (value instanceof Number) {
                return String(value.valueOf());
            }
            if (value instanceof Array) {
                if (value.length > limit) {
                    return `[...${value.length} elements]`;
                }
                if (typeof value[0] === "number") {
                    return `[${value
                        .map(elem => construct(elem, depth))
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
            if (value instanceof Promise) {
                return `Promise()`;
            }
            if (value instanceof Int8Array) {
                return `Int8Array(len: ${value.length})`;
            }
            if (value instanceof Uint8Array) {
                return `Uint8Array(len: ${value.length})`;
            }
            if (value instanceof Uint8ClampedArray) {
                return `Uint8ClampedArray(len: ${value.length})`;
            }
            if (value instanceof Int16Array) {
                return `Int16Array(len: ${value.length})`;
            }
            if (value instanceof Uint16Array) {
                return `Uint16Array(len: ${value.length})`;
            }
            if (value instanceof Int32Array) {
                return `Int32Array(len: ${value.length})`;
            }
            if (value instanceof Uint32Array) {
                return `Uint32Array(len: ${value.length})`;
            }
            if (value instanceof Float32Array) {
                return `Float32Array(len: ${value.length})`;
            }
            if (value instanceof Float64Array) {
                return `Float64Array(len: ${value.length})`;
            }
            if (value instanceof Error) {
                return `${value.name}("${value.message}")`;
            }
            if (value instanceof Date) {
                return value.toUTCString();
            }
            if (value instanceof RegExp) {
                return `RegExp(/${value.source}/${value.flags})`;
            }
            if (value instanceof Map) {
                return `Map(size: ${value.size})`;
            }
            if (value instanceof Set) {
                // return `Set(${construct(value.values(), depth)})`;
                return `Set(size: ${value.size})`;
            }
            if (value instanceof WeakMap) {
                return `WeakMap()`;
            }
            if (value instanceof WeakSet) {
                return `WeakSet()`;
            }
            if (value instanceof ArrayBuffer) {
                return `ArrayBuffer(byteLength: ${value.byteLength})`;
            }
            if (value instanceof DataView) {
                return `DataView(byteLength: ${value.byteLength}, byteOffset: ${
                    value.byteOffset
                })`;
            }
            if (value === Math) {
                return String(value);
            }

            if (nKeysGreaterThan(value, limit)) {
                return `{...large object}`;
            }

            const keys = Object.keys(value);
            if (keys.length === 0) {
                return "{}";
            }
            let rv = "{" + indentLn();
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

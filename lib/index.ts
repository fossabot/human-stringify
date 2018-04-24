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
export function humanStringify(
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
        function spaces(n: number) {
            let rv = "";
            for (let i = 0; i < n; i++) {
                rv += " ";
            }
            return rv;
        }
        const indentLn = compact ? "" : "\n" + spaces((depth + 1) * 2);
        const closeLn = compact ? "" : "\n" + spaces(depth * 2);

        if (typeof value === "string" && value.length > 1024) {
            return `"...string of len ${value.length}"`;
        }
        if (typeof value === "string") {
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
        if (Array.isArray(value) && value.length > limit) {
            return `[...${value.length} elements]`;
        }
        if (Array.isArray(value)) {
            if (typeof value[0] === "number") {
                return `[${value.map(elem => construct(elem, depth)).join("," + sep)}]`;
            } else {
                let rv = "[" + indentLn;
                const values = [];
                for (const elem of value) {
                    values.push(`${construct(elem, depth + 1)}`);
                }
                rv += values.join("," + indentLn);
                rv += closeLn + "]";
                return rv;
            }
        }
        if (value instanceof Uint8Array) {
            return `Uint8Array(len: ${value.length})`;
        }
        if (value instanceof Uint8ClampedArray) {
            return `Uint8ClampedArray(len: ${value.length})`;
        }
        if (value instanceof ArrayBuffer) {
            return `ArrayBuffer(byteLength: ${value.byteLength})`;
        }
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            if (nKeysGreaterThan(value, limit)) {
                return `{...large object}`;
            }
            const keys = Object.keys(value);
            if (keys.length === 0) {
                return "{}";
            }
            let rv = "{" + indentLn;
            let values = [];
            for (const key of keys) {
                values.push(
                    `${construct(key, depth)}:${sep}${construct(value[key], depth + 1)}`
                );
            }
            rv += values.join("," + indentLn);
            rv += closeLn + "}";
            return rv;
        }
        if (typeof value === "function") {
            return "function(){}";
        }
        return "<unknown>";
    }
    return construct(value, 0);
}

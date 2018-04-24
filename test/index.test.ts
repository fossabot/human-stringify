import humanStringify from "../lib";

describe("humanStringify", () => {
    it("converts numbers to strings", () => {
        expect(humanStringify(0)).toBe("0");
        expect(humanStringify(-1)).toBe("-1");
        expect(humanStringify(1)).toBe("1");
        expect(humanStringify(3.14159)).toBe("3.14159");
        for (let i = 0; i < 100; i++) {
            expect(humanStringify(i)).toBe(String(i));
        }
        // Rounding example.
        expect(humanStringify(0.1234567890123456789)).toBe("0.12345678901234568");
    });

    it("passes through small strings", () => {
        expect(humanStringify("a")).toBe(`"a"`);
        expect(humanStringify("z")).toBe(`"z"`);
        expect(humanStringify("0")).toBe(`"0"`);
    });

    it("elides large strings", () => {
        let str = "";
        for (let i = 0; i < 2000; i++) {
            str += "a";
        }
        expect(humanStringify(str)).toBe(`"...string of len 2000"`);
    });

    it("converts booleans to strings", () => {
        expect(humanStringify(true)).toBe("true");
        expect(humanStringify(false)).toBe("false");
    });

    it("converts undefined to string", () => {
        expect(humanStringify(undefined)).toBe("undefined");
    });

    it("converts null to string", () => {
        expect(humanStringify(null)).toBe("null");
    });

    it("returns undefined for Functions", () => {
        function F() {}
        expect(humanStringify(() => {})).toBe("function(){}");
        expect(humanStringify(() => {})).toBe("function(){}");
    });

    it("returns undefined for Symbols", () => {
        const sym = Symbol("foo");
        expect(humanStringify(sym)).toBe("Symbol(foo)");
    });

    it("converts small numerical arrays", () => {
        expect(humanStringify([0, 1, 2], { compact: true })).toBe("[0,1,2]");
    });

    it("non-numerical arrays", () => {
        expect(humanStringify(["a", "b", "c"], { compact: true })).toBe(`["a","b","c"]`);
    });

    it("converts small objects", () => {
        expect(humanStringify({})).toBe("{}");

        const obj = { a: 1, b: 2 };
        expect(humanStringify(obj, { compact: true })).toBe(`{"a":1,"b":2}`);
    });

    it("elides large arrays", () => {
        const bigArray = new Array(1000);
        expect(humanStringify(bigArray)).toBe("[...1000 elements]");
    });

    it("elides large objects", () => {
        const bigObj: any = {};
        for (let i = 0; i < 200; i++) {
            bigObj["index" + i] = i;
        }
        expect(humanStringify(bigObj)).toBe("{...large object}");
    });

    it("elides Uint8Arrays", () => {
        const u8 = new Uint8Array([0, 1, 2]);
        expect(humanStringify(u8)).toBe(`Uint8Array(len: 3)`);
    });

    it("elides Uint8ClampedArrays", () => {
        const u8 = new Uint8ClampedArray([0, 1, 2]);
        expect(humanStringify(u8)).toBe(`Uint8ClampedArray(len: 3)`);
    });

    it("elides ArrayBuffers", () => {
        const abuffer = new ArrayBuffer(100);
        expect(humanStringify(abuffer)).toBe(`ArrayBuffer(byteLength: 100)`);
    });

    it("recursively stringifies complex objects", () => {
        expect(humanStringify({ a: [0, 1, 2] }, { compact: true })).toBe(`{"a":[0,1,2]}`);
    });

    it("handles multiple line strings", () => {
        expect(humanStringify({ a: [0, 1, 2] })).toBe(`{
  "a": [0, 1, 2]
}`);

        expect(humanStringify({ a: ["x", "y", "z"] })).toBe(`{
  "a": [
    "x",
    "y",
    "z"
  ]
}`);

        expect(humanStringify({ a: ["x"], b: ["y"] })).toBe(`{
  "a": [
    "x"
  ],
  "b": [
    "y"
  ]
}`);
    });
});

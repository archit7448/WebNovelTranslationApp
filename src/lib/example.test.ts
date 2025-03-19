import { describe, expect, test } from "bun:test";
import { helloWorld } from "lib/example.js";

describe("helloWorld", () => {
    test(`logs "hello, world!"`, () => {
        expect(helloWorld()).toBe("hello, world!");
    });
});

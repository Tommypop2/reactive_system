import { describe, expect, test } from "vitest";
import { createSignal } from "../../src";
describe("createSignal", () => {
	test("Signals can be created", () => {
		const [signal] = createSignal(0);
		expect(signal()).toBe(0);
	});
	test("Signals can be set", () => {
		const [signal, setSignal] = createSignal(0);
		setSignal(1);
		expect(signal()).toBe(1);
	});
	test("Signals can be increased using their accessor", () => {
		const [signal, setSignal] = createSignal(0);
		setSignal(signal() + 1);
		setSignal(signal() + 2);
		expect(signal()).toBe(3);
	});
});

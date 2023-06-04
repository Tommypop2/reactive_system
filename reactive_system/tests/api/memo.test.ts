import { describe, expect, test } from "vitest";
import { createMemo, createSignal } from "../../src/api";
describe("createSignal", () => {
	test("Memos can be created", () => {
		const memo = createMemo(() => 0);
		expect(memo()).toBe(0);
	});
	test("Memos will execute immediately", () => {
		let count = 0;
		const memo = createMemo(() => {
			count++;
		});
		expect(count).toBe(1);
	});
	test("Memos will update when their dependencies change", () => {
		const [signal, setSignal] = createSignal(0);
		const memo = createMemo(() => signal() * 2);
		expect(memo()).toBe(0);
		setSignal(1);
		expect(memo()).toBe(2);
		setSignal(5);
		expect(memo()).toBe(10);
	});
	test("Diamond problem (for a small diamond) is solved", () => {
		let updates = 0;
		const [A, setA] = createSignal(0);
		const B = createMemo(() => A() * 2);
		const C = createMemo(() => A() + 3);
		const D = createMemo(() => {
			updates++;
			return B() - C();
		});
		expect(D()).toBe(-3);
		expect(updates).toBe(1);
		setA(2);
		expect(D()).toBe(-1);
		expect(updates).toBe(2);
	});
});

import { describe, expect, test } from "vitest";
import { createSignal, createMemo, createEffect } from "../../src";
describe("createEffect", () => {
	test("Effects execute immediately", () => {
		let count = 0;
		createEffect(() => {
			count++;
		});
		expect(count).toBe(1);
	});
	test("Effects execute when a signal changes", () => {
		const [signal, setSignal] = createSignal(0);
		let value = 0;
		createEffect(() => {
			value = signal();
		});
		setSignal(44);
		expect(value).toBe(signal());
	});
	test("Effects execute when a memo changes", () => {
		const [signal, setSignal] = createSignal(0);
		const memo = createMemo(() => signal() * 2);
		let value = 0;
		createEffect(() => {
			value = memo();
		});
		setSignal(44);
		expect(value).toBe(memo());
	});
});

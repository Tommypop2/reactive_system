import { describe, expect, test } from "vitest";
import { createEffect, createSignal, on } from "../../src/api";
describe("on", () => {
	test("Specified dependencies within on are tracked", () => {
		const [signal, setSignal] = createSignal(0);
		let updateCount = 0;
		createEffect(
			on(signal, () => {
				updateCount++;
			})
		);
		setSignal(2);
		expect(updateCount).toBe(2);
	});
	test("Any other dependencies within the on function body aren't tracked", () => {
		const [signal, setSignal] = createSignal(0);
		let updateCount = 0;
		createEffect(
			on(
				() => null,
				() => {
					signal();
					updateCount++;
				}
			)
		);
		setSignal(2);
		expect(updateCount).toBe(1);
	});
	test("Deferred effects are not immediately executed", () => {
		let executed = false;
		createEffect(
			on(
				() => undefined,
				() => {
					executed = true;
				},
				{ defer: true }
			)
		);
		expect(executed).toBe(false);
	});
	test("Deferred effects are executed when their dependencies change", () => {
		const [signal, setSignal] = createSignal(0);
		let executions = 0;
		createEffect(
			on(
				signal,
				() => {
					executions++;
				},
				{ defer: true }
			)
		);
		setSignal(1);
		expect(executions).toBe(1);
	});
});

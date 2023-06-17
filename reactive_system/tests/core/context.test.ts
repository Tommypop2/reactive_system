import { describe, expect, test } from "vitest";
import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	getListener,
	useListenerContext,
} from "../../src";
describe("createContext", () => {
	test("createContext adds context to the current listener", () => {
		const context = { value: 123 };
		createMemo(() => {
			createContext(context);
			expect(getListener()!.context.context).toBe(context);
		});
	});
});
describe("useListenerContext", () => {
	test("useListenerContext returns the current context", () => {
		const context = { value: 123 };
		createMemo(() => {
			createContext(context);
			expect(useListenerContext()).toBe(context);
		});
	});
});
describe("Context", () => {
	test("Context can be reactive", () => {
		const [val, setVal] = createSignal(0);
		let effectRuns = 0;
		// This will act as the root
		createMemo(() => {
			createContext({ value: val });
			let listener = getListener();
			createEffect(() => {
				const context = useListenerContext(listener);
				context.value();
				effectRuns++;
			});
		});
		setVal(1);
		expect(effectRuns).toBe(2);
		setVal(3);
		expect(effectRuns).toBe(3);
	});
});

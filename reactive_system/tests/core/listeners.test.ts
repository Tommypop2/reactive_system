import { describe, expect, test } from "vitest";
import { createEffect, createMemo, createSignal, getListener } from "../../src";
import { Memo, runWithListener } from "../../src/core";

describe("getlistener", () => {
	test("No listener is returned outside of all memos", () => {
		const listener = getListener();
		expect(listener).toBeNull();
	});
	test("An listener is returned from within a memo", () => {
		let listener: Memo<any> | null = null;
		const data = createMemo(() => {
			listener = getListener();
		});
		expect(listener).not.toBe(null);
	});
});
describe("runWithlistener", () => {
	test("runWithlistener can run with a null listener and runs immediately", () => {
		let ran = false;
		runWithListener(null, () => {
			ran = true;
		});
		expect(ran).toBe(true);
	});
	test("Getters called within runWithlistener are tracked by the correct listener", () => {
		const [signal, setSignal] = createSignal(0);
		let effectlistener: Memo<any> | null = null;
		let updates = 0;
		createEffect(() => {
			updates += 1;
			effectlistener = getListener();
		});
		runWithListener(effectlistener, () => {
			// This signal should be tracked under the effect's scope
			signal();
		});
		setSignal(2);
		expect(updates).toBe(2);
	});
});

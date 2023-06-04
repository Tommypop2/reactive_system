import { describe, expect, test } from "vitest";
import { createEffect, createMemo, createSignal, getOwner } from "../../src";
import { Memo, runWithOwner } from "../../src/core";

describe("getOwner", () => {
	test("No owner is returned outside of all memos", () => {
		const owner = getOwner();
		expect(owner).toBeNull();
	});
	test("An owner is returned from within a memo", () => {
		let owner: Memo<any> | null = null;
		const data = createMemo(() => {
			owner = getOwner();
		});
		expect(owner).not.toBe(null);
	});
});
describe("runWithOwner", () => {
	test("runWithOwner can run with a null owner and runs immediately", () => {
		let ran = false;
		runWithOwner(null, () => {
			ran = true;
		});
		expect(ran).toBe(true);
	});
	test("Getters called within runWithOwner are tracked by the correct owner", () => {
		const [signal, setSignal] = createSignal(0);
		let effectOwner: Memo<any> | null = null;
		let updates = 0;
		createEffect(() => {
			updates += 1;
			effectOwner = getOwner();
		});
		runWithOwner(effectOwner, () => {
			// This signal should be tracked under the effect's scope
			signal();
		});
		setSignal(2);
		expect(updates).toBe(2);
	});
});

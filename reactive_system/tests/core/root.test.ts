import { describe, expect, test } from "vitest";
import { Memo, getOwner, getRoot } from "../../src";
import { createMemo } from "../../src";

describe("getRoot", () => {
	test("Root is null when called outside of a computation", () => {
		const root = getRoot();
		expect(root).toBe(null);
	});
	test("Root is the same as the owner when called within computation", () => {
		let owner: Memo<any> | null = null;
		let root: Memo<any> | null = null;
		const memo = createMemo(() => {
			owner = getOwner();
			root = getRoot();
		});
		// Owner and root should be the same in this situation, as the memo above has no higher owner. Therefore it is its own owner
		expect(root).toBe(owner);
	});
	test("Root is the same as a higher order owner", () => {
		let owner: Memo<any> | null = null;
		let root: Memo<any> | null = null;
		const base = createMemo(() => {
			owner = getOwner();
			const scoped = createMemo(() => {
				root = getRoot();
			});
		});
		expect(root).toBe(owner);
	});
});

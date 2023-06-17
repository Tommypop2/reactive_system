import { describe, expect, test } from "vitest";
import { Memo, createMemo, getOwner } from "../../src";

describe("getOwner", () => {
	test("Owner is null within an unowned computation", () => {
		let owner: Memo | null = null;
		createMemo(() => {
			owner = getOwner();
		});
		expect(owner).toBe(null);
	});
});

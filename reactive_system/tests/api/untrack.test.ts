import { describe, expect, test } from "vitest";
import { createEffect, createSignal, untrack } from "../../src";

describe("unTrack", () => {
	test("Effects don't include untracked dependencies", () => {
		const [signal, setSignal] = createSignal(2);
		let value: number | undefined;
		createEffect(() => {
			value = untrack(signal);
		});
		setSignal(3);
		expect(value).toBe(2);
	});
});

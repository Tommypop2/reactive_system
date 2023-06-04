import { describe, expect, test } from "vitest";
import { createCacheableMemo, createSignal } from "../../src/api";

describe("cacheableMemo", () => {
	test("Recomputations don't occur when a previously computed set of dependencies occur", () => {
		const [signal, setSignal] = createSignal(0);
		let computations = 0;
		const doubled = createCacheableMemo(() => {
			computations++;
			return signal() * 2;
		});
		expect(computations).toBe(1);
		setSignal(1);
		expect(computations).toBe(2);
		setSignal(0);
		expect(computations).toBe(2);
	});
});

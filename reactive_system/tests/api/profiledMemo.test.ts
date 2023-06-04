import { describe, expect, test } from "vitest";
import { createProfiledMemo, createSignal } from "../../src";
/**
 * Helper function to synchronously wait for a time
 * @param ms Time to wait (milliseconds)
 */
function wait(ms: number) {
	const now = Date.now();
	while (Date.now() - now <= ms) {}
}
describe("createProfiledMemo", () => {
	test("Memos with a computation time greater than the maximum are cached", () => {
		const [signal, setSignal] = createSignal(0);
		let computations = 0;
		const doubled = createProfiledMemo(() => {
			wait(2);
			computations++;
			return signal() * 2;
		}, 1);
		expect(computations).toBe(1);
		setSignal(2);
		expect(computations).toBe(2);
		setSignal(0);
		// Number of computations shouldn't increase if we use a value that we've had before
		expect(computations).toBe(2);
	});
	test("Memos with a computation time less than the maximum are not cached", () => {
		const [signal, setSignal] = createSignal(0);
		let computations = 0;
		const doubled = createProfiledMemo(() => {
			wait(5);
			computations++;
			return signal() * 2;
		});
		expect(computations).toBe(1);
		setSignal(2);
		expect(computations).toBe(2);
		setSignal(0);
		// Number of computations should increase even if we use a value that we've had before
		expect(computations).toBe(3);
	});
});

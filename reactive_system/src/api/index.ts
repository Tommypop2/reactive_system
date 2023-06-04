import { Memo, getOwner, runWithOwner } from "../core";
export { getOwner, runWithOwner, getRoot } from "../core";
export type { Memo } from "../core";
type Getter<T> = () => T;
type Setter<T> = (v: T) => void;
type Signal<T = unknown> = [get: Getter<T>, set: Setter<T>];
/**
 * Creates a signal
 * @param initialValue The initial value of the signal
 * @returns A getter and setter
 */
export const createSignal = <T>(initialValue: T): Signal<T> => {
	const signal = new Memo(() => initialValue);
	return [signal.get, signal.set];
};
/**
 * Creates a memo
 * @param fn The computation to track
 * @returns The result of the computation
 */
export const createMemo = <T>(fn: () => T) => {
	const memo = new Memo(fn);
	return memo.get;
};
/**
 * Creates an effect
 * @param fn The computation to track
 */
export const createEffect = <T>(fn: () => T) => {
	new Memo(fn);
};
/**
 * Executes the given function outside of a tracking scope
 * @param fn
 * @returns
 */
export const untrack = <T>(fn: () => T) => {
	return runWithOwner(null, fn);
};
type OnOptions = { defer?: boolean };

/**
 * Only tracks a specific set of dependencies, whilst untracking the computation itself
 * @param deps The dependencies to track, can be given as an array, or just as a single getter
 * @param fn The computation to execute
 * @param options
 */
export function on<T>(
	deps: Getter<unknown>[] | Getter<unknown>,
	fn: () => T | undefined,
	options?: OnOptions & { defer: false }
): () => T;
export function on<T>(
	deps: Getter<unknown>[] | Getter<unknown>,
	fn: () => T | undefined,
	options?: OnOptions & { defer: true }
): () => T | undefined;
export function on<T>(
	deps: Getter<unknown>[] | Getter<unknown>,
	fn: () => T | undefined,
	options?: OnOptions
): () => T | undefined {
	return () => {
		Array.isArray(deps) ? deps.forEach((dep) => dep()) : deps();
		if (options?.defer) {
			options.defer = false;
			return undefined;
		}
		return untrack(fn);
	};
}
// Primitives
const getDepsString = (deps: Set<Memo>) => {
	let depValues: string[] = [];
	deps.forEach((dep) => depValues.push(String(untrack(dep.get))));
	return depValues.join("");
};
type CachedMemoOptions = {
	cache: boolean;
};
export const createCacheableMemo = <T>(
	fn: () => T,
	options: CachedMemoOptions = { cache: true }
) => {
	let dependencies = new Set<Memo>();
	const cache: Record<string, T> = {};
	const memo = createMemo(() => {
		if (!options.cache) {
			return fn();
		}
		const depString = getDepsString(dependencies);
		if (depString in cache) {
			return cache[depString];
		}
		const value = fn();
		const owner = getOwner();
		dependencies = owner?.dependencies!;
		cache[getDepsString(dependencies)] = value;
		return value;
	});
	return memo;
};

export const createProfiledMemo = <T>(
	fn: () => T,
	minCacheTimeMs: number = 10
) => {
	const cache: Record<string, T> = {};
	let cachedDependencies = new Set<Memo>();
	let caching = false;
	const memo = createMemo(() => {
		if (caching) {
			const depString = getDepsString(cachedDependencies);
			if (depString in cache) {
				return cache[depString];
			}
		}
		const startTime = performance.now();
		const res = fn();
		const endTime = performance.now();
		if (endTime - startTime >= minCacheTimeMs) {
			caching = true;
			const owner = getOwner();
			if (owner?.dependencies) {
				cachedDependencies = owner.dependencies;
			}
			cache[getDepsString(cachedDependencies)] = res;
		}
		return res;
	});
	return memo;
};

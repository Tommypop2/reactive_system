import {
	createEffect,
	createSignal,
	createProfiledMemo,
	createMemo,
} from "../../src";

const body = document.body;
function wait(ms: number) {
	const now = Date.now();
	while (Date.now() - now <= ms) {}
}
const [count, setCount] = createSignal(0);
const inc = document.createElement("button");
inc.textContent = "Increment";
inc.addEventListener("click", () => {
	console.log("Incrementing");
	setCount(count() + 1);
});
const dec = document.createElement("button");
dec.textContent = "Decrement";
dec.addEventListener("click", () => {
	console.log("Decrementing");
	setCount(count() - 1);
});
const display = document.createElement("p");
const doubledDisplay = document.createElement("p");
createEffect(() => {
	// display.textContent = count().toString();
	// doubledDisplay.textContent = doubled().toString();
	count();
	// console.log("Effect running");
	const memo = createMemo(() => "yes");
	const memo2 = createMemo(() => "yes");
	const memo3 = createMemo(() => "yes");
	const memo4 = createMemo(() => "yes");
});
const start = performance.now();
while (true) {
	const x = count();
	if (x === 10000) {
		break;
	}
	setCount(x + 1);
}
const end = performance.now();
console.log(end - start);
body.append(inc);
body.append(display);
body.append(doubledDisplay);
body.append(dec);

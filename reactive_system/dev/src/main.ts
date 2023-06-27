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
const doubled = createProfiledMemo(() => {
	// wait(50);
	console.log("Doubled recomputed");
	return count() * 2;
});
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
	display.textContent = count().toString();
	doubledDisplay.textContent = doubled().toString();
	console.log("Effect running");
	const memo = createMemo(() => "yes");
});
let condition = true;
setInterval(() => {
	if (!condition) return;
	setCount(count() + 1);
}, 0);
body.append(inc);
body.append(display);
body.append(doubledDisplay);
body.append(dec);

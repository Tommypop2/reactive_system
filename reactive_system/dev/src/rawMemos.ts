import { Memo } from "../../src/core";
const A = new Memo(() => 1);

const B = new Memo(() => {
	return A.get() * 2;
});
const C = new Memo(() => {
	return A.get() * 3;
});
const D = new Memo(() => {
	return C.get() + B.get();
});
const E = new Memo(() => {
	return C.get() * B.get();
});
const F = new Memo(() => {
	console.log("Updating", D.get(), E.get());
	return D.get() + E.get();
});
const yes = new Memo(() => {
	console.log(F.get());
});
A.set(2);

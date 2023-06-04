import { createMemo, createSignal, createEffect } from "../../reactive_system";
const [signal, setSignal] = createSignal(0);
const doubled = createMemo(() => signal() * 2);
const tripled = createMemo(() => signal() * 3);
createEffect(() => {
	console.log(doubled());
});

<>
	<button
		onclick={() => {
			setSignal(signal() + 1);
		}}
	>
		{signal()}
	</button>
	<div>{doubled()}</div>
	<div>{tripled()}</div>
</>;

// setInterval(() => setSignal(signal() + 1), 1000);

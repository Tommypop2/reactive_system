import { createSignal } from "../../reactive_system";
const [signal, setSignal] = createSignal(0);
const derived = () => "Other count: " + signal().toString();
<>
	<button
		onclick={() => {
			setSignal(signal() + 1);
		}}
	>
		{derived()}
	</button>
</>;

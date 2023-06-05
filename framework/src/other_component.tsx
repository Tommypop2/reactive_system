import { createSignal } from "../../reactive_system";
import { globalSignal, setGlobalSignal } from "./global_app_state";
const [signal, setSignal] = createSignal(0);
const derived = () => "Other count: " + signal().toString();
const derivedGlobal = () => "Total counts: " + globalSignal().toString();
<>
	<button
		onclick={() => {
			setSignal(signal() + 1);
			setGlobalSignal(globalSignal() + 1);
		}}
		type="button"
	>
		{derived()}
	</button>
	<div>{derivedGlobal()}</div>
</>;

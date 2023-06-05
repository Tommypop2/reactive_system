import { createMemo, createSignal } from "../../reactive_system";
import { globalSignal, setGlobalSignal } from "./global_app_state";
import "./style.css";
const [signal, setSignal] = createSignal(0);
const doubled = createMemo(() => signal() * 2);
const tripled = createMemo(() => signal() * 3);
<>
	<button
		onclick={() => {
			setSignal(signal() + 1);
			setGlobalSignal(globalSignal() + 1);
		}}
		type="button"
	>
		{signal()}
	</button>
	<div>{doubled()}</div>
	<div>{tripled()}</div>
</>;
// This has to be done dynamically as, otherwise, imports are hoisted, and everything would appear out of order
import("./other_component");
import("./dark_mode_toggle");

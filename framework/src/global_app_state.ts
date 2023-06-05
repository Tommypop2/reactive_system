import { createSignal } from "../../reactive_system";

const [globalSignal, setGlobalSignal] = createSignal(0);
export { globalSignal, setGlobalSignal };

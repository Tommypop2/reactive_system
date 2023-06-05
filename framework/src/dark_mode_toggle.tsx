import { createEffect, createSignal, on } from "../../reactive_system";
type Theme = "dark" | "light";
const [theme, setTheme] = createSignal<Theme>(
	(localStorage.getItem("theme") as Theme) ?? "light"
);
createEffect(
	on(theme, () => {
		localStorage.setItem("theme", theme());
		if (theme() === "light") {
			document.body.classList.remove("dark");
			return;
		}
		document.body.classList.add("dark");
	})
);
<button
	onclick={() => {
		setTheme(theme() === "dark" ? "light" : "dark");
	}}
>
	Toggle Dark Mode
</button>;

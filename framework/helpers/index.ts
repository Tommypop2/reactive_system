import { createEffect } from "../../reactive_system";
export function createElement(
	name: string,
	options: { innerText?: () => any | string; onclick?: () => any }
) {
	const element = document.createElement(name);
	const innerText = options.innerText;
	if (innerText) {
		switch (typeof innerText) {
			case "function":
				createEffect(() => {
					element.innerText = innerText();
				});
				break;
			case "string":
				element.innerText = innerText;
		}
	}
	const onClick = options.onclick;
	if (onClick) {
		element.onclick = onClick;
	}
	document.body.appendChild(element);
}

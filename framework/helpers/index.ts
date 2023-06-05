import { createEffect } from "../../reactive_system";
// Array of
const fnArguments = ["onclick"];
export function createElement(
	name: string,
	options: { innerText?: () => any | string; onclick?: () => any }
) {
	const element = document.createElement(name);
	Object.keys(options).forEach((key) => {
		const value = options[key];
		if (typeof value === "function") {
			if (fnArguments.indexOf(key) !== -1) {
				element[key] = value;
				return;
			}
			createEffect(() => {
				element[key] = value();
			});
			return;
		}
		element[key] = value;
		// if (typeof value === "function") {
		// 	createEffect(() => {
		// 		element[key] = value();
		// 	});
		// 	return;
		// }
		// element[key] = value;
	});
	// const innerText = options.innerText;
	// if (innerText) {
	// 	switch (typeof innerText) {
	// 		case "function":
	// 			createEffect(() => {
	// 				element.innerText = innerText();
	// 			});
	// 			break;
	// 		case "string":
	// 			element.innerText = innerText;
	// 	}
	// }
	// const onClick = options.onclick;
	// if (onClick) {
	// 	element.onclick = onClick;
	// }
	document.body.appendChild(element);
}

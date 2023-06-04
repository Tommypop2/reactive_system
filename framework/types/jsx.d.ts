declare namespace JSX {
	interface IntrinsicElements {
		div: Partial<HTMLDivElement & { class: string }>;
		button: Partial<HTMLButtonElement & { class: string }>;
	}
}

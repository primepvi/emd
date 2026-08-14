import { readdirSync, readFileSync } from "node:fs";

export function generateStyles(themePath: string = "styles/themes/default.css") {
	const resetCSS = readFileSync("styles/reset.css", "utf8");
	const baseCSS = readFileSync("styles/base.css", "utf8");

	const tokensCSS = readdirSync("styles/tokens")
		.map(p => readFileSync(p, "utf8"));
	const componentsCSS = readdirSync("styles/components")
		.map(p => readFileSync(p, "utf8"));

	const themeCSS = readFileSync(themePath, "utf8");

	const styles = [
		resetCSS,
		baseCSS,
		tokensCSS.join("\n"),
		componentsCSS.join("\n"),
		themeCSS,
	];

	return styles.join("\n");
}

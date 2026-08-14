import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export function generateStyles() {
	const basePath = path.resolve(import.meta.dirname, "../..");

	const resetCSS = readFileSync(`${basePath}/styles/reset.css`, "utf8");
	const baseCSS = readFileSync(`${basePath}/styles/base.css`, "utf8");

	const tokensCSS = readdirSync(`${basePath}/styles/tokens`)
		.map(p => readFileSync(`${basePath}/styles/tokens/${p}`, "utf8"));
	const componentsCSS = readdirSync(`${basePath}/styles/components`)
		.map(p => readFileSync(`${basePath}/styles/components/${p}`, "utf8"));

	const themeCSS = readFileSync(`${basePath}/styles/themes/default.css`, "utf8");

	const styles = [
		resetCSS,
		baseCSS,
		tokensCSS.join("\n"),
		componentsCSS.join("\n"),
		themeCSS,
	];

	return styles.join("\n");
}

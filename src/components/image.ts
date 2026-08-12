import { ComponentProcessor, type ComponentProcessorContext } from "../types/component.js";

export class ImageComponentProcessor extends ComponentProcessor {
	public name: string = "image";

	public override process(context: ComponentProcessorContext): string {
		const source = this.getNamedAttrib(context, "src") || this.getAttrib(context, 0);
		const alt = this.getNamedAttrib(context, "alt") || "";

		return `<img class="emd-image" src="${source}" alt="${alt}"/>`
	}
}

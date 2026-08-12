import type { ComponentAttributeNode, Document } from "./document.js";

export interface ComponentProcessorContext {
	depth: number;
	document: Document;
	attributes: ComponentAttributeNode[];
};

export abstract class ComponentProcessor {
	abstract name: string;
	abstract process(context: ComponentProcessorContext): string;

	protected getNamedAttrib(context: ComponentProcessorContext, name: string) {
		const attrib = context.attributes.find(a => a.name === name);
		return attrib?.value.value || null;
	}

	protected getAttrib(context: ComponentProcessorContext, index: number) {
		const attrib = context.attributes[index];
		return attrib?.value.value || null;
	}
};

export type ComponentProcessorRegistry = Map<string, ComponentProcessor>;

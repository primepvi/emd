import type { ComponentProcessorRegistry } from "../types/component.js";
import { ImageComponentProcessor } from "./image.js";

export const DefaultProcessorRegistry: ComponentProcessorRegistry = new Map();
DefaultProcessorRegistry.set("image", new ImageComponentProcessor());

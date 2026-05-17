declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		
	};

	type DataEntryMap = {
		"events": {
"creative-solace-x-3-house": {
	id: "creative-solace-x-3-house";
  collection: "events";
  data: any
};
"creative-solace-x-cafe-cremers": {
	id: "creative-solace-x-cafe-cremers";
  collection: "events";
  data: any
};
"creative-solace-x-foodhallen": {
	id: "creative-solace-x-foodhallen";
  collection: "events";
  data: any
};
"creative-solace-x-greyspace": {
	id: "creative-solace-x-greyspace";
  collection: "events";
  data: any
};
"creative-solace-x-mr-buffalo": {
	id: "creative-solace-x-mr-buffalo";
  collection: "events";
  data: any
};
"creative-solace-x-thriftpark": {
	id: "creative-solace-x-thriftpark";
  collection: "events";
  data: any
};
};
"gallery": {
"grey-space-in-the-middle-the-hague-1": {
	id: "grey-space-in-the-middle-the-hague-1";
  collection: "gallery";
  data: any
};
"grey-space-in-the-middle-the-hague-2": {
	id: "grey-space-in-the-middle-the-hague-2";
  collection: "gallery";
  data: any
};
"grey-space-in-the-middle-the-hague-3": {
	id: "grey-space-in-the-middle-the-hague-3";
  collection: "gallery";
  data: any
};
"mr-buffalo-the-hague": {
	id: "mr-buffalo-the-hague";
  collection: "gallery";
  data: any
};
"mr-buffalo-the-hague-1": {
	id: "mr-buffalo-the-hague-1";
  collection: "gallery";
  data: any
};
"mr-buffalo-the-hague-2": {
	id: "mr-buffalo-the-hague-2";
  collection: "gallery";
  data: any
};
"thriftpark-amsterdam": {
	id: "thriftpark-amsterdam";
  collection: "gallery";
  data: any
};
"thriftpark-amsterdam-1": {
	id: "thriftpark-amsterdam-1";
  collection: "gallery";
  data: any
};
};
"products": {
"bouquet-of-kisses": {
	id: "bouquet-of-kisses";
  collection: "products";
  data: any
};
"chanel-lipstick": {
	id: "chanel-lipstick";
  collection: "products";
  data: any
};
"dior-heels": {
	id: "dior-heels";
  collection: "products";
  data: any
};
"lucky-777": {
	id: "lucky-777";
  collection: "products";
  data: any
};
};
"testimonials": Record<string, {
  id: string;
  collection: "testimonials";
  data: any;
}>;
"workshops": {
"bachelorette-and-birthday-packages": {
	id: "bachelorette-and-birthday-packages";
  collection: "workshops";
  data: any
};
"bedazzle-and-sip": {
	id: "bedazzle-and-sip";
  collection: "workshops";
  data: any
};
"paint-and-sip": {
	id: "paint-and-sip";
  collection: "workshops";
  data: any
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}

declare module "vite-plugin-amd" {
	interface PluginOptions {
		requirejs?:string;
		freeze?: boolean;
		strict?: boolean;
		interop?: boolean;
	}
	export default function plugin(option?: PluginOptions): any;
}
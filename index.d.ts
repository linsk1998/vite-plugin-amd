declare module "vite-plugin-amd" {
	interface PluginOptions {
		requirejs?:string;
		freeze?: boolean;
		strict?: boolean;
		interop?: boolean;
		config?:any
	}
	export default function plugin(option?: PluginOptions): any;
}
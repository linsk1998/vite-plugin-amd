const cheerio = require('cheerio');

const preloadHelperId = 'vite/preload-helper';
const preloadMethod = `__vitePreload`;

function preload(baseModule, deps){
	if (!deps || deps.length === 0) {
		return baseModule()
	}
	var rdeps=[];
	var links = document.getElementsByTagName("LINK");
	var ps=[];
	deps.forEach(function(dep) {
		// @ts-ignore
		dep = base + dep;
		// @ts-ignore
		if (Object.prototype.hasOwnProperty.call(seen,dep)) return;
		// @ts-ignore
		seen[dep] = true;
		var isCss = dep.endsWith('.css');
		// @ts-ignore check if the file is already preloaded by SSR markup
		var link;
		var i = links.length;
		while(i-->0){
			link = links[i];
			if(link.href == dep && link.rel=="stylesheet"){
				return ;
			}
		}
		if (isCss) {
			// @ts-ignore
			link = document.createElement('link');
			// @ts-ignore
			link.rel = 'stylesheet';
			link.href = dep;
			// @ts-ignore
			// document.head.appendChild(link);
			// ps.push( new Promise(function(res, rej) {
			// 	link.onload = function(){
			// 		res(this);
			// 	};
			// 	link.onerror = function(message){
			// 		rej(new Error(message));
			// 	};
			// }));
		}else{
			rdeps.push(dep);
		}
	});
	if(rdeps){
		ps.push(new Promise(function(resolve,reject){
			require(rdeps,resolve,reject);
		}));
	}
	return Promise.all(rdeps).then(baseModule);
};
function amd(options) {
	if (!options) options = {};
	var requirejs = options.requirejs;
	let config;
	return {
		name: 'amd',
		enforce: 'pre',
		apply: 'build',
		config(config, { command }) {
			if (command === 'build') {
				//console.log(config);
				var build = config.build;
				if (!build) {
					build = config.build = {};
				}
				var rollupOptions = build.rollupOptions;
				if (!rollupOptions) {
					rollupOptions = build.rollupOptions = {};
				}
				var output = rollupOptions.output;
				if (!output) {
					output = rollupOptions.output = {};
				}
				build.polyfillModulePreload = false;
				output.format = "amd";
				output.freeze = options.freeze || false;
				output.strict = options.strict || false;
				output.interop = options.interop || false;
			}
		},
		transformIndexHtml(html, { bundle }) {
			//console.log(bundle);
			const $ = cheerio.load(html);
			var entries = [];
			$('script[type=module]').each(function () {
				var url = $(this).attr('src');
				if (!url.match(/^\w+:/.test(url))) {
					entries.push(url);
					$(this).remove();
				}
			});
			$('link[rel=modulepreload]').each(function () {
				var url = $(this).attr('href');
				if (!url.match(/^\w+:/.test(url))) {
					entries.push(url);
					$(this).remove();
				}
			});
			if(requirejs){
				$('head').append(
					$('<script></script>').attr('src', requirejs)
				);
			}
			var requirejsConfig=options.config;
			if(requirejsConfig){
				if(typeof requirejsConfig!=="string"){
					requirejsConfig=JSON.stringify(requirejsConfig)
				}
				$('head').append(
					$('<script></script>').html(`require.config(${requirejsConfig});`)
				);
			}
			$('head').append(
				$('<script></script>').html(`require(${JSON.stringify(entries)});`)
			);
			return $.html();
		},
		configResolved(_config) {
			config = _config;
		},
		load(id) {
			Promise.resolve();
			if (id === preloadHelperId) {
				return `
var seen = {};
var base = '${config.base}';
export var ${preloadMethod}=${preload.toString()};
				`;
			}
		}
	}
}

amd.default = amd;
module.exports = amd;
// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.

import WindiCSS from "vite-plugin-windicss";

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	// Enable the Solid renderer to support Solid JSX components.
	renderers: ['@astrojs/renderer-solid'],
	vite: {
		plugins: [WindiCSS()]
	}
});

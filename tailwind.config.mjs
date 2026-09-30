const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['"Instrument Serif"', ...defaultTheme.fontFamily.serif],
				public: ['"Public Sans"', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				// Design tokens (design_handoff_portfolio_editorial)
				paper: '#f5f1ea',
				ink: '#1d1b18',
				muted: '#6b645a',
				body: '#3b3731',
				rule: 'rgba(29, 27, 24, 0.13)',
				chip: 'rgba(29, 27, 24, 0.2)',
				'img-bg': '#e4ddd0',
				accent: 'oklch(0.52 0.14 38)',
				'accent-dark-bg': 'oklch(0.75 0.12 45)',
				'footer-muted': '#b9b1a4',
			},
		},
	},
	plugins: [],
}

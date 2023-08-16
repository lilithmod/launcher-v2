import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { zinc, sky, cyan, lime } from 'tailwindcss/colors';

const config: Config = {
	content: ['./src/assets/index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: ['Inter var', ...fontFamily.sans],
			mono: [...fontFamily.mono]
		},
		extend: {
			boxShadow: {
				outline: '0 0 0 3px rgba(101, 31, 255, 0.4)',
			},
			spacing: {
				'9/16': '56.25%',
			},
			lineHeight: {
				11: '2.75rem',
				12: '3rem',
				13: '3.25rem',
				14: '3.5rem',
			},
			colors: {
				zinc,
				sky,
				cyan,
				lime,
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
};

export default config;

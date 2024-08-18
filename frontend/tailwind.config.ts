import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { zinc, sky, cyan, lime } from 'tailwindcss/colors';

const config: Config = {
	content: ['./src/assets/index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: ['Inter var', ...fontFamily.sans],
			mono: [...fontFamily.mono],
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'spin-around': {
					'0%': { transform: 'translateZ(0) rotate(0)' },
					'15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
					'65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
					'100%': { transform: 'translateZ(0) rotate(360deg)' },
				},
				slide: { to: { transform: 'translate(calc(100cqw - 100%), 0)' } },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
				slide: 'slide var(--speed) ease-in-out infinite alternate',
			},
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
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms'), require('tailwind-scrollbar')],
};

export default config;

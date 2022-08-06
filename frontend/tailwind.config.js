const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/assets/index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: ['Inter var', ...defaultTheme.fontFamily.sans],
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
				zinc: colors.zinc,
				sky: colors.sky,
				cyan: colors.cyan,
				lime: colors.lime,
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.gray.700'),
						a: {
							color: theme('colors.blue.500'),
							'&:hover': {
								color: `${theme('colors.blue.600')} !important`,
							},
							code: { color: theme('colors.blue.400') },
						},
						h1: {
							fontWeight: '700',
							letterSpacing: theme('letterSpacing.tight'),
							color: theme('colors.gray.900'),
						},
						h2: {
							fontWeight: '700',
							letterSpacing: theme('letterSpacing.tight'),
							color: theme('colors.gray.900'),
						},
						h3: {
							fontWeight: '600',
							color: theme('colors.gray.900'),
						},
						'h4,h5,h6': {
							color: theme('colors.gray.900'),
						},
						pre: {
							backgroundColor: theme('colors.gray.800'),
						},
						code: {
							color: theme('colors.pink.500'),
							backgroundColor: theme('colors.gray.100'),
							paddingLeft: '4px',
							paddingRight: '4px',
							paddingTop: '2px',
							paddingBottom: '2px',
							borderRadius: '0.25rem',
						},
						'code::before': {
							content: 'none',
						},
						'code::after': {
							content: 'none',
						},
						details: {
							backgroundColor: theme('colors.gray.100'),
							paddingLeft: '4px',
							paddingRight: '4px',
							paddingTop: '2px',
							paddingBottom: '2px',
							borderRadius: '0.25rem',
						},
						hr: { borderColor: theme('colors.gray.200') },
						'ol li::marker': {
							fontWeight: '600',
							color: theme('colors.gray.500'),
						},
						'ul li::marker': {
							backgroundColor: theme('colors.gray.500'),
						},
						strong: { color: theme('colors.gray.600') },
						blockquote: {
							color: theme('colors.gray.900'),
							borderLeftColor: theme('colors.gray.200'),
						},
					},
				},
			}),
		},
	},
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('tailwind-scrollbar')],
};

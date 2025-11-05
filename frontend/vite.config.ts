import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'
import checker from 'vite-plugin-checker'
import removeConsole from 'vite-plugin-remove-console'
import pkg from './package.json'

const resolve = path.resolve

export default defineConfig({
	root: './src',
	esbuild: {
		logOverride: { 'this-is-undefined-in-esm': 'silent' },
	},
	plugins: [
		removeConsole(),
		checker({
			typescript: true,
			eslint: {
				lintCommand: 'eslint',
			},
		}),
		banner(`Copyright (c) ${new Date().getUTCFullYear()} theMackabu @ Lilith. All Rights Reserved.
		version: ${pkg.version}
		build: ${process.env.NODE_ENV}
		`),

		react({
			babel: {
				plugins: [
					'babel-plugin-macros',
					[
						'@emotion/babel-plugin-jsx-pragmatic',
						{
							export: 'jsx',
							import: '__cssprop',
							module: '@emotion/react',
						},
					],
					['@babel/plugin-transform-react-jsx', { pragma: '__cssprop' }, 'twin.macro'],
				],
			},
		}),
	],
	build: {
		outDir: '../dist',
		rollupOptions: { external: ['/src/main.tsx'] },
		target: 'esnext', // you can also use 'es2020' here
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext', // you can also use 'es2020' here
		},
	},
	server: {
		hmr: true,
		port: 5352,
		host: '0.0.0.0',
	},
})

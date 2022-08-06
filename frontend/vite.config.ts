import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';
import { createHtmlPlugin } from 'vite-plugin-html';
import removeConsole from 'vite-plugin-remove-console';
import banner from 'vite-plugin-banner';
import checker from 'vite-plugin-checker';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const resolve = path.resolve;

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
		banner(`Copyright (c) ${new Date().getUTCFullYear()} theMackabu @ Gamespeed LTD. All Rights Reserved.
		version: ${pkg.version} 
		build: ${process.env.NODE_ENV}
		`),
		createHtmlPlugin({
			minify: true,
			entry: 'index.tsx',
			template: 'assets/index.html',
			inject: {
				data: {
					version: pkg.version,
					build: process.env.NODE_ENV,
				},
			},
		}),
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
		output: {
			entryFileNames: `${pkg.version}/[name].js`,
			chunkFileNames: `${pkg.version}/[name].js`,
			assetFileNames: `${pkg.version}/[name].[ext]`,
		},
	},
	server: {
		watch: true,
		hmr: true,
		port: 5352,
		host: '0.0.0.0',
	},
	resolve: {
		alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
	},
});

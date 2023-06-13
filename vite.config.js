import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        svelte(),
    ],
    resolve: {
        extensions: ['.*', '.wasm', '.mjs', '.js', '.jsx', '.json', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        conditionNames: ['svelte'],
        alias: {
            '@': path.resolve('resources/js'),
        },
    },
});

import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                app: {
                    '50': '#f2fbf7',
                    '100': '#d6f4e7',
                    '200': '#c4eedc',
                    '300': '#97dec1',
                    '400': '#61c79d',
                    '500': '#3cab7e',
                    '600': '#2c8d66',
                    '700': '#266f51',
                    '800': '#225943',
                    '900': '#1e4939',
                    '950': '#0b281d',
                },
            },
        },
    },
};

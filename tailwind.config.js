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
                    '50': '#f6f7f9',
                    '100': '#eceef2',
                    '200': '#d4dae3',
                    '300': '#afbaca',
                    '400': '#8495ac',
                    '500': '#647793',
                    '600': '#506079',
                    '700': '#414e63',
                    '800': '#374151',
                    '900': '#333b47',
                    '950': '#22272f',
                },
            },
        },
    },
};

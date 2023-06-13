import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.svelte',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                app: {
                    50: '#f3faf7',
                    100: '#d7f0e5',
                    200: '#b0dfce',
                    300: '#80c8b0',
                    400: '#56ab92',
                    500: '#429f84',
                    600: '#2e7361',
                    700: '#285d4f',
                    800: '#244b42',
                    900: '#214038',
                    950: '#0e2520',
                },
            },
        },
    },
};

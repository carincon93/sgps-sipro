import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2e7361',
        },
        secondary: {
            main: '#f50057',
        },
    },
})


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<ThemeProvider theme={theme}><App {...props} /></ThemeProvider>);
    },
    progress: {
        // The delay after which the progress bar will appear, in milliseconds...
        delay: 250,

        // The color of the progress bar...
        color: '#1f2937',

        // Whether to include the default NProgress styles...
        includeCSS: true,

        // Whether the NProgress spinner will be shown...
        showSpinner: true,
    },
});

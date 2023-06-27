import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { InertiaProgress } from '@inertiajs/progress'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

InertiaProgress.init({ color: '#429f84' })

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
        color: '#4B5563',
    },
});

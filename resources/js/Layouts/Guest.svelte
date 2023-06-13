<script context="module">
    import { writable } from 'svelte/store'
    export const title = writable(null)
</script>

<script>
    import { inertia, useForm } from '@inertiajs/inertia-svelte'
    import { route } from '@/Utils'
    import ApplicationLogo from '@/Shared/ApplicationLogo'
    import FlashMessages from '@/Shared/FlashMessages'
    import Input from '@/Shared/Input'
    import SenaLogo from '@/Shared/SenaLogo'

    let form = useForm({
        numero_documento: '',
    })
</script>

<svelte:head>
    <title>{$title ? `${$title} - SGPS-SIPRO` : 'SGPS-SIPRO'}</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
    <div class="mt-10 z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div class="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none rounded-lg shadow bg-[#ffffff59]">
            <a class="pointer-events-none place-items-center gap-2 flex px-4 py-2" href="/">
                SENNOVA | <SenaLogo class="w-10" />
            </a>
        </div>
    </div>

    <div
        class="mt-10 relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-green-200 after:via-sena-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-sena-700 before:dark:opacity-10 after:dark:from-green-900 after:dark:via-[#01ff67] after:dark:opacity-40 before:lg:h-[360px] w-5/12"
    >
        <a use:inertia href={route('login')} class="flex items-center justify-center text-orangered-600 text-xl">
            <ApplicationLogo fill="white" class="w-64 mr-6" />
        </a>
        <slot />
    </div>

    <div class="my-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100">
            <h2 class="mb-3 text-2xl font-semibold">Registrarse</h2>

            <p class="m-0 max-w-[30ch] text-sm text-justify opacity-50">Por favor ingrese el número de documento para verificar si ya tiene una cuenta creada.</p>

            <Input type="number" placeholder="Número de documento" bind:value={$form.numero_documento} class="w-full mt-1 text-xs p-0" />
            <a
                use:inertia
                href="/register?numero_documento={$form.numero_documento}"
                class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-app-500 focus:ring-offset-2 transition ease-in-out duration-150 mt-2">Verificar</a
            >
        </div>

        <a href={route('password.request')} class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100">
            <h2 class="mb-3 text-2xl font-semibold">Recuperar contraseña</h2>

            <p class="m-0 max-w-[30ch] text-sm opacity-50">Mediante el correo electrónico institucional y el número de documento puede recuperar la contraseña de su cuenta.</p>
        </a>

        <!-- <a href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100">
            <h2 class="mb-3 text-2xl font-semibold">Documentación</h2>

            <p class="m-0 max-w-[30ch] text-sm opacity-50">Explore the Next.js 13 playground.</p>
        </a> -->

        <a href="#" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:bg-gray-100">
            <h2 class="mb-3 text-2xl font-semibold">Ayuda</h2>
            <p class="m-0 max-w-[30ch] text-sm opacity-50">
                ¿Problemas con la plataforma?. <br /> Realice la siguiente configuración en su navegador <a href="/images/borrar-cache.gif" class="bg-gray-800 hover:bg-gray-700 inline-block px-2 py-1 rounded-sm text-white text-xs" target="_blank">Ver configuración</a> <br /> o envíe un correo a la dirección <a class="underline" href="mailto:sgpssipro@sena.edu.co">sgpssipro@sena.edu.co</a> (Se debe
                enviar desde una cuenta @sena.edu.co).
            </p>
        </a>
    </div>
    <FlashMessages />
</main>

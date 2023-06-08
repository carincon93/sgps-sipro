<script context="module">
    import { writable } from 'svelte/store'
    export const title = writable(null)
</script>

<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'
    import Button from '@/Shared/Button'

    export let status
    export let message

    console.log(message)

    $title = 'SGPS-SIPRO - Error ' + status
</script>

<svelte:head>
    <title>SGPS-SIPRO - Error {status}</title>
</svelte:head>

<div class="{status >= 500 || status == 403 || status == 405 ? 'bg-red-500' : 'bg-app-700'} flex flex-col items-center justify-center min-h-screen text-white">
    <figure>
        {#if status >= 500 || status == 403 || status == 405}
            <img src="/images/error.png" alt="Error" class="w-2/3 m-auto mb-10" />
        {:else if status == 404}
            <img src="/images/error404.png" alt="Error" class="w-2/3 m-auto mb-10" />
        {/if}
    </figure>

    <div class="px-20">
        {#if message}
            <h1 class="text-2xl text-center">{message}</h1>
        {:else}
            {#if status == 403}
                <h1 class="text-2xl text-center">Está acción no está autorizada para su rol.</h1>
            {:else if status == 405}
                <h1 class="text-2xl text-center">Su sesión ha finalizado previamente y no puede realizar está acción. Por favor vuelva a iniciar sesión (En el formulario de Inisio de sesión se recomienda que active la casilla de <strong>Mantener sesión activa</strong>)</h1>
            {:else if status == 404}
                <h1 class="text-2xl text-center">La página que busca no existe.</h1>

                <div class="mt-20">
                    <p>Posibles motivos por los que la página solicitada no se encuentra disponible:</p>
                    <ul class="list-disc mt-5">
                        <li>Puede que haya cambiado de dirección (URL).</li>
                        <li>Es posible que está página no exista o no se haya escrito correctamente la URL, compruebe de nuevo y verifique que este bien escrita.</li>
                    </ul>
                </div>
            {:else if status == 500}
                <h1 class="text-2xl text-center">Algo está mal en nuestros servidores. Por favor notifique este error a la mesa de ayuda.</h1>
            {:else if status == 503}
                <h1 class="text-2xl text-center">La aplicación está en mantenimiento. Por favor intenta de nuevo en unos minutos.</h1>
            {/if}

            {#if status != 503 && status != 405 && status != 403}
                <div class="mt-10">
                    <p>Puede notificar a la mesa de ayuda realice los siguientes pasos:</p>
                    <ul class="list-disc mt-5">
                        <li>Tome un pantallazo del error desde alguna aplicación de Windows o Mac. El pantallazo se recomienda hacerlo de pantalla completa donde se observe con claridad la url y la fecha del momento en el que ocurrió el error.</li>
                        <li>Envie las evidencias al correo <a class="underline" href="mailto:sgpssipro@sena.edu.co">sgpssipro@sena.edu.co</a> describriendo de como ocurrió el error. (Se debe enviar desde una cuenta @sena.edu.co)</li>
                    </ul>
                </div>
            {/if}
            <div class="flex items-center justify-center mt-10">
                <Button on:click={() => Inertia.visit(route('login'))} variant="raised" type="button" class="mr-4" style="background-color: white !important; color: black !important;">Regresar a la aplicación</Button>
            </div>
        {/if}
    </div>
</div>

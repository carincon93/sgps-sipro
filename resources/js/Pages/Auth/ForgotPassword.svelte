<script context="module">
    import GuestLayout from '@/Layouts/Guest'
    export const layout = GuestLayout
</script>

<script>
    import { page, inertia, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import LoadingButton from '@/Shared/LoadingButton'
    import Input from '@/Shared/Input'
    import InfoMessage from '@/Shared/InfoMessage'

    export let success
    export let error
    export let errors

    let form = useForm({
        email: '',
        numero_documento: '',
    })

    function handleSubmit() {
        $form.post(route('password.email'))
    }
</script>

{#if success}
    <div class="mb-4 font-medium text-sm text-green-600">
        {success}
    </div>
{:else if error}
    <div class="mb-4 font-medium text-sm text-red-600">
        {error}
    </div>
{/if}

<form on:submit|preventDefault={handleSubmit} class="m-10 w-2/3">
    <div>
        <Input label={$_('Email')} id="email" type="email" class="mt-1" bind:value={$form.email} error={errors.email} name="email" required autocomplete="email" />
    </div>

    <div class="mt-4">
        <Input label="Número de documento" id="numero_documento" type="number" class="mt-1" bind:value={$form.numero_documento} error={errors.numero_documento} name="numero_documento" required />
    </div>

    {#if $page.props.flash.success}
        <div>
            <InfoMessage class="ml-4 text-center">
                La nueva contraseña es: <strong>sena{$form.numero_documento}*</strong>
                <br />
                <a use:inertia href="/" class="p-3 block rounded text-center mt-2 bg-app-700 text-white">Volver al inico de sesión</a>
            </InfoMessage>
        </div>
    {/if}

    <div class="flex items-center justify-end mt-4">
        <LoadingButton loading={$form.processing} type="submit">Restablecer contraseña</LoadingButton>
    </div>
</form>

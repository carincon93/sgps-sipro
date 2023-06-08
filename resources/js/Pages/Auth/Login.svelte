<script context="module">
    import GuestLayout, { title } from '@/Layouts/Guest'
    export const layout = GuestLayout
</script>

<script>
    import { inertia, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Input from '@/Shared/Input'
    import LoadingButton from '@/Shared/LoadingButton'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Password from '@/Shared/Password'

    export let status
    export let errors

    $title = 'Iniciar sesión'

    let canResetPassword
    let selection = []

    let form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    function handleSubmit() {
        $form.post(route('login'))
    }
</script>

<svelte:head>
    <title>Ingresar - SGPS-SIPRO</title>
</svelte:head>

{#if status}
    <div class="mb-4 font-medium text-sm text-green-600">
        {status}
    </div>
{/if}

<form on:submit|preventDefault={handleSubmit} class="mt-10 w-2/3">
    <div>
        <Input label={$_('Email')} id="email" type="email" class="mt-1" bind:value={$form.email} error={errors.email} required autocomplete="email" />
    </div>

    <div class="mt-8">
        <Password id="password" class="mt-1 w-full" bind:value={$form.password} error={errors.password} required autocomplete="current-password" />
    </div>

    <div class="block mt-4">
        <FormField>
            <Checkbox bind:checked={$form.remember} value={selection} />
            <span slot="label">{$_('Remember me')}</span>
        </FormField>
    </div>

    <div class="flex items-center justify-between mt-4">
        <LoadingButton loading={$form.processing} type="submit">{$_('Login')}</LoadingButton>
    </div>
</form>

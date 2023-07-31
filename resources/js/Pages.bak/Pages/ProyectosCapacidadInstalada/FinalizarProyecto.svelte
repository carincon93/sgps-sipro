<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import LoadingButton from '@/Shared/LoadingButton'

    import Header from './Shared/Header'

    export let errors
    export let proyectoCapacidadInstalada
    export let estadosProyectoCapacidadInstalada

    $: $title = 'Finalizar proyecto de capacidad instalada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        estado_proyecto: proyectoCapacidadInstalada.estado_proyecto,
    })

    function submit() {
        if (proyectoCapacidadInstalada.allowed.to_update) {
            $form.post(route('proyectos-capacidad-instalada.store.finalizar', proyectoCapacidadInstalada.id))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Header {proyectoCapacidadInstalada} />
    </header>

    <form on:submit|preventDefault={submit}>
        <fieldset class="p-8" disabled={proyectoCapacidadInstalada.allowed.to_update ? undefined : true}>
            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="estado_proyecto" value="Estado del proyecto" />
                </div>
                <div>
                    <Select id="estado_proyecto" items={estadosProyectoCapacidadInstalada} bind:selectedValue={$form.estado_proyecto} error={errors.centro_formacion_id} autocomplete="off" placeholder="Seleccione un estado" required />
                </div>
            </div>
        </fieldset>

        <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
            <span class="inline-block"> Si finaliza el proyecto no se podrá modificar </span>

            {#if proyectoCapacidadInstalada.allowed.to_update}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">
                    {$_('Save')}
                </LoadingButton>
            {:else}
                <span class="inline-block"> El proyecto no se puede modificar </span>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>

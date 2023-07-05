<script>
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import PrimaryButton from '@/Components/PrimaryButton'
    import File from '@/Components/File'
    import Label from '@/Components/Label'
    import PercentageProgress from '@/Components/PercentageProgress'

    export let errors
    export let convocatoria
    export let proyecto
    export let anexo
    export let proyectoAnexo

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        archivo: proyectoAnexo.find((item) => item.anexo_id == anexo.id) ? proyectoAnexo.find((item) => item.anexo_id == anexo.id).archivo : '',
        anexo_id: anexo.id,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.proyecto-anexos.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    let proyectoAnexoId
    let fechaActualizacion
    let archivo
    $: if (proyectoAnexo) {
        proyectoAnexoId = proyectoAnexo.find((item) => item.anexo_id == anexo.id) ? proyectoAnexo.find((item) => item.anexo_id == anexo.id).id : null
        fechaActualizacion = proyectoAnexo.find((item) => item.anexo_id == anexo.id) ? proyectoAnexo.find((item) => item.anexo_id == anexo.id).updated_at : null
        archivo = proyectoAnexo.find((item) => item.anexo_id == anexo.id) ? proyectoAnexo.find((item) => item.anexo_id == anexo.id).archivo : null
    }
</script>

<form on:submit|preventDefault={submit} className="mt-4 p-4">
    <fieldset disabled={proyecto?.allowed?.to_update && anexo.habilitado == true ? undefined : true}>
        <div className="mt-20">
            <Label value="Archivo/anexo" />

            <File id="archivo" maxSize="10000" bind:value={$form.archivo} change={[() => submit()]} valueDb={archivo} error={errors.archivo} route={archivo?.includes('http') == true || archivo?.includes('http') == undefined ? null : route('convocatorias.proyectos.proyecto-anexos.download-file-sharepoint', [convocatoria.id, proyecto.id, proyectoAnexoId, 'archivo'])} />

            {#if fechaActualizacion}
                <div className="mt-4">
                    <strong>Fecha de carga del archivo: </strong>{fechaActualizacion}.
                </div>
            {/if}
        </div>
        <div>
            <PrimaryButton loading={$form.processing} className="w-full mt-4" type="submit">
                Cargar {anexo.nombre}
            </PrimaryButton>
        </div>
        {#if $form.progress}
            <PercentageProgress percentage={$form.progress.percentage} />
        {/if}
    </fieldset>
</form>

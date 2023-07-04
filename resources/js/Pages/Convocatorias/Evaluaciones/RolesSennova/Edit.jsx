<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import LoadingButton from '@/Shared/LoadingButton'
    import InfoMessage from '@/Shared/InfoMessage'
    import Textarea from '@/Shared/Textarea'
    import Switch from '@/Shared/Switch'

    import Form from '../../Proyectos/RolesSennova/Form'

    export let convocatoria
    export let evaluacion
    export let proyectoRolEvaluacion
    export let proyecto
    export let errors
    export let proyectoRolSennova
    export let convocatoriaRolesSennova
    export let actividades
    export let lineasTecnologicas
    export let proyectoLineasTecnologicasRelacionadas
    export let proyectoActividadesRelacionadas

    $: $title = proyectoRolSennova.convocatoria_rol_sennova.rol_sennova.nombre

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let rolSennovaInfo = useForm({
        numero_meses: proyectoRolSennova.numero_meses,
        numero_roles: proyectoRolSennova.numero_roles,
        descripcion: proyectoRolSennova.descripcion,
        convocatoria_rol_sennova_id: proyectoRolSennova.convocatoria_rol_sennova_id,
        educacion: proyectoRolSennova.educacion,
        formacion: proyectoRolSennova.formacion,
        experiencia: proyectoRolSennova.experiencia,
        actividad_id: proyectoActividadesRelacionadas,
        linea_tecnologica_id: proyectoLineasTecnologicasRelacionadas,
        numero_monitorias: proyectoRolSennova.numero_roles,
        numero_meses_monitorias: proyectoRolSennova.numero_meses,
    })

    let form = useForm({
        comentario: proyectoRolEvaluacion ? proyectoRolEvaluacion.comentario : '',
        correcto: proyectoRolEvaluacion?.correcto == undefined || proyectoRolEvaluacion?.correcto == true ? true : false,
    })
    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.put(route('convocatorias.evaluaciones.proyecto-rol-sennova.update', [convocatoria.id, evaluacion.id, proyectoRolSennova.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.proyecto-rol-sennova.index', [convocatoria.id, evaluacion.id])} class="text-app-400 hover:text-app-600"> Roles SENNOVA </a>
                    <span class="text-app-400 font-medium">/</span>
                    {proyectoRolSennova.convocatoria_rol_sennova.rol_sennova.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div>
            <h1 class="font-black text-4xl sticky top-0 uppercase">Roles SENNOVA</h1>
        </div>
        <div class="col-span-2">
            <Form {proyecto} {errors} {proyectoRolSennova} {convocatoriaRolesSennova} form={rolSennovaInfo} {actividades} {lineasTecnologicas} {isSuperAdmin} {evaluacion} />

            <form class="mt-10" on:submit|preventDefault={submit}>
                <InfoMessage>
                    <div class="mt-4">
                        <p>¿El rol es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$form.correcto} />
                        {#if $form.correcto == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="comentario" bind:value={$form.comentario} error={errors.comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Evaluar</LoadingButton>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</AuthenticatedLayout>

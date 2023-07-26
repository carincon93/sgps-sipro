<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import PrimaryButton from '@/Components/PrimaryButton'
    import InfoMessage from '@/Components/InfoMessage'
    import Textarea from '@/Components/Textarea'
    import Switch from '@/Components/Switch'

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
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

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
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.put(route('convocatorias.evaluaciones.proyecto-rol-sennova.update', [convocatoria.id, evaluacion.id, proyectoRolSennova.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.proyecto-rol-sennova.index', [convocatoria.id, evaluacion.id])} className="text-app-400 hover:text-app-600"> Roles SENNOVA </a>
                    <span className="text-app-400 font-medium">/</span>
                    {proyectoRolSennova.convocatoria_rol_sennova.rol_sennova.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Roles SENNOVA</h1>
        </div>
        <div className="col-span-2">
            <Form {proyecto} {errors} {proyectoRolSennova} {convocatoriaRolesSennova} form={rolSennovaInfo} {actividades} {lineasTecnologicas} {is_super_admin} {evaluacion} />

            <form className="mt-10" on:submit|preventDefault={submit}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿El rol es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$form.correcto} />
                        {#if $form.correcto == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="comentario" bind:value={$form.comentario} error={errors.comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Evaluar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</AuthenticatedLayout>

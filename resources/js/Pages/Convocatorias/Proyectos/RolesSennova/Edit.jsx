<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let rolSennova
    export let proyectoRolSennova
    export let convocatoriaRolesSennova
    export let lineasTecnologicas
    export let proyectoLineasTecnologicasRelacionadas
    export let actividades
    export let proyectoActividadesRelacionadas

    $: $title = rolSennova.nombre

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        proyecto_id: proyecto.id,
        numero_meses: proyectoRolSennova.numero_meses,
        numero_roles: proyectoRolSennova.numero_roles,
        descripcion: proyectoRolSennova.descripcion,
        educacion: proyectoRolSennova.educacion,
        formacion: proyectoRolSennova.formacion,
        experiencia: proyectoRolSennova.experiencia,
        convocatoria_rol_sennova_id: proyectoRolSennova.convocatoria_rol_sennova_id,
        actividad_id: proyectoActividadesRelacionadas,
        linea_tecnologica_id: proyectoLineasTecnologicasRelacionadas,
        numero_monitorias: proyectoRolSennova.numero_roles,
        numero_meses_monitorias: proyectoRolSennova.numero_meses,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.proyecto-rol-sennova.update', [convocatoria.id, proyecto.id, proyectoRolSennova.id]), {
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
                    <a use:inertia href={route('convocatorias.proyectos.proyecto-rol-sennova.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600"> Roles SENNOVA </a>
                    <span className="text-app-400 font-medium">/</span>
                    {rolSennova.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Roles SENNOVA</h1>

            {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                <RecomendacionEvaluador className="!w-full mt-10">
                    {#each proyectoRolSennova.proyecto_roles_evaluaciones as evaluacionRol, i}
                        <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p className="text-xs">Evaluador COD-{evaluacionRol.evaluacion.id}:</p>
                            {#if evaluacionRol.correcto == false && evaluacionRol.evaluacion.habilitado}
                                <p className="whitespace-pre-line">{evaluacionRol.comentario ? evaluacionRol.comentario : 'Sin recomendación'}</p>
                            {:else}
                                Aprobado
                            {/if}
                        </div>
                    {/each}
                    {#if proyectoRolSennova.proyecto_roles_evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if}
        </div>
        <div className="col-span-2">
            <Form {errors} {proyecto} {proyectoRolSennova} {convocatoriaRolesSennova} {form} {submit} {actividades} {lineasTecnologicas} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>

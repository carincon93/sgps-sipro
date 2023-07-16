<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'

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
    let authUser = $page.props.auth.user
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
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.proyectos.proyecto-rol-sennova.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600"> Roles SENNOVA </a>
                    <span class="text-app-400 font-medium">/</span>
                    {rolSennova.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div>
            <h1 class="font-black text-4xl sticky top-0 uppercase">Roles SENNOVA</h1>

            {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                <RecomendacionEvaluador class="!w-full mt-10">
                    {#each proyectoRolSennova.proyecto_roles_evaluaciones as evaluacionRol, i}
                        <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p class="text-xs">Evaluador COD-{evaluacionRol.evaluacion.id}:</p>
                            {#if evaluacionRol.correcto == false && evaluacionRol.evaluacion.habilitado}
                                <p class="whitespace-pre-line">{evaluacionRol.comentario ? evaluacionRol.comentario : 'Sin recomendación'}</p>
                            {:else}
                                Aprobado
                            {/if}
                        </div>
                    {/each}
                    {#if proyectoRolSennova.proyecto_roles_evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if}
        </div>
        <div class="col-span-2">
            <Form {errors} {proyecto} {proyectoRolSennova} {convocatoriaRolesSennova} {form} {submit} {actividades} {lineasTecnologicas} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>

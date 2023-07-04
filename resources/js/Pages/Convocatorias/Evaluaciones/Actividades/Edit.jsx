<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'

    export let convocatoria
    export let evaluacion
    export let proyecto
    export let actividad
    export let proyectoPresupuesto
    export let proyectoPresupuestoRelacionado

    $: $title = actividad ? actividad.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let actividadInfo = {
        descripcion: actividad.descripcion,
        fecha_inicio: actividad.fecha_inicio,
        fecha_finalizacion: actividad.fecha_finalizacion,
        proyecto_presupuesto_id: proyectoPresupuestoRelacionado,
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.actividades', [convocatoria.id, evaluacion.id])} class="text-app-400 hover:text-app-600"> Actividades </a>
                    <span class="text-app-400 font-medium">/</span>
                    {actividad.descripcion}
                </h1>
            </div>
        </div>
    </header>

    <div class="bg-white rounded shadow max-w-3xl">
        <form>
            <fieldset class="p-8" disabled={isSuperAdmin || (checkRole(authUser, [11, 5]) && proyecto.finalizado == true) ? undefined : true}>
                <div class="mt-4">
                    <p class="text-center">Fecha de ejecución</p>
                    <div class="mt-4 flex items-start justify-around">
                        <div class="mt-4 flex ">
                            <Label labelFor="fecha_inicio" value="Del" />
                            <div class="ml-4">
                                <input disabled id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} value={actividadInfo.fecha_inicio} />
                            </div>
                        </div>
                        <div class="mt-4 flex ">
                            <Label labelFor="fecha_finalizacion" value="hasta" />
                            <div class="ml-4">
                                <input disabled id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} value={actividadInfo.fecha_finalizacion} />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-20">
                    <Textarea disabled label="Descripción" maxlength="15000" id="descripcion" value={actividadInfo.descripcion} />
                </div>

                <h6 class="mt-20 mb-12 text-2xl">Rubros presupuestales</h6>
                <div class="bg-white rounded shadow overflow-hidden">
                    <div class="p-4">
                        <Label class="mb-4" labelFor="proyecto_presupuesto_id" value="Relacione algún rubro" />
                    </div>

                    <div class="p-2">
                        <ul class="list-disc p-4">
                            {#each proyectoPresupuesto as presupuesto}
                                {#each actividadInfo.proyecto_presupuesto_id as proyectoPresupuesto}
                                    {#if presupuesto.id == proyectoPresupuesto}
                                        <li class="mb-4">
                                            <div class="mb-8 mt-4">
                                                <small class="block">Concepto interno SENA</small>
                                                {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal.nombre}
                                            </div>
                                            <div class="mb-8">
                                                <small class="block">Rubro</small>
                                                {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.tercer_grupo_presupuestal.nombre}
                                            </div>
                                            <div class="mb-8">
                                                <small class="block">Uso presupuestal</small>
                                                {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.uso_presupuestal.descripcion}
                                            </div>
                                            <div class="mb-8">
                                                <small class="block">Descripción</small>
                                                {presupuesto.descripcion}
                                            </div>
                                        </li>
                                    {/if}
                                {/each}
                            {/each}
                        </ul>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</AuthenticatedLayout>

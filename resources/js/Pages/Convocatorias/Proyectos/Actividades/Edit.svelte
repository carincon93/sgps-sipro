<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Textarea from '@/Shared/Textarea'
    import InputError from '@/Shared/InputError'
    import InfoMessage from '@/Shared/InfoMessage'
    import Select from '@/Shared/Select'

    export let errors
    export let convocatoria
    export let proyecto
    export let actividad
    export let proyectoRoles
    export let proyectoRolRelacionado
    export let proyectoPresupuesto
    export let proyectoPresupuestoRelacionado
    export let resultadosFiltrados

    $: $title = actividad ? actividad.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let form = useForm({
        resultado_id: actividad.resultado_id,
        descripcion: actividad.descripcion,
        fecha_inicio: actividad.fecha_inicio,
        fecha_finalizacion: actividad.fecha_finalizacion,
        proyecto_presupuesto_id: proyectoPresupuestoRelacionado,
        proyecto_rol_sennova_id: proyectoRolRelacionado,
        requiere_rubros: proyectoPresupuestoRelacionado.length == 0 ? { value: 2, label: 'No' } : { value: 1, label: 'Si' },
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.actividades.update', [convocatoria.id, proyecto.id, actividad.id]), {
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
                    <a use:inertia href={route('convocatorias.proyectos.actividades.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600"> Actividades </a>
                    <span class="text-app-400 font-medium">/</span>
                    {actividad.descripcion}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar actividad</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <form on:submit|preventDefault={submit}>
                <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
                    <div class="mt-8">
                        <p class="text-center">Fecha de ejecución</p>
                        <div class="mt-4 flex items-start justify-around">
                            <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                                <Label required labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                                <div class="ml-4">
                                    <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} bind:value={$form.fecha_inicio} required />
                                </div>
                            </div>
                            <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                                <Label required labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                                <div class="ml-4">
                                    <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                                </div>
                            </div>
                        </div>
                        {#if errors.fecha_inicio || errors.fecha_finalizacion}
                            <InputError message={errors.fecha_inicio || errors.fecha_finalizacion} />
                        {/if}
                    </div>

                    <div class="mt-20">
                        <Label labelFor="resultado_id" value="Resultado" />
                        <Select id="resultado_id" items={resultadosFiltrados} bind:selectedValue={$form.resultado_id} error={errors.resultado_id} autocomplete="off" placeholder="Seleccione un resultado" required />
                    </div>

                    <div class="mt-20">
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="15000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
                    </div>

                    <h6 class="mt-20 mb-12 text-2xl">Rubros presupuestales</h6>

                    <InfoMessage class="ml-10 mb-6 shadow">
                        Si la actividad no requiere asociar un rubro presupuestal. (Ej: Actividad de PQRS) <br /> Por favor, cambie la siguiente opción a <strong>No</strong>
                        <hr class="mb-10" />
                        IMPORTANTE: Solo para actividades que no requieran asociar algún rubro presupuestal. Para el resto de actividades SI debe asociar un rubro para poder completar la<strong class="ml-1.5"> Cadena de valor</strong>.
                        <div class="mt-4">
                            <span class="font-black mr-2">Opción seleccionada:</span>
                            <br />
                            <Select items={opcionesSiNo} id="requiere_rubros" bind:selectedValue={$form.requiere_rubros} error={errors.requiere_rubros} autocomplete="off" placeholder="Seleccione una opción" required />
                        </div>
                    </InfoMessage>
                    {#if $form.requiere_rubros?.value == 1}
                        <div class="bg-white max-h-[600px] overflow-y-auto rounded shadow">
                            <div class="p-4">
                                <Label required class="mb-4" labelFor="proyecto_presupuesto_id" value="Relacione algún rubro" />
                                <InputError message={errors.proyecto_presupuesto_id} />
                            </div>
                            {#if isSuperAdmin || proyecto.allowed.to_update}
                                <div>
                                    {#each proyectoPresupuesto as presupuesto}
                                        <FormField class="border-b border-l w-full odd:bg-white even:bg-slate-50">
                                            <Checkbox bind:group={$form.proyecto_presupuesto_id} value={presupuesto.id} />
                                            <span slot="label">
                                                <div class="mb-4 mt-4">
                                                    <small>
                                                        Código: PRE-{presupuesto.id}
                                                    </small>
                                                    <small class="block">Concepto interno SENA</small>
                                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal.nombre}
                                                </div>
                                                <div class="mb-4">
                                                    <small class="block">Rubro</small>
                                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.tercer_grupo_presupuestal.nombre}
                                                </div>
                                                <div class="mb-4">
                                                    <small class="block">Uso presupuestal</small>
                                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.uso_presupuestal.descripcion}
                                                </div>
                                                <div class="mb-4">
                                                    <small class="block">Descripción</small>
                                                    {presupuesto.descripcion}
                                                </div>
                                                <div class="mb-4">
                                                    <small class="block">Valor total</small>
                                                    ${new Intl.NumberFormat('de-DE').format(presupuesto.valor_total)} COP
                                                </div>
                                            </span>
                                        </FormField>
                                    {/each}
                                    {#if proyectoPresupuesto.length == 0}
                                        <p class="p-4">Sin información registrada</p>
                                    {/if}
                                </div>
                            {:else}
                                <div class="p-2">
                                    <ul class="list-disc p-4">
                                        {#each proyectoPresupuesto as presupuesto}
                                            {#each $form.proyecto_presupuesto_id as proyectoPresupuesto}
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
                            {/if}
                        </div>
                    {/if}

                    <h6 class="mt-20 mb-12 text-2xl">Roles</h6>
                    <InfoMessage class="ml-10 mb-6">Si la actividad tiene un responsable por favor seleccione el rol de la siguiente lista</InfoMessage>
                    <div class="bg-white rounded shadow overflow-hidden">
                        <div class="p-4">
                            <Label class="mb-4" labelFor="proyecto_rol_sennova_id" value="Relacione algún rol" />
                            <InputError message={errors.proyecto_rol_sennova_id} />
                        </div>
                        {#if isSuperAdmin || proyecto.allowed.to_update}
                            <div class="flex flex-col">
                                {#each proyectoRoles as rol}
                                    <FormField class="border-b border-l">
                                        <Checkbox bind:group={$form.proyecto_rol_sennova_id} value={rol.id} />
                                        <span slot="label">
                                            <div class="mb-8">
                                                <small class="block">Nombre</small>
                                                {rol.convocatoria_rol_sennova.rol_sennova.nombre}
                                                <br />
                                                Nivel académico:
                                                {rol.convocatoria_rol_sennova.nivel_academico_formateado}
                                            </div>
                                        </span>
                                    </FormField>
                                {/each}
                                {#if proyectoRoles.length == 0}
                                    <p class="p-4">Sin información registrada</p>
                                {/if}
                            </div>
                        {:else}
                            <div class="p-2">
                                <ul class="list-disc p-4">
                                    {#each proyectoRoles as rol}
                                        {#if rol.id == rol}
                                            <li class="mb-4">
                                                <div class="mb-8">
                                                    <small class="block">Nombre</small>
                                                    {rol.convocatoria_rol_sennova.rol_sennova.nombre}
                                                </div>
                                            </li>
                                        {/if}
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    </div>
                </fieldset>
                <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                    {#if actividad}
                        <small class="flex items-center text-app-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {actividad.updated_at}
                        </small>
                    {/if}
                    {#if proyecto.allowed.to_update}
                        <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                    {:else}
                        <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</AuthenticatedLayout>

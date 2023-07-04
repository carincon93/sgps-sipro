<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import InputError from '@/Components/InputError'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Select from '@/Components/Select'
    import Input from '@/Components/Input'
    import InfoMessage from '@/Components/InfoMessage'

    export let errors
    export let convocatoria
    export let roles
    export let centrosFormacion
    export let lineasInvestigacion
    export let lineasProgramaticas
    export let areasConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let allowedToCreate
    export let tiposProyectos
    export let tiposEventos

    $: $title = 'Crear proyecto de apropiación de la cultura de la innovación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        centro_formacion_id: null,
        linea_investigacion_id: null,
        area_conocimiento_id: null,
        tematica_estrategica_id: null,
        linea_programatica_id: null,
        actividad_economica_id: null,
        tipo_proyecto: null,
        tipo_evento: null,
        titulo: '',
        fecha_inicio: null,
        fecha_finalizacion: null,
        max_meses_ejecucion: 0,
        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    let arrayLineasInvestigacion = lineasInvestigacion
    function selectLineaInvestigacion(event) {
        arrayLineasInvestigacion = lineasInvestigacion.filter(function (obj) {
            return obj.centro_formacion_id == event.detail?.value
        })
    }

    $: if ($form.fecha_inicio && $form.fecha_finalizacion) {
        $form.max_meses_ejecucion = monthDiff($form.fecha_inicio, $form.fecha_finalizacion)
    }

    function submit() {
        if (allowedToCreate) {
            $form.post(route('convocatorias.cultura-innovacion.store', [convocatoria.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.cultura-innovacion.index', [convocatoria.id])} className="text-app-400 hover:text-app-600"> Apropiación de la cultura de la innovación </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <form on:submit|preventDefault={submit}>
        <fieldset className="p-8">
            <div className="mt-28">
                <Label required labelFor="titulo" className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
                <Textarea label="Título" sinContador={true} id="titulo" error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required />
            </div>

            <div className="mt-44">
                <p className="text-center">Fecha de ejecución</p>
                <small className="text-red-400 block text-center"> * Campo obligatorio </small>

                <div className="mt-4 flex items-start justify-around">
                    <div className="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                        <Label required labelFor="fecha_inicio" className={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                        <div className="ml-4">
                            <input id="fecha_inicio" type="date" className="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_65} max={convocatoria.max_fecha_finalizacion_proyectos_cultura} error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required />
                        </div>
                    </div>
                    <div className="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                        <Label required labelFor="fecha_finalizacion" className={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                        <div className="ml-4">
                            <input id="fecha_finalizacion" type="date" className="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_65} max={convocatoria.max_fecha_finalizacion_proyectos_cultura} error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                        </div>
                    </div>
                </div>
                {#if errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion}
                    <div className="mb-20 flex justify-center mt-4">
                        <InputError classes="text-center" message={errors.fecha_inicio} />
                        <InputError classes="text-center" message={errors.fecha_finalizacion} />
                        <InputError classes="text-center" message={errors.max_meses_ejecucion} />
                    </div>
                {/if}
            </div>

            {#if centrosFormacion.length > 0}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
                        <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
                    </div>
                    <div>
                        <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} selectFunctions={[(event) => selectLineaInvestigacion(event)]} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                    </div>
                </div>
            {:else}
                <div className="mt-44">
                    <InfoMessage message="No hay centros de formación disponibles para la formulación de proyectos de la línea 65." alertMsg={true} />
                </div>
            {/if}

            {#if $form.centro_formacion_id?.value}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="linea_investigacion_id" value="Línea de investigación" />
                    </div>
                    <div>
                        <Select id="linea_investigacion_id" items={arrayLineasInvestigacion} bind:selectedValue={$form.linea_investigacion_id} error={errors.linea_investigacion_id} autocomplete="off" placeholder="Busque por el nombre de la línea de investigación, centro de formación, grupo de investigación o regional" required />
                    </div>
                </div>
            {/if}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                </div>
                <div>
                    <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" required />
                </div>
            </div>
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="tipo_proyecto" value="Tipo de proyecto" />
                </div>
                <div>
                    <Select id="tipo_proyecto" items={tiposProyectos} bind:selectedValue={$form.tipo_proyecto} error={errors.tipo_proyecto} autocomplete="off" placeholder="Seleccione un tipo de proyecto" required />
                </div>
            </div>
            {#if $form.tipo_proyecto?.value == 2}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="tipo_evento" value="Tipo de evento" />
                    </div>
                    <div>
                        <Select id="tipo_evento" items={tiposEventos} bind:selectedValue={$form.tipo_evento} error={errors.tipo_evento} autocomplete="off" placeholder="Seleccione un tipo de evento" required />
                    </div>
                </div>
            {/if}
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="area_conocimiento_id" value="Área de conocimiento" />
                </div>
                <div>
                    <Select id="area_conocimiento_id" items={areasConocimiento} bind:selectedValue={$form.area_conocimiento_id} error={errors.area_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la área de conocimiento" required />
                </div>
            </div>
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="actividad_economica_id" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto de investigación?" />
                </div>
                <div>
                    <Select id="actividad_economica_id" items={actividadesEconomicas} bind:selectedValue={$form.actividad_economica_id} error={errors.actividad_economica_id} autocomplete="off" placeholder="Busque por el nombre de la actividad económica" required />
                </div>
            </div>
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="tematica_estrategica_id" value="Temática estratégica SENA" />
                </div>
                <div>
                    <Select id="tematica_estrategica_id" items={tematicasEstrategicas} bind:selectedValue={$form.tematica_estrategica_id} error={errors.tematica_estrategica_id} autocomplete="off" placeholder="Busque por el nombre de temática estratégica" required />
                </div>
            </div>

            <hr className="mt-5 mb-5" />

            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                </div>
                <div>
                    <Select id="rol_sennova" items={roles} bind:selectedValue={$form.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                </div>
            </div>
            {#if $form.fecha_inicio && $form.fecha_finalizacion}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
                    </div>
                    <div>
                        <Input label="Número de meses de vinculación" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max={monthDiff($form.fecha_inicio, $form.fecha_finalizacion)} className="mt-1" bind:value={$form.cantidad_meses} error={errors.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" required />
                        {#if monthDiff($form.fecha_inicio, $form.fecha_finalizacion)}
                            <InfoMessage>
                                <small>
                                    El proyecto se ejecutará entre {$form.fecha_inicio} y {$form.fecha_finalizacion}, por lo tanto el número de meses máximo es: {monthDiff($form.fecha_inicio, $form.fecha_finalizacion)}
                                    <br />
                                    <span className="flex">
                                        Uitlice las flechas <span className="flex flex-col relative top-[-0.4rem]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                            </svg>

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </span> que aparecen dentro del campo para ajustar los decimales.
                                    </span>
                                </small>
                            </InfoMessage>
                        {/if}
                    </div>
                </div>
            {/if}

            <div className="mt-44 grid grid-cols-2">
                <div>
                    <Label required className="mb-4" labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto (basarse en los lineamientos operativos SENNOVA {convocatoria.year} y en la circular 01-3-2021-000034)" />
                </div>
                <div>
                    <Input label="Número de horas semanales dedicadas para el desarrollo del proyecto" id="cantidad_horas" type="number" input$step="1" input$min="1" input$max={$form.rol_sennova?.maxHoras} className="mt-1" bind:value={$form.cantidad_horas} error={errors.cantidad_horas} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" autocomplete="off" required />
                    <InfoMessage>Horas máximas permitidas para este rol: {$form.rol_sennova?.maxHoras ? $form.rol_sennova?.maxHoras : 0}.</InfoMessage>
                </div>
            </div>
        </fieldset>

        <div className="flex items-center justify-between mt-14 px-8 py-4">
            {#if allowedToCreate}
                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">
                    {$_('Continue')}
                </PrimaryButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>

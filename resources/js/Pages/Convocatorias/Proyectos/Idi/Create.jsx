<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import Input from '@/Shared/Input'
    import Switch from '@/Shared/Switch'
    import InfoMessage from '@/Shared/InfoMessage'
    import SelectMulti from '@/Shared/SelectMulti'

    export let errors
    export let convocatoria
    export let centrosFormacion
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let lineasInvestigacion
    export let lineasProgramaticas
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let redesConocimiento
    export let allowedToCreate
    export let gruposInvestigacion
    export let lineasInvestigacionEni
    export let areasTematicasEni

    $: $title = 'Crear proyecto I+D+i'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        centro_formacion_id: null,
        linea_investigacion_id: null,
        area_conocimiento_id: null,
        subarea_conocimiento_id: null,
        disciplina_subarea_conocimiento_id: null,
        tematica_estrategica_id: null,
        red_conocimiento_id: null,
        linea_programatica_id: null,
        actividad_economica_id: null,
        titulo: '',
        fecha_inicio: null,
        fecha_finalizacion: null,
        max_meses_ejecucion: 0,
        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
        articulacion_eni: false,
        proyecto_investigacion_pedagogica: false,
        justificacion_proyecto_investigacion_pedagogica: '',

        grupo_investigacion_eni_id: null,
        linea_investigacion_eni_id: null,
        area_tematica_eni_id: null,
    })

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == $form.area_conocimiento_id?.value
    })
    function selectAreaConocimiento(event) {
        arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
            return obj.area_conocimiento_id == event.detail?.value
        })
    }

    let arrayDisciplinasSubareaConocimiento = []
    function selectSubreaConocimiento(event) {
        arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
            return obj.subarea_conocimiento_id == event.detail?.value
        })
    }

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
            $form.post(route('convocatorias.idi.store', [convocatoria.id]))
        }
    }

    let roles = [
        { value: 1, label: 'Dinamizador SENNOVA', maxHoras: 48 },
        { value: 2, label: 'Investigador experto', maxHoras: 48 },
        { value: 3, label: 'Instructor investigador', maxHoras: 16 },
        { value: 4, label: 'Aprendiz Sena de semillero de investigación', maxHoras: 48 },
        { value: 5, label: 'Investigador junior', maxHoras: 48 },
        { value: 6, label: 'Aprendiz SENA', maxHoras: 48 },
    ]
    $: if ($form.articulacion_eni?.value == 1) {
        roles = [
            { value: 1, label: 'Dinamizador SENNOVA', maxHoras: 48 },
            { value: 2, label: 'Investigador experto', maxHoras: 48 },
            { value: 3, label: 'Instructor investigador', maxHoras: 16 },
            { value: 4, label: 'Aprendiz Sena de semillero de investigación', maxHoras: 48 },
            { value: 5, label: 'Investigador junior', maxHoras: 48 },
            { value: 6, label: 'Aprendiz SENA', maxHoras: 48 },
            { value: 7, label: 'Formador de formadores', maxHoras: 48 },
        ]
    } else if ($form.proyecto_investigacion_pedagogica?.value == 2 || $form.articulacion_eni?.value == 2) {
        roles = [
            { value: 1, label: 'Dinamizador SENNOVA', maxHoras: 48 },
            { value: 2, label: 'Investigador experto', maxHoras: 48 },
            { value: 3, label: 'Instructor investigador', maxHoras: 16 },
            { value: 4, label: 'Aprendiz Sena de semillero de investigación', maxHoras: 48 },
            { value: 5, label: 'Investigador junior', maxHoras: 48 },
            { value: 6, label: 'Aprendiz SENA', maxHoras: 48 },
        ]
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.idi.index', [convocatoria.id])} class="text-app-400 hover:text-app-600"> I+D+i </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <form on:submit|preventDefault={submit}>
        <fieldset class="p-8 divide-y">
            <div class="py-24">
                <Label required labelFor="titulo" class="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
                <Textarea label="Título" id="titulo" sinContador={true} error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required />
            </div>

            <div class="py-24">
                <p class="text-center">Fecha de ejecución</p>
                <small class="text-red-400 block text-center"> * Campo obligatorio </small>
                <div class="mt-4 flex items-start justify-around">
                    <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                        <Label required labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                        <div class="ml-4">
                            <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required />
                        </div>
                    </div>
                    <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                        <Label required labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                        <div class="ml-4">
                            <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                        </div>
                    </div>
                </div>
                {#if errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion}
                    <div class="mb-20 flex justify-center mt-4">
                        <InputError classes="text-center" message={errors.fecha_inicio} />
                        <InputError classes="text-center" message={errors.fecha_finalizacion} />
                        <InputError classes="text-center" message={errors.max_meses_ejecucion} />
                    </div>
                {/if}
            </div>

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
                        <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
                    </div>
                    <div>
                        <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} selectFunctions={[(event) => selectLineaInvestigacion(event)]} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                    </div>
                </div>
            </div>

            {#if $form.centro_formacion_id?.value}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="linea_investigacion_id" value="Línea de investigación" />
                        </div>
                        <div>
                            <Select id="linea_investigacion_id" items={arrayLineasInvestigacion} bind:selectedValue={$form.linea_investigacion_id} error={errors.linea_investigacion_id} autocomplete="off" placeholder="Busque por el nombre de la línea de investigación, centro de formación, grupo de investigación o regional" required />
                        </div>
                    </div>
                </div>
            {/if}

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                    </div>
                    <div>
                        <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" required />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="red_conocimiento_id" value="Red de conocimiento sectorial" />
                    </div>
                    <div>
                        <Select id="red_conocimiento_id" items={redesConocimiento} bind:selectedValue={$form.red_conocimiento_id} error={errors.red_conocimiento_id} autocomplete="off" placeholder="Seleccione una red de conocimiento" required />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="area_conocimiento_id" value="Área de conocimiento" />
                    </div>
                    <div>
                        <Select id="area_conocimiento_id" items={areasConocimiento} bind:selectedValue={$form.area_conocimiento_id} selectFunctions={[(event) => selectAreaConocimiento(event)]} error={errors.area_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la área de conocimiento" required />
                    </div>
                </div>
            </div>
            {#if $form.area_conocimiento_id}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="subarea_conocimiento_id" value="Subárea de conocimiento" />
                        </div>
                        <div>
                            <Select id="subarea_conocimiento_id" items={arraySubareasConocimiento} bind:selectedValue={$form.subarea_conocimiento_id} selectFunctions={[(event) => selectSubreaConocimiento(event)]} error={errors.subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la subárea de conocimiento" required />
                        </div>
                    </div>
                </div>
            {/if}
            {#if $form.subarea_conocimiento_id}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de la subárea de conocimiento" />
                        </div>
                        <div>
                            <Select id="disciplina_subarea_conocimiento_id" items={arrayDisciplinasSubareaConocimiento} bind:selectedValue={$form.disciplina_subarea_conocimiento_id} error={errors.disciplina_subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la disciplina de subáreas de conocimiento" required />
                        </div>
                    </div>
                </div>
            {/if}

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="actividad_economica_id" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                    </div>
                    <div>
                        <Select id="actividad_economica_id" items={actividadesEconomicas} bind:selectedValue={$form.actividad_economica_id} error={errors.actividad_economica_id} autocomplete="off" placeholder="Busque por el nombre de la actividad económica" required />
                    </div>
                </div>
            </div>
            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="tematica_estrategica_id" value="Temática estratégica SENA" />
                    </div>
                    <div>
                        <Select id="tematica_estrategica_id" items={tematicasEstrategicas} bind:selectedValue={$form.tematica_estrategica_id} error={errors.tematica_estrategica_id} autocomplete="off" placeholder="Busque por el nombre de la temática estratégica" required />
                    </div>
                </div>
            </div>

            {#if $form.linea_programatica_id?.value == 1 || $form.linea_programatica_id?.value == 3}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="proyecto_investigacion_pedagogica" value="¿El proyecto es de investigación pedagógica?" />
                        </div>
                        <div>
                            <Switch bind:checked={$form.proyecto_investigacion_pedagogica} />
                        </div>
                    </div>

                    {#if $form.proyecto_investigacion_pedagogica}
                        {#if convocatoria.campos_convocatoria.find((element) => element.campo == 'justificacion_proyecto_investigacion_pedagogica').convocatoriaId == convocatoria.id}
                            <div class="mt-44 ml-8 grid grid-cols-2">
                                <div>
                                    <Label required class="mb-4" labelFor="justificacion_proyecto_investigacion_pedagogica" value="Justificación" />
                                </div>
                                <div>
                                    <Textarea maxlength="40000" id="justificacion_proyecto_investigacion_pedagogica" error={errors.justificacion_proyecto_investigacion_pedagogica} bind:value={$form.justificacion_proyecto_investigacion_pedagogica} required={!$form.proyecto_investigacion_pedagogica ? undefined : 'required'} />
                                </div>
                            </div>
                        {/if}

                        <div class="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required class="mb-4" labelFor="articulacion_eni" value="¿El proyecto está articulado con la ENI?" />
                            </div>
                            <div>
                                <Switch bind:checked={$form.articulacion_eni} />
                            </div>
                        </div>

                        <div class="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required class="mb-4" labelFor="grupo_investigacion_eni_id" value="Grupo de investigación ENI" />
                            </div>
                            <div>
                                <Select id="grupo_investigacion_eni_id" items={gruposInvestigacion} bind:selectedValue={$form.grupo_investigacion_eni_id} error={errors.grupo_investigacion_eni_id} autocomplete="off" placeholder="Seleccione un grupo de investigación" required />
                            </div>
                        </div>

                        <div class="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required class="mb-4" labelFor="linea_investigacion_eni_id" value="Líneas de investigación ENI" />
                            </div>
                            <div>
                                <SelectMulti id="linea_investigacion_eni_id" bind:selectedValue={$form.linea_investigacion_eni_id} items={lineasInvestigacionEni} isMulti={true} error={errors.linea_investigacion_eni_id} placeholder="Seleccione una o varias opciones" required />
                            </div>
                        </div>

                        <div class="ml-8 grid grid-cols-2 mt-24">
                            <div>
                                <Label required class="mb-4" labelFor="area_tematica_eni_id" value="Áreas temáticas" />
                            </div>
                            <div>
                                <SelectMulti id="area_tematica_eni_id" bind:selectedValue={$form.area_tematica_eni_id} items={areasTematicasEni} isMulti={true} error={errors.area_tematica_eni_id} placeholder="Seleccione una o varias opciones" required />
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}

            <div class="py-24">
                <p class="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                    </div>
                    <div>
                        <Select id="rol_sennova" bind:items={roles} bind:selectedValue={$form.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                    </div>
                </div>
            </div>

            {#if $form.fecha_inicio && $form.fecha_finalizacion}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
                        </div>
                        <div>
                            <Input label="Número de meses de vinculación" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max={monthDiff($form.fecha_inicio, $form.fecha_finalizacion)} class="mt-1" bind:value={$form.cantidad_meses} error={errors.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" required />
                            {#if monthDiff($form.fecha_inicio, $form.fecha_finalizacion)}
                                <InfoMessage>
                                    <small>
                                        El proyecto se ejecutará entre {$form.fecha_inicio} y {$form.fecha_finalizacion}, por lo tanto el número de meses máximo es: {monthDiff($form.fecha_inicio, $form.fecha_finalizacion)}
                                        <br />
                                        <span class="flex">
                                            Uitlice las flechas <span class="flex flex-col relative top-[-0.4rem]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </span> que aparecen dentro del campo para ajustar los decimales.
                                        </span>
                                    </small>
                                </InfoMessage>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}

            <div class="py-24">
                <div class="grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto (basarse en los lineamientos operativos SENNOVA {convocatoria.year} y en la circular 01-3-2021-000034)" />
                    </div>
                    <div>
                        <Input label="Número de horas semanales dedicadas para el desarrollo del proyecto" id="cantidad_horas" type="number" input$step="1" input$min="1" input$max={$form.rol_sennova?.maxHoras} class="mt-1" bind:value={$form.cantidad_horas} error={errors.cantidad_horas} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" autocomplete="off" required />
                        <InfoMessage>Horas máximas permitidas para este rol: {$form.rol_sennova?.maxHoras ? $form.rol_sennova?.maxHoras : 0}.</InfoMessage>
                    </div>
                </div>
            </div>
        </fieldset>

        <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            {#if allowedToCreate}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">
                    {$_('Continue')}
                </LoadingButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>

<script>
    import { route } from '@/Utils'
    import { Inertia } from '@inertiajs/inertia'

    import Select from '@/Components/Select'
    import MultipleSelect from '@/Components/MultipleSelect'
    import Switch from '@/Components/Switch'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Radio from '@smui/radio'
    import Input from '@/Components/Input'
    import InputError from '@/Components/InputError'
    import Label from '@/Components/Label'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let isSuperAdmin
    export let idi
    export let convocatoria
    export let evaluacion
    export let form
    export let errors
    export let redesConocimiento
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let lineasInvestigacion
    export let tecnoacademia
    export let lineasTecnoacademia
    export let tecnoacademias
    export let municipios
    export let areasTematicasEni
    export let lineasInvestigacionEni
    export let opcionesIDiDropdown
    export let programasFormacionConRegistroCalificado
    export let programasFormacionSinRegistroCalificado
    export let tieneVideo
    export let requiereJustificacionIndustria4
    export let requiereJustificacionEconomiaNaranja
    export let requiereJustificacionPoliticaDiscapacidad
    export let requiereJustificacionAntencionPluralista
    export let requiereJustificacionSectorAgricola
    export let lineasProgramaticas
    export let gruposInvestigacion
    export let mesasSectoriales

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
        return obj.tecnoacademia_id == tecnoacademia?.id
    })
    function selectLineasTecnoacademia(event) {
        arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
            return obj.tecnoacademia_id == event.detail?.value
        })
    }

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == $form.area_conocimiento_id
    })
    function selectAreaConocimiento(event) {
        arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
            return obj.area_conocimiento_id == event.detail?.value
        })
    }

    let arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
        return obj.subarea_conocimiento_id == $form.subarea_conocimiento_id
    })
    function selectSubreaConocimiento(event) {
        arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
            return obj.subarea_conocimiento_id == event.detail?.value
        })
    }

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (typeof column !== undefined && typeof form !== undefined && idi.proyecto.allowed.to_update) {
                //guardar
                Inertia.put(
                    route('convocatorias.idi.updateLongColumn', [convocatoria.id, idi.id, column]),
                    { [column]: form[column] },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }
</script>

<div className="py-24">
    <Label required disabled={evaluacion ? 'disabled' : undefined} labelFor="titulo" className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)" />
    <Textarea label="Título" id="titulo" sinContador={true} error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required disabled={evaluacion ? 'disabled' : undefined} />
    <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador className="mt-8">
            {#each idi.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.titulo_comentario ? evaluacion.idi_evaluacion.titulo_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if idi.proyecto.evaluaciones.length == 0}
                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if} -->

    <slot name="titulo" />
</div>
<div className="py-24">
    {#if idi.proyecto.allowed.to_update}
        <p className="text-center">Fecha de ejecución</p>
    {/if}
    <small className="text-red-400 block text-center"> * Campo obligatorio </small>

    <div className="mt-4 flex items-start justify-around">
        <div className="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
            <Label required disabled={evaluacion ? 'disabled' : undefined} labelFor="fecha_inicio" className={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
            <div className="ml-4">
                <input id="fecha_inicio" type="date" className="mt-1 block w-full p-4" bind:value={$form.fecha_inicio} required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
        <div className="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
            <Label required disabled={evaluacion ? 'disabled' : undefined} labelFor="fecha_finalizacion" className={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
            <div className="ml-4">
                <input id="fecha_finalizacion" type="date" className="mt-1 block w-full p-4" bind:value={$form.fecha_finalizacion} required disabled={evaluacion ? 'disabled' : undefined} />
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

    <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador className="mt-8">
            {#each idi.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.fechas_comentario ? evaluacion.idi_evaluacion.fechas_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if idi.proyecto.evaluaciones.length == 0}
                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if} -->

    <slot name="fechas" />
</div>

<fieldset className="py-24" disabled>
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
            <small className="block leading-tight"> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
        </div>
        <div className="capitalize">
            {idi.proyecto.centro_formacion.nombre}
            <br />
            {idi.proyecto.centro_formacion.codigo}
        </div>
    </div>

    {#if $form.centro_formacion_id}
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_investigacion_id" value="Línea de investigación" />
            </div>
            <div>
                <Select id="linea_investigacion_id" items={lineasInvestigacion} bind:selectedValue={$form.linea_investigacion_id} error={errors.linea_investigacion_id} autocomplete="off" placeholder="Busque por el nombre de la línea de investigación, centro de formación, grupo de investigación o regional" required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
    {/if}
    <div className="mt-44 grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
        </div>
        <div>
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="red_conocimiento_id" value="Red de conocimiento sectorial" />
        </div>
        <div>
            <Select id="red_conocimiento_id" items={redesConocimiento} bind:selectedValue={$form.red_conocimiento_id} error={errors.red_conocimiento_id} autocomplete="off" placeholder="Seleccione una red de conocimiento" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>

    <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador className="mt-8">
            {#each idi.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.red_conocimiento_comentario ? evaluacion.idi_evaluacion.red_conocimiento_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if idi.proyecto.evaluaciones.length == 0}
                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if} -->

    <slot name="red-conocimiento" />
</div>

<div className="py-24">
    <div className="mt-44 grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="area_conocimiento_id" value="Área de conocimiento" />
        </div>
        <div>
            <Select id="area_conocimiento_id" items={areasConocimiento} bind:selectedValue={$form.area_conocimiento_id} selectFunctions={[(event) => selectAreaConocimiento(event)]} error={errors.area_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la área de conocimiento" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if $form.area_conocimiento_id}
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="subarea_conocimiento_id" value="Subárea de conocimiento" />
            </div>
            <div>
                <Select id="subarea_conocimiento_id" items={arraySubareasConocimiento} bind:selectedValue={$form.subarea_conocimiento_id} selectFunctions={[(event) => selectSubreaConocimiento(event)]} error={errors.subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la subárea de conocimiento" required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
    {/if}
    {#if $form.subarea_conocimiento_id}
        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de la subárea de conocimiento" />
            </div>
            <div>
                <Select id="disciplina_subarea_conocimiento_id" items={arrayDisciplinasSubareaConocimiento} bind:selectedValue={$form.disciplina_subarea_conocimiento_id} error={errors.disciplina_subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la disciplina de subáreas de conocimiento" required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
        <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
            <RecomendacionEvaluador className="mt-8">
                {#each idi.proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.disciplina_subarea_conocimiento_comentario ? evaluacion.idi_evaluacion.disciplina_subarea_conocimiento_comentario : 'Sin recomendación'}</p>
                        </div>
                    {/if}
                {/each}
                {#if idi.proyecto.evaluaciones.length == 0}
                    <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        {/if} -->

        <slot name="disciplina-subarea-conocimiento" />
    {/if}
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="actividad_economica_id" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
        </div>
        <div>
            <Select id="actividad_economica_id" items={actividadesEconomicas} bind:selectedValue={$form.actividad_economica_id} error={errors.actividad_economica_id} autocomplete="off" placeholder="Busque por el nombre de la actividad económica" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador className="mt-8">
            {#each idi.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.actividad_economica_comentario ? evaluacion.idi_evaluacion.actividad_economica_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if idi.proyecto.evaluaciones.length == 0}
                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if} -->

    <slot name="actividad-economica" />
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="tematica_estrategica_id" value="Temática estratégica SENA" />
        </div>
        <div>
            <Select id="tematica_estrategica_id" items={tematicasEstrategicas} bind:selectedValue={$form.tematica_estrategica_id} error={errors.tematica_estrategica_id} autocomplete="off" placeholder="Busque por el nombre de la temática estratégica" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador className="mt-8">
            {#each idi.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.tematica_estrategica_comentario ? evaluacion.idi_evaluacion.tematica_estrategica_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if idi.proyecto.evaluaciones.length == 0}
                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if} -->

    <slot name="tematica-estrategica" />
</div>

{#if $form.linea_programatica_id?.value == 1 || $form.linea_programatica_id?.value == 3}
    <div className="py-24">
        <div className="grid grid-cols-2">
            <div>
                <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="proyecto_investigacion_pedagogica" value="¿El proyecto es de investigación pedagógica?" />
            </div>
            <div>
                <Switch bind:checked={$form.proyecto_investigacion_pedagogica} />
            </div>
        </div>

        {#if $form.proyecto_investigacion_pedagogica}
            {#if convocatoria.campos_convocatoria.find((element) => element.campo == 'justificacion_proyecto_investigacion_pedagogica').convocatoriaId == convocatoria.id}
                <div className="mt-44 ml-8 grid grid-cols-2">
                    <div>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="justificacion_proyecto_investigacion_pedagogica" value="Justificación" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="justificacion_proyecto_investigacion_pedagogica" error={errors.justificacion_proyecto_investigacion_pedagogica} bind:value={$form.justificacion_proyecto_investigacion_pedagogica} required={!$form.proyecto_investigacion_pedagogica ? undefined : 'required'} />
                    </div>
                </div>
            {/if}

            <div className="ml-8 grid grid-cols-2 mt-24">
                <div>
                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="articulacion_eni" value="¿El proyecto está articulado con la ENI?" />
                </div>
                <div>
                    <Switch bind:checked={$form.articulacion_eni} />
                </div>
            </div>

            {#if $form.articulacion_eni}
                <div className="ml-8 grid grid-cols-2 mt-24">
                    <div>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="grupo_investigacion_eni_id" value="Grupo de investigación ENI" />
                    </div>
                    <div>
                        <Select id="grupo_investigacion_eni_id" items={gruposInvestigacion} bind:selectedValue={$form.grupo_investigacion_eni_id} error={errors.grupo_investigacion_eni_id} autocomplete="off" placeholder="Seleccione un grupo de investigación" required disabled={evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>

                <div className="ml-8 grid grid-cols-2 mt-24">
                    <div>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="linea_investigacion_eni_id" value="Líneas de investigación ENI" />
                    </div>
                    <div>
                        <MultipleSelect id="linea_investigacion_eni_id" bind:selectedValue={$form.linea_investigacion_eni_id} items={lineasInvestigacionEni}  error={errors.linea_investigacion_eni_id} placeholder="Seleccione una o varias opciones" required disabled={evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>

                <div className="ml-8 grid grid-cols-2 mt-24">
                    <div>
                        <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="area_tematica_eni_id" value="Áreas temáticas" />
                    </div>
                    <div>
                        <MultipleSelect id="area_tematica_eni_id" bind:selectedValue={$form.area_tematica_eni_id} items={areasTematicasEni}  error={errors.area_tematica_eni_id} placeholder="Seleccione una o varias opciones" required disabled={evaluacion ? 'disabled' : undefined} />
                    </div>
                </div>
            {/if}
        {/if}
    </div>
{/if}

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label labelFor="video" value="¿El proyecto tiene video?" />
        </div>
        <div>
            <Switch bind:checked={tieneVideo} />
            {#if tieneVideo}
                <InfoMessage className="mb-2" message="Video de 3 minutos, en donde se presente de manera sencilla y dinámica la justificación del proyecto, la problemática, el objetivo general, los objetivos específicos, las actividades, los productos y su impacto en el marco del mecanismo de participación seleccionado como regional." />
                <Input label="Link del video" id="video" type="url" className="mt-1" error={errors.video} placeholder="Link del video del proyecto https://www.youtube.com/watch?v=gmc4tk" bind:value={$form.video} required={!tieneVideo ? undefined : 'required'} />
            {/if}
        </div>
    </div>
    {#if tieneVideo}
        <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
            <RecomendacionEvaluador className="mt-8">
                {#each idi.proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.video_comentario ? evaluacion.idi_evaluacion.video_comentario : 'Sin recomendación'}</p>
                        </div>
                    {/if}
                {/each}
                {#if idi.proyecto.evaluaciones.length == 0}
                    <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        {/if} -->

        <slot name="video" />
    {/if}
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label id="justificacion_industria_4" value="¿El proyecto está relacionado con la industria 4.0?" />
        </div>
        <div>
            <div className="flex items-center mb-14">
                <Switch bind:checked={requiereJustificacionIndustria4} />
            </div>

            {#if requiereJustificacionIndustria4}
                <InfoMessage className="mb-2" message="Si el proyecto está relacionado con la industria 4.0 por favor realice la justificación." />
                <Textarea label="Justificación" maxlength="40000" id="justificacion_industria_4" error={errors.justificacion_industria_4} bind:value={$form.justificacion_industria_4} on:blur={() => syncColumnLong('justificacion_industria_4', $form)} required={!requiereJustificacionIndustria4 ? undefined : 'required'} />
            {/if}
        </div>
    </div>
    {#if requiereJustificacionIndustria4}
        <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
            <RecomendacionEvaluador className="mt-8">
                {#each idi.proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.justificacion_industria_4_comentario ? evaluacion.idi_evaluacion.justificacion_industria_4_comentario : 'Sin recomendación'}</p>
                        </div>
                    {/if}
                {/each}
                {#if idi.proyecto.evaluaciones.length == 0}
                    <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        {/if} -->

        <slot name="industria4" />
    {/if}
</div>

{#if convocatoria.campos_convocatoria.find((element) => element.campo == 'justificacion_economia_naranja').convocatoriaId == convocatoria.id}
    <div className="py-24">
        <div className="grid grid-cols-2">
            <div>
                <Label labelFor="justificacion_economia_naranja" value="¿El proyecto está relacionado con la economía naranja?" />
            </div>
            <div>
                <div className="flex items-center mb-14">
                    <Switch bind:checked={requiereJustificacionEconomiaNaranja} />
                </div>
                {#if requiereJustificacionEconomiaNaranja}
                    <InfoMessage className="mb-2" message="Si el proyecto está relacionado con la economía naranja por favor realice la justificación. (Ver documento de apoyo: Guía Rápida SENA es NARANJA.)" />
                    <Textarea label="Justificación" maxlength="40000" id="justificacion_economia_naranja" error={errors.justificacion_economia_naranja} bind:value={$form.justificacion_economia_naranja} on:blur={() => syncColumnLong('justificacion_economia_naranja', $form)} required={!requiereJustificacionEconomiaNaranja ? undefined : 'required'} />
                {/if}
            </div>
        </div>

        {#if requiereJustificacionEconomiaNaranja}
            <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
                <RecomendacionEvaluador className="mt-8">
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.justificacion_economia_naranja_comentario ? evaluacion.idi_evaluacion.justificacion_economia_naranja_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if} -->

            <slot name="economia-naranja" />
        {/if}
    </div>
{/if}

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label labelFor="impacto_sector_agricola" value="¿El proyecto tendrá un impacto en el sector agrícola?" />
        </div>
        <div>
            <div className="flex items-center mb-14">
                <Switch bind:checked={requiereJustificacionSectorAgricola} />
            </div>
            {#if requiereJustificacionSectorAgricola}
                <Textarea label="Justificación" maxlength="40000" id="impacto_sector_agricola" error={errors.impacto_sector_agricola} bind:value={$form.impacto_sector_agricola} on:blur={() => syncColumnLong('impacto_sector_agricola', $form)} required={!requiereJustificacionSectorAgricola ? undefined : 'required'} />
            {/if}
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label labelFor="justificacion_politica_discapacidad" value="¿El proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad?" />
        </div>
        <div>
            <div className="flex items-center mb-14">
                <Switch bind:checked={requiereJustificacionPoliticaDiscapacidad} />
            </div>
            {#if requiereJustificacionPoliticaDiscapacidad}
                <InfoMessage className="mb-2" message="Si el proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad por favor realice la justificación. RESOLUCIÓN 01726 DE 2014 - Por la cual se adopta la Política Institucional para Atención de las Personas con discapacidad." />
                <Textarea label="Justificación" maxlength="40000" id="justificacion_politica_discapacidad" error={errors.justificacion_politica_discapacidad} bind:value={$form.justificacion_politica_discapacidad} on:blur={() => syncColumnLong('justificacion_politica_discapacidad', $form)} required={!requiereJustificacionPoliticaDiscapacidad ? undefined : 'required'} />
            {/if}
        </div>
    </div>
    {#if requiereJustificacionPoliticaDiscapacidad}
        <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
            <RecomendacionEvaluador className="mt-8">
                {#each idi.proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.justificacion_politica_discapacidad_comentario ? evaluacion.idi_evaluacion.justificacion_politica_discapacidad_comentario : 'Sin recomendación'}</p>
                        </div>
                    {/if}
                {/each}
                {#if idi.proyecto.evaluaciones.length == 0}
                    <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        {/if} -->

        <slot name="politica-discapacidad" />
    {/if}
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label labelFor="atencion_pluralista_diferencial" value="¿El proyecto aporta a la Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)?" />
        </div>
        <div>
            <div className="flex items-center mb-14">
                <Switch bind:checked={requiereJustificacionAntencionPluralista} />
            </div>
            {#if requiereJustificacionAntencionPluralista}
                <Textarea label="Justificación" maxlength="40000" id="atencion_pluralista_diferencial" error={errors.atencion_pluralista_diferencial} bind:value={$form.atencion_pluralista_diferencial} on:blur={() => syncColumnLong('atencion_pluralista_diferencial', $form)} required={!requiereJustificacionAntencionPluralista ? undefined : 'required'} />
            {/if}
        </div>
    </div>
</div>

<div className="py-24">
    <p className="text-center mb-8">¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?</p>
    <InfoMessage className="mb-2" message="Nota: Bioprospección se define como la exploración sistemática y sostenible de la biodiversidad para identificar y obtener nuevas fuentes de compuestos químicos, genes, proteínas, microorganismos y otros productos que tienen potencial de ser aprovechados comercialmente" />
    <InputError message={errors.muestreo} />
    <div className="flex mt-20 items-center">
        <FormField>
            <Radio bind:group={$form.muestreo} value="1" />
            <span slot="label">
                Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se encuentren en el país o migren a él como resultado voluntario o
                involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de domesticación incluyendo virus, viroides y similares)
            </span>
        </FormField>
    </div>

    {#if $form.muestreo == 1}
        <InfoMessage className="my-20" message="Ha seleccionado Especies Nativas. Por favor responda las siguientes preguntas:" />
        <div className="flex mb-20">
            <div className="bg-gray-200 flex-1 p-8">
                <div className="flex items-center">
                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" id="1.1" value="¿Qué actividad pretende realizar con la especie nativa?" />
                </div>

                <p className="bg-app-100 mt-10 p-4 text-app-600">Seleccione una opción</p>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.actividades_muestreo} value="1.1.1" />
                        <span slot="label"> Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza. </span>
                    </FormField>
                </div>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.actividades_muestreo} value="1.1.2" />
                        <span slot="label"> Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo. </span>
                    </FormField>
                </div>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.actividades_muestreo} value="1.1.3" />
                        <span slot="label"> Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado. </span>
                    </FormField>
                </div>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.actividades_muestreo} value="1.1.4" />
                        <span slot="label"> No logro identificar la actividad a desarrollar con la especie nativa </span>
                    </FormField>
                </div>
            </div>

            <div className="bg-gray-300 flex-1 p-8">
                <div className="flex items-center">
                    <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" id="1.2" value="¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?" />
                </div>

                <p className="bg-app-100 mt-10 p-4 text-app-600">Seleccione una opción</p>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.objetivo_muestreo} value="1.2.1" />
                        <span slot="label"> Investigación básica sin fines comerciales </span>
                    </FormField>
                </div>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.objetivo_muestreo} value="1.2.2" />
                        <span slot="label"> Bioprospección en cualquiera de sus fases </span>
                    </FormField>
                </div>
                <div className="flex mt-4 items-center">
                    <FormField>
                        <Radio bind:group={$form.objetivo_muestreo} value="1.2.3" />
                        <span slot="label"> Comercial o Industrial </span>
                    </FormField>
                </div>
            </div>
        </div>
    {/if}

    <div className="flex mt-4 items-center">
        <FormField>
            <Radio bind:group={$form.muestreo} value="2" />
            <span slot="label"> Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana) </span>
        </FormField>
    </div>
    <div className="flex mt-4 items-center">
        <FormField>
            <Radio bind:group={$form.muestreo} value="3" />
            <span slot="label"> Recursos genéticos humanos y sus productos derivados </span>
        </FormField>
    </div>
    <div className="flex mt-4 items-center">
        <FormField>
            <Radio bind:group={$form.muestreo} value="4" />
            <span slot="label"> Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus prácticas consuetudinarias) </span>
        </FormField>
    </div>
    <div className="flex mt-4 items-center">
        <FormField>
            <Radio bind:group={$form.muestreo} value="5" />
            <span slot="label">
                Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación científica no comercial o provenga de una colección registrada ante el
                Instituto Alexander van Humboldt)
            </span>
        </FormField>
    </div>
    <div className="flex mt-4 items-center">
        <FormField>
            <Radio bind:group={$form.muestreo} value="6" />
            <span slot="label"> No aplica </span>
        </FormField>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label
                required
                className="mb-4"
                labelFor="recoleccion_especimenes"
                value="En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica."
            />
        </div>
        <div>
            <Select items={opcionesSiNo} id="recoleccion_especimenes" bind:selectedValue={$form.recoleccion_especimenes} error={errors.recoleccion_especimenes} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
        <div />
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_plan_tecnologico" value="¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?" />
        </div>
        <div>
            <Select items={opcionesIDiDropdown} id="relacionado_plan_tecnologico" bind:selectedValue={$form.relacionado_plan_tecnologico} error={errors.relacionado_plan_tecnologico} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_agendas_competitividad" value="¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?" />
        </div>
        <div>
            <Select items={opcionesIDiDropdown} id="relacionado_agendas_competitividad" bind:selectedValue={$form.relacionado_agendas_competitividad} error={errors.relacionado_agendas_competitividad} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_mesas_sectoriales" value="¿El proyecto se alinea con las Mesas Sectoriales?" />
        </div>
        <div>
            <Select items={opcionesIDiDropdown} id="relacionado_mesas_sectoriales" bind:selectedValue={$form.relacionado_mesas_sectoriales} error={errors.relacionado_mesas_sectoriales} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if $form.relacionado_mesas_sectoriales?.value == 1}
        {#if isSuperAdmin || idi.proyecto.allowed.to_update}
            <div className="bg-app-100 p-5 mt-10">
                <InputError message={errors.mesa_sectorial_id} />
                <div className="grid grid-cols-2">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5" style="transform: translateX(-50px);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el proyecto</p>
                    </div>
                    <div className="bg-white grid grid-cols-2 max-w-xl overflow-y-scroll shadow-2xl mt-4 h-80">
                        {#each mesasSectoriales as { id, nombre }, i}
                            <FormField>
                                <Checkbox bind:group={$form.mesa_sectorial_id} value={id} />
                                <span slot="label">{nombre}</span>
                            </FormField>
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <div className="grid grid-cols-2">
                <div>Mesas sectoriales relacionadas:</div>
                <div>
                    <ul className="list-disc p-4">
                        {#each mesasSectoriales as { id, nombre }, i}
                            {#each $form.mesa_sectorial_id as mesaSectorialRelacionada}
                                {#if id == mesaSectorialRelacionada}
                                    <li>{nombre}</li>
                                {/if}
                            {/each}
                        {/each}
                    </ul>
                </div>
            </div>
        {/if}
    {/if}
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="relacionado_tecnoacademia" value="¿El proyecto se formuló en conjunto con la tecnoacademia?" />
        </div>
        <div>
            <Select items={opcionesIDiDropdown} id="relacionado_tecnoacademia" bind:selectedValue={$form.relacionado_tecnoacademia} error={errors.relacionado_tecnoacademia} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>

    {#if $form.relacionado_tecnoacademia?.value == 1}
        {#if isSuperAdmin || idi.proyecto.allowed.to_update}
            <div className="bg-app-100 p-5 mt-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5" style="transform: translateX(-50px);">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <div className="grid grid-cols-2">
                    <div>
                        <p className="text-app-600">Por favor seleccione la Tecnoacademia con la cual articuló el proyecto</p>
                    </div>
                    <div>
                        <Select items={tecnoacademias} id="tecnoacademia_id" bind:selectedValue={$form.tecnoacademia_id} selectFunctions={[(event) => selectLineasTecnoacademia(event)]} error={errors.tecnoacademia_id} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
                        {#if arrayLineasTecnoacademia?.length > 0}
                            <div className="bg-white grid grid-cols-2 max-w-xl overflow-y-scroll shadow-2xl mt-4 h-80">
                                {#each arrayLineasTecnoacademia as { value, label }, i}
                                    <Label className="p-3 border-t border-b flex items-center text-sm" labelFor={'linea-tecnologica-' + value} value={label} />

                                    <div className="border-b border-t flex items-center justify-center">
                                        <input type="checkbox" bind:group={$form.linea_tecnologica_id} id={'linea-tecnologica-' + value} {value} className="rounded text-app-500" />
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
                <InputError message={errors.linea_tecnologica_id} />
            </div>
        {:else}
            <div className="grid grid-cols-2">
                <div>Tecnoacademia relacionada</div>
                <div>
                    <Select items={tecnoacademias} id="tecnoacademia_id" bind:selectedValue={$form.tecnoacademia_id} error={errors.tecnoacademia_id} autocomplete="off" placeholder="Seleccione una opción" required disabled={evaluacion ? 'disabled' : undefined} />
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div>Líneas tecnológicas relacionadas:</div>
                <div>
                    <ul className="list-disc p-4">
                        {#each arrayLineasTecnoacademia as { value, label }, i}
                            {#each $form.linea_tecnologica_id as lineaTecnologica}
                                {#if value == lineaTecnologica}
                                    <li>{label}</li>
                                {/if}
                            {/each}
                        {/each}
                    </ul>
                </div>
            </div>
        {/if}
    {/if}
</div>

<div className="py-24">
    <div className="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
            <InfoMessage className="mb-2" message="Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto." />
        </div>
        <div>
            <Textarea maxlength="40000" id="resumen" error={errors.resumen} on:blur={() => syncColumnLong('resumen', $form)} bind:value={$form.resumen} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>

    <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador className="mt-8">
            {#each idi.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.resumen_comentario ? evaluacion.idi_evaluacion.resumen_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if idi.proyecto.evaluaciones.length == 0}
                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if} -->

    <slot name="resumen" />
</div>

<div className="py-24">
    <div className="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
            <InfoMessage className="mb-2" message="Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición." />
        </div>
        <div>
            <Textarea maxlength="40000" id="antecedentes" error={errors.antecedentes} bind:value={$form.antecedentes} on:blur={() => syncColumnLong('antecedentes', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
            <InfoMessage className="mb-2" message="Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones." />
        </div>
        <div>
            <Textarea maxlength="20000" id="marco_conceptual" error={errors.marco_conceptual} bind:value={$form.marco_conceptual} on:blur={() => syncColumnLong('marco_conceptual', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="numero_aprendices" value="Número de los aprendices que se beneficiarán en la ejecución del proyecto" />
        </div>
        <div>
            <Input label="Número de aprendices" id="numero_aprendices" type="number" input$min="0" input$max="9999" className="mt-1" error={errors.numero_aprendices} placeholder="Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto" bind:value={$form.numero_aprendices} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
        </div>
        <div>
            <MultipleSelect id="municipios" bind:selectedValue={$form.municipios} items={municipios}  error={errors.municipios} placeholder="Buscar municipios" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="programas_formacion" value="Nombre de los programas de formación con registro calificado a impactar" />
        </div>
        <div>
            <MultipleSelect id="programas_formacion" bind:selectedValue={$form.programas_formacion} items={programasFormacionConRegistroCalificado}  error={errors.programas_formacion} placeholder="Buscar por el nombre del programa de formación" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-2">
        <div>
            <Label className="mb-4" labelFor="programas_formacion_articulados" value="Nombre de los programas de formación articulados" />
        </div>
        <div>
            <MultipleSelect id="programas_formacion_articulados" bind:selectedValue={$form.programas_formacion_articulados} items={programasFormacionSinRegistroCalificado}  error={errors.programas_formacion_articulados} placeholder="Buscar por el nombre del programa de formación" />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio en los municipios" />
        </div>
        <div>
            <Textarea maxlength="40000" id="impacto_municipios" error={errors.impacto_municipios} bind:value={$form.impacto_municipios} on:blur={() => syncColumnLong('impacto_municipios', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />
        </div>
        <div>
            <Textarea maxlength="40000" id="impacto_centro_formacion" error={errors.impacto_centro_formacion} bind:value={$form.impacto_centro_formacion} on:blur={() => syncColumnLong('impacto_centro_formacion', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div className="py-24">
    <div className="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
            <InfoMessage className="mb-2" message="Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf)." />
        </div>
        <div>
            <Textarea maxlength="40000" id="bibliografia" error={errors.bibliografia} bind:value={$form.bibliografia} on:blur={() => syncColumnLong('bibliografia', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>

    <div>
        <!-- {#if (isSuperAdmin && !evaluacion) || (idi.proyecto.mostrar_recomendaciones && !evaluacion)}
            <RecomendacionEvaluador className="mt-8">
                {#each idi.proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.bibliografia_comentario ? evaluacion.idi_evaluacion.bibliografia_comentario : 'Sin recomendación'}</p>
                        </div>
                    {/if}
                {/each}
                {#if idi.proyecto.evaluaciones.length == 0}
                    <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        {/if} -->

        <slot name="bibliografia" />
    </div>
</div>

<!-- <div className="py-24">
    <slot name="items-finales" />
</div> -->

<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route, checkPermissionByUser } from '@/Utils'

    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import SelectMulti from '@/Shared/SelectMulti'
    import Select from '@/Shared/Select'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'
    import InfoMessage from '@/Shared/InfoMessage'
    import File from '@/Shared/File'

    export let isSuperAdmin
    export let errors
    export let authUser
    export let convocatoria
    export let ta
    export let form
    export let lineasTecnoacademia
    export let lineasProgramaticas
    export let evaluacion = false

    let arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
        return obj.tecnoacademia_id == $form.tecnoacademia_id
    })
    function selectLineasTecnoacademia(event) {
        arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
            return obj.tecnoacademia_id == event.detail?.value
        })
    }

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (ta.proyecto.allowed.to_update) {
                //guardar
                Inertia.put(
                    route('convocatorias.ta.updateLongColumn', [convocatoria.id, ta.id, column]),
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

<div class="py-24">
    <p class="text-center">Fecha de ejecución</p>
    {#if ta.proyecto.allowed.to_update}
        <small class="text-red-400 block text-center"> * Campo obligatorio </small>
    {/if}

    <div class="mt-4 flex items-start justify-around">
        <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
            <Label required labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
            <div class="ml-4">
                <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_70} max={convocatoria.max_fecha_finalizacion_proyectos_linea_70} error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
        <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
            <Label required labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
            <div class="ml-4">
                <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_70} max={convocatoria.max_fecha_finalizacion_proyectos_linea_70} error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required disabled={evaluacion ? 'disabled' : undefined} />
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

    {#if (isSuperAdmin && !evaluacion) || (ta.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador class="mt-8">
            {#each ta.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.fecha_ejecucion_comentario ? evaluacion.ta_evaluacion.fecha_ejecucion_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if ta.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="fechas" />
</div>

{#if convocatoria.descripcion?.includes('proyectos de tecnoacademia y tecnoparque')}
    <div class="py-24">
        <Label  class="mb-4" labelFor="pdf_proyecto_general" value="Archivo en formato (.pdf) del proyecto general" />
        <File id="pdf_proyecto_general" maxSize="10000" bind:value={$form.pdf_proyecto_general} valueDb={ta.pdf_proyecto_general} error={errors.pdf_proyecto_general} route={ta.pdf_proyecto_general?.includes('http') ? null : route('convocatorias.ta.download-pdf-sharepoint', [convocatoria.id, ta, 'pdf_proyecto_general'])}  />
    </div>
{/if}

<fieldset class="py-24" disabled>
    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
        </div>
        <div>
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Busque por el nombre de la línea programática" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    <div class="mt-44 grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
            <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
        </div>
        <div class="capitalize">
            {ta.proyecto.centro_formacion.nombre}
        </div>
    </div>

    <div class="mt-44 grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="tecnoacademia_id" value="TecnoAcademia" />
        </div>
        <div>
            {ta.titulo}
        </div>
    </div>
</fieldset>

{#if $form.tecnoacademia_id && arrayLineasTecnoacademia}
    <div class="py-24">
        <div class="grid grid-cols-2">
            <div>
                <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="tecnoacademia_linea_tecnoacademia_id" value="Líneas temáticas a ejecutar en la vigencia del proyecto:" />
            </div>
            <div>
                <SelectMulti id="tecnoacademia_linea_tecnoacademia_id" bind:selectedValue={$form.tecnoacademia_linea_tecnoacademia_id} items={arrayLineasTecnoacademia} isMulti={true} error={errors.tecnoacademia_linea_tecnoacademia_id} placeholder="Buscar por el nombre de la línea" required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
    </div>
{/if}

<fieldset class="py-24" disabled={ta.proyecto_base || checkPermissionByUser(authUser, [23]) ? undefined : true}>
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="resumen" value="Resumen del proyecto" />
            <InfoMessage message="Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto." />
        </div>
        <div>
            <Textarea maxlength="40000" id="resumen" error={errors.resumen} bind:value={$form.resumen} on:blur={() => syncColumnLong('resumen', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="resumen_regional" value="Complemento - Resumen ejecutivo regional" />
        </div>
        <div>
            <Textarea maxlength="40000" id="resumen_regional" error={errors.resumen_regional} bind:value={$form.resumen_regional} on:blur={() => syncColumnLong('resumen_regional', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (ta.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador class="mt-8">
            {#each ta.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.resumen_regional_comentario ? evaluacion.ta_evaluacion.resumen_regional_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if ta.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="resumen-regional" />
</div>

<fieldset class="py-24" disabled={ta.proyecto_base || checkPermissionByUser(authUser, [23]) ? undefined : true}>
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="antecedentes" value="Antecedentes" />
            <InfoMessage
                message="Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición. De igual forma, relacionar los proyectos ejecutados en vigencias anteriores (incluir códigos SGPS), si el proyecto corresponde a la continuidad de proyectos SENNOVA."
            />
        </div>
        <div>
            <Textarea maxlength="40000" id="antecedentes" error={errors.antecedentes} bind:value={$form.antecedentes} on:blur={() => syncColumnLong('antecedentes', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="antecedentes_tecnoacademia" value="Antecedentes de la Tecnoacademia y su impacto en la región" />
        </div>
        <div>
            <Textarea maxlength="40000" id="antecedentes_tecnoacademia" error={errors.antecedentes_tecnoacademia} bind:value={$form.antecedentes_tecnoacademia} on:blur={() => syncColumnLong('antecedentes_tecnoacademia', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (ta.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador class="mt-8">
            {#each ta.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.antecedentes_tecnoacademia_comentario ? evaluacion.ta_evaluacion.antecedentes_tecnoacademia_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if ta.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="antecedentes" />
</div>

<fieldset class="py-24" disabled={ta.proyecto_base || checkPermissionByUser(authUser, [23]) ? undefined : true}>
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="justificacion_problema" value="Justificación" />
        </div>
        <div>
            <Textarea maxlength="40000" id="justificacion_problema" error={errors.justificacion_problema} bind:value={$form.justificacion_problema} on:blur={() => syncColumnLong('justificacion_problema', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="logros_vigencia_anterior" value="Logros de la vigencia {convocatoria.year - 1} en la implementación del programa de TecnoAcademia" />
        </div>
        <div>
            <Textarea maxlength="40000" id="logros_vigencia_anterior" error={errors.logros_vigencia_anterior} bind:value={$form.logros_vigencia_anterior} on:blur={() => syncColumnLong('logros_vigencia_anterior', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="retos_oportunidades" value="Descripción de retos y prioridades locales y regionales en los cuales la Tecnoacademia tiene impacto" />
        </div>
        <div>
            <Textarea maxlength="40000" id="retos_oportunidades" error={errors.retos_oportunidades} bind:value={$form.retos_oportunidades} on:blur={() => syncColumnLong('retos_oportunidades', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (ta.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador class="mt-8">
            {#each ta.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.retos_oportunidades_comentario ? evaluacion.ta_evaluacion.retos_oportunidades_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if ta.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="retos-oportunidades" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="pertinencia_territorio" value="Justificación y pertinencia en el territorio" />
        </div>
        <div>
            <Textarea maxlength="40000" id="pertinencia_territorio" error={errors.pertinencia_territorio} bind:value={$form.pertinencia_territorio} on:blur={() => syncColumnLong('pertinencia_territorio', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<fieldset class="py-24" disabled={ta.proyecto_base || checkPermissionByUser(authUser, [23]) ? undefined : true}>
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
            <InfoMessage message="Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones." />
        </div>
        <div>
            <Textarea maxlength="40000" id="marco_conceptual" error={errors.marco_conceptual} bind:value={$form.marco_conceptual} on:blur={() => syncColumnLong('marco_conceptual', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="lineas_tecnologicas_centro" value="Líneas tecnológicas del Centro con las que se articula la TecnoAcademia" />
        </div>
        <div>
            <Textarea maxlength="40000" id="lineas_tecnologicas_centro" error={errors.lineas_tecnologicas_centro} bind:value={$form.lineas_tecnologicas_centro} on:blur={() => syncColumnLong('lineas_tecnologicas_centro', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (ta.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador class="mt-8">
            {#each ta.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.lineas_tecnologicas_centro_comentario ? evaluacion.ta_evaluacion.lineas_tecnologicas_centro_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if ta.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="lineas-tecnologicas" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="bibliografia" value="Bibliografía" />
            <InfoMessage message="Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf)." />
        </div>
        <div>
            <!-- <Textarea maxlength="40000" id="bibliografia" error={errors.bibliografia} bind:value={$form.bibliografia} on:blur={() => syncColumnLong('bibliografia', $form)} required disabled={evaluacion ? 'disabled' : undefined} /> -->
                
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (ta.proyecto.mostrar_recomendaciones && !evaluacion)}
        <RecomendacionEvaluador class="mt-8">
            {#each ta.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.bibliografia ? evaluacion.ta_evaluacion.bibliografia : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if ta.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="bibliografia" />
</div>

<div class="py-24">
    <slot name="items-finales" />
</div>

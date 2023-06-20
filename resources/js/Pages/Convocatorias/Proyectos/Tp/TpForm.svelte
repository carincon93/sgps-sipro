<script>
    import { route, checkPermissionByUser } from '@/Utils'
    import { Inertia } from '@inertiajs/inertia'

    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'
    import InfoMessage from '@/Shared/InfoMessage'
    import File from '@/Shared/File'

    export let isSuperAdmin
    export let authUser
    export let errors
    export let form
    export let convocatoria
    export let tp
    export let lineasProgramaticas
    export let evaluacion

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (tp.proyecto.allowed.to_update) {
                //guardar
                Inertia.put(
                    route('convocatorias.tp.updateLongColumn', [convocatoria.id, tp.id, column]),
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

<fieldset class="py-24" disabled>
    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
        </div>
        <div>
            <Select id="linea_programatica_id" bind:selectedValue={$form.linea_programatica_id} items={lineasProgramaticas} placeholder="Busque por el nombre de la línea programática" message={errors.linea_programatica_id} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    <div class="mt-24 grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} labelFor="centro_formacion_id" value="Centro de formación" />
            <small> <strong>Nota:</strong> El Centro de Formación relacionado es el ejecutor del proyecto </small>
        </div>
        <div class="capitalize">
            {tp.proyecto.centro_formacion.nombre}
        </div>
    </div>

    <div class="mt-24 grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="nodo_tecnoparque_id" value="Nodo Tecnoparque" />
        </div>
        <div class="capitalize">
            {tp.titulo}
        </div>
    </div>
</fieldset>

<div class="py-24">
    <p class="text-center">Fecha de ejecución</p>
    {#if tp.proyecto.allowed.to_update}
        <small class="text-red-400 block text-center"> * Campo obligatorio </small>
    {/if}
    <InfoMessage message={convocatoria.fecha_maxima_tp} class="my-5" />

    <div class="mt-4 flex items-start justify-around">
        <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
            <Label labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
            <div class="ml-4">
                <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_69} max={convocatoria.max_fecha_finalizacion_proyectos_linea_69} error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
        <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
            <Label labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
            <div class="ml-4">
                <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_69} max={convocatoria.max_fecha_finalizacion_proyectos_linea_69} error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required disabled={evaluacion ? 'disabled' : undefined} />
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

    {#if (isSuperAdmin && !evaluacion && tp.proyecto?.evaluaciones.length > 0) || (!evaluacion && tp.proyecto?.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
        <RecomendacionEvaluador class="mt-8">
            {#each tp.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.fecha_ejecucion_comentario ? evaluacion.tp_evaluacion.fecha_ejecucion_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if tp.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="fechas" />
</div>

{#if convocatoria.descripcion?.includes('proyectos de tecnoacademia y tecnoparque')}
    <div class="py-24">
        <Label required class="mb-4" labelFor="pdf_proyecto_general" value="Archivo en formato (.pdf) del proyecto general" />
        <File id="pdf_proyecto_general" maxSize="10000" bind:value={$form.pdf_proyecto_general} valueDb={tp.pdf_proyecto_general} error={errors.pdf_proyecto_general} route={tp.pdf_proyecto_general?.includes('http') ? null : route('convocatorias.tp.download-file-sharepoint', [convocatoria.id, tp, 'pdf_proyecto_general'])} required />
    </div>
{/if}

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="resumen" value="Resumen del proyecto" />
            <InfoMessage message="Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto." />
        </div>
        <div>
            <Textarea maxlength="40000" id="resumen" error={errors.resumen} bind:value={$form.resumen} on:blur={() => syncColumnLong('resumen', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="resumen_regional" value="Complemento - Resumen ejecutivo regional" />
        </div>
        <div>
            <Textarea maxlength="40000" id="resumen_regional" error={errors.resumen_regional} bind:value={$form.resumen_regional} on:blur={() => syncColumnLong('resumen_regional', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion && tp.proyecto?.evaluaciones.length > 0) || (!evaluacion && tp.proyecto?.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
        <RecomendacionEvaluador class="mt-8">
            {#each tp.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.resumen_regional_comentario ? evaluacion.tp_evaluacion.resumen_regional_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if tp.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="resumen-regional" />
</div>

<fieldset class="py-24" disabled={tp.proyecto_base || checkPermissionByUser(authUser, [24]) ? undefined : true}>
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
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="antecedentes_regional" value="Complemento - Antecedentes regional" />
        </div>
        <div>
            <Textarea maxlength="40000" id="antecedentes_regional" error={errors.antecedentes_regional} bind:value={$form.antecedentes_regional} on:blur={() => syncColumnLong('antecedentes_regional', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion && tp.proyecto?.evaluaciones.length > 0) || (!evaluacion && tp.proyecto?.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
        <RecomendacionEvaluador class="mt-8">
            {#each tp.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.antecedentes_regional_comentario ? evaluacion.tp_evaluacion.antecedentes_regional_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if tp.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="antecedentes" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="retos_oportunidades" value="Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto" />
        </div>
        <div>
            <Textarea maxlength="40000" id="retos_oportunidades" error={errors.retos_oportunidades} bind:value={$form.retos_oportunidades} on:blur={() => syncColumnLong('retos_oportunidades', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion && tp.proyecto?.evaluaciones.length > 0) || (!evaluacion && tp.proyecto?.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
        <RecomendacionEvaluador class="mt-8">
            {#each tp.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.retos_oportunidades_comentario ? evaluacion.tp_evaluacion.retos_oportunidades_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if tp.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="retos-oportunidades" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="articulacion_agenda_competitividad" value="Articulación y contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad." />
        </div>
        <div>
            <Textarea maxlength="40000" id="articulacion_agenda_competitividad" error={errors.articulacion_agenda_competitividad} bind:value={$form.articulacion_agenda_competitividad} on:blur={() => syncColumnLong('articulacion_agenda_competitividad', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="aportes_linea_ocho_conpes" value="Aportes del Tecnoparque en el {convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos  CONPES'" />
        </div>
        <div>
            <Textarea maxlength="40000" id="aportes_linea_ocho_conpes" error={errors.aportes_linea_ocho_conpes} bind:value={$form.aportes_linea_ocho_conpes} on:blur={() => syncColumnLong('aportes_linea_ocho_conpes', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="estado_ecosistema_ctel" value="Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades de articulación con el Tecnoparque." />
        </div>
        <div>
            <Textarea maxlength="40000" id="estado_ecosistema_ctel" error={errors.estado_ecosistema_ctel} bind:value={$form.estado_ecosistema_ctel} on:blur={() => syncColumnLong('estado_ecosistema_ctel', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="logros_vigencia_anterior" value="Describa los principales logros del Tecnoparque en el {convocatoria.year - 1}" />
        </div>
        <div>
            <Textarea maxlength="40000" id="logros_vigencia_anterior" error={errors.logros_vigencia_anterior} bind:value={$form.logros_vigencia_anterior} on:blur={() => syncColumnLong('logros_vigencia_anterior', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
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
    {#if (isSuperAdmin && !evaluacion && tp.proyecto?.evaluaciones.length > 0) || (!evaluacion && tp.proyecto?.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
        <RecomendacionEvaluador class="mt-8">
            {#each tp.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.pertinencia_territorio_comentario ? evaluacion.tp_evaluacion.pertinencia_territorio_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if tp.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="pertinencia-territorio" />
</div>

<fieldset class="py-24" disabled={tp.proyecto_base || checkPermissionByUser(authUser, [24]) ? undefined : true}>
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
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="bibliografia" value="Bibliografía" />
            <InfoMessage message="Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf)." />
        </div>
        <div>
            <Textarea maxlength="40000" id="bibliografia" error={errors.bibliografia} bind:value={$form.bibliografia} on:blur={() => syncColumnLong('bibliografia', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion && tp.proyecto?.evaluaciones.length > 0) || (!evaluacion && tp.proyecto?.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
        <RecomendacionEvaluador class="mt-8">
            {#each tp.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.bibliografia_comentario ? evaluacion.tp_evaluacion.bibliografia_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if tp.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="bibliografia" />
</div>

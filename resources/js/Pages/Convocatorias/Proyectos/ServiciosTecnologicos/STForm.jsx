<script>
    import { Inertia } from '@inertiajs/inertia'

    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import SelectMulti from '@/Shared/SelectMulti'
    import Input from '@/Shared/Input'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'
    import InfoMessage from '@/Shared/InfoMessage'

    export let isSuperAdmin
    export let form
    export let errors
    export let convocatoria
    export let servicioTecnologico
    export let lineasProgramaticas
    export let tiposProyectoSt
    export let sectoresProductivos
    export let estadosSistemaGestion
    export let programasFormacionConRegistroCalificado
    export let evaluacion

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (servicioTecnologico.proyecto.allowed.to_update) {
                //guardar
                Inertia.put(
                    route('convocatorias.servicios-tecnologicos.updateLongColumn', [convocatoria.id, servicioTecnologico.id, column]),
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
    <Label
        required
        labelFor="titulo"
        class="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
        value="Debe corresponder al contenido del proyecto y responder a los siguientes interrogantes: ¿Qué se va a hacer?, ¿Sobre qué o quiénes se hará?, ¿Cómo?, ¿Dónde se llevará a cabo? Tiene que estar escrito de manera breve y concisa. Un buen título describe con exactitud y usando el menor número posible de palabras el tema central del proyecto. Nota: las respuestas a las preguntas anteriormente formuladas no necesariamente deben responderse en mismo orden en el que aparecen. (Máximo 40 palabras)"
    />
    <Textarea sinContador={true} id="titulo" error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required disabled={evaluacion ? 'disabled' : undefined} />

    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.titulo_comentario ? evaluacion.servicio_tecnologico_evaluacion.titulo_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="titulo" />
</div>

<div class="py-24">
    <p class="text-center">Fecha de ejecución</p>
    <small class="text-red-400 block text-center"> * Campo obligatorio </small>

    <div class="mt-4 flex items-start justify-around">
        <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
            <Label required disabled={evaluacion ? 'disabled' : undefined} labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
            <div class="ml-4">
                <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_68} max={convocatoria.max_fecha_finalizacion_proyectos_linea_68} bind:value={$form.fecha_inicio} required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
        <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
            <Label required disabled={evaluacion ? 'disabled' : undefined} labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
            <div class="ml-4">
                <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_linea_68} max={convocatoria.max_fecha_finalizacion_proyectos_linea_68} bind:value={$form.fecha_finalizacion} required disabled={evaluacion ? 'disabled' : undefined} />
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

    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.fecha_ejecucion_comentario ? evaluacion.servicio_tecnologico_evaluacion.fecha_ejecucion_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="fechas" />
</div>

<fieldset class="py-24" disabled>
    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="tipo_proyecto_st_id" value="Centro de formación" />
        </div>
        <div>
            <Select id="tipo_proyecto_st_id" items={tiposProyectoSt} bind:selectedValue={$form.tipo_proyecto_st_id} error={errors.tipo_proyecto_st_id} autocomplete="off" placeholder="Seleccione una tipología de ST" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div class="py-24">
    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="nombre_area_tecnica" value="Nombre del área técnica" />
        </div>
        <div>
            <Input label="Nombre del área técnica" id="nombre_area_tecnica" type="text" class="mt-1" error={errors.nombre_area_tecnica} bind:value={$form.nombre_area_tecnica} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<fieldset class="py-24" disabled>
    {#if $form.tipo_proyecto_st_id}
        <div class="grid grid-cols-2">
            <div>
                <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="estado_sistema_gestion_id" value="Estado del sistema de gestión" />
            </div>
            <div>
                <Select id="estado_sistema_gestion_id" items={estadosSistemaGestion} bind:selectedValue={$form.estado_sistema_gestion_id} error={errors.estado_sistema_gestion_id} autocomplete="off" placeholder="Seleccione un estado" required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="sector_productivo" value="Sector priorizado de Colombia Productiva" />
        </div>
        <div>
            <Select id="sector_productivo" items={sectoresProductivos} bind:selectedValue={$form.sector_productivo} error={errors.sector_productivo} autocomplete="off" placeholder="Seleccione una sector" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>

    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
        </div>
        <div>
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</fieldset>

<div class="py-24">
    <h1 class="text-2xl text-center" id="estructura-proyecto">Estructura del proyecto</h1>
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="resumen" value="Resumen ejecutivo" />
            <InfoMessage class="mb-2">
                <p>
                    Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                    <br />
                    <strong>Nota:</strong> El resumen por lo general se construye al final de la contextualización con el fin de tener claros todos los puntos que intervinieron en la misma y poder dar a conocer de forma más pertinente los por menores del proyecto. (Máximo 1000 caracteres).
                </p>
            </InfoMessage>
        </div>
        <div>
            <Textarea maxlength="1000" id="resumen" error={errors.resumen} bind:value={$form.resumen} on:blur={() => syncColumnLong('resumen', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    <div>
        {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
            <RecomendacionEvaluador class="mt-8">
                {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.resumen_comentario ? evaluacion.servicio_tecnologico_evaluacion.resumen_comentario : 'Sin recomendación'}</p>
                        </div>
                    {/if}
                {/each}
            </RecomendacionEvaluador>
        {/if}

        <slot name="resumen" />
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="antecedentes" value="Antecedentes" />
            <InfoMessage class="mb-2">
                <p>
                    Se debe evidenciar la identificación y caracterización del mercado potencial/objetivo, nicho de mercado al cual se busca atender o la necesidad que se busca satisfacer tomando como referencia el estudio del sector, identificando si existen el(los) mismo(s) alcance(s) o similar(es) en la empresa privada o pública u otros centros de formación de tal forma que el proyecto no se
                    convierta en una competencia frente a un servicio/producto ofertado. Se debe registrar el análisis de las tendencias del mercado, en relación con clientes potenciales, competidores y proveedores. En este ítem es necesario valorar las necesidades de los clientes actuales o potenciales y precisar la segmentación del mercado, las tendencias de los precios y las gestiones
                    comerciales a realizadas.
                    <br />
                    <strong>Nota:</strong> La información debe ser de fuentes primarias, ejemplo: Secretarías, DANE, Artículos científicos, entre otros y citarla utilizando normas APA séptima edición. (Máximo 10000 caracteres).
                </p>
            </InfoMessage>
        </div>
        <div>
            <Textarea maxlength="10000" id="antecedentes" error={errors.antecedentes} bind:value={$form.antecedentes} on:blur={() => syncColumnLong('antecedentes', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.antecedentes_comentario ? evaluacion.servicio_tecnologico_evaluacion.antecedentes_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="antecedentes" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="identificacion_problema" value="Identificación y descripción del problema" />
            <InfoMessage
                class="mb-2"
                message="1. Descripción de la necesidad, problema u oportunidad identificada del plan tecnológico y/o agendas departamentales de innovación y competitividad.<br>2. Descripción del problema que se atiende con el proyecto, sustentado en el contexto, la caracterización, los datos, las estadísticas, de la regional, entre otros, citar toda la información consignada utilizando normas APA última edición. La información debe ser de fuentes primarias de información, ejemplo: Secretarías, DANE, Artículos científicos, entre otros."
            />
        </div>

        <div>
            <Textarea label="Identificación y descripción del problema" maxlength="5000" id="identificacion_problema" error={errors.identificacion_problema} bind:value={$form.identificacion_problema} on:blur={() => syncColumnLong('identificacion_problema', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.identificacion_problema_comentario ? evaluacion.servicio_tecnologico_evaluacion.identificacion_problema_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="problema" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="pregunta_formulacion_problema" value="Pregunta de formulación del problema" />
            <InfoMessage class="mb-2">
                <p>Se debe verificar que la pregunta del problema defina con exactitud ¿cuál es el problema para resolver, investigar o intervenir?</p>
                La pregunta debe cumplir las siguientes condiciones:
                <ul>
                    <li>• Guardar estrecha correspondencia con el título del proyecto.</li>
                    <li>• Evitar adjetivos que impliquen juicios de valor tales como: bueno, malo, mejor, peor.</li>
                    <li>• No debe dar origen a respuestas tales como si o no.</li>
                </ul>
                <br />
                <strong>Nota:</strong> Se sugiere convertir el problema principal (tronco) identificado en el árbol de problemas en forma pregunta.
                <br />
                <strong>Máximo 50 palabras</strong>
            </InfoMessage>
        </div>
        <div>
            <Textarea sinContador={true} id="pregunta_formulacion_problema" error={errors.pregunta_formulacion_problema} bind:value={$form.pregunta_formulacion_problema} on:blur={() => syncColumnLong('pregunta_formulacion_problema', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.pregunta_formulacion_problema_comentario ? evaluacion.servicio_tecnologico_evaluacion.pregunta_formulacion_problema_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="pregunta-formulacion" />
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="justificacion_problema" value="Justificación" />
            <InfoMessage class="mb-2">
                <p>La justificación debe describir la solución del problema y debe responder a las siguientes preguntas:</p>
                <ul>
                    <li>• ¿Cómo se relaciona el proyecto con las prioridades de la región y del país?</li>
                    <li>• ¿Qué resultados se lograrán?</li>
                    <li>• ¿Cuál es la finalidad con los resultados esperados?</li>
                    <li>• ¿Cómo se utilizarán los resultados y quiénes serán los beneficiarios?</li>
                    <li>• Debe incluir el impacto a la formación, al sector productivo y a la política nacional de ciencia, tecnología e innovación.</li>
                </ul>
                <strong>Nota:</strong> La justificación debe brindar un argumento convincente de los resultados del proyecto generado y de su aplicabilidad."
            </InfoMessage>
        </div>
        <div>
            <Textarea maxlength="5000" id="justificacion_problema" error={errors.justificacion_problema} bind:value={$form.justificacion_problema} on:blur={() => syncColumnLong('justificacion_problema', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.justificacion_problema_comentario ? evaluacion.servicio_tecnologico_evaluacion.justificacion_problema_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="justificacion" />
</div>

<div class="py-24">
    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="programas_formacion" value="Nombre de los programas de formación con los que se relaciona el proyecto" />
        </div>
        <div>
            <SelectMulti id="programas_formacion" bind:selectedValue={$form.programas_formacion} items={programasFormacionConRegistroCalificado} isMulti={true} error={errors.programas_formacion} placeholder="Buscar por el nombre del programa de formación" required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-2">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="zona_influencia" value="Zona de influencia" />
        </div>
        <div>
            <Input label="Zona de influencia" id="zona_influencia" type="text" class="mt-1" error={errors.zona_influencia} placeholder="Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto" bind:value={$form.zona_influencia} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
</div>

<div class="py-24">
    <div class="grid grid-cols-1">
        <div>
            <Label required disabled={evaluacion ? 'disabled' : undefined} class="mb-4" labelFor="bibliografia" value="Bibliografía" />
            <InfoMessage message="Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf)." />
        </div>
        <div>
            <Textarea sinContador={true} id="bibliografia" error={errors.bibliografia} bind:value={$form.bibliografia} on:blur={() => syncColumnLong('bibliografia', $form)} required disabled={evaluacion ? 'disabled' : undefined} />
        </div>
    </div>
    {#if (isSuperAdmin && !evaluacion) || (!evaluacion && servicioTecnologico.proyecto.mostrar_recomendaciones)}
        <RecomendacionEvaluador class="mt-8">
            {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.bibliografia_comentario ? evaluacion.servicio_tecnologico_evaluacion.bibliografia_comentario : 'Sin recomendación'}</p>
                    </div>
                {/if}
            {/each}
            {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
            {/if}
        </RecomendacionEvaluador>
    {/if}

    <slot name="bibliografia" />
</div>

<div class="py-24">
    <slot name="items-finales" />
</div>

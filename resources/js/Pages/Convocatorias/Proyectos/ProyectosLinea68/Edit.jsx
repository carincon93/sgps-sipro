<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Components/Button'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Stepper from '@/Components/Stepper'
    import InfoMessage from '@/Components/InfoMessage'
    import Dialog from '@/Components/Dialog'
    import Export2Word from '@/Components/Export2Word'

    import STForm from './STForm'

    export let errors
    export let convocatoria
    export let servicioTecnologico
    export let lineasProgramaticas
    export let tiposProyectoSt
    export let sectoresProductivos
    export let proyectoProgramasFormacion
    export let estadosSistemaGestion
    export let programasFormacionConRegistroCalificado

    $: $title = servicioTecnologico ? servicioTecnologico.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let proyectoDialogOpen = true

    let form = useForm({
        tipo_proyecto_st_id: servicioTecnologico.tipo_proyecto_st_id,
        linea_programatica_id: servicioTecnologico.proyecto?.linea_programatica_id,
        titulo: servicioTecnologico.titulo,
        fecha_inicio: servicioTecnologico.fecha_inicio,
        fecha_finalizacion: servicioTecnologico.fecha_finalizacion,
        max_meses_ejecucion: servicioTecnologico.max_meses_ejecucion,
        pregunta_formulacion_problema: servicioTecnologico.pregunta_formulacion_problema,

        programas_formacion: proyectoProgramasFormacion.length > 0 ? proyectoProgramasFormacion : null,

        estado_sistema_gestion_id: servicioTecnologico.estado_sistema_gestion_id,
        sector_productivo: servicioTecnologico.sector_productivo,

        resumen: servicioTecnologico.resumen,
        antecedentes: servicioTecnologico.antecedentes,
        identificacion_problema: servicioTecnologico.identificacion_problema,
        justificacion_problema: servicioTecnologico.justificacion_problema,
        bibliografia: servicioTecnologico.bibliografia,
        zona_influencia: servicioTecnologico.zona_influencia,
        nombre_area_tecnica: servicioTecnologico.nombre_area_tecnica,

        resumen: servicioTecnologico.resumen,
        antecedentes: servicioTecnologico.antecedentes,
        identificacion_problema: servicioTecnologico.identificacion_problema,
        justificacion_problema: servicioTecnologico.justificacion_problema,
        bibliografia: servicioTecnologico.bibliografia,
    })

    let dialogGuardar = false
    let exportComponent

    function submit() {
        if (servicioTecnologico.proyecto.allowed.to_update) {
            $form.put(route('convocatorias.servicios-tecnologicos.update', [convocatoria.id, servicioTecnologico.id]), {
                onFinish: () => {
                    dialogGuardar = false
                },
                preserveScroll: true,
            })
        }
    }

    $: if ($form.fecha_inicio && $form.fecha_finalizacion) {
        $form.max_meses_ejecucion = monthDiff($form.fecha_inicio, $form.fecha_finalizacion)
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} proyecto={servicioTecnologico} />
    </header>

    <form on:submit|preventDefault={submit} id="servicios-tecnologicos-form">
        <fieldset className="p-8 divide-y" disabled={servicioTecnologico.proyecto.allowed.to_update ? undefined : true}>
            <STForm {form} {isSuperAdmin} {errors} {convocatoria} {servicioTecnologico} {lineasProgramaticas} {tiposProyectoSt} {sectoresProductivos} {estadosSistemaGestion} {programasFormacionConRegistroCalificado} />

            {#if isSuperAdmin || servicioTecnologico.proyecto.mostrar_recomendaciones}
                <div className="py-24">
                    <h1>Ortografía</h1>
                    {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p className="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.ortografia_comentario ? evaluacion.servicio_tecnologico_evaluacion.ortografia_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || servicioTecnologico.proyecto.mostrar_recomendaciones}
                <div className="py-24">
                    <h1>Redacción</h1>
                    {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p className="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.redaccion_comentario ? evaluacion.servicio_tecnologico_evaluacion.redaccion_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || servicioTecnologico.proyecto.mostrar_recomendaciones}
                <div className="py-24">
                    <h1>Normas APA</h1>
                    {#each servicioTecnologico.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p className="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.normas_apa_comentario ? evaluacion.servicio_tecnologico_evaluacion.normas_apa_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if servicioTecnologico.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}
        </fieldset>

        <div>
            <InfoMessage>
                Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador de Generalidades en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                    El recurso se ha modificado correctamente</strong
                >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" className="underline">sgpssipro@sena.edu.co</a>
                desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del proyecto).
            </InfoMessage>
            <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                <small className="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {servicioTecnologico.updated_at}
                </small>
                <Button type="button" on:click={() => (dialogGuardar = true)}>Descargar Generalidades en Word</Button>

                {#if servicioTecnologico.proyecto.allowed.to_update}
                    <PrimaryButton loading={$form.processing} form="servicios-tecnologicos-form">Guardar información</PrimaryButton>
                {:else}
                    <span className="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if}
            </div>
        </div>
    </form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/proyecto.png'} alt="Proyecto" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {servicioTecnologico.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                {#if (JSON.parse(servicioTecnologico.proyecto.estado_cord_sennova)?.requiereSubsanar == true && servicioTecnologico.proyecto.mostrar_recomendaciones == true && servicioTecnologico.proyecto.mostrar_requiere_subsanacion == true) || (JSON.parse(servicioTecnologico.proyecto.estado)?.requiereSubsanar == true && servicioTecnologico.proyecto.mostrar_recomendaciones == true && servicioTecnologico.proyecto.mostrar_requiere_subsanacion == true)}
                    <!-- <h1 className="text-center mb-4 font-black text-2xl">Este proyecto requiere ser subsanado</h1> -->
                    <p>Por favor revise las observaciones de los evaluadores en cada uno de los campos y secciones.</p>
                    <p>Importante: Se ha agregado una sección de <strong>Comentarios generales</strong>, revise si hay comentarios de los evaluadores y por favor escriba la respectiva respuesta.</p>
                {:else if (JSON.parse(servicioTecnologico.proyecto.estado_cord_sennova)?.requiereSubsanar == false && servicioTecnologico.proyecto.mostrar_recomendaciones == true && servicioTecnologico.proyecto.mostrar_requiere_subsanacion == true) || (JSON.parse(servicioTecnologico.proyecto.estado)?.requiereSubsanar == false && servicioTecnologico.proyecto.mostrar_recomendaciones == true && servicioTecnologico.proyecto.mostrar_requiere_subsanacion == true)}
                    <div>
                        <!-- <h1 className="text-center mb-4 font-black text-2xl">Este proyecto no requiere subsanación</h1> -->
                        <p><strong>Tenga en cuenta:</strong> El estado final de los proyectos se conocerá cuando finalice la etapa de segunda evaluación (Estado Rechazado, pre – aprobado con observaciones y Preaprobado).</p>
                    </div>
                {:else}
                    <h1 className="text-center mt-4 mb-4">Para terminar el numeral de <strong>Generalidades</strong> por favor continue diligenciando los siguientes campos:</h1>
                    <p className="text-center mb-4">Si ya están completos omita esta información.</p>
                    <ul className="list-disc">
                        <li>Resumen</li>
                        <li>Antecedentes</li>
                        <li>Identificación y descripción del problema</li>
                        <li>Pregunta de formulación del problema</li>
                        <li>Justificación</li>
                        <li>Bibliografía</li>
                    </ul>
                {/if}
            </div>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (proyectoDialogOpen = false)} variant={null}>Omitir</Button>
                {#if servicioTecnologico.proyecto.allowed.to_update}
                    <Button variant="raised" on:click={() => (proyectoDialogOpen = false)} on:click={() => Inertia.visit('#estructura-proyecto')}>Continuar diligenciando</Button>
                {/if}
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={dialogGuardar}>
        <div slot="title">
            <div className="m-auto relative text-app-600">
                <figure>
                    <img src="/images/megaphone.png" alt="" className="m-auto w-20" />
                </figure>
            </div>
        </div>

        <div slot="content">
            <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
                <h1 className="font-black text-center my-10">Información del proyecto</h1>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>
                        Debe corresponder al contenido del proyecto y responder a los siguientes interrogantes: ¿Qué se va a hacer?, ¿Sobre qué o quiénes se hará?, ¿Cómo?, ¿Dónde se llevará a cabo? Tiene que estar escrito de manera breve y concisa. Un buen título describe con exactitud y usando el menor número posible de palabras el tema central del proyecto. Nota: las respuestas a las preguntas
                        anteriormente formuladas no necesariamente deben responderse en mismo orden en el que aparecen. (Máximo 40 palabras):
                    </strong>
                    {$form.titulo}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Código dependencia presupuestal (SIIF):</strong>
                    {lineasProgramaticas.find((item) => item.value == $form.linea_programatica_id?.value)?.label}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Centro de formación:</strong>
                    {servicioTecnologico.proyecto.centro_formacion.nombre}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Líneas temáticas a ejecutar en la vigencia del proyecto:</strong>
                    <br />
                    {#if $form.tecnoacademia_linea_tecnoacademia_id}
                        {#each $form.tecnoacademia_linea_tecnoacademia_id as lineaTematica}
                            <br />
                            {lineaTematica.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Fecha de ejecución:</strong>
                    Del {$form.fecha_inicio + ' hasta ' + $form.fecha_finalizacion}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Resumen ejecutivo</strong>
                    <br />
                    <small>
                        Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto. Nota: El resumen por lo general se construye al final de la contextualización
                        con el fin de tener claros todos los puntos que intervinieron en la misma y poder dar a conocer de forma más pertinente los por menores del proyecto. (Máximo 1000 caracteres).
                    </small>
                    <br />
                    {$form.antecedentes ? $form.antecedentes : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Antecedentes</strong>
                    <br />
                    <small>
                        Se debe evidenciar la identificación y caracterización del mercado potencial/objetivo, nicho de mercado al cual se busca atender o la necesidad que se busca satisfacer tomando como referencia el estudio del sector, identificando si existen el(los) mismo(s) alcance(s) o similar(es) en la empresa privada o pública u otros centros de formación de tal forma que el proyecto no
                        se convierta en una competencia frente a un servicio/producto ofertado. Se debe registrar el análisis de las tendencias del mercado, en relación con clientes potenciales, competidores y proveedores. En este ítem es necesario valorar las necesidades de los clientes actuales o potenciales y precisar la segmentación del mercado, las tendencias de los precios y las gestiones
                        comerciales a realizadas. Nota: La información debe ser de fuentes primarias, ejemplo: Secretarías, DANE, Artículos científicos, entre otros y citarla utilizando normas APA séptima edición. (Máximo 10000 caracteres).
                    </small>
                    <br />
                    {$form.antecedentes ? $form.antecedentes : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Identificación y descripción del problema</strong>
                    <br />
                    <small>
                        1. Descripción de la necesidad, problema u oportunidad identificada del plan tecnológico y/o agendas departamentales de innovación y competitividad. 2. Descripción del problema que se atiende con el proyecto, sustentado en el contexto, la caracterización, los datos, las estadísticas, de la regional, entre otros, citar toda la información consignada utilizando normas APA
                        última edición. La información debe ser de fuentes primarias de información, ejemplo: Secretarías, DANE, Artículos científicos, entre otros.
                    </small>
                    <br />
                    {$form.identificacion_problema ? $form.identificacion_problema : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Pregunta de formulación del problema</strong>
                    <br />
                    <small>
                        Se debe verificar que la pregunta del problema defina con exactitud ¿cuál es el problema para resolver, investigar o intervenir? La pregunta debe cumplir las siguientes condiciones: • Guardar estrecha correspondencia con el título del proyecto. • Evitar adjetivos que impliquen juicios de valor tales como: bueno, malo, mejor, peor. • No debe dar origen a respuestas tales
                        como si o no. Nota: Se sugiere convertir el problema principal (tronco) identificado en el árbol de problemas en forma pregunta. Máximo 50 palabras
                    </small>
                    <br />
                    {$form.pregunta_formulacion_problema ? $form.pregunta_formulacion_problema : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Justificación</strong>
                    <br />
                    <small>
                        La justificación debe describir la solución del problema y debe responder a las siguientes preguntas: • ¿Cómo se relaciona el proyecto con las prioridades de la región y del país? • ¿Qué resultados se lograrán? • ¿Cuál es la finalidad con los resultados esperados? • ¿Cómo se utilizarán los resultados y quiénes serán los beneficiarios? • Debe incluir el impacto a la
                        formación, al sector productivo y a la política nacional de ciencia, tecnología e innovación. Nota: La justificación debe brindar un argumento convincente de los resultados del proyecto generado y de su aplicabilidad."
                    </small>
                    <br />
                    {$form.justificacion_problema ? $form.justificacion_problema : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Nombre de los programas de formación con los que se relaciona el proyecto:</strong>
                    <br />
                    {#if $form.programas_formacion}
                        {#each $form.programas_formacion as programaFormacion}
                            <br />
                            {programaFormacion.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Zona de influencia</strong>

                    {$form.zona_influencia ? $form.zona_influencia : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word">
                    <strong>Bibliografía</strong>
                    <br />
                    <small>Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).</small>
                    <br />
                    {$form.bibliografia ? $form.bibliografia : 'Sin información registrada'}
                </p>
            </Export2Word>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(servicioTecnologico.proyecto.codigo)}>Descargar Generalidades en Word</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>

<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { Inertia } from '@inertiajs/inertia'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Label from '@/Components/Label'
    import Textarea from '@/Components/Textarea'
    import MultipleSelect from '@/Components/MultipleSelect'
    import InfoMessage from '@/Components/InfoMessage'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Export2Word from '@/Components/Export2Word'

    import Header from './Shared/Header'
    import Form from './Form'

    export let errors
    export let centrosFormacion
    export let proyectoCapacidadInstalada
    export let listaBeneficiados
    export let programasFormacion
    export let lineasInvestigacion
    export let semillerosInvestigacion
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let redesConocimiento
    export let actividadesEconomicas
    export let tiposProyectoCapacidadInstalada
    export let subtiposProyectoCapacidadInstalada
    export let programasFormacionRegistroAsociados
    export let programasFormacionSinRegistroAsociados
    export let roles
    export let autorPrincipal

    $: $title = 'Editar proyecto de capacidad instalada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let proyectoDialogOpen = true
    let dialogGuardar = false
    let exportComponent

    let programasFormacionSinRegistro = []

    let programasFormacionConRegistro = programasFormacion
    function selectProgramasFormacionConRegistros(event) {
        programasFormacionConRegistro = programasFormacion.filter(function (obj) {
            return obj.registro_calificado == true && obj.centro_formacion_id == event.detail?.value
        })
    }

    programasFormacionSinRegistro = programasFormacion.filter((obj) => obj.registro_calificado == false)

    let formPlanteamientoProblema = useForm({
        planteamiento_problema: proyectoCapacidadInstalada.planteamiento_problema,
    })

    let formJustificacion = useForm({
        justificacion: proyectoCapacidadInstalada.justificacion,
    })

    let formObjetivoGeneral = useForm({
        objetivo_general: proyectoCapacidadInstalada.objetivo_general,
    })

    let formMetodologia = useForm({
        metodologia: proyectoCapacidadInstalada.metodologia,
    })

    let formInfraestructuraDesarrolloProyecto = useForm({
        infraestructura_desarrollo_proyecto: proyectoCapacidadInstalada.infraestructura_desarrollo_proyecto,
    })

    let formMaterialesFormacion = useForm({
        materiales_formacion_a_usar: proyectoCapacidadInstalada.materiales_formacion_a_usar,
    })

    let formConclusiones = useForm({
        conclusiones: proyectoCapacidadInstalada.conclusiones,
    })

    let formBibliografia = useForm({
        bibliografia: proyectoCapacidadInstalada.bibliografia,
    })

    let form = useForm({
        centro_formacion_id: proyectoCapacidadInstalada.semillero_investigacion.linea_investigacion.grupo_investigacion.centro_formacion_id,
        linea_investigacion_id: proyectoCapacidadInstalada.semillero_investigacion.linea_investigacion_id,
        semillero_investigacion_id: proyectoCapacidadInstalada.semillero_investigacion_id,
        area_conocimiento_id: proyectoCapacidadInstalada.disciplina_subarea_conocimiento.subarea_conocimiento.area_conocimiento_id,
        subarea_conocimiento_id: proyectoCapacidadInstalada.disciplina_subarea_conocimiento.subarea_conocimiento_id,
        disciplina_subarea_conocimiento_id: proyectoCapacidadInstalada.disciplina_subarea_conocimiento_id,
        red_conocimiento_id: proyectoCapacidadInstalada.red_conocimiento_id,
        actividad_economica_id: proyectoCapacidadInstalada.actividad_economica_id,
        tipo_proyecto_capacidad_instalada_id: proyectoCapacidadInstalada.subtipo_proyecto_capacidad_instalada.tipo_proyecto_capacidad_instalada_id,
        subtipo_proyecto_capacidad_instalada_id: proyectoCapacidadInstalada.subtipo_proyecto_capacidad_instalada_id,
        titulo: proyectoCapacidadInstalada.titulo,
        fecha_inicio: proyectoCapacidadInstalada.fecha_inicio,
        fecha_finalizacion: proyectoCapacidadInstalada.fecha_finalizacion,
        beneficia_a: proyectoCapacidadInstalada.beneficia_a,
        programas_formacion_registro_calificado: programasFormacionRegistroAsociados.length > 0 ? programasFormacionRegistroAsociados : null,
        programas_formacion_sin_registro_calificado: programasFormacionSinRegistroAsociados.length > 0 ? programasFormacionSinRegistroAsociados : null,
        rol_sennova: autorPrincipal.pivot.rol_sennova,
        cantidad_meses: autorPrincipal ? autorPrincipal.pivot.cantidad_meses : null,
        cantidad_horas: autorPrincipal ? autorPrincipal.pivot.cantidad_horas : null,
    })

    function submit() {
        if (proyectoCapacidadInstalada.allowed.to_update) {
            $form.put(route('proyectos-capacidad-instalada.update', proyectoCapacidadInstalada.id))
        }
    }

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (typeof column !== 'undefined' && typeof form !== 'undefined') {
                Inertia.put(
                    route('proyectos-capacidad-instalada.updateLongColumn', [proyectoCapacidadInstalada.id, column]),
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

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Header {proyectoCapacidadInstalada} active={true} />
    </header>

    <Form
        id="capacidad-instalada-form"
        {submit}
        {selectProgramasFormacionConRegistros}
        {proyectoCapacidadInstalada}
        {errors}
        {form}
        {formPlanteamientoProblema}
        {formJustificacion}
        {formObjetivoGeneral}
        {formMetodologia}
        {formMaterialesFormacion}
        {formConclusiones}
        {formBibliografia}
        {centrosFormacion}
        {lineasInvestigacion}
        {semillerosInvestigacion}
        {redesConocimiento}
        {areasConocimiento}
        {subareasConocimiento}
        {disciplinasSubareaConocimiento}
        {actividadesEconomicas}
        {tiposProyectoCapacidadInstalada}
        {subtiposProyectoCapacidadInstalada}
        {listaBeneficiados}
        {roles}
        {programasFormacion}
    >
        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="planteamiento_problema" value="Planteamiento del problema" />
            </div>
            <div>
                <Textarea maxlength="40000" id="planteamiento_problema" error={errors.planteamiento_problema} bind:value={$formPlanteamientoProblema.planteamiento_problema} on:blur={() => syncColumnLong('planteamiento_problema', $formPlanteamientoProblema)} required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="justificacion" value="Justificación" />
            </div>
            <div>
                <Textarea maxlength="40000" id="justificacion" error={errors.justificacion} bind:value={$formJustificacion.justificacion} on:blur={() => syncColumnLong('justificacion', $formJustificacion)} required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="objetivo_general" value="Objetivo general" />
            </div>
            <div>
                <Textarea maxlength="40000" id="objetivo_general" error={errors.objetivo_general} bind:value={$formObjetivoGeneral.objetivo_general} on:blur={() => syncColumnLong('objetivo_general', $formObjetivoGeneral)} required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="metodologia" value="Metodología" />
            </div>
            <div>
                <Textarea maxlength="40000" id="metodologia" error={errors.metodologia} bind:value={$formMetodologia.metodologia} on:blur={() => syncColumnLong('metodologia', $formMetodologia)} required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="infraestructura_desarrollo_proyecto" value="Infraestructura para el desarrollo del proyecto" />
            </div>
            <div>
                <Textarea
                    label="Describr los ambientes de formación y equipos que se van a usar"
                    maxlength="40000"
                    id="infraestructura_desarrollo_proyecto"
                    error={errors.infraestructura_desarrollo_proyecto}
                    bind:value={$formInfraestructuraDesarrolloProyecto.infraestructura_desarrollo_proyecto}
                    on:blur={() => syncColumnLong('infraestructura_desarrollo_proyecto', $formInfraestructuraDesarrolloProyecto)}
                    required
                />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="materiales_formacion_a_usar" value="Materiales de formación a utilizar" />
            </div>
            <div>
                <Textarea label="Describir los materiales de formación que se van a utilizar" maxlength="40000" id="materiales_formacion_a_usar" error={errors.materiales_formacion_a_usar} bind:value={$formMaterialesFormacion.materiales_formacion_a_usar} on:blur={() => syncColumnLong('materiales_formacion_a_usar', $formMaterialesFormacion)} required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="programas_formacion_registro_calificado" value="Nombre de los programas de formación con registro calificado" />
            </div>
            <div>
                <MultipleSelect id="programas_formacion_registro_calificado" bind:selectedValue={$form.programas_formacion_registro_calificado} items={programasFormacionConRegistro}  error={errors.programas_formacion_registro_calificado} placeholder="Buscar por el nombre del programa de formación" required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="programas_formacion_sin_registro_calificado" value="Nombre de los programas de formación a los cuales está asociado el proyecto " />
            </div>
            <div>
                <MultipleSelect id="programas_formacion_sin_registro_calificado" bind:selectedValue={$form.programas_formacion_sin_registro_calificado} items={programasFormacionSinRegistro}  error={errors.programas_formacion_sin_registro_calificado} placeholder="Buscar por el nombre del programa de formación" required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="conclusiones" value="Conclusiones" />
            </div>
            <div>
                <Textarea maxlength="40000" id="conclusiones" error={errors.conclusiones} bind:value={$formConclusiones.conclusiones} on:blur={() => syncColumnLong('conclusiones', $formConclusiones)} required />
            </div>
        </div>

        <div className="mt-44 grid grid-cols-1">
            <div>
                <Label required className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                <InfoMessage className="mb-2" message="Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf)." />
            </div>
            <div>
                <Textarea maxlength="40000" id="bibliografia" error={errors.bibliografia} bind:value={$formBibliografia.bibliografia} on:blur={() => syncColumnLong('bibliografia', $formBibliografia)} required />
            </div>
        </div>

        <div className="flex items-center justify-between mt-14 px-8 py-4" slot="buttons">
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {proyectoCapacidadInstalada.updated_at}
            </small>
            <Button on:click={() => (dialogGuardar = true)} className="ml-auto" type="button">Revisar información antes de guardar</Button>
        </div>
    </Form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/proyecto.png'} alt="Proyecto" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {proyectoCapacidadInstalada.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 className="text-center mt-4 mb-4">Para terminar el numeral de <strong>Información básica</strong> por favor continue diligenciando los siguientes campos:</h1>
                <p className="text-center mb-4">Si ya están completos omita esta información.</p>
                <ul className="list-disc">
                    <li>Justificación</li>
                    <li>Plan tecnológico</li>
                    <li>Objetivo general</li>
                    <li>Metodología</li>
                    <li>Infraestructura para el desarrollo del proyecto</li>
                    <li>Materiales de formación a utilizar</li>
                    <li>Planteamiento del problema</li>
                    <li>Conclusiones</li>
                    <li>Bibliografía</li>
                </ul>
            </div>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (proyectoDialogOpen = false)} variant={null}>Omitir</Button>
                {#if proyectoCapacidadInstalada.allowed.to_update}
                    <Button variant="raised" on:click={() => (proyectoDialogOpen = false)} on:click={() => Inertia.visit('#beneficia_a')}>Continuar diligenciando</Button>
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
        <div slot="header-info" className="ml-10 shadow-md">
            <InfoMessage>
                Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                    El recurso se ha modificado correctamente</strong
                >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" className="underline">sgpssipro@sena.edu.co</a>
                desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del proyecto).
            </InfoMessage>
        </div>
        <div slot="content">
            <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
                <h1 className="font-black text-center my-10">Información del proyecto</h1>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Centro de formación:</strong>
                    {$form.centro_formacion_id ? $form.centro_formacion_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Línea de investigación:</strong>
                    {$form.linea_investigacion_id ? $form.linea_investigacion_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Semillero de investigación:</strong>
                    {$form.semillero_investigacion_id ? $form.semillero_investigacion_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Área de conocimiento:</strong>
                    {$form.area_conocimiento_id ? $form.area_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Subárea de conocimiento:</strong>
                    {$form.subarea_conocimiento_id ? $form.subarea_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Disciplina de la subárea de conocimiento:</strong>
                    {$form.disciplina_subarea_conocimiento_id ? $form.disciplina_subarea_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Red de conocimiento:</strong>
                    {$form.red_conocimiento_id ? $form.red_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Actividad económica:</strong>
                    {$form.actividad_economica_id ? $form.actividad_economica_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Tipo de proyecto:</strong>
                    {$form.tipo_proyecto_capacidad_instalada_id ? $form.tipo_proyecto_capacidad_instalada_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Subtipo de proyecto:</strong>
                    {$form.subtipo_proyecto_capacidad_instalada_id ? $form.subtipo_proyecto_capacidad_instalada_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem;">
                    <strong>Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué:</strong>
                    {$form.titulo ? $form.titulo : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Fecha de ejecución:</strong>
                    Del {$form.fecha_inicio + ' hasta ' + $form.fecha_finalizacion}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>El proyecto beneficiará a:</strong>
                    <br />
                    {$form.beneficia_a ? $form.beneficia_a?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Planteamiento del problema</strong>
                    <br />
                    {$formPlanteamientoProblema.planteamiento_problema ? $formPlanteamientoProblema.planteamiento_problema : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Justificación</strong>
                    <br />
                    {$formJustificacion.justificacion ? $formJustificacion.justificacion : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Objetivo general</strong>
                    <br />
                    {$formObjetivoGeneral.objetivo_general ? $formObjetivoGeneral.objetivo_general : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Metodología</strong>
                    <br />
                    {$formMetodologia.metodologia ? $formMetodologia.metodologia : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Materiales de formación a utilizar</strong>
                    <br />
                    {$formMaterialesFormacion.materiales_formacion_a_usar ? $formMaterialesFormacion.materiales_formacion_a_usar : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Nombre de los programas de formación con registro calificado:</strong>
                    <br />
                    {#if $form.programas_formacion_registro_calificado}
                        {#each $form.programas_formacion_registro_calificado as programa_formacion}
                            <br />
                            {programa_formacion.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Nombre de los programas de formación a los cuales está asociado el proyecto:</strong>
                    <br />
                    {#if $form.programas_formacion_sin_registro_calificado}
                        {#each $form.programas_formacion_sin_registro_calificado as programa_formacion}
                            <br />
                            {programa_formacion.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Conclusiones</strong>
                    <br />
                    {$formConclusiones.conclusiones ? $formConclusiones.conclusiones : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word;">
                    <strong>Bibliografía</strong>
                    <br />
                    {$formBibliografia.bibliografia ? $formBibliografia.bibliografia : 'Sin información registrada'}
                </p>
            </Export2Word>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(proyectoCapacidadInstalada.codigo)}>Descargar borrador en Word</Button>
                {#if proyectoCapacidadInstalada.allowed.to_update}
                    <PrimaryButton loading={$form.processing} form="capacidad-instalada-form">Guardar</PrimaryButton>
                {:else}
                    <span className="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if}
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>

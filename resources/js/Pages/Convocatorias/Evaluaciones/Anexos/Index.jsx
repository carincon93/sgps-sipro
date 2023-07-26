<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import Switch from '@/Components/Switch'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import PrimaryButton from '@/Components/PrimaryButton'
    import EvaluationStepper from '@/Components/EvaluationStepper'

    import Create from '../../Proyectos/Anexos/Create'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let proyectoAnexo
    export let anexos
    export let otrasEvaluaciones

    $title = 'Anexos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let anexosSTInfo = {
        video: proyecto.video,
        infraestructura_adecuada: proyecto.infraestructura_adecuada,
        especificaciones_area: proyecto.especificaciones_area,
    }

    let formEstrategiaRegionalEvaluacion = useForm({
        anexos_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.anexos_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.anexos_comentario : null,
        anexos_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion?.anexos_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.anexos_comentario == null ? true : false) : null,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTaEvaluacion = useForm({
        anexos_comentario: evaluacion.ta_evaluacion?.anexos_comentario ? evaluacion.ta_evaluacion?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion.ta_evaluacion?.anexos_comentario == null ? true : false,
    })
    function submitTaEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTpEvaluacion = useForm({
        anexos_comentario: evaluacion.tp_evaluacion?.anexos_comentario ? evaluacion.tp_evaluacion?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion.tp_evaluacion?.anexos_comentario == null ? true : false,
    })
    function submitTpEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTpEvaluacion.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formServicioTecnologicoEvaluacion = useForm({
        anexos_comentario: evaluacion.servicio_tecnologico_evaluacion?.anexos_comentario ? evaluacion.servicio_tecnologico_evaluacion?.anexos_comentario : '',
        anexos_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.anexos_comentario == null ? true : false,

        video_comentario: evaluacion.servicio_tecnologico_evaluacion?.video_comentario ? evaluacion.servicio_tecnologico_evaluacion?.video_comentario : '',
        video_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.video_comentario == null ? true : false,

        especificaciones_area_comentario: evaluacion.servicio_tecnologico_evaluacion?.especificaciones_area_comentario ? evaluacion.servicio_tecnologico_evaluacion?.especificaciones_area_comentario : '',
        especificaciones_area_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.especificaciones_area_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.anexos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Ir a la evaluación
    </a>

    {#if proyecto.codigo_linea_programatica == 68}
        <h1 className="mt-24 mb-8 text-center text-3xl">Especificaciones e infraestructura</h1>

        <form className="mt-4 p-4">
            <fieldset disabled={is_super_admin || (checkRole(auth_user, [11, 5]) && proyecto.finalizado == true) ? undefined : true}>
                <div className="mt-4">
                    <Label labelFor="infraestructura_adecuada" value="¿Cuenta con infraestructura adecuada y propia para el funcionamiento de la línea servicios tecnológicos en el centro de formación?" className="inline-block mb-4" />
                    <br />
                    <Switch disabled checked={anexosSTInfo.infraestructura_adecuada} />
                </div>
                <div className="mt-4">
                    <Label labelFor="especificaciones_area" value="Relacione las especificaciones del área donde se desarrollan las actividades de servicios tecnológicos en el centro de formación" className="inline-block mb-4" />
                    <Textarea disabled label="Especificaciones del área" maxlength="40000" id="especificaciones_area" value={anexosSTInfo.especificaciones_area} />
                </div>
                <div className="mt-4">
                    <Label labelFor="video" value="Enlace del video de las instalaciones donde se desarrollan las actividades de la línea servicios tecnológicos. (Youtube, Vídeo en Google Drive con visualización pública)" className="inline-block mb-4" />
                    <Input disabled label="Enlace del video" type="url" className="mt-1" value={anexosSTInfo.video} />
                    <InfoMessage message="El vídeo debe incluir durante el recorrido en las instalaciones, una voz en off que justifique puntualmente el proyecto e incluya: el impacto a la formación, al sector productivo y a la política nacional de ciencia, tecnología e innovación." />
                </div>
            </fieldset>
        </form>
    {/if}

    <DataTable className="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
        <div slot="title">Anexos</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Archivo</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each anexos.data as anexo (anexo.id)}
                <tr>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {anexo.nombre}
                            <br />
                            {#if anexo.obligatorio}
                                <span className="text-red-500">* El anexo es obligatorio</span>
                            {/if}
                            {#if anexo.archivo}
                                <a target="_blank" className="text-app-400 underline mt-4 mb-4 flex" download href={anexo.archivo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Descargar formato para diligenciar dando clic en este enlace.
                                </a>
                            {/if}
                        </p>
                    </td>
                    <td className="border-t">
                        <Create {errors} {convocatoria} {proyecto} {anexo} bind:proyectoAnexo />
                    </td>
                </tr>
            {/each}

            {#if anexos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={anexos.links} />

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.anexos_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.anexos_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="anexos_comentario" bind:value={$formEstrategiaRegionalEvaluacion.anexos_comentario} error={errors.anexos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formEstrategiaRegionalEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 68}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitServicioTecnologicoEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.anexos_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.anexos_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="anexos_comentario" bind:value={$formServicioTecnologicoEvaluacion.anexos_comentario} error={errors.anexos_comentario} required />
                        {/if}
                    </div>

                    <div className="mt-4">
                        <p>¿El video es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.video_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.video_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="video_comentario" bind:value={$formServicioTecnologicoEvaluacion.video_comentario} error={errors.video_comentario} required />
                        {/if}
                    </div>

                    <div className="mt-4">
                        <p>¿Las especificaciones del área son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.especificaciones_area_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.especificaciones_area_requiere_comentario == false}
                            <Textarea
                                disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="especificaciones_area_comentario"
                                bind:value={$formServicioTecnologicoEvaluacion.especificaciones_area_comentario}
                                error={errors.especificaciones_area_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formServicioTecnologicoEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 70}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTaEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        {#if checkRole(auth_user, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div className="mb-8">
                                    <h4>Evaluador(a): <span className="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.anexos_comentario ? evaluacion.anexos_comentario : 'Estado: El evaluador(a) da cumplimiento a los anexos'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.anexos_requiere_comentario} />
                        {#if $formTaEvaluacion.anexos_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="anexos_comentario" bind:value={$formTaEvaluacion.anexos_comentario} error={errors.anexos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTaEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 69}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTpEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los anexos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.anexos_requiere_comentario} />
                        {#if $formTpEvaluacion.anexos_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="anexos_comentario" bind:value={$formTpEvaluacion.anexos_comentario} error={errors.anexos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTpEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>

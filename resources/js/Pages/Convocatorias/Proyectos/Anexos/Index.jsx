<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import Button from '@/Components/Button'
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import Switch from '@/Components/Switch'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'
    import Create from './Create'

    import Stepper from '@/Components/Stepper'

    export let errors
    export let convocatoria
    export let proyecto
    export let proyectoAnexo
    export let anexos

    $title = 'Anexos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        video: proyecto.video,
        infraestructura_adecuada: proyecto.infraestructura_adecuada ? proyecto.infraestructura_adecuada : false,
        especificaciones_area: proyecto.especificaciones_area,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.servicios-tecnologicos.infraestructura', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    {#if proyecto.codigo_linea_programatica == 68}
        <h1 className="mt-24 mb-8 text-center text-3xl">Especificaciones e infraestructura</h1>

        <form on:submit|preventDefault={submit} className="mt-4 p-4">
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <div className="mt-8">
                    <Label required labelFor="infraestructura_adecuada" value="¿Cuenta con infraestructura adecuada y propia para el funcionamiento de la línea servicios tecnológicos en el centro de formación?" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.infraestructura_adecuada} />
                </div>
                <div className="mt-8">
                    <Label required labelFor="especificaciones_area" value="Relacione las especificaciones del área donde se desarrollan las actividades de servicios tecnológicos en el centro de formación" className="inline-block mb-4" />
                    <Textarea label="Especificaciones del área" maxlength="40000" id="especificaciones_area" error={errors.especificaciones_area} bind:value={$form.especificaciones_area} required />
                </div>
                <div className="mt-8">
                    <Label required labelFor="video" value="Enlace del video de las instalaciones donde se desarrollan las actividades de la línea servicios tecnológicos. (Youtube, Vídeo en Google Drive con visualización pública)" className="inline-block mb-4" />
                    <Input label="Enlace del video" type="url" className="mt-1" bind:value={$form.video} error={errors?.video} required />
                    <InfoMessage message="El vídeo debe incluir durante el recorrido en las instalaciones, una voz en off que justifique puntualmente el proyecto e incluya: el impacto a la formación, al sector productivo y a la política nacional de ciencia, tecnología e innovación." />
                </div>
                <div className="w-1/12">
                    <Button loading={$form.processing} className="w-full mt-4" type="submit">Guardar</Button>
                </div>
            </fieldset>
        </form>
    {/if}

    {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
        <InfoMessage className="mt-20">
            <h1 className="mb-10 font-black">Importante:</h1>
            <ul>
                <li><strong>ANEXO 1A. Acta_Reunión Regional</strong> NO se adjunta en plataforma. Se envía junto al Anexo 1B a la Coordinación Sennova (Obligatorio)</li>

                <li><strong>ANEXO 1C. Carta C.I Director Regional</strong> NO se adjunta en plataforma. Se envía a la Coordinación Sennova, uno por regional, junto con el Anexo 1A (Obligatorio)</li>
            </ul>
        </InfoMessage>

        <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
            <div slot="title">Anexos</div>

            <div slot="caption">
                {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                    <RecomendacionEvaluador className="mt-8">
                        {#each proyecto.evaluaciones as evaluacion, i}
                            {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                    {#if evaluacion.idi_evaluacion}
                                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.anexos_comentario ? evaluacion.idi_evaluacion.anexos_comentario : 'Sin recomendación'}</p>
                                    {:else if evaluacion.cultura_innovacion_evaluacion}
                                        <p className="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.anexos_comentario ? evaluacion.cultura_innovacion_evaluacion.anexos_comentario : 'Sin recomendación'}</p>
                                    {:else if evaluacion.ta_evaluacion}
                                        <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.anexos_comentario ? evaluacion.ta_evaluacion.anexos_comentario : 'Sin recomendación'}</p>
                                    {:else if evaluacion.tp_evaluacion}
                                        <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.anexos_comentario ? evaluacion.tp_evaluacion.anexos_comentario : 'Sin recomendación'}</p>
                                    {:else if evaluacion.servicio_tecnologico_evaluacion}
                                        <hr className="mt-10 mb-10 border-black-200" />
                                        <h1 className="font-black">Anexos</h1>

                                        <ul className="list-disc pl-4">
                                            <li className="whitespace-pre-line mb-10">{evaluacion.servicio_tecnologico_evaluacion?.anexos_comentario ? 'Recomendación anexos: ' + evaluacion.servicio_tecnologico_evaluacion.anexos_comentario : 'Sin recomendación'}</li>
                                        </ul>

                                        <hr className="mt-10 mb-10 border-black-200" />
                                        <h1 className="font-black">Video</h1>

                                        <ul className="list-disc pl-4">
                                            <li className="whitespace-pre-line mb-10">{evaluacion.servicio_tecnologico_evaluacion?.video_comentario ? 'Recomendación video: ' + evaluacion.servicio_tecnologico_evaluacion.video_comentario : 'Sin recomendación'}</li>
                                        </ul>

                                        <hr className="mt-10 mb-10 border-black-200" />
                                        <h1 className="font-black">Especificaciones del área</h1>

                                        <ul className="list-disc pl-4">
                                            <li className="whitespace-pre-line mb-10">{evaluacion.servicio_tecnologico_evaluacion?.especificaciones_area_comentario ? 'Recomendación especificaciones área: ' + evaluacion.servicio_tecnologico_evaluacion.especificaciones_area_comentario : 'Sin recomendación'}</li>
                                        </ul>
                                    {/if}
                                </div>
                            {/if}
                        {/each}
                        {#if proyecto.evaluaciones.length == 0}
                            <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                        {/if}
                    </RecomendacionEvaluador>
                {/if}
            </div>

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
    {:else if convocatoria.tipo_convocatoria == 2}
        <InfoMessage className="mt-20" alertMsg={true}>No se permite el cargue de archivos anexos porque es un proyecto DEMO de ejercicio y no es un proyecto oficial.</InfoMessage>
    {/if}
</AuthenticatedLayout>

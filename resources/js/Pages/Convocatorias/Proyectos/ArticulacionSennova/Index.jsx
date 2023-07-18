import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'

import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

import Participantes from '../Participantes/Participantes'

const ArticulacionSennova = ({
    auth,
    convocatoria,
    proyecto,
    areasConocimiento,
    subareasConocimiento,
    disciplinasSubareaConocimiento,
    lineasInvestigacion,
    gruposInvestigacion,
    semillerosInvestigacion,
    redesConocimiento,
    tematicasEstrategicas,
    actividadesEconomicas,
    gruposInvestigacionRelacionados,
    lineasInvestigacionRelacionadas,
    semillerosInvestigacionRelacionados,
    disciplinasSubareaConocimientoRelacionadas,
    redesConocimientoRelacionadas,
    actividadesEconomicasRelacionadas,
    tematicasEstrategicasRelacionadas,
    proyectosIdiTecnoacademia,
    proyectosIdiTecnoacademiaRelacionados,
    centrosFormacion,
    autorPrincipal,
    tiposDocumento,
    tiposVinculacion,
    roles,
    ...props
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const form = useForm({
        area_conocimiento_id: null,
        subarea_conocimiento_id: null,
        lineas_investigacion: lineasInvestigacionRelacionadas?.length > 0 ? lineasInvestigacionRelacionadas : null,
        grupos_investigacion: gruposInvestigacionRelacionados?.length > 0 ? gruposInvestigacionRelacionados : null,
        semilleros_investigacion: semillerosInvestigacionRelacionados?.length > 0 ? semillerosInvestigacionRelacionados : null,
        disciplinas_subarea_conocimiento: disciplinasSubareaConocimientoRelacionadas?.length > 0 ? disciplinasSubareaConocimientoRelacionadas : null,
        redes_conocimiento: redesConocimientoRelacionadas?.length > 0 ? redesConocimientoRelacionadas : null,
        actividades_economicas: actividadesEconomicasRelacionadas?.length > 0 ? actividadesEconomicasRelacionadas : null,
        tematicas_estrategicas: tematicasEstrategicasRelacionadas?.length > 0 ? tematicasEstrategicasRelacionadas : null,
        proyecto_idi_tecnoacademia_id: proyectosIdiTecnoacademiaRelacionados?.length > 0 ? proyectosIdiTecnoacademiaRelacionados : null,
        proyectos_ejecucion: proyecto.proyectos_ejecucion ? proyecto.proyectos_ejecucion : '',
        semilleros_en_formalizacion: proyecto.semilleros_en_formalizacion,
        articulacion_semillero: proyecto.articulacion_semillero,
        articulacion_centro_formacion: proyecto.articulacion_centro_formacion,
        lineas_medulares_centro: proyecto.lineas_medulares_centro,
        articulacion_programas_centro: proyecto.articulacion_programas_centro,
        articulacion_bienestar_aprendiz: proyecto.articulacion_bienestar_aprendiz,
        favorecimiento_ruta_formacion: proyecto.favorecimiento_ruta_formacion,

        // Tp
        impacto_centro_formacion: proyecto.impacto_centro_formacion,
        aportacion_semilleros_grupos: proyecto.aportacion_semilleros_grupos,
        proyeccion_con_st: proyecto.proyeccion_con_st,
        proyeccion_extensionismo_tecnologico: proyecto.proyeccion_extensionismo_tecnologico,
        proyeccion_centros_desarrollo: proyecto.proyeccion_centros_desarrollo,
        proyeccion_formacion_regional: proyecto.proyeccion_formacion_regional,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.articulacion-sennova.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == form.area_conocimiento_id?.value
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

    return (
        <AuthenticatedLayout>
            <Grid item md={12}>
                <div className="mt-16">
                    <Participantes centrosFormacion={centrosFormacion} autorPrincipal={autorPrincipal} convocatoria={convocatoria} proyecto={proyecto} tiposDocumento={tiposDocumento} tiposVinculacion={tiposVinculacion} rolesSennova={roles} />{' '}
                </div>
            </Grid>
            <Grid item md={12}>
                <h1 className="text-3xl mt-24 mb-8 text-center">Articulación SENNOVA</h1>

                <p className="text-center mb-8">A continuación, registre la información relacionada con la articulación de la línea de {proyecto.codigo_linea_programatica == 70 ? 'TecnoAcademia' : proyecto.codigo_linea_programatica == 69 ? 'TecnoParque' : ''} con las otras líneas de SENNOVA en el centro y la regional:</p>

                <form onSubmit={submit}>
                    <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                        {proyecto.codigo_linea_programatica == 70 ? (
                            <>
                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="lineas_investigacion" value="Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="lineas_investigacion"
                                            bdValues={form.data.lineas_investigacion}
                                            options={lineasInvestigacion}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    lineas_investigacion: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.lineas_investigacion}
                                            placeholder="Buscar por el nombre de la línea de investigación"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación en los cuales está vinculada la TecnoAcademia" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="grupos_investigacion"
                                            bdValues={form.data.grupos_investigacion}
                                            options={gruposInvestigacion}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    grupos_investigacion: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.grupos_investigacion}
                                            placeholder="Seleccione el grupo de investigación"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="articulacion_semillero" value="¿Está la TecnoAcademia articulada con un semillero?" />
                                    </div>
                                    <div>
                                        <Autocomplete
                                            options={[
                                                { value: 1, label: 'Si' },
                                                { value: 2, label: 'No' },
                                            ]}
                                            id="articulacion_semillero"
                                            selectedValue={form.data.articulacion_semillero}
                                            error={form.errors.articulacion_semillero}
                                            onChange={(event, newValue) => form.setData('articulacion_semillero', newValue.value)}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>
                                </div>

                                {form.articulacion_semillero?.value == 1 && (
                                    <div className="mt-44 grid grid-cols-2">
                                        <div>
                                            <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación de la TecnoAcademia" />
                                        </div>
                                        <div>
                                            <SelectMultiple
                                                id="semilleros_investigacion"
                                                bdValues={form.data.semilleros_investigacion}
                                                options={semillerosInvestigacion}
                                                onChange={(event, newValue) => {
                                                    const selectedValues = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        semilleros_investigacion: selectedValues,
                                                    }))
                                                }}
                                                error={form.errors.semilleros_investigacion}
                                                placeholder="Seleccione el semillero de investigación"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="proyectos_ejecucion" value={`Proyectos o iniciativas en ejecución en el año ${convocatoria.year - 1}`} />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="proyecto_idi_tecnoacademia_id"
                                            bdValues={form.data.proyecto_idi_tecnoacademia_id}
                                            options={proyectosIdiTecnoacademia}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    proyecto_idi_tecnoacademia_id: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.proyecto_idi_tecnoacademia_id}
                                            placeholder="Seleccione uno o varias iniciativas"
                                            required
                                        />

                                        <AlertMui hiddenIcon={true} className="mt-10 mb-4">
                                            Si aún no ha registrado el proyecto en el módulo de <strong>Proyectos e iniciativas I+D+i TecnoAcademias</strong>, relacione en el siguiente campo el título del proyecto. Se recomienda hacer el registro en el módulo.
                                        </AlertMui>
                                        <Textarea label="Proyectos / Iniciativas" id="proyectos_ejecucion" error={form.errors.proyectos_ejecucion} value={form.data.proyectos_ejecucion} onChange={(e) => form.setData('proyectos_ejecucion', e.target.value)} />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label className="mb-4" labelFor="semilleros_en_formalizacion" value="Semilleros en proceso de formalización (Separados por coma)" />
                                    </div>
                                    <div>
                                        <Tags id="semilleros_en_formalizacion" className="mt-4" enforceWhitelist={false} tags={form.data.semilleros_en_formalizacion} value={form.data.semilleros_en_formalizacion} onChange={(e) => form.setData('semilleros_en_formalizacion', e.target.value)} placeholder="Nombre(s) de la(s) IE" error={form.errors.semilleros_en_formalizacion} />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de la subárea de conocimiento" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="disciplinas_subarea_conocimiento_id"
                                            bdValues={form.data.disciplinas_subarea_conocimiento}
                                            options={disciplinasSubareaConocimiento}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    disciplinas_subarea_conocimiento: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.disciplinas_subarea_conocimiento}
                                            placeholder="Disciplinas subárea de concimiento"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="redes_conocimiento" value="Red de conocimiento sectorial" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="redes_conocimiento"
                                            bdValues={form.data.redes_conocimiento}
                                            options={redesConocimiento}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    redes_conocimiento: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.redes_conocimiento}
                                            placeholder="Seleccione la red de conocimiento"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="actividades_economicas" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="actividades_economicas"
                                            bdValues={form.data.actividades_economicas}
                                            options={actividadesEconomicas}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    actividades_economicas: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.actividades_economicas}
                                            placeholder="Seleccione la actividad económica"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="tematicas_estrategicas" value="Temática estratégica SENA" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="tematicas_estrategicas"
                                            bdValues={form.data.tematicas_estrategicas}
                                            options={tematicasEstrategicas}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    tematicas_estrategicas: selectedValues,
                                                }))
                                            }}
                                            error={form.errors.tematicas_estrategicas}
                                            placeholder="Seleccione la temática estratégica SENA"
                                            required
                                        />
                                    </div>
                                </div>

                                <h6 className="mt-20 mb-12 text-2xl text-center">Articulación con el Centro</h6>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="articulacion_centro_formacion" value="Articulación con el centro de formación" />
                                    </div>
                                    <div>
                                        <Textarea id="articulacion_centro_formacion" error={form.errors.articulacion_centro_formacion} value={form.data.articulacion_centro_formacion} onChange={(e) => form.setData('articulacion_centro_formacion', e.target.value)} required />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="articulacion_programas_centro" value="¿Articulación de la TecnoAcademia en los programas de formación del Centro? " />
                                    </div>
                                    <div>
                                        <Textarea id="articulacion_programas_centro" error={form.errors.articulacion_programas_centro} value={form.data.articulacion_programas_centro} onChange={(e) => form.setData('articulacion_programas_centro', e.target.value)} required />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="articulacion_bienestar_aprendiz" value="¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?  " />
                                    </div>
                                    <div>
                                        <Textarea id="articulacion_bienestar_aprendiz" error={form.errors.articulacion_bienestar_aprendiz} value={form.data.articulacion_bienestar_aprendiz} onChange={(e) => form.setData('articulacion_bienestar_aprendiz', e.target.value)} required />
                                    </div>
                                </div>

                                <div className="mt-44 grid grid-cols-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="favorecimiento_ruta_formacion" value="¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?" />
                                    </div>
                                    <div>
                                        <Textarea id="fav" error={form.errors.favorecimiento_ruta_formacion} value={form.data.favorecimiento_ruta_formacion} onChange={(e) => form.setData('favorecimiento_ruta_formacion', e.target.value)} required />
                                    </div>
                                </div>

                                <div className="py-24">
                                    <div className="mt-44 grid grid-cols-2">
                                        <div>
                                            <Label required className="mb-4" labelFor="lineas_medulares_centro" value="Líneas medulares del Centro con las que se articula la TecnoAcademia" />
                                        </div>
                                        <div>
                                            <Textarea id="lineas_medulares_centro" error={form.errors.lineas_medulares_centro} value={form.data.lineas_medulares_centro} onChange={(e) => form.setData('lineas_medulares_centro', e.target.value)} required />
                                        </div>
                                    </div>
                                    {/* {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <RecomendacionEvaluador className="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.lineas_medulares_centro_comentario ? evaluacion.ta_evaluacion.lineas_medulares_centro_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if} */}
                                </div>
                            </>
                        ) : (
                            proyecto.codigo_linea_programatica == 69 && (
                                <>
                                    <div className="py-24">
                                        <div className="grid grid-cols-1">
                                            <div>
                                                <Label required className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />
                                            </div>
                                            <div>
                                                <Textarea id="impacto_centro_formacion" error={form.errors.impacto_centro_formacion} value={form.data.impacto_centro_formacion} onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)} required />
                                            </div>
                                        </div>
                                        {/* {#if (isSuperAdmin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0)}
                        <RecomendacionEvaluador className="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.impacto_centro_formacion_comentario ? evaluacion.tp_evaluacion.impacto_centro_formacion_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if} */}
                                    </div>

                                    <div className="py-24">
                                        <div className="grid grid-cols-1">
                                            <div>
                                                <Label required className="mb-4" labelFor="aportacion_semilleros_grupos" value="Comente la articulación y aporte del TecnoParque proyectada para el {convocatoria.year} a los semilleros y grupos de investigación." />
                                            </div>
                                            <div>
                                                <Textarea id="aportacion_semilleros_grupos" error={form.errors.aportacion_semilleros_grupos} value={form.data.aportacion_semilleros_grupos} onChange={(e) => form.setData('aportacion_semilleros_grupos', e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-24">
                                        <div className="grid grid-cols-1">
                                            <div>
                                                <Label required className="mb-4" labelFor="proyeccion_con_st" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con la línea de Servicios Tecnológicos?" />
                                            </div>
                                            <div>
                                                <Textarea id="proyeccion_con_st" error={form.errors.proyeccion_con_st} value={form.data.proyeccion_con_st} onChange={(e) => form.setData('proyeccion_con_st', e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-24">
                                        <div className="grid grid-cols-1">
                                            <div>
                                                <Label required className="mb-4" labelFor="proyeccion_extensionismo_tecnologico" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con la línea de Extensionismo Tecnológico?" />
                                            </div>
                                            <div>
                                                <Textarea id="proyeccion_extensionismo_tecnologico" error={form.errors.proyeccion_extensionismo_tecnologico} value={form.data.proyeccion_extensionismo_tecnologico} onChange={(e) => form.setData('proyeccion_extensionismo_tecnologico', e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-24">
                                        <div className="grid grid-cols-1">
                                            <div>
                                                <Label required className="mb-4" labelFor="proyeccion_centros_desarrollo" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con los centros de desarrollo empresarial de la Regional?" />
                                            </div>
                                            <div>
                                                <Textarea id="proyeccion_centros_desarrollo" error={form.errors.proyeccion_centros_desarrollo} value={form.data.proyeccion_centros_desarrollo} onChange={(e) => form.setData('proyeccion_centros_desarrollo', e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-24">
                                        <div className="grid grid-cols-1">
                                            <div>
                                                <Label required className="mb-4" labelFor="proyeccion_formacion_regional" value="¿Cómo proyecta en el {convocatoria.year}, el Tecnoparque contribuir a la formación en la Regional o en el SENA?" />
                                            </div>
                                            <div>
                                                <Textarea id="proyeccion_formacion_regional" error={form.errors.proyeccion_formacion_regional} value={form.data.proyeccion_formacion_regional} onChange={(e) => form.setData('proyeccion_formacion_regional', e.target.value)} required />
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="text-4xl text-center">Semilleros y Grupos de investigación</h1>

                                    <div className="mt-44 grid grid-cols-2">
                                        <div>
                                            <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
                                        </div>
                                        <div>
                                            <SelectMultiple
                                                id="semilleros_investigacion"
                                                bdValues={form.data.semilleros_investigacion}
                                                options={semillerosInvestigacion}
                                                onChange={(event, newValue) => {
                                                    const selectedValues = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        semilleros_investigacion: selectedValues,
                                                    }))
                                                }}
                                                error={form.errors.semilleros_investigacion}
                                                placeholder="Seleccione el semillero de investigación"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-44 grid grid-cols-2">
                                        <div>
                                            <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
                                        </div>
                                        <div>
                                            <SelectMultiple
                                                id="grupos_investigacion"
                                                bdValues={form.data.grupos_investigacion}
                                                options={gruposInvestigacion}
                                                onChange={(event, newValue) => {
                                                    const selectedValues = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        grupos_investigacion: selectedValues,
                                                    }))
                                                }}
                                                error={form.errors.grupos_investigacion}
                                                placeholder="Seleccione el grupo de investigación"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                        )}
                    </fieldset>
                    <div className=" flex items-center justify-between mt-14  py-4">
                        {proyecto.allowed.to_update && (
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Guardar
                            </PrimaryButton>
                        )}
                    </div>
                </form>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArticulacionSennova

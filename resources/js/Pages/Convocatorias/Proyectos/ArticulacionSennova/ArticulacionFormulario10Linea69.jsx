import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const ArtituclacionFormulario10Linea69 = ({ convocatoria, proyecto, semilleros_investigacion, grupos_investigacion }) => {
    const form_articulacion_proyecto_formulario_10_linea_69 = useForm({
        contribucion_formacion_centro_regional: proyecto.proyecto_formulario10_linea69?.contribucion_formacion_centro_regional,
        acciones_fortalecimiento_centro_regional: proyecto.proyecto_formulario10_linea69?.acciones_fortalecimiento_centro_regional,
        acciones_participacion_aprendices: proyecto.proyecto_formulario10_linea69?.acciones_participacion_aprendices,
        acciones_aportes_por_edt: proyecto.proyecto_formulario10_linea69?.acciones_aportes_por_edt,
        acciones_fortalecimiento_programas_calificados: proyecto.proyecto_formulario10_linea69?.acciones_fortalecimiento_programas_calificados,
        acciones_categorizacion_grupos_investigacion: proyecto.proyecto_formulario10_linea69?.acciones_categorizacion_grupos_investigacion,
        oportunidades_fortalecimiento_proyectos_sennova: proyecto.proyecto_formulario10_linea69?.oportunidades_fortalecimiento_proyectos_sennova,
        proyeccion_articulacion_linea_68: proyecto.proyecto_formulario10_linea69?.proyeccion_articulacion_linea_68,
        proyeccion_articulacion_linea_83: proyecto.proyecto_formulario10_linea69?.proyeccion_articulacion_linea_83,
        oportunidades_fortalecimiento_convocatorias_innovacion: proyecto.proyecto_formulario10_linea69?.oportunidades_fortalecimiento_convocatorias_innovacion,
        proyeccion_articulacion_centros_empresariales: proyecto.proyecto_formulario10_linea69?.proyeccion_articulacion_centros_empresariales,
        grupos_investigacion: proyecto.grupos_investigacion?.map((item) => item.id),
        semilleros_investigacion: proyecto.semilleros_investigacion?.map((item) => item.id),
    })
    const submitArticulacionSennovaProyectoHub = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_articulacion_proyecto_formulario_10_linea_69.post(route('convocatorias.proyectos.articulacion-sennova-proyectos-formulario-10-linea-69.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.articulacion-sennova.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => console.log('Request finished'),
                        preserveScroll: true,
                    },
                )
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <form onSubmit={submitArticulacionSennovaProyectoHub}>
            <Grid container rowSpacing={20}>
                <Grid item md={12}>
                    <h1 className="text-center">CONTRIBUCIÓN A LA FORMACIÓN</h1>
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="contribucion_formacion_centro_regional"
                        value={`¿Cuales fueron las principales acciones ejecutadas por el Hub de innovación en la vigencia ${
                            convocatoria.year - 1
                        } para contribuir a la formación en el Centro y en la Regional?`}
                    />

                    <Textarea
                        id="contribucion_formacion_centro_regional"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.contribucion_formacion_centro_regional}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.contribucion_formacion_centro_regional}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('contribucion_formacion_centro_regional', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('contribucion_formacion_centro_regional', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_fortalecimiento_centro_regional"
                        value={`Para la vigencia ${convocatoria.year}, defina acciones a realizar desde el Hub de Innovación,  que sean verificables,  y que contribuyan al fortalecimiento de la formación en el Centro y en la regional`}
                    />

                    <Textarea
                        id="acciones_fortalecimiento_centro_regional"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.acciones_fortalecimiento_centro_regional}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.acciones_fortalecimiento_centro_regional}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('acciones_fortalecimiento_centro_regional', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_fortalecimiento_centro_regional', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_participacion_aprendices"
                        value={`Defina acciones a realizar en el ${convocatoria.year}, que promuevan la participación de aprendices en el Hub de Innovación`}
                    />

                    <Textarea
                        id="acciones_participacion_aprendices"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.acciones_participacion_aprendices}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.acciones_participacion_aprendices}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('acciones_participacion_aprendices', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_participacion_aprendices', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_aportes_por_edt"
                        value={`A partir de las acciones realizadas en el ${
                            convocatoria.year - 1
                        }, desde la oferta de Formación Complementaria (EDTs y otros Eventos), proyecte las acciones a realizar en la vigencia ${
                            convocatoria.year
                        } en las que participe el Hub de Innovación.`}
                    />

                    <Textarea
                        id="acciones_aportes_por_edt"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.acciones_aportes_por_edt}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.acciones_aportes_por_edt}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('acciones_aportes_por_edt', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_aportes_por_edt', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_fortalecimiento_programas_calificados"
                        value={`Describa las acciones realizadas o productos generados que contribuyeron en el ${
                            convocatoria.year - 1
                        } al Registro Calificado de Programas del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia ${
                            convocatoria.year
                        } que fortalezcan esta articulación.`}
                    />

                    <Textarea
                        id="acciones_fortalecimiento_programas_calificados"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.acciones_fortalecimiento_programas_calificados}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.acciones_fortalecimiento_programas_calificados}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('acciones_fortalecimiento_programas_calificados', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_fortalecimiento_programas_calificados', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <h1 className="text-center">CONTRIBUCIÓN A LA INVESTIGACIÓN</h1>
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_categorizacion_grupos_investigacion"
                        value={`Describa las acciones realizadas o productos generados que contribuyeron en el ${
                            convocatoria.year - 1
                        } a la categorización de Grupos de Investigación del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia ${
                            convocatoria.year
                        } que fortalezcan esta articulación.`}
                    />

                    <Textarea
                        id="acciones_categorizacion_grupos_investigacion"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.acciones_categorizacion_grupos_investigacion}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.acciones_categorizacion_grupos_investigacion}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('acciones_categorizacion_grupos_investigacion', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_categorizacion_grupos_investigacion', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="oportunidades_fortalecimiento_proyectos_sennova"
                        value={`Describa los Proyectos de Investigación del Centro en la vigencia ${
                            convocatoria.year - 1
                        }, en los cuales participó el  Hub. Plantee oportunidades para el fortalecimiento de esta articulación`}
                    />

                    <Textarea
                        id="oportunidades_fortalecimiento_proyectos_sennova"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.oportunidades_fortalecimiento_proyectos_sennova}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.oportunidades_fortalecimiento_proyectos_sennova}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('oportunidades_fortalecimiento_proyectos_sennova', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('oportunidades_fortalecimiento_proyectos_sennova', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="semilleros_investigacion"
                        bdValues={form_articulacion_proyecto_formulario_10_linea_69.data.semilleros_investigacion}
                        options={semilleros_investigacion}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_articulacion_proyecto_formulario_10_linea_69.setData((prevData) => ({
                                ...prevData,
                                semilleros_investigacion: selected_values,
                            }))
                        }}
                        disabled={!proyecto?.allowed?.to_update}
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.semilleros_investigacion}
                        onBlur={() => syncColumnLong('semilleros_investigacion', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="grupos_investigacion"
                        bdValues={form_articulacion_proyecto_formulario_10_linea_69.data.grupos_investigacion}
                        options={grupos_investigacion}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_articulacion_proyecto_formulario_10_linea_69.setData((prevData) => ({
                                ...prevData,
                                grupos_investigacion: selected_values,
                            }))
                        }}
                        disabled={!proyecto?.allowed?.to_update}
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.grupos_investigacion}
                        onBlur={() => syncColumnLong('grupos_investigacion', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <h1 className="text-center">El Hub de Innovación en el Eje de Servicios de I+D+i</h1>
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="proyeccion_articulacion_linea_68"
                        value={`A partir de los resultados y las acciones realizadas por el Hub de Innovación, ¿Cómo proyecta la articulación en el ${
                            convocatoria.year - 1
                        }, el  con la línea de Servicios Tecnológicos?`}
                    />

                    <Textarea
                        id="proyeccion_articulacion_linea_68"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.proyeccion_articulacion_linea_68}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.proyeccion_articulacion_linea_68}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('proyeccion_articulacion_linea_68', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('proyeccion_articulacion_linea_68', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="proyeccion_articulacion_linea_83"
                        value={`A partir de los resultados y las acciones realizadas por el Hub de Innovación, ¿Cómo proyecta la articulación en el ${
                            convocatoria.year - 1
                        }, el  con la línea de Extensionismo Tecnológico?`}
                    />

                    <Textarea
                        id="proyeccion_articulacion_linea_83"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.proyeccion_articulacion_linea_83}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.proyeccion_articulacion_linea_83}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('proyeccion_articulacion_linea_83', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('proyeccion_articulacion_linea_83', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="oportunidades_fortalecimiento_convocatorias_innovacion"
                        value={`A partir de los resultados y las acciones realizadas por el Hub de Innovación en las convocatorias de Fomento a la Innovación, plantee oportunidades para el fortalecimietno de esta estrategia ${convocatoria.year} para ser implementadas en la siguiente vigencia.`}
                    />

                    <Textarea
                        id="oportunidades_fortalecimiento_convocatorias_innovacion"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.oportunidades_fortalecimiento_convocatorias_innovacion}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.oportunidades_fortalecimiento_convocatorias_innovacion}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('oportunidades_fortalecimiento_convocatorias_innovacion', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('oportunidades_fortalecimiento_convocatorias_innovacion', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="proyeccion_articulacion_centros_empresariales"
                        value={`¿Cómo proyecta la articulación en el ${convocatoria.year - 1}, el  con los centros de desarrollo empresarial de la Regional?`}
                    />

                    <Textarea
                        id="proyeccion_articulacion_centros_empresariales"
                        error={form_articulacion_proyecto_formulario_10_linea_69.errors.proyeccion_articulacion_centros_empresariales}
                        value={form_articulacion_proyecto_formulario_10_linea_69.data.proyeccion_articulacion_centros_empresariales}
                        onChange={(e) => form_articulacion_proyecto_formulario_10_linea_69.setData('proyeccion_articulacion_centros_empresariales', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('proyeccion_articulacion_centros_empresariales', form_articulacion_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
            </Grid>

            <div className=" flex items-center justify-between mt-14  py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form_articulacion_proyecto_formulario_10_linea_69.processing} className="ml-auto" type="submit">
                        Guardar
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default ArtituclacionFormulario10Linea69

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useState } from 'react'

const ArticulacionFormulario4Linea70 = ({
    convocatoria,
    proyecto,
    proyectos_idi_tecnoacademia,
    actividades_economicas,
    tematicas_estrategicas,
    redes_conocimiento,
    semilleros_investigacion,
    grupos_investigacion,
    lineas_investigacion,
    disciplinas_subarea_conocimiento,
}) => {
    const form = useForm({
        lineas_investigacion: proyecto.lineas_investigacion?.map((item) => item.id),
        grupos_investigacion: proyecto.grupos_investigacion?.map((item) => item.id),
        semilleros_investigacion: proyecto.semilleros_investigacion?.map((item) => item.id),

        disciplinas_subarea_conocimiento: proyecto?.proyecto_formulario4_linea70?.disciplinas_subarea_conocimiento?.map((item) => item.id),
        redes_conocimiento: proyecto?.redes_conocimiento?.map((item) => item.id),
        actividades_economicas: proyecto?.proyecto_formulario4_linea70?.actividades_economicas?.map((item) => item.id),
        tematicas_estrategicas: proyecto?.proyecto_formulario4_linea70?.tematicas_estrategicas?.map((item) => item.id),
        proyecto_idi_tecnoacademia_id: proyecto?.proyecto_formulario4_linea70?.proyectos_idi_tecnoacademia?.map((item) => item.id),

        proyectos_ejecucion: proyecto?.proyecto_formulario4_linea70?.proyectos_ejecucion ?? '',
        semilleros_en_formalizacion: proyecto?.proyecto_formulario4_linea70?.semilleros_en_formalizacion,
        articulacion_semillero: proyecto?.proyecto_formulario4_linea70?.articulacion_semillero,
        articulacion_centro_formacion: proyecto?.proyecto_formulario4_linea70?.articulacion_centro_formacion,
        lineas_medulares_centro: proyecto?.proyecto_formulario4_linea70?.lineas_medulares_centro,
        articulacion_programas_centro: proyecto?.proyecto_formulario4_linea70?.articulacion_programas_centro,
        articulacion_bienestar_aprendiz: proyecto?.proyecto_formulario4_linea70?.articulacion_bienestar_aprendiz,
        favorecimiento_ruta_formacion: proyecto?.proyecto_formulario4_linea70?.favorecimiento_ruta_formacion,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.articulacion-sennova.store', [convocatoria.id, proyecto.id]), {
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
        <form onSubmit={submit}>
            <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                <Grid container rowSpacing={20}>
                    <Grid item md={6}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="lineas_investigacion"
                            value="Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia"
                        />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="lineas_investigacion"
                            bdValues={form.data.lineas_investigacion}
                            options={lineas_investigacion}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    lineas_investigacion: selected_values,
                                }))
                            }}
                            error={form.errors.lineas_investigacion}
                            onBlur={() => syncColumnLong('lineas_investigacion', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación en los cuales está vinculada la TecnoAcademia" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="grupos_investigacion"
                            bdValues={form.data.grupos_investigacion}
                            options={grupos_investigacion}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    grupos_investigacion: selected_values,
                                }))
                            }}
                            error={form.errors.grupos_investigacion}
                            onBlur={() => syncColumnLong('grupos_investigacion', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="articulacion_semillero" value="¿Está la TecnoAcademia articulada con un semillero?" />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            options={[
                                { value: 1, label: 'Si' },
                                { value: 2, label: 'No' },
                            ]}
                            id="articulacion_semillero"
                            selectedValue={form.data.articulacion_semillero}
                            error={form.errors.articulacion_semillero}
                            onChange={(event, newValue) => form.setData('articulacion_semillero', newValue.value)}
                            onBlur={() => syncColumnLong('articulacion_semillero', form)}
                            required
                        />
                    </Grid>

                    {form.articulacion_semillero == 1 && (
                        <>
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación de la TecnoAcademia" />
                            </Grid>

                            <Grid item md={6}>
                                <SelectMultiple
                                    id="semilleros_investigacion"
                                    bdValues={form.data.semilleros_investigacion}
                                    options={semilleros_investigacion}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            semilleros_investigacion: selected_values,
                                        }))
                                    }}
                                    error={form.errors.semilleros_investigacion}
                                    onBlur={() => syncColumnLong('semilleros_investigacion', form)}
                                    required
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="proyectos_ejecucion" value={`Proyectos o iniciativas en ejecución en el año ${convocatoria.year - 1}`} />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="proyecto_idi_tecnoacademia_id"
                            bdValues={form.data.proyecto_idi_tecnoacademia_id}
                            options={proyectos_idi_tecnoacademia}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    proyecto_idi_tecnoacademia_id: selected_values,
                                }))
                            }}
                            error={form.errors.proyecto_idi_tecnoacademia_id}
                            onBlur={() => syncColumnLong('proyecto_idi_tecnoacademia_id', form)}
                            required
                        />

                        <AlertMui className="mt-10 mb-4">
                            Si aún no ha registrado el proyecto en el módulo de <strong>Proyectos e iniciativas I+D+i TecnoAcademias</strong>, relacione en el siguiente campo el título del proyecto.
                            Se recomienda hacer el registro en el módulo.
                        </AlertMui>
                        <Textarea
                            label="Proyectos / Iniciativas"
                            id="proyectos_ejecucion"
                            error={form.errors.proyectos_ejecucion}
                            value={form.data.proyectos_ejecucion}
                            onChange={(e) => form.setData('proyectos_ejecucion', e.target.value)}
                            onBlur={() => syncColumnLong('proyectos_ejecucion', form)}
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label className="mb-4" labelFor="semilleros_en_formalizacion" value="Semilleros en proceso de formalización (Separados por coma)" />
                    </Grid>

                    <Grid item md={6}>
                        <Tags
                            id="semilleros_en_formalizacion"
                            enforceWhitelist={false}
                            tags={form.data.semilleros_en_formalizacion}
                            value={form.data.semilleros_en_formalizacion}
                            onChange={(e) => (form.setData('semilleros_en_formalizacion', e.target.value), syncColumnLong('semilleros_en_formalizacion', form, e.target.value))}
                            placeholder="Nombres de los semilleros"
                            error={form.errors.semilleros_en_formalizacion}
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de conocimiento" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="disciplinas_subarea_conocimiento_id"
                            bdValues={form.data.disciplinas_subarea_conocimiento}
                            options={disciplinas_subarea_conocimiento}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    disciplinas_subarea_conocimiento: selected_values,
                                }))
                            }}
                            error={form.errors.disciplinas_subarea_conocimiento}
                            onBlur={() => syncColumnLong('disciplinas_subarea_conocimiento', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="redes_conocimiento" value="Red de conocimiento sectorial" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="redes_conocimiento"
                            bdValues={form.data.redes_conocimiento}
                            options={redes_conocimiento}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    redes_conocimiento: selected_values,
                                }))
                            }}
                            error={form.errors.redes_conocimiento}
                            onBlur={() => syncColumnLong('redes_conocimiento', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="actividades_economicas" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="actividades_economicas"
                            bdValues={form.data.actividades_economicas}
                            options={actividades_economicas}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    actividades_economicas: selected_values,
                                }))
                            }}
                            error={form.errors.actividades_economicas}
                            onBlur={() => syncColumnLong('actividades_economicas', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="tematicas_estrategicas" value="Temática estratégica SENA" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="tematicas_estrategicas"
                            bdValues={form.data.tematicas_estrategicas}
                            options={tematicas_estrategicas}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    tematicas_estrategicas: selected_values,
                                }))
                            }}
                            error={form.errors.tematicas_estrategicas}
                            onBlur={() => syncColumnLong('tematicas_estrategicas', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <h6 className="mt-20 mb-12 text-2xl text-center">Articulación con el Centro de formación</h6>
                    </Grid>

                    <Grid item md={12}>
                        <Textarea
                            id="articulacion_centro_formacion"
                            error={form.errors.articulacion_centro_formacion}
                            value={form.data.articulacion_centro_formacion}
                            onChange={(e) => form.setData('articulacion_centro_formacion', e.target.value)}
                            label="Articulación con el centro de formación"
                            onBlur={() => syncColumnLong('articulacion_centro_formacion', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label required className="mb-4" labelFor="articulacion_programas_centro" />

                        <Textarea
                            id="articulacion_programas_centro"
                            error={form.errors.articulacion_programas_centro}
                            value={form.data.articulacion_programas_centro}
                            onChange={(e) => form.setData('articulacion_programas_centro', e.target.value)}
                            label="¿Articulación de la TecnoAcademia en los programas de formación del Centro?"
                            onBlur={() => syncColumnLong('articulacion_programas_centro', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Textarea
                            id="articulacion_bienestar_aprendiz"
                            error={form.errors.articulacion_bienestar_aprendiz}
                            value={form.data.articulacion_bienestar_aprendiz}
                            onChange={(e) => form.setData('articulacion_bienestar_aprendiz', e.target.value)}
                            label="¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?"
                            onBlur={() => syncColumnLong('articulacion_bienestar_aprendiz', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Textarea
                            id="fav"
                            error={form.errors.favorecimiento_ruta_formacion}
                            value={form.data.favorecimiento_ruta_formacion}
                            onChange={(e) => form.setData('favorecimiento_ruta_formacion', e.target.value)}
                            label="¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?"
                            onBlur={() => syncColumnLong('favorecimiento_ruta_formacion', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Textarea
                            id="lineas_medulares_centro"
                            error={form.errors.lineas_medulares_centro}
                            value={form.data.lineas_medulares_centro}
                            onChange={(e) => form.setData('lineas_medulares_centro', e.target.value)}
                            label="Líneas medulares del Centro con las que se articula la TecnoAcademia"
                            onBlur={() => syncColumnLong('lineas_medulares_centro', form)}
                            required
                        />
                    </Grid>
                </Grid>
            </fieldset>
            <div className=" flex items-center justify-between mt-14  py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                        Guardar
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default ArticulacionFormulario4Linea70

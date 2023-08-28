import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const ArticulacionFormulario5Linea69 = ({ convocatoria, proyecto, semilleros_investigacion, grupos_investigacion }) => {
    const form = useForm({
        grupos_investigacion: proyecto.grupos_investigacion?.map((item) => item.id),
        semilleros_investigacion: proyecto.semilleros_investigacion?.map((item) => item.id),

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
            <fieldset>
                <Grid container rowSpacing={20}>
                    <Grid item md={12}>
                        <Label required className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />

                        <Textarea
                            id="impacto_centro_formacion"
                            error={form.errors.impacto_centro_formacion}
                            value={form.data.impacto_centro_formacion}
                            onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)}
                            disabled={!proyecto?.allowed?.to_update}
                            onBlur={() => syncColumnLong('impacto_centro_formacion', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="aportacion_semilleros_grupos"
                            value={`Comente la articulación y aporte del TecnoParque proyectada para el ${convocatoria.year} a los semilleros y grupos de investigación.`}
                        />

                        <Textarea
                            id="aportacion_semilleros_grupos"
                            error={form.errors.aportacion_semilleros_grupos}
                            value={form.data.aportacion_semilleros_grupos}
                            onChange={(e) => form.setData('aportacion_semilleros_grupos', e.target.value)}
                            disabled={!proyecto?.allowed?.to_update}
                            onBlur={() => syncColumnLong('aportacion_semilleros_grupos', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="proyeccion_con_st"
                            value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, el Tecnoparque con la línea de Servicios Tecnológicos?`}
                        />

                        <Textarea
                            id="proyeccion_con_st"
                            error={form.errors.proyeccion_con_st}
                            value={form.data.proyeccion_con_st}
                            onChange={(e) => form.setData('proyeccion_con_st', e.target.value)}
                            disabled={!proyecto?.allowed?.to_update}
                            onBlur={() => syncColumnLong('proyeccion_con_st', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="proyeccion_extensionismo_tecnologico"
                            value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, el Tecnoparque con la línea de Extensionismo Tecnológico?`}
                        />

                        <Textarea
                            id="proyeccion_extensionismo_tecnologico"
                            error={form.errors.proyeccion_extensionismo_tecnologico}
                            value={form.data.proyeccion_extensionismo_tecnologico}
                            onChange={(e) => form.setData('proyeccion_extensionismo_tecnologico', e.target.value)}
                            disabled={!proyecto?.allowed?.to_update}
                            onBlur={() => syncColumnLong('proyeccion_extensionismo_tecnologico', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="proyeccion_centros_desarrollo"
                            value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, el Tecnoparque con los centros de desarrollo empresarial de la Regional?`}
                        />

                        <Textarea
                            id="proyeccion_centros_desarrollo"
                            error={form.errors.proyeccion_centros_desarrollo}
                            value={form.data.proyeccion_centros_desarrollo}
                            onChange={(e) => form.setData('proyeccion_centros_desarrollo', e.target.value)}
                            disabled={!proyecto?.allowed?.to_update}
                            onBlur={() => syncColumnLong('proyeccion_centros_desarrollo', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="proyeccion_formacion_regional"
                            value={`¿Cómo proyecta en el ${convocatoria.year}, el Tecnoparque contribuir a la formación en la Regional o en el SENA?`}
                        />

                        <Textarea
                            id="proyeccion_formacion_regional"
                            error={form.errors.proyeccion_formacion_regional}
                            value={form.data.proyeccion_formacion_regional}
                            onChange={(e) => form.setData('proyeccion_formacion_regional', e.target.value)}
                            disabled={!proyecto?.allowed?.to_update}
                            onBlur={() => syncColumnLong('proyeccion_formacion_regional', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={12}>
                        <h1 className="text-4xl text-center">Semilleros y Grupos de investigación</h1>
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
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
                            disabled={!proyecto?.allowed?.to_update}
                            error={form.errors.semilleros_investigacion}
                            onBlur={() => syncColumnLong('semilleros_investigacion', form)}
                            required
                        />
                    </Grid>

                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
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
                            disabled={!proyecto?.allowed?.to_update}
                            error={form.errors.grupos_investigacion}
                            onBlur={() => syncColumnLong('grupos_investigacion', form)}
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

export default ArticulacionFormulario5Linea69

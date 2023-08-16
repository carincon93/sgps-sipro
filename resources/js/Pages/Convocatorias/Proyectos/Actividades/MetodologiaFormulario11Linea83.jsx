import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const MetodologiaFormulario11Linea83 = ({ convocatoria, proyecto, regionales }) => {
    const form_metdologia_proyecto_formulario_11_linea_83 = useForm({
        metodologia: proyecto.proyecto_formulario11_linea83?.metodologia,
        departamentos_a_impactar: proyecto.proyecto_formulario11_linea83?.departamentos_a_impactar,
        estrategias_atencion_empresas_municipios: proyecto.proyecto_formulario11_linea83?.estrategias_atencion_empresas_municipios,
        estrategias_promover_logros: proyecto.proyecto_formulario11_linea83?.estrategias_promover_logros,
        estrategias_visibilizacion: proyecto.proyecto_formulario11_linea83?.estrategias_visibilizacion,
        estrategias_productividad_agropecuaria_agroindustrial: proyecto.proyecto_formulario11_linea83?.estrategias_productividad_agropecuaria_agroindustrial,
    })

    const submitMetodologiaProyectoFormulario11Linea83 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_metdologia_proyecto_formulario_11_linea_83.put(route('convocatorias.proyectos.metodologia-proyecto-formulario-11-linea-83', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.metodologia.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
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
        <form onSubmit={submitMetodologiaProyectoFormulario11Linea83} className="!mt-20">
            <Grid container rowSpacing={20}>
                <Grid item md={12}>
                    <Label required className="mb-4" labelFor="metodologia" value={`Metodología (¿Cómo se implementará la línea en el ${convocatoria.year}?)`} />

                    <Textarea
                        id="metodologia"
                        error={form_metdologia_proyecto_formulario_11_linea_83.errors.metodologia}
                        value={form_metdologia_proyecto_formulario_11_linea_83.data.metodologia}
                        onChange={(e) => form_metdologia_proyecto_formulario_11_linea_83.setData('metodologia', e.target.value)}
                        onBlur={() => syncColumnLong('metodologia', form_metdologia_proyecto_formulario_11_linea_83)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="departamentos_a_impactar" value="Departamentos a impactar" />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="departamentos_a_impactar"
                        bdValues={form_metdologia_proyecto_formulario_11_linea_83.data.departamentos_a_impactar}
                        options={regionales}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_metdologia_proyecto_formulario_11_linea_83.setData((prevData) => ({
                                ...prevData,
                                departamentos_a_impactar: selected_values,
                            }))
                        }}
                        error={form_metdologia_proyecto_formulario_11_linea_83.errors.departamentos_a_impactar}
                        label="Seleccione una o varias opciones"
                        required
                        onBlur={() => syncColumnLong('departamentos_a_impactar', form_metdologia_proyecto_formulario_11_linea_83)}
                    />
                </Grid>
                <Grid item md={12}>
                    <Label required className="mb-4" labelFor="estrategias_atencion_empresas_municipios" value="Comparta la estrategia para la atención de Empresas en los departamentos mencionados" />

                    <Textarea
                        id="estrategias_atencion_empresas_municipios"
                        error={form_metdologia_proyecto_formulario_11_linea_83.errors.estrategias_atencion_empresas_municipios}
                        value={form_metdologia_proyecto_formulario_11_linea_83.data.estrategias_atencion_empresas_municipios}
                        onChange={(e) => form_metdologia_proyecto_formulario_11_linea_83.setData('estrategias_atencion_empresas_municipios', e.target.value)}
                        onBlur={() => syncColumnLong('estrategias_atencion_empresas_municipios', form_metdologia_proyecto_formulario_11_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategias_promover_logros"
                        value={`Comparta las alianzas estratégicas a gestionar en el ${convocatoria.year} para promover el logro de las metas de Extensionismo Tecnológico`}
                    />

                    <Textarea
                        id="estrategias_promover_logros"
                        error={form_metdologia_proyecto_formulario_11_linea_83.errors.estrategias_promover_logros}
                        value={form_metdologia_proyecto_formulario_11_linea_83.data.estrategias_promover_logros}
                        onChange={(e) => form_metdologia_proyecto_formulario_11_linea_83.setData('estrategias_promover_logros', e.target.value)}
                        onBlur={() => syncColumnLong('estrategias_promover_logros', form_metdologia_proyecto_formulario_11_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategias_visibilizacion"
                        value={`Comparta la estrategia de divulgación y visibilización de acciones de las acciones de la línea ET para el ${convocatoria.year}`}
                    />

                    <Textarea
                        id="estrategias_visibilizacion"
                        error={form_metdologia_proyecto_formulario_11_linea_83.errors.estrategias_visibilizacion}
                        value={form_metdologia_proyecto_formulario_11_linea_83.data.estrategias_visibilizacion}
                        onChange={(e) => form_metdologia_proyecto_formulario_11_linea_83.setData('estrategias_visibilizacion', e.target.value)}
                        onBlur={() => syncColumnLong('estrategias_visibilizacion', form_metdologia_proyecto_formulario_11_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategias_productividad_agropecuaria_agroindustrial"
                        value={`Proponga las estrategias para el ${convocatoria.year} con el fin de que las estrategias de la lïnea de Extensionismo Tecnológico contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial`}
                    />

                    <Textarea
                        id="estrategias_productividad_agropecuaria_agroindustrial"
                        error={form_metdologia_proyecto_formulario_11_linea_83.errors.estrategias_productividad_agropecuaria_agroindustrial}
                        value={form_metdologia_proyecto_formulario_11_linea_83.data.estrategias_productividad_agropecuaria_agroindustrial}
                        onChange={(e) => form_metdologia_proyecto_formulario_11_linea_83.setData('estrategias_productividad_agropecuaria_agroindustrial', e.target.value)}
                        onBlur={() => syncColumnLong('estrategias_productividad_agropecuaria_agroindustrial', form_metdologia_proyecto_formulario_11_linea_83)}
                        required
                    />
                </Grid>
            </Grid>
            <div className=" flex items-center justify-between py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form_metdologia_proyecto_formulario_11_linea_83.processing} className="ml-auto" type="submit">
                        Guardar información de la metodología
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default MetodologiaFormulario11Linea83

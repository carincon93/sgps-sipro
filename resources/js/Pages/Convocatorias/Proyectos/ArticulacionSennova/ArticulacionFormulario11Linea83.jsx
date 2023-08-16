import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const ArticulacionFormulario11Linea83 = ({ convocatoria, proyecto, grupos_investigacion }) => {
    const form_articulacion_proyectos_linea_83 = useForm({
        impacto_centros_formacion: proyecto.proyecto_formulario11_linea83?.impacto_centros_formacion,
        articulacion_semilleros_grupos_investigacion: proyecto.proyecto_formulario11_linea83?.articulacion_semilleros_grupos_investigacion,
        articulacion_linea_68: proyecto.proyecto_formulario11_linea83?.articulacion_linea_68,
        articulacion_linea_69_y_hubs: proyecto.proyecto_formulario11_linea83?.articulacion_linea_69_y_hubs,
        articulacion_centros_desarrollo_empresarial: proyecto.proyecto_formulario11_linea83?.articulacion_centros_desarrollo_empresarial,
        contribucion_formacion_regional_nacional: proyecto.proyecto_formulario11_linea83?.contribucion_formacion_regional_nacional,
        proyeccion_capacidades_tecnologicas_empresas: proyecto.proyecto_formulario11_linea83?.proyeccion_capacidades_tecnologicas_empresas,
    })
    const submitArticulacionSennovaProyectosLinea83 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_articulacion_proyectos_linea_83.post(route('convocatorias.proyectos.articulacion-sennova-proyectos-linea-83.store', [convocatoria.id, proyecto.id]), {
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
        <form onSubmit={submitArticulacionSennovaProyectosLinea83}>
            <Grid container rowSpacing={20}>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="impacto_centros_formacion"
                        value="Impacto de la impelmentación de acciones de la línea de Extensionismo Tecnológico  en el (los) centro(s) de formación y en la Formación Profesional"
                    />

                    <Textarea
                        id="impacto_centros_formacion"
                        error={form_articulacion_proyectos_linea_83.errors.impacto_centros_formacion}
                        value={form_articulacion_proyectos_linea_83.data.impacto_centros_formacion}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('impacto_centros_formacion', e.target.value)}
                        onBlur={() => syncColumnLong('impacto_centros_formacion', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="articulacion_semilleros_grupos_investigacion"
                        value={`Comente la articulación y aporte dela Línea de ET, proyectada para el ${convocatoria.year} a los semilleros y grupos de investigación.`}
                    />

                    <Textarea
                        id="articulacion_semilleros_grupos_investigacion"
                        error={form_articulacion_proyectos_linea_83.errors.articulacion_semilleros_grupos_investigacion}
                        value={form_articulacion_proyectos_linea_83.data.articulacion_semilleros_grupos_investigacion}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('articulacion_semilleros_grupos_investigacion', e.target.value)}
                        onBlur={() => syncColumnLong('articulacion_semilleros_grupos_investigacion', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="articulacion_linea_68"
                        value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, de las acciones de ET con la línea de Servicios Tecnológicos?`}
                    />

                    <Textarea
                        id="articulacion_linea_68"
                        error={form_articulacion_proyectos_linea_83.errors.articulacion_linea_68}
                        value={form_articulacion_proyectos_linea_83.data.articulacion_linea_68}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('articulacion_linea_68', e.target.value)}
                        onBlur={() => syncColumnLong('articulacion_linea_68', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="articulacion_linea_69_y_hubs"
                        value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, de la  línea de Extensionismo Tecnológico con la Red de Tecnoparques y Hubs de Innovación?`}
                    />

                    <Textarea
                        id="articulacion_linea_69_y_hubs"
                        error={form_articulacion_proyectos_linea_83.errors.articulacion_linea_69_y_hubs}
                        value={form_articulacion_proyectos_linea_83.data.articulacion_linea_69_y_hubs}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('articulacion_linea_69_y_hubs', e.target.value)}
                        onBlur={() => syncColumnLong('articulacion_linea_69_y_hubs', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="articulacion_centros_desarrollo_empresarial"
                        value="¿Cómo se  proyectan las estrategias de Extensionismo Tecnológico para articularse con los centros de desarrollo empresarial de(l) Los Centros en las Regionales impactadas?"
                    />

                    <Textarea
                        id="articulacion_centros_desarrollo_empresarial"
                        error={form_articulacion_proyectos_linea_83.errors.articulacion_centros_desarrollo_empresarial}
                        value={form_articulacion_proyectos_linea_83.data.articulacion_centros_desarrollo_empresarial}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('articulacion_centros_desarrollo_empresarial', e.target.value)}
                        onBlur={() => syncColumnLong('articulacion_centros_desarrollo_empresarial', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="contribucion_formacion_regional_nacional"
                        value={`¿Cómo proyecta en el ${convocatoria.year}, Extensionismo Tecnológico contribuir a la formación en la Regional o en el SENA?`}
                    />

                    <Textarea
                        id="contribucion_formacion_regional_nacional"
                        error={form_articulacion_proyectos_linea_83.errors.contribucion_formacion_regional_nacional}
                        value={form_articulacion_proyectos_linea_83.data.contribucion_formacion_regional_nacional}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('contribucion_formacion_regional_nacional', e.target.value)}
                        onBlur={() => syncColumnLong('contribucion_formacion_regional_nacional', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="proyeccion_capacidades_tecnologicas_empresas"
                        value={`¿Cómo proyecta en el ${convocatoria.year}, Extensionismo Tecnológico promover el desarrollo y fortalecimiento de las capacidades tecnológicas de las empresas, cadenas productivas y clústeres en las regiones?`}
                    />

                    <Textarea
                        id="proyeccion_capacidades_tecnologicas_empresas"
                        error={form_articulacion_proyectos_linea_83.errors.proyeccion_capacidades_tecnologicas_empresas}
                        value={form_articulacion_proyectos_linea_83.data.proyeccion_capacidades_tecnologicas_empresas}
                        onChange={(e) => form_articulacion_proyectos_linea_83.setData('proyeccion_capacidades_tecnologicas_empresas', e.target.value)}
                        onBlur={() => syncColumnLong('proyeccion_capacidades_tecnologicas_empresas', form_articulacion_proyectos_linea_83)}
                        required
                    />
                </Grid>
            </Grid>
            <div className=" flex items-center justify-between mt-14  py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form_articulacion_proyectos_linea_83.processing} className="ml-auto" type="submit">
                        Guardar
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default ArticulacionFormulario11Linea83

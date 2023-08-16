import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import ToolTipMui from '@/Components/Tooltip'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import axios from 'axios'

const MetodologiaFormulario5Linea69 = ({ convocatoria, proyecto }) => {
    const form_metodologia_proyecto_formulario_5_linea_69 = useForm({
        metodologia: proyecto.proyecto.proyecto_formulario5_linea69?.metodologia,
        metodologia_local: proyecto.proyecto.proyecto_formulario5_linea69?.metodologia_local,
    })

    const submitMetodologiaProyectoFormulario5Linea69 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_metodologia_proyecto_formulario_5_linea_69.put(route('convocatorias.proyectos.metodologia-proyecto-formulario-5-linea-69', [convocatoria.id, proyecto.id]), {
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
        <form onSubmit={submitMetodologiaProyectoFormulario5Linea69} className="!mt-20">
            <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                <Grid container rowSpacing={20}>
                    <Grid item md={12}>
                        <Label required className="mb-4" labelFor="metodologia" value="Metodología" />
                        <Textarea
                            id="metodologia"
                            error={form_metodologia_proyecto_formulario_5_linea_69.errors.metodologia}
                            name="metodologia"
                            value={form_metodologia_proyecto_formulario_5_linea_69.data.metodologia}
                            onChange={(e) => form_metodologia_proyecto_formulario_5_linea_69.setData('metodologia', e.target.value)}
                            onBlur={() => syncColumnLong('metodologia', form_metodologia_proyecto_formulario_5_linea_69)}
                            required
                        />
                    </Grid>
                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="metodologia_local"
                            value={
                                'A continuación, describa la metodología que será implementada en el ' +
                                convocatoria.year +
                                ' en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques:'
                            }
                        />
                        <Textarea
                            id="metodologia_local"
                            error={form_metodologia_proyecto_formulario_5_linea_69.errors.metodologia_local}
                            name="metodologia_local"
                            value={form_metodologia_proyecto_formulario_5_linea_69.data.metodologia_local}
                            onChange={(e) => form_metodologia_proyecto_formulario_5_linea_69.setData('metodologia_local', e.target.value)}
                            onBlur={() => syncColumnLong('metodologia_local', form_metodologia_proyecto_formulario_5_linea_69)}
                            required
                        />
                    </Grid>
                </Grid>
            </fieldset>
            <div className=" flex items-center justify-between py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form_metodologia_proyecto_formulario_5_linea_69.processing} className="ml-auto" type="submit">
                        Guardar información de la metodología
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default MetodologiaFormulario5Linea69

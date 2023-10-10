import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, laboratorio_st, tipologias_st, subclasificaciones_st, lineas_tecnicas, centros_formacion, ...props }) => {
    const form = useForm({
        _method: method,
        centro_formacion_id: laboratorio_st?.centro_formacion_id,
        tipologia: laboratorio_st?.tipologia,
        subclasificacion: laboratorio_st?.subclasificacion,
        tipo_proyecto: laboratorio_st?.tipo_proyecto,
        linea_tecnica_id: laboratorio_st?.linea_tecnica_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('laboratorios-servicios-tecnologicos.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('laboratorios-servicios-tecnologicos.update', [laboratorio_st.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} laboratorio ST</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="centro_formacion_id"
                                    options={centros_formacion}
                                    selectedValue={form.data.centro_formacion_id}
                                    onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                                    error={form.errors.centro_formacion_id}
                                    label="Seleccione el centro de formación"
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="tipologia"
                                    options={tipologias_st}
                                    selectedValue={form.data.tipologia}
                                    onChange={(event, newValue) => form.setData('tipologia', newValue.value)}
                                    error={form.errors.tipologia}
                                    label="Seleccione la tipología"
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="subclasificacion"
                                    options={subclasificaciones_st}
                                    selectedValue={form.data.subclasificacion}
                                    onChange={(event, newValue) => form.setData('subclasificacion', newValue.value)}
                                    error={form.errors.subclasificacion}
                                    label="Seleccione la subclasificación"
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="linea_tecnica_id"
                                    options={lineas_tecnicas}
                                    selectedValue={form.data.linea_tecnica_id}
                                    onChange={(event, newValue) => form.setData('linea_tecnica_id', newValue.value)}
                                    error={form.errors.linea_tecnica_id}
                                    label="Seleccione la línea técnica"
                                />
                            </Grid>
                        </Grid>
                        <div className="py-4 flex items-center justify-end">
                            <PrimaryButton disabled={form.processing || !form.isDirty} type="submit">
                                Guardar cambios
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)} className="!ml-2">
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form

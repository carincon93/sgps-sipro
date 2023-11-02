import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, tipo_formulario_convocatoria_id, item_evaluacion, convocatorias, ...props }) => {
    const form = useForm({
        campo: item_evaluacion?.campo,
        criterio: item_evaluacion?.criterio,
        puntaje_maximo: item_evaluacion?.puntaje_maximo,
        convocatorias_id: item_evaluacion?.convocatorias_id,
    })

    const submit = (e) => {
        e.preventDefault()

        method == 'POST'
            ? form.post(route('convocatorias.tipos-formulario-convocatoria.store-formulario-evaluacion', [convocatoria.id, tipo_formulario_convocatoria_id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.tipos-formulario-convocatoria.update-formulario-evaluacion', [convocatoria.id, tipo_formulario_convocatoria_id, item_evaluacion?.id]), {
                  onSuccess: () => setDialogStatus(false),

                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} ítem</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={8}>
                                <Grid item md={12}>
                                    <Textarea
                                        id="campo"
                                        label="Nombre o descripción del campo a evaluar"
                                        value={form.data.campo}
                                        onChange={(e) => form.setData('campo', e.target.value)}
                                        error={form.errors.campo}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="puntaje_maximo"
                                        name="puntaje_maximo"
                                        label="Puntaje máximo"
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={form.data.puntaje_maximo}
                                        onChange={(e) => form.setData('puntaje_maximo', e.target.value)}
                                        error={form.errors.puntaje_maximo}
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea id="criterio" label="Criterio" value={form.data.criterio} onChange={(e) => form.setData('criterio', e.target.value)} error={form.errors.criterio} />
                                </Grid>

                                <Grid item md={12}>
                                    <SelectMultiple
                                        id="convocatorias_id"
                                        bdValues={form.data.convocatorias_id}
                                        options={convocatorias}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                convocatorias_id: selected_values,
                                            }))
                                        }}
                                        error={form.errors.convocatorias_id}
                                        label="Seleccione las convocatorias"
                                        required
                                    />
                                    {form.data.convocatorias_id?.find((item) => item == convocatoria.id) == undefined && (
                                        <AlertMui severity="error">
                                            No ha seleccionado la convocatoria <strong className="uppercase">{convocatoria.descripcion + ' ' + convocatoria.year}</strong>
                                        </AlertMui>
                                    )}
                                </Grid>
                            </Grid>
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                {method == 'POST' ? 'Agregar' : 'Modificar'} ítem
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
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

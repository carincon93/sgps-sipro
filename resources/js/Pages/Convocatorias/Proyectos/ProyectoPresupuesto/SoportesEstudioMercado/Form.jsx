import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, proyecto_presupuesto, soporte, ...props }) => {
    const form = useForm({
        concepto: soporte?.concepto,
    })

    const submit = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.presupuesto.soportes.store', [convocatoria.id, proyecto.id, proyecto_presupuesto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.soportes.update', [convocatoria.id, proyecto.id, proyecto_presupuesto.id, soporte.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}></Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <TextInput
                                id="concepto"
                                label="Concepto / Nombre de la empresa"
                                type="text"
                                value={form.data.concepto}
                                onChange={(e) => form.setData('concepto', e.target.value)}
                                error={form.errors.concepto}
                                required
                            />
                        </fieldset>

                        {soporte && <small className="flex items-center my-14 text-app-700">{soporte.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'}
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
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

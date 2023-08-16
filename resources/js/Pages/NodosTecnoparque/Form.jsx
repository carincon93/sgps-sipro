import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, nodo_tecnoparque, centros_formacion, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: nodo_tecnoparque?.nombre,
        centro_formacion_id: nodo_tecnoparque?.centro_formacion_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('nodos-tecnoparque.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('nodos-tecnoparque.update', [nodo_tecnoparque.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} Nodo Tecnoparque</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    value={form.data.nombre}
                                    error={form.errors.nombre}
                                    label="Nombre del Nodo Tecnoparque"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="centro_formacion_id"
                                    options={centros_formacion}
                                    selectedValue={form.data.centro_formacion_id}
                                    onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                                    error={form.errors.centro_formacion_id}
                                    label="Centro de formación"
                                    required
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

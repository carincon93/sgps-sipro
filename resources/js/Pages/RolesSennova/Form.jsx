import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, rol_sennova, lineas_programaticas, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: rol_sennova?.nombre,
        linea_programatica_id: rol_sennova?.linea_programatica_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('roles-sennova.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('roles-sennova.update', [rol_sennova.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} rol SENNOVA</h1>
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
                                    label="Nombre del rol SENNOVA"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="linea_programatica_id"
                                    options={lineas_programaticas}
                                    selectedValue={form.data.linea_programatica_id}
                                    onChange={(event, newValue) => form.setData('linea_programatica_id', newValue.value)}
                                    error={form.errors.linea_programatica_id}
                                    label="¿Pertenece a alguna línea programática? Por favor seleccione a cuál"
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

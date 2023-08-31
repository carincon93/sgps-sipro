import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', is_super_admin, setDialogStatus, regional, regiones, directores_regionales, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: regional?.nombre,
        codigo: regional?.codigo,
        region_id: regional?.region_id,
        director_regional_id: regional?.director_regional_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('regionales.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('regionales.update', [regional.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} regional</h1>
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
                                    label="Nombre del centro de formación"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="codigo"
                                    type="number"
                                    value={form.data.codigo}
                                    error={form.errors.codigo}
                                    label="Código"
                                    onChange={(e) => form.setData('codigo', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="region_id"
                                    options={regiones}
                                    selectedValue={form.data.region_id}
                                    onChange={(event, newValue) => form.setData('region_id', newValue.value)}
                                    error={form.errors.region_id}
                                    label="Región"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="director_regional_id"
                                    options={directores_regionales}
                                    selectedValue={form.data.director_regional_id}
                                    onChange={(event, newValue) => form.setData('director_regional_id', newValue.value)}
                                    error={form.errors.director_regional_id}
                                    label="Director/a regional"
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

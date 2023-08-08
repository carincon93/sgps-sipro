import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, centro_formacion, regionales, subdirectores, dinamizadores_sennova, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: centro_formacion?.nombre,
        codigo: centro_formacion?.codigo,
        regional_id: centro_formacion?.regional_id,
        subdirector_id: centro_formacion?.subdirector_id,
        dinamizador_sennova_id: centro_formacion?.dinamizador_sennova_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('centros-formacion.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('centros-formacion.update', [centro_formacion.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} centro de formación</h1>
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
                                    id="regional_id"
                                    options={regionales}
                                    selectedValue={form.data.regional_id}
                                    onChange={(event, newValue) => form.setData('regional_id', newValue.value)}
                                    error={form.errors.regional_id}
                                    label="Regional"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="subdirector_id"
                                    options={subdirectores}
                                    selectedValue={form.data.subdirector_id}
                                    onChange={(event, newValue) => form.setData('subdirector_id', newValue.value)}
                                    error={form.errors.subdirector_id}
                                    label="Subdirector"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="dinamizador_sennova_id"
                                    options={dinamizadores_sennova}
                                    selectedValue={form.data.dinamizador_sennova_id}
                                    onChange={(event, newValue) => form.setData('dinamizador_sennova_id', newValue.value)}
                                    error={form.errors.dinamizador_sennova_id}
                                    label="Dinamizador/a SENNOVA"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <div className="py-4 flex items-center justify-end">
                            <PrimaryButton disabled={form.processing || !form.isDirty} type="submit">
                                Guardar cambios
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

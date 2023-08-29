import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, usuario, participacion_grupo_investigacion_sena, grupos_investigacion, semilleros_investigacion }) => {
    const form = useForm({
        user_id: usuario.id,
        pertenece_grupo_investigacion_centro: participacion_grupo_investigacion_sena?.pertenece_grupo_investigacion_centro == false ? '2' : '1',
        pertenece_semillero_investigacion_centro: participacion_grupo_investigacion_sena?.pertenece_semillero_investigacion_centro == false ? '2' : '1',
        grupo_investigacion_id: participacion_grupo_investigacion_sena?.grupo_investigacion_id,
        semillero_investigacion_id: participacion_grupo_investigacion_sena?.semillero_investigacion_id,
    })

    const submit = (e) => {
        e.preventDefault()

        method == 'POST'
            ? form.post(route('participaciones-grupos-investigacion-sena.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('participaciones-grupos-investigacion-sena.update', participacion_grupo_investigacion_sena.id), {
                  onSuccess: () => setDialogStatus(false),

                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} participación</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset className="p-8 space-y-10">
                            <Autocomplete
                                id="pertenece_grupo_investigacion_centro"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.pertenece_grupo_investigacion_centro}
                                error={form.errors.pertenece_grupo_investigacion_centro}
                                label="¿Actualmente pertenece al grupo de investigación de su centro?"
                                onChange={(event, newValue) => form.setData('pertenece_grupo_investigacion_centro', newValue.value)}
                                disabled={!usuario?.allowed?.to_update}
                                required
                            />

                            {form.data.pertenece_grupo_investigacion_centro == 1 && (
                                <Autocomplete
                                    id="grupo_investigacion_id"
                                    options={grupos_investigacion}
                                    selectedValue={form.data.grupo_investigacion_id}
                                    error={form.errors.grupo_investigacion_id}
                                    label="Grupo de investigación al que pertenece actualmente"
                                    onChange={(event, newValue) => form.setData('grupo_investigacion_id', newValue.value)}
                                    disabled={!usuario?.allowed?.to_update}
                                    required
                                />
                            )}

                            <Autocomplete
                                id="pertenece_semillero_investigacion_centro"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.pertenece_semillero_investigacion_centro}
                                error={form.errors.pertenece_semillero_investigacion_centro}
                                label="¿Actualmente pertenece al semillero de investigación de su centro?"
                                onChange={(event, newValue) => form.setData('pertenece_semillero_investigacion_centro', newValue.value)}
                                disabled={!usuario?.allowed?.to_update}
                                required
                            />

                            {form.data.pertenece_semillero_investigacion_centro == 1 && (
                                <Autocomplete
                                    id="semillero_investigacion_id"
                                    options={semilleros_investigacion}
                                    selectedValue={form.data.semillero_investigacion_id}
                                    error={form.errors.semillero_investigacion_id}
                                    label="Semillero de investigación al que pertenece actualmente"
                                    onChange={(event, newValue) => form.setData('semillero_investigacion_id', newValue.value)}
                                    disabled={!usuario?.allowed?.to_update}
                                    required
                                />
                            )}
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {participacion_grupo_investigacion_sena && <small className="flex items-center text-app-700">{participacion_grupo_investigacion_sena?.updated_at}</small>}
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Guardar
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

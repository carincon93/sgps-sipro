import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, tope_rol_sennova_formulario_16, centros_formacion, roles_sennova, ...props }) => {
    const form = useForm({
        centro_formacion_id: tope_rol_sennova_formulario_16?.centro_formacion_id,
        convocatoria_rol_sennova_id: tope_rol_sennova_formulario_16?.convocatoria_rol_sennova_id,
        cantidad_maxima: tope_rol_sennova_formulario_16?.cantidad_maxima,
        meses_maximos: tope_rol_sennova_formulario_16?.meses_maximos,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.topes-roles-sennova-formulario-16.store', [convocatoria.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.topes-roles-sennova-formulario-16.update', [convocatoria.id, tope_rol_sennova_formulario_16.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} tope</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={8}>
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

                                <Grid item md={12}>
                                    <Autocomplete
                                        id="convocatoria_rol_sennova_id"
                                        options={roles_sennova}
                                        selectedValue={form.data.convocatoria_rol_sennova_id}
                                        onChange={(event, newValue) => form.setData('convocatoria_rol_sennova_id', newValue.value)}
                                        error={form.errors.convocatoria_rol_sennova_id}
                                        label="Rol SENNOVA"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="cantidad_maxima"
                                        name="cantidad_maxima"
                                        label="Cantidad máxima"
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={form.data.cantidad_maxima}
                                        onChange={(e) => form.setData('cantidad_maxima', e.target.value)}
                                        error={form.errors.cantidad_maxima}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        type="number"
                                        id="meses_maximos"
                                        inputProps={{
                                            step: 0.1,
                                            min: 1,
                                            max: 12,
                                        }}
                                        value={form.data.meses_maximos}
                                        onChange={(e) => form.setData('meses_maximos', e.target.value)}
                                        label="Número máximo de meses de vinculación"
                                    />
                                </Grid>
                            </Grid>
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                {method == 'POST' ? 'Agregar' : 'Modificar'} tope
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

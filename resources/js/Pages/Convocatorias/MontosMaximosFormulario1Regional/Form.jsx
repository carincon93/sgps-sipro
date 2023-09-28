import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm, usePage } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, monto_maximo_por_regional, regionales, ...props }) => {
    const { props: page_props } = usePage()

    const form = useForm({
        regional_id: monto_maximo_por_regional?.regional_id,
        convocatoria_rol_sennova_id: monto_maximo_por_regional?.convocatoria_rol_sennova_id,
        monto_maximo: monto_maximo_por_regional?.monto_maximo,
        maximo_proyectos: monto_maximo_por_regional?.maximo_proyectos,
        tipo_formulario_convocatoria_id: page_props.ziggy.query.tipo_formulario_convocatoria_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.montos-maximos-formulario1-regional.store', [convocatoria.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.montos-maximos-formulario1-regional.update', [convocatoria.id, monto_maximo_por_regional.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} monto</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={8}>
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
                                    <TextInput
                                        id="monto_maximo"
                                        name="monto_maximo"
                                        label="Monto máximo"
                                        isCurrency={true}
                                        inputProps={{
                                            min: 0,
                                            prefix: '$',
                                        }}
                                        value={form.data.monto_maximo}
                                        onChange={(e) => form.setData('monto_maximo', e.target.value)}
                                        error={form.errors.monto_maximo}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="maximo_proyectos"
                                        name="maximo_proyectos"
                                        label="Cantidad máxima de proyectos"
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={form.data.maximo_proyectos}
                                        onChange={(e) => form.setData('maximo_proyectos', e.target.value)}
                                        error={form.errors.maximo_proyectos}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                {method == 'POST' ? 'Agregar' : 'Modificar'} monto
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

import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, tope_presupuestal_tecnoparque, nodos_tecnoparque, segundo_grupo_presupuestal, ...props }) => {
    const form = useForm({
        convocatoria_id: convocatoria?.id,
        nodo_tecnoparque_id: tope_presupuestal_tecnoparque?.nodo_tecnoparque_id,
        segundo_grupo_presupuestal_id: tope_presupuestal_tecnoparque?.segundo_grupo_presupuestal.map((item) => item.id),
        valor: tope_presupuestal_tecnoparque?.valor,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.topes-presupuestales-tecnoparque.store', [convocatoria.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.topes-presupuestales-tecnoparque.update', [convocatoria.id, tope_presupuestal_tecnoparque.id]), {
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
                                        id="nodo_tecnoparque_id"
                                        options={nodos_tecnoparque}
                                        selectedValue={form.data.nodo_tecnoparque_id}
                                        onChange={(event, newValue) => form.setData('nodo_tecnoparque_id', newValue.value)}
                                        error={form.errors.nodo_tecnoparque_id}
                                        label="Nodo Tecnoparque"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <SelectMultiple
                                        id="segundo_grupo_presupuestal_id"
                                        bdValues={form.data.segundo_grupo_presupuestal_id}
                                        options={segundo_grupo_presupuestal}
                                        onChange={(event, newValue) => {
                                            const selected_values = newValue.map((option) => option.value)
                                            form.setData((prevData) => ({
                                                ...prevData,
                                                segundo_grupo_presupuestal_id: selected_values,
                                            }))
                                        }}
                                        error={form.errors.segundo_grupo_presupuestal_id}
                                        label="Concepto interno SENA"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="valor"
                                        name="valor"
                                        label="Valor"
                                        isCurrency={true}
                                        inputProps={{
                                            min: 0,
                                            prefix: '$',
                                        }}
                                        value={form.data.valor}
                                        onChange={(e) => form.setData('valor', e.target.value)}
                                        error={form.errors.valor}
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

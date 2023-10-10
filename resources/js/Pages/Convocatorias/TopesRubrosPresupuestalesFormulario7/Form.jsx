import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import { useEffect } from 'react'

const Form = ({ method = '', setDialogStatus, convocatoria, tope_presupuestal_formulario_7, segundo_grupo_presupuestal, conceptos_internos_sena, ...props }) => {
    const form = useForm({
        convocatoria_id: convocatoria?.id,
        segundo_grupo_presupuestal_id: tope_presupuestal_formulario_7?.segundo_grupo_presupuestal_id,
        valor: tope_presupuestal_formulario_7?.valor,
        porcentaje: tope_presupuestal_formulario_7?.porcentaje,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.topes-presupuestales-formulario-7.store', [convocatoria.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.topes-presupuestales-formulario-7.update', [convocatoria.id, tope_presupuestal_formulario_7.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    useEffect(() => {
        if (form.data.valor > 0) {
            form.setData('porcentaje', null)
        }
    }, [form.data.valor])

    useEffect(() => {
        if (form.data.porcentaje > 0) {
            form.setData('valor', null)
        }
    }, [form.data.porcentaje])

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
                                    {method == 'POST' ? (
                                        <Autocomplete
                                            id="segundo_grupo_presupuestal_id"
                                            options={segundo_grupo_presupuestal}
                                            selectedValue={form.data.segundo_grupo_presupuestal_id}
                                            onChange={(event, newValue) => form.setData('segundo_grupo_presupuestal_id', newValue.value)}
                                            error={form.errors.segundo_grupo_presupuestal_id}
                                            label="Concepto interno SENA"
                                            required
                                        />
                                    ) : (
                                        <p className="first-letter:uppercase">{conceptos_internos_sena.find((item) => item.value == form.data.segundo_grupo_presupuestal_id)?.label}</p>
                                    )}
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="valor"
                                        name="valor"
                                        label="Valor ($)"
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

                                <Grid item md={12}>
                                    <TextInput
                                        id="porcentaje"
                                        name="porcentaje"
                                        label="Porcentaje (%)"
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            step: 0.1,
                                        }}
                                        value={form.data.porcentaje}
                                        onChange={(e) => form.setData('porcentaje', e.target.value)}
                                        error={form.errors.porcentaje}
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

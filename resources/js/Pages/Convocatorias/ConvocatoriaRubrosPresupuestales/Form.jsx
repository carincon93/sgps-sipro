import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'

import { router, useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, convocatoria_rubro_presupuestal, tipo_formulario_convocatoria_id, rubros_presupuestales, ...props }) => {
    const form = useForm({
        rubro_presupuestal_id: convocatoria_rubro_presupuestal?.rubro_presupuestal_id,
        tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id,
        habilitado: convocatoria_rubro_presupuestal?.habilitado,
        sumar_al_presupuesto: convocatoria_rubro_presupuestal?.sumar_al_presupuesto,
        requiere_estudio_mercado: convocatoria_rubro_presupuestal?.requiere_estudio_mercado,
        rubros_completos: false,
    })

    const submit = (e) => {
        e.preventDefault()

        if (form.data.rubros_completos) {
            router.post(
                route('convocatorias.convocatoria-rubros-presupuestales.store-rubros-completos', [convocatoria.id]),
                { rubros_completos: form.data.rubros_completos, tipo_formulario_convocatoria_id: form.data.tipo_formulario_convocatoria_id },
                {
                    onSuccess: () => setDialogStatus(false),
                    preserveScroll: true,
                },
            )
        }

        if (!form.data.rubros_completos) {
            method == 'POST'
                ? form.post(route('convocatorias.convocatoria-rubros-presupuestales.store', [convocatoria.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.convocatoria-rubros-presupuestales.update', [convocatoria.id, convocatoria_rubro_presupuestal.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} rubro presupuestal</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={6}>
                            <Grid item md={12}>
                                <Checkbox
                                    className="mb-4"
                                    name="rubros_completos"
                                    checked={form.data.rubros_completos}
                                    onChange={(e) => form.setData('rubros_completos', e.target.checked)}
                                    error={form.errors.rubros_completos}
                                    label="Agregar todos los rubros."
                                />
                            </Grid>
                            {!form.data.rubros_completos && (
                                <>
                                    <Grid item md={12}>
                                        {rubros_presupuestales.length > 0 ? (
                                            <Autocomplete
                                                id="rubro_presupuestal_id"
                                                options={rubros_presupuestales}
                                                selectedValue={form.data.rubro_presupuestal_id}
                                                onChange={(event, newValue) => form.setData('rubro_presupuestal_id', newValue.value)}
                                                error={form.errors.rubro_presupuestal_id}
                                                label="Rubros presupuestales"
                                                required
                                            />
                                        ) : (
                                            <AlertMui severity="error">Ya ha agregado todos los rubros presupuestales disponibles.</AlertMui>
                                        )}
                                    </Grid>
                                    <Grid item md={12}>
                                        <Label required value="¿Requiere de estudio de mercado?" labelFor="requiere_estudio_mercado" />
                                        <SwitchMui checked={form.data.requiere_estudio_mercado} onChange={(e) => form.setData('requiere_estudio_mercado', e.target.checked)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Label required value="¿El rol SENNOVA está habilitado?" labelFor="habilitado" />
                                        <SwitchMui checked={form.data.habilitado} onChange={(e) => form.setData('habilitado', e.target.checked)} />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Label required value="¿El rol SENNOVA suma al presupuesto del proyecto?" labelFor="sumar_al_presupuesto" />

                                        <SwitchMui checked={form.data.sumar_al_presupuesto} onChange={(e) => form.setData('sumar_al_presupuesto', e.target.checked)} />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            <PrimaryButton disabled={form.processing || rubros_presupuestales.length == 0 || !form.isDirty} className="mr-2 ml-auto" type="submit">
                                {method == 'POST' ? 'Agregar' : 'Modificar'} rubro presupuestal
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

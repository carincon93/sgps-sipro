import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, convocatoria_anexo, anexos, tipo_formulario_convocatoria_id, ...props }) => {
    const form = useForm({
        anexo_id: convocatoria_anexo?.anexo_id,
        tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id,
        habilitado: convocatoria_anexo?.habilitado,
        obligatorio: convocatoria_anexo?.obligatorio,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.convocatoria-anexos.store', [convocatoria.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.convocatoria-anexos.update', [convocatoria.id, convocatoria_anexo.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} anexo</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <div className="mt-8">
                                <Autocomplete
                                    id="anexo_id"
                                    options={anexos}
                                    selectedValue={form.data.anexo_id}
                                    onChange={(event, newValue) => form.setData('anexo_id', newValue.value)}
                                    error={form.errors.anexo_id}
                                    label="Anexos"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Label value="¿El anexo está habilitado?" labelFor="habilitado" />
                                <SwitchMui checked={form.data.habilitado} onChange={(e) => form.setData('habilitado', e.target.checked)} />
                            </div>

                            <div className="mt-8">
                                <Label value="¿El anexo es obligatorio?" labelFor="obligatorio" />

                                <SwitchMui checked={form.data.obligatorio} onChange={(e) => form.setData('obligatorio', e.target.checked)} />
                            </div>
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                {method == 'POST' ? 'Agregar' : 'Modificar'} anexo
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

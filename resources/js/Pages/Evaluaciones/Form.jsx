import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, evaluacion, evaluadores, proyectos, ...props }) => {
    const form = useForm({
        _method: method,
        habilitado: evaluacion?.habilitado,
        modificable: evaluacion?.modificable,
        finalizado: evaluacion?.finalizado,
        proyecto_id: evaluacion?.proyecto_id,
        user_id: evaluacion?.user_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('evaluaciones.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('evaluaciones.update', [evaluacion.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} evaluación</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={6}>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="user_id"
                                    options={evaluadores}
                                    selectedValue={form.data.user_id}
                                    onChange={(event, newValue) => form.setData('user_id', newValue.value)}
                                    error={form.errors.user_id}
                                    label="Evaluador/a"
                                    disabled={evaluacion?.clausula_confidencialidad}
                                    required
                                />
                                {evaluacion?.clausula_confidencialidad && (
                                    <AlertMui severity="error">
                                        No se puede modificar el evaluador debido a que la evaluación ya tiene información registrada. Por favor genere una nueva evaluación con el nuevo evaluador y
                                        posteriormente deshabilite esta evaluación.
                                    </AlertMui>
                                )}
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="proyecto_id"
                                    options={proyectos}
                                    selectedValue={form.data.proyecto_id}
                                    onChange={(event, newValue) => form.setData('proyecto_id', newValue.value)}
                                    error={form.errors.proyecto_id}
                                    label="Código SPGS del proyecto"
                                    disabled={evaluacion?.clausula_confidencialidad}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Checkbox
                                    name="habilitado"
                                    checked={form.data.habilitado}
                                    onChange={(e) => form.setData('habilitado', e.target.checked)}
                                    error={form.errors.habilitado}
                                    label="¿La evaluación está habilitada?"
                                />
                                <AlertMui>Nota: Una evaluación habilitada significa que el sistema la puede tomar para hacer el cálculo del promedio y asignar el estado del proyecto.</AlertMui>
                            </Grid>

                            <Grid item md={12}>
                                <Checkbox
                                    name="modificable"
                                    checked={form.data.modificable}
                                    onChange={(e) => form.setData('modificable', e.target.checked)}
                                    error={form.errors.modificable}
                                    label="¿La evaluación es modificable?"
                                />
                                <AlertMui>
                                    Nota: Si la evaluación es modificable el evaluador podrá editar la información de la evaluación. Por otro lado el formulador NO podrá modicar la información del
                                    proyecto mientras se está realizando una evaluación.
                                </AlertMui>
                            </Grid>

                            {!form.data.modificable && (
                                <Grid item md={12}>
                                    <Checkbox
                                        name="finalizado"
                                        checked={form.data.finalizado}
                                        onChange={(e) => form.setData('finalizado', e.target.checked)}
                                        error={form.errors.finalizado}
                                        label="¿La evaluación está finalizada?"
                                    />
                                </Grid>
                            )}
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

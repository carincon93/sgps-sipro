import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import FileInput from '@/Components/FileInput'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, proyecto, ods, proyectos, ...props }) => {
    const form = useForm({
        _method: method,
        radicado: proyecto?.radicado,
        modificable: proyecto?.modificable,
        finalizado: proyecto?.finalizado,
        formulacion_fuera_convocatoria: proyecto?.formulacion_fuera_convocatoria,
    })

    const submit = (e) => {
        e.preventDefault()
        form.put(route('proyectos.update.actualizar-estado-proyecto', [proyecto.id]), {
            onSuccess: () => setDialogStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Modificar estado del proyecto</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={6}>
                            <Grid item md={12}>
                                <Checkbox
                                    name="radicado"
                                    checked={form.data.radicado}
                                    onChange={(e) => form.setData('radicado', e.target.checked)}
                                    error={form.errors.radicado}
                                    label="¿El proyecto está radicado?"
                                />
                                <AlertMui>Nota: Un proyecto radicado es aquel que puede pasar a fase de evaluación.</AlertMui>
                            </Grid>

                            <Grid item md={12}>
                                <Checkbox
                                    name="modificable"
                                    checked={form.data.modificable}
                                    onChange={(e) => form.setData('modificable', e.target.checked)}
                                    error={form.errors.modificable}
                                    label="¿El proyecto es modificable?"
                                />
                                <AlertMui>
                                    Nota: Si el proyecto es modificable el formulador podrá editar la información previamente cargada. Se recomienda revisar que no hayan evaluaciones en curso para no
                                    causar discrepancias en el proceso.
                                </AlertMui>
                            </Grid>

                            <Grid item md={12}>
                                <Checkbox
                                    name="formulacion_fuera_convocatoria"
                                    checked={form.data.formulacion_fuera_convocatoria}
                                    onChange={(e) => form.setData('formulacion_fuera_convocatoria', e.target.checked)}
                                    error={form.errors.formulacion_fuera_convocatoria}
                                    label="¿El proyecto se está formulando por fuera de las fechas de la convocatoria oficial?"
                                />

                                <AlertMui>Nota: Habilita el proyecto para que el formulador pueda seguir cargando información aún si la convocatoria oficial ha sido finalizada.</AlertMui>
                            </Grid>

                            {!form.data.modificable && !form.data.formulacion_fuera_convocatoria && (
                                <Grid item md={12}>
                                    <Checkbox
                                        name="finalizado"
                                        checked={form.data.finalizado}
                                        onChange={(e) => form.setData('finalizado', e.target.checked)}
                                        error={form.errors.finalizado}
                                        label="¿El proyecto está finalizado por el proponente?"
                                    />
                                    {proyecto.finalizado_en_primera_fase && (
                                        <span className="block text-xs bg-slate-400 p-2 text-white mb-4">✅ El proyecto ha sido finalizado en primera fase (Formulación)</span>
                                    )}

                                    {proyecto.finalizado_en_subsanación && <span className="block text-xs bg-slate-400 p-2 text-white">✅ El proyecto ha sido finalizado en fase de subsanación</span>}
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

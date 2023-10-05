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
        imagen: '',
        nuevo_titulo: proyecto?.nuevo_titulo,
        video: proyecto?.video,
        ods: proyecto?.ods,
    })

    const submit = (e) => {
        e.preventDefault()
        form.post(route('proyectos.update', [proyecto.id]), {
            onSuccess: () => setDialogStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Modificar información del proyecto</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={6}>
                            <Grid item md={12}>
                                <Label required labelFor="nuevo_titulo" value="Nombre del proyecto" />

                                <Textarea id="nuevo_titulo" value={form.data.nuevo_titulo} onChange={(e) => form.setData('nuevo_titulo', e.target.value)} required />
                                <AlertMui className="mb-4">Utilice este campo para asignar un nombre "comercial" o llamativo a su proyecto</AlertMui>
                            </Grid>
                            <Grid item md={12}>
                                <SelectMultiple
                                    id="ods"
                                    bdValues={form.data.ods}
                                    options={ods}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            ods: selected_values,
                                        }))
                                    }}
                                    error={form.errors.ods}
                                    label="Seleccione uno o varios ODS"
                                    required
                                />
                                <AlertMui>
                                    Aquí podra seleccionar uno o mas objetivos de desarrollo sostenible asociados con el proyecto SGPS. Esto apuntará a destacar la contribución de su proyecto a los
                                    objetivos globales de sostenibilidad.{' '}
                                    <a
                                        className="underline"
                                        href="https://nam10.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.un.org%2Fsustainabledevelopment%2Fes%2Fobjetivos-de-desarrollo-sostenible%2F&data=05%7C01%7Cccvasquez%40sena.edu.co%7C7168b0f08eab4d96fdff08dbb60205bf%7Ccbc2c3812f2e4d9391d1506c9316ace7%7C0%7C0%7C638303892043633838%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=LyXn%2B9vskVi%2BoyiNe3lQiWjycr%2BbxWgwfbwCGe4xWCk%3D&reserved=0"
                                        target="_blank">
                                        Más información haciendo clic aquí.
                                    </a>
                                </AlertMui>
                            </Grid>

                            {/* <Grid item md={12}>
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

                            <Grid item md={12}>
                                <Checkbox
                                    name="finalizado"
                                    checked={form.data.finalizado}
                                    onChange={(e) => form.setData('finalizado', e.target.checked)}
                                    error={form.errors.finalizado}
                                    label="¿La evaluación está finalizada?"
                                />
                            </Grid> */}
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

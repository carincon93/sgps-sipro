import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Checkbox from '@/Components/Checkbox'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, programa_formacion, modalidades, niveles_formacion, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: programa_formacion?.nombre,
        codigo: programa_formacion?.codigo,
        modalidad: programa_formacion?.modalidad,
        nivel_formacion: programa_formacion?.nivel_formacion,
        registro_calificado: programa_formacion?.registro_calificado,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('programas-formacion.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('programas-formacion.update', [programa_formacion.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} programa de formación</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    value={form.data.nombre}
                                    error={form.errors.nombre}
                                    label="Nombre del programa de formación"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="codigo"
                                    type="number"
                                    value={form.data.codigo}
                                    error={form.errors.codigo}
                                    label="Código"
                                    onChange={(e) => form.setData('codigo', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="modalidad"
                                    options={modalidades}
                                    selectedValue={form.data.modalidad}
                                    onChange={(event, newValue) => form.setData('modalidad', newValue.value)}
                                    error={form.errors.modalidad}
                                    label="Modalidad de estudio"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="nivel_formacion"
                                    options={niveles_formacion}
                                    selectedValue={form.data.nivel_formacion}
                                    onChange={(event, newValue) => form.setData('nivel_formacion', newValue.value)}
                                    error={form.errors.nivel_formacion}
                                    label="Nivel de formación"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <AlertMui>
                                    ¿El programa de formación cuenta con registro calificado?
                                    <Checkbox
                                        className="mt-8"
                                        name="registro_calificado"
                                        checked={form.data.registro_calificado}
                                        onChange={(e) => form.setData('registro_calificado', e.target.checked)}
                                        error={form.errors.registro_calificado}
                                        label="Habilite esta casilla si el programa cuenta con registro calificado"
                                    />
                                </AlertMui>
                            </Grid>
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

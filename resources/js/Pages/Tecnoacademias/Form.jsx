import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, tecnoacademia, modalidades, centros_formacion, lineas_tecnoacademia, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: tecnoacademia?.nombre,
        modalidad: tecnoacademia?.modalidad,
        centro_formacion_id: tecnoacademia?.centro_formacion_id,
        linea_tecnoacademia_id: tecnoacademia?.lineas_tecnoacademia.map((item) => item.id),
        fecha_creacion: tecnoacademia?.fecha_creacion,
        foco: tecnoacademia?.foco,
    })

    console.log(tecnoacademia)

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('tecnoacademias.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('tecnoacademias.update', [tecnoacademia.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} TecnoAcademia</h1>
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
                                    label="Nombre de la TecnoAcademia"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="centro_formacion_id"
                                    options={centros_formacion}
                                    selectedValue={form.data.centro_formacion_id}
                                    onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                                    error={form.errors.centro_formacion_id}
                                    label="Centro de formación"
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="modalidad"
                                    options={modalidades}
                                    selectedValue={form.data.modalidad}
                                    onChange={(event, newValue) => form.setData('modalidad', newValue.value)}
                                    error={form.errors.modalidad}
                                    label="Modalidad"
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="fecha_creacion" value="Fecha creación" />
                                <DatePicker
                                    id="fecha_creacion"
                                    className="block w-full p-4"
                                    value={form.data.fecha_creacion}
                                    onChange={(e) => form.setData('fecha_creacion', e.target.value)}
                                    error={form.errors.fecha_creacion}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <SelectMultiple
                                    id="linea_tecnoacademia_id"
                                    bdValues={form.data.linea_tecnoacademia_id}
                                    options={lineas_tecnoacademia}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            linea_tecnoacademia_id: selected_values,
                                        }))
                                    }}
                                    error={form.errors.linea_tecnoacademia_id}
                                    label="Seleccione las líneas tecnológicas"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Textarea id="foco" label="Foco" value={form.data.foco} onChange={(e) => form.setData('foco', e.target.value)} error={form.errors.foco} required />
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

import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, presupuesto, edt, tiposEvento, ...props }) => {
    const form = useForm({
        nombre_evento: edt?.nombre_evento ?? '',
        tipo_evento: edt?.tipo_evento ?? '',
        descripcion_evento: edt?.descripcion_evento ?? '',
        descripcion_participacion_entidad: edt?.descripcion_participacion_entidad ?? '',
        publico_objetivo: edt?.publico_objetivo ?? '',
        numero_asistentes: edt?.numero_asistentes ?? '',
        estrategia_comunicacion: edt?.estrategia_comunicacion ?? '',
        organizador: edt?.organizador ?? '',
        fecha_evento: edt?.fecha_evento ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.presupuesto.edt.store', [convocatoria.id, proyecto.id, presupuesto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.edt.update', [convocatoria.id, proyecto.id, presupuesto.id, edt.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} EDT</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <div>
                                <TextInput
                                    id="nombre_evento"
                                    type="text"
                                    error={form.errors.nombre_evento}
                                    value={form.data.nombre_evento}
                                    onChange={(e) => form.setData('nombre_evento', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Nombre del evento"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="organizador"
                                    type="text"
                                    error={form.errors.organizador}
                                    value={form.data.organizador}
                                    onChange={(e) => form.setData('organizador', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Organizador"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Label required className="mb-4" labelFor="fecha_evento" value="Fecha probable del evento" />

                                <DatePicker
                                    id="fecha_evento"
                                    className="w-full"
                                    value={form.data.fecha_evento}
                                    onChange={(e) => form.setData('fecha_evento', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    error={form.errors.fecha_evento}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo_evento"
                                    options={tiposEvento}
                                    selectedValue={form.data.tipo_evento}
                                    onChange={(event, newValue) => form.setData('tipo_evento', newValue.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    error={form.errors.tipo_evento}
                                    label="Tipo de evento"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="descripcion_evento"
                                    error={form.errors.descripcion_evento}
                                    value={form.data.descripcion_evento}
                                    onChange={(e) => form.setData('descripcion_evento', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Descripción del evento"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="descripcion_participacion_entidad"
                                    error={form.errors.descripcion_participacion_entidad}
                                    value={form.data.descripcion_participacion_entidad}
                                    onChange={(e) => form.setData('descripcion_participacion_entidad', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Descripción de participación de la entidad"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="publico_objetivo"
                                    type="text"
                                    error={form.errors.publico_objetivo}
                                    value={form.data.publico_objetivo}
                                    onChange={(e) => form.setData('publico_objetivo', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Público objetivo"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="numero_asistentes"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    error={form.errors.numero_asistentes}
                                    value={form.data.numero_asistentes}
                                    onChange={(e) => form.setData('numero_asistentes', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Número de asistentes"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="estrategia_comunicacion"
                                    type="text"
                                    error={form.errors.estrategia_comunicacion}
                                    value={form.data.estrategia_comunicacion}
                                    onChange={(e) => form.setData('estrategia_comunicacion', e.target.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    label="Estrategia de comunicación"
                                    required
                                />
                            </div>
                        </fieldset>

                        {edt && <small className="flex items-center mt-14 text-app-700">{edt.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4 ">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} EDT
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
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

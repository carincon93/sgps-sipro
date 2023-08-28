import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const FormSoftwareInfo = ({ is_super_admin, method = '', setDialogStatus, convocatoria, proyecto, rubro_presupuestal, tipos_licencia, tipos_software }) => {
    const form = useForm({
        tipo_software: rubro_presupuestal?.software_info?.tipo_software ?? '',
        tipo_licencia: rubro_presupuestal?.software_info?.tipo_licencia ?? '',
        fecha_inicio: rubro_presupuestal?.software_info?.fecha_inicio ?? '',
        fecha_finalizacion: rubro_presupuestal?.software_info?.fecha_finalizacion ?? '',
    })

    const submit = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.presupuesto.software-info', [convocatoria.id, proyecto.id, rubro_presupuestal.id]), {
                onSuccess: () => setDialogStatus(false),
                preserveScroll: true,
            })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Información del software</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset>
                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo_licencia"
                                    options={tipos_licencia}
                                    label="Tipo de licencia"
                                    selectedValue={form.data.tipo_licencia}
                                    onChange={(e, newValue) => form.setData('tipo_licencia', newValue.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    error={form.errors.tipo_licencia}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo_software"
                                    options={tipos_software}
                                    label="Tipo de software"
                                    selectedValue={form.data.tipo_software}
                                    onChange={(e, newValue) => form.setData('tipo_software', newValue.value)}
                                    disabled={!proyecto?.allowed?.to_update}
                                    error={form.errors.tipo_software}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <h1 className="font-black">Periodo de uso</h1>
                                <div className="mt-8 flex justify-between">
                                    <Label required className="mb-4" labelFor="fecha_inicio" value="Fecha de inicio" />
                                    <DatePicker
                                        label="Fecha de inicio"
                                        id="fecha_inicio"
                                        type="date"
                                        className="mt-1 p-4"
                                        value={form.data.fecha_inicio}
                                        error={form.errors.fecha_inicio}
                                        onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        required
                                    />
                                </div>
                                <div className="mt-8 flex justify-between">
                                    <Label className="mb-4" labelFor="fecha_finalizacion" value="Fecha de finalización (Cuando aplique)" />
                                    <DatePicker
                                        label="Fecha de finalización"
                                        id="fecha_finalizacion"
                                        type="date"
                                        className="mt-1 p-4"
                                        value={form.data.fecha_finalizacion}
                                        error={form.errors.fecha_finalizacion}
                                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {rubro_presupuestal && <small className="flex items-center mt-14 text-app-700">{rubro_presupuestal.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} información del software
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

export default FormSoftwareInfo

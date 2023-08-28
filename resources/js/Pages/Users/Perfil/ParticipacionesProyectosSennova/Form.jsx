import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, user_id, participacion_proyecto_sennova, tipos_proyectos }) => {
    const form = useForm({
        user_id: user_id,
        ha_formulado_proyectos_sennova: participacion_proyecto_sennova?.ha_formulado_proyectos_sennova == false ? '2' : '1',
        tipo_proyecto: participacion_proyecto_sennova?.tipo_proyecto,
        codigo_proyecto: participacion_proyecto_sennova?.codigo_proyecto,
        titulo: participacion_proyecto_sennova?.titulo,
        fecha_inicio_proyecto: participacion_proyecto_sennova?.fecha_inicio_proyecto,
        fecha_finalizacion_proyecto: participacion_proyecto_sennova?.fecha_finalizacion_proyecto,
    })

    const submit = (e) => {
        e.preventDefault()

        method == 'POST'
            ? form.post(route('participaciones-proyectos-sennova.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('participaciones-proyectos-sennova.update', [participacion_proyecto_sennova.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} participación en proyectos SENNOVA</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset className="p-8 space-y-10">
                            <Autocomplete
                                id="ha_formulado_proyectos_sennova"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.ha_formulado_proyectos_sennova}
                                error={form.errors.ha_formulado_proyectos_sennova}
                                label="¿Ha formulado proyectos SENNOVA?"
                                onChange={(event, newValue) => form.setData('ha_formulado_proyectos_sennova', newValue.value)}
                                disabled={!usuario?.allowed?.to_update}
                                required
                            />

                            {form.data.ha_formulado_proyectos_sennova == 1 && (
                                <>
                                    <Autocomplete
                                        id="tipo_proyecto"
                                        options={tipos_proyectos}
                                        selectedValue={form.data.tipo_proyecto}
                                        error={form.errors.tipo_proyecto}
                                        label="Tipo de proyecto"
                                        onChange={(event, newValue) => form.setData('tipo_proyecto', newValue.value)}
                                        disabled={!usuario?.allowed?.to_update}
                                        required
                                    />

                                    <TextInput
                                        label="Código del proyecto"
                                        id="codigo_proyecto"
                                        type="text"
                                        value={form.data.codigo_proyecto}
                                        onChange={(e) => form.setData('codigo_proyecto', e.target.value)}
                                        disabled={!usuario?.allowed?.to_update}
                                        error={form.errors.codigo_proyecto}
                                        required
                                    />

                                    <TextInput
                                        label="Título"
                                        id="titulo"
                                        type="text"
                                        value={form.data.titulo}
                                        onChange={(e) => form.setData('titulo', e.target.value)}
                                        disabled={!usuario?.allowed?.to_update}
                                        error={form.errors.titulo}
                                        required
                                    />

                                    <DatePicker
                                        variant="outlined"
                                        id="fecha_inicio_proyecto"
                                        name="fecha_inicio_proyecto"
                                        value={form.data.fecha_inicio_proyecto}
                                        className="p-4 w-full"
                                        onChange={(e) => form.setData('fecha_inicio_proyecto', e.target.value)}
                                        disabled={!usuario?.allowed?.to_update}
                                        error={form.errors.fecha_inicio_proyecto}
                                        label="Fecha de inicio del proyecto"
                                        required
                                    />

                                    <DatePicker
                                        variant="outlined"
                                        id="fecha_finalizacion_proyecto"
                                        name="fecha_finalizacion_proyecto"
                                        value={form.data.fecha_finalizacion_proyecto}
                                        className="p-4 w-full"
                                        onChange={(e) => form.setData('fecha_finalizacion_proyecto', e.target.value)}
                                        disabled={!usuario?.allowed?.to_update}
                                        error={form.errors.fecha_finalizacion_proyecto}
                                        label="Fecha de finalización del proyecto"
                                        required
                                    />
                                </>
                            )}
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {participacion_proyecto_sennova && <small className="flex items-center text-app-700">{participacion_proyecto_sennova?.updated_at}</small>}
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Guardar
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

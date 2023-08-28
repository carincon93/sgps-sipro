import ButtonMui from '@/Components/Button'
import FileInput from '@/Components/FileInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, aula_movil }) => {
    const form = useForm({
        _method: method,
        id: aula_movil?.id ?? '',
        placa: aula_movil?.placa ?? '',
        modelo: aula_movil?.modelo ?? '',
        logros_vigencia: aula_movil?.logros_vigencia ?? '',
        numero_municipios_visitados: aula_movil?.numero_municipios_visitados ?? '',
        numero_aprendices_beneficiados: aula_movil?.numero_aprendices_beneficiados ?? '',
        estado: aula_movil?.estado ?? '',
        modulos_interactivos: aula_movil?.modulos_interactivos ?? '',
        acciones_a_desarrollar: aula_movil?.acciones_a_desarrollar ?? '',
        numero_aprendices_a_beneficiar: aula_movil?.numero_aprendices_a_beneficiar ?? '',
        recursos_mantenimiento: aula_movil?.recursos_mantenimiento ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.post(route('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.update', [convocatoria.id, proyecto.id, aula_movil.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Aula móvil</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset>
                            <Grid container rowSpacing={8}>
                                <Grid item md={12}>
                                    <TextInput
                                        id="placa"
                                        type="text"
                                        onChange={(e) => form.setData('placa', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.placa}
                                        value={form.data.placa}
                                        label="Placa del vehículo"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="modelo"
                                        type="number"
                                        onChange={(e) => form.setData('modelo', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.modelo}
                                        inputProps={{ min: 0 }}
                                        value={form.data.modelo}
                                        label="Modelo del vehículo"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        id="logros_vigencia"
                                        onChange={(e) => form.setData('logros_vigencia', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.logros_vigencia}
                                        value={form.data.logros_vigencia}
                                        label="Acciones desarrolladas y logros en la vigencia actual con el Aula Móvil"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="numero_municipios_visitados"
                                        type="number"
                                        onChange={(e) => form.setData('numero_municipios_visitados', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.numero_municipios_visitados}
                                        inputProps={{ min: 0 }}
                                        value={form.data.numero_municipios_visitados}
                                        label="Número de municipios visitados en la vigencia actual"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="numero_aprendices_beneficiados"
                                        type="number"
                                        onChange={(e) => form.setData('numero_aprendices_beneficiados', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.numero_aprendices_beneficiados}
                                        inputProps={{ min: 0 }}
                                        value={form.data.numero_aprendices_beneficiados}
                                        label={`Número de aprendices beneficiados por el Aula Móvil en la vigencia ${convocatoria.year - 1}`}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="estado"
                                        type="text"
                                        onChange={(e) => form.setData('estado', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.estado}
                                        value={form.data.estado}
                                        label="Estado actual (mecánico) del Aula Móvil"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        id="modulos_interactivos"
                                        onChange={(e) => form.setData('modulos_interactivos', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.modulos_interactivos}
                                        value={form.data.modulos_interactivos}
                                        label="Módulos interactivos en el Aula Móvil"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        id="acciones_a_desarrollar"
                                        onChange={(e) => form.setData('acciones_a_desarrollar', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.acciones_a_desarrollar}
                                        value={form.data.acciones_a_desarrollar}
                                        label={`Acciones que espera desarrollar con el Aula Móvole en la vigencia ${convocatoria.year}`}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        id="numero_aprendices_a_beneficiar"
                                        type="number"
                                        onChange={(e) => form.setData('numero_aprendices_a_beneficiar', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.numero_aprendices_a_beneficiar}
                                        inputProps={{ min: 0 }}
                                        value={form.data.numero_aprendices_a_beneficiar}
                                        label={`Número de aprendices a beneficiar en la vigencia ${convocatoria.year}`}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        id="recursos_mantenimiento"
                                        onChange={(e) => form.setData('recursos_mantenimiento', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.recursos_mantenimiento}
                                        value={form.data.recursos_mantenimiento}
                                        label={`Requerimientos de recursos de Mantenimiento para la vigencia ${convocatoria.year}`}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </fieldset>

                        {aula_movil && <small className="flex items-center mt-14 text-app-700">{aula_movil.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} aula móvil
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

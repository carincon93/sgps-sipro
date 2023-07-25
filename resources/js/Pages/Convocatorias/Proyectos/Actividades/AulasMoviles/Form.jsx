import ButtonMui from '@/Components/Button'
import FileInput from '@/Components/FileInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, aulaMovil }) => {
    const form = useForm({
        id: aulaMovil?.id ?? '',
        placa: aulaMovil?.placa ?? '',
        modelo: aulaMovil?.modelo ?? '',
        logros_vigencia: aulaMovil?.logros_vigencia ?? '',
        numero_municipios_visitados: aulaMovil?.numero_municipios_visitados ?? '',
        numero_aprendices_beneficiados: aulaMovil?.numero_aprendices_beneficiados ?? '',
        estado: aulaMovil?.estado ?? '',
        modulos_interactivos: aulaMovil?.modulos_interactivos ?? '',
        acciones_a_desarrollar: aulaMovil?.acciones_a_desarrollar ?? '',
        numero_aprendices_a_beneficiar: aulaMovil?.numero_aprendices_a_beneficiar ?? '',
        recursos_mantenimiento: aulaMovil?.recursos_mantenimiento ?? '',
        soat: null,
        tecnicomecanica: null,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.ta.aulas-moviles.store', [convocatoria.id, proyecto.id]), {
                      preserveScroll: true,
                  })
                : form.post(route('convocatorias.ta.aulas-moviles.store', [convocatoria.id, proyecto.id, aulaMovil.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    console.log(aulaMovil?.filename.tecnicomecanicaFilename)

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">Aula móvil</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <TextInput
                                    id="placa"
                                    type="text"
                                    onChange={(e) => form.setData('placa', e.target.value)}
                                    error={form.errors.placa}
                                    value={form.data.placa}
                                    label="Placa del vehículo"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="modelo"
                                    type="number"
                                    onChange={(e) => form.setData('modelo', e.target.value)}
                                    error={form.errors.modelo}
                                    inputProps={{ min: 0 }}
                                    value={form.data.modelo}
                                    label="Modelo del vehículo"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="logros_vigencia"
                                    onChange={(e) => form.setData('logros_vigencia', e.target.value)}
                                    error={form.errors.logros_vigencia}
                                    value={form.data.logros_vigencia}
                                    label="Acciones desarrolladas y logros en la vigencia actual con el Aula Móvil"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="numero_municipios_visitados"
                                    type="number"
                                    onChange={(e) => form.setData('numero_municipios_visitados', e.target.value)}
                                    error={form.errors.numero_municipios_visitados}
                                    inputProps={{ min: 0 }}
                                    value={form.data.numero_municipios_visitados}
                                    label="Número de municipios visitados en la vigencia actual"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="numero_aprendices_beneficiados"
                                    type="number"
                                    onChange={(e) => form.setData('numero_aprendices_beneficiados', e.target.value)}
                                    error={form.errors.numero_aprendices_beneficiados}
                                    inputProps={{ min: 0 }}
                                    value={form.data.numero_aprendices_beneficiados}
                                    label={`Número de aprendices beneficiados por el Aula Móvil en la vigencia ${convocatoria.year - 1}`}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="estado"
                                    type="text"
                                    onChange={(e) => form.setData('estado', e.target.value)}
                                    error={form.errors.estado}
                                    value={form.data.estado}
                                    label="Estado actual (mecánico) del Aula Móvil"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="modulos_interactivos"
                                    onChange={(e) => form.setData('modulos_interactivos', e.target.value)}
                                    error={form.errors.modulos_interactivos}
                                    value={form.data.modulos_interactivos}
                                    label="Módulos interactivos en el Aula Móvil"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="acciones_a_desarrollar"
                                    onChange={(e) => form.setData('acciones_a_desarrollar', e.target.value)}
                                    error={form.errors.acciones_a_desarrollar}
                                    value={form.data.acciones_a_desarrollar}
                                    label={`Acciones que espera desarrollar con el Aula Móvole en la vigencia ${convocatoria.year}`}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput
                                    id="numero_aprendices_a_beneficiar"
                                    type="number"
                                    onChange={(e) => form.setData('numero_aprendices_a_beneficiar', e.target.value)}
                                    error={form.errors.numero_aprendices_a_beneficiar}
                                    inputProps={{ min: 0 }}
                                    value={form.data.numero_aprendices_a_beneficiar}
                                    label={`Número de aprendices a beneficiar en la vigencia ${convocatoria.year}`}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    id="recursos_mantenimiento"
                                    onChange={(e) => form.setData('recursos_mantenimiento', e.target.value)}
                                    error={form.errors.recursos_mantenimiento}
                                    value={form.data.recursos_mantenimiento}
                                    label={`Requerimientos de recursos de Mantenimiento para la vigencia ${convocatoria.year}`}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <FileInput
                                    id="soat"
                                    value={form.data.soat}
                                    filename={aulaMovil?.filename.soatFilename}
                                    extension={aulaMovil?.extension.soatExtension}
                                    label="Seleccione el SOAT"
                                    accept="application/pdf"
                                    downloadRoute={
                                        aulaMovil
                                            ? aulaMovil?.soat.includes('http') == true || aulaMovil?.soat.includes('http') == undefined
                                                ? null
                                                : route('convocatorias.ta.aulas-moviles.download-file-sharepoint', [convocatoria.id, proyecto.id, aulaMovil.id, 'soat'])
                                            : null
                                    }
                                    onChange={(e) => form.setData('soat', e.target.files[0])}
                                    error={form.errors.soat}
                                />
                            </div>

                            <div className="mt-8">
                                <FileInput
                                    id="tecnicomecanica"
                                    value={form.data.tecnicomecanica}
                                    filename={aulaMovil?.filename.tecnicomecanicaFilename}
                                    extension={aulaMovil?.extension.tecnicomecanicaExtension}
                                    label="Seleccione la tecnicomecánica"
                                    accept="application/pdf"
                                    downloadRoute={
                                        aulaMovil?.tecnicomecanica
                                            ? aulaMovil?.tecnicomecanica?.includes('http')
                                                ? null
                                                : route('convocatorias.ta.aulas-moviles.download-file-sharepoint', [convocatoria, proyecto, aulaMovil.id, 'tecnicomecánica'])
                                            : null
                                    }
                                    onChange={(e) => form.setData('tecnicomecanica', e.target.files[0])}
                                    error={form.errors.tecnicomecanica}
                                />
                            </div>
                        </fieldset>

                        {aulaMovil && <small className="flex items-center mt-14 text-app-700">{aulaMovil.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} aula móvil
                                    </PrimaryButton>
                                    <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
                                        Cancelar
                                    </ButtonMui>
                                </>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form

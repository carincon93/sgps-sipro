import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import FileInput from '@/Components/FileInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, user_id, formacion_academica_sena, modalidades_estudio, niveles_formacion }) => {
    const form = useForm({
        user_id: user_id,
        egresado_sena: formacion_academica_sena?.egresado_sena == false ? '2' : '1',
        modalidad_sena: formacion_academica_sena?.modalidad_sena ?? '',
        nivel_sena: formacion_academica_sena?.nivel_sena ?? '',
        titulo_obtenido: formacion_academica_sena?.titulo_obtenido ?? '',
        fecha_inicio_formacion: formacion_academica_sena?.fecha_inicio_formacion ?? '',
        fecha_finalizacion_formacion: formacion_academica_sena?.fecha_finalizacion_formacion ?? '',
        certificado_formacion: null,
    })

    const submit = (e) => {
        e.preventDefault()

        method == 'crear'
            ? form.post(route('formaciones-academicas-sena.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('formaciones-academicas-sena.update', formacion_academica_sena.id), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'crear' ? 'Agregar' : 'Modificar'} formación académica SENA</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset className="p-8 space-y-10">
                            <Autocomplete
                                id="egresado_sena"
                                options={[
                                    { value: 1, label: 'Si' },
                                    { value: 2, label: 'No' },
                                ]}
                                selectedValue={form.data.egresado_sena}
                                error={form.errors.egresado_sena}
                                label="¿Es egresado SENA?"
                                onChange={(event, newValue) => form.setData('egresado_sena', newValue.value)}
                                required
                            />

                            <Autocomplete
                                id="modalidad_sena"
                                options={modalidades_estudio}
                                selectedValue={form.data.modalidad_sena}
                                error={form.errors.modalidad_sena}
                                label="Modalidad SENA"
                                onChange={(event, newValue) => form.setData('modalidad_sena', newValue.value)}
                                required
                            />

                            <Autocomplete
                                id="nivel_sena"
                                options={niveles_formacion}
                                selectedValue={form.data.nivel_sena}
                                error={form.errors.nivel_sena}
                                label="Nivel SENA"
                                onChange={(event, newValue) => form.setData('nivel_sena', newValue.value)}
                                required
                            />

                            <TextInput
                                label="Título obtenido"
                                id="titulo_obtenido"
                                type="text"
                                value={form.data.titulo_obtenido}
                                onChange={(e) => form.setData('titulo_obtenido', e.target.value)}
                                error={form.errors.titulo_obtenido}
                                required
                            />

                            <DatePicker
                                variant="outlined"
                                id="fecha_inicio_formacion"
                                name="fecha_inicio_formacion"
                                value={form.data.fecha_inicio_formacion}
                                className="p-4 w-full"
                                onChange={(e) => form.setData('fecha_inicio_formacion', e.target.value)}
                                error={form.errors.fecha_inicio_formacion}
                                label="Fecha de inicio de la formación"
                                required
                            />

                            <DatePicker
                                variant="outlined"
                                id="fecha_finalizacion_formacion"
                                name="fecha_finalizacion_formacion"
                                value={form.data.fecha_finalizacion_formacion}
                                className="p-4 w-full"
                                onChange={(e) => form.setData('fecha_finalizacion_formacion', e.target.value)}
                                error={form.errors.fecha_finalizacion_formacion}
                                label="Fecha de finalización de la formación"
                                required
                            />

                            <FileInput
                                id="certificado_formacion"
                                value={form.data.certificado_formacion}
                                filename={formacion_academica_sena?.filename}
                                extension={formacion_academica_sena?.extension}
                                label="Seleccione certificado"
                                accept="application/pdf"
                                downloadRoute={
                                    formacion_academica_sena?.certificado_formacion
                                        ? formacion_academica_sena?.certificado_formacion?.includes('http')
                                            ? null
                                            : route('formaciones-academicas-sena.download-file-sharepoint', [formacion_academica_sena.id, 'certificado_formacion'])
                                        : null
                                }
                                onChange={(e) => form.setData('certificado_formacion', e.target.files[0])}
                                error={form.errors.certificado_formacion}
                            />
                        </fieldset>

                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {formacion_academica_sena && <small className="flex items-center text-app-700">{formacion_academica_sena?.updated_at}</small>}
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

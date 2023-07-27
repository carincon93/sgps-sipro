import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import FileInput from '@/Components/FileInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, user_id, estudio_academico, niveles_academicos }) => {
    const form = useForm({
        user_id: user_id,
        grado_formacion: estudio_academico?.grado_formacion ?? null,
        titulo_obtenido: estudio_academico?.titulo_obtenido ?? '',
        soporte_titulo_obtenido: null,
    })

    const submit = (e) => {
        e.preventDefault()

        method == 'crear'
            ? form.post(route('estudios-academicos.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.put(route('estudios-academicos.update', [estudio_academico.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">{method == 'crear' ? 'Añadir' : 'Modificar'} estudio académico</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset className="p-8 space-y-10">
                            <Autocomplete
                                id="grado_formacion"
                                options={niveles_academicos}
                                selectedValue={form.data.grado_formacion}
                                error={form.errors.grado_formacion}
                                label="Nivel académico"
                                onChange={(event, newValue) => form.setData('grado_formacion', newValue.value)}
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

                            <FileInput
                                id="soporte_titulo_obtenido"
                                value={form.data.soporte_titulo_obtenido}
                                filename={estudio_academico?.filename}
                                extension={estudio_academico?.extension}
                                label="Seleccione el soporte del título obtenido"
                                accept="application/pdf"
                                downloadRoute={
                                    estudio_academico?.soporte_titulo_obtenido
                                        ? estudio_academico?.soporte_titulo_obtenido?.includes('http')
                                            ? null
                                            : route('users.download-file-sharepoint', [user, estudio_academico.id, 'soporte_titulo_obtenido'])
                                        : null
                                }
                                onChange={(e) => form.setData('soporte_titulo_obtenido', e.target.files[0])}
                                error={form.errors.soporte_titulo_obtenido}
                            />
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {estudio_academico && <small className="flex items-center text-app-700">{estudio_academico?.updated_at}</small>}
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

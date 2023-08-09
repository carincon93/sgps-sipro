import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import FileInput from '@/Components/FileInput'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, semillero_investigacion, grupo_investigacion, linea_investigacion, lineas_investigacion, redes_conocimiento, allowed_to_create, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: semillero_investigacion?.nombre,
        codigo: semillero_investigacion?.codigo,
        fecha_creacion_semillero: semillero_investigacion?.fecha_creacion_semillero,
        nombre_lider_semillero: semillero_investigacion?.nombre_lider_semillero,
        email_contacto: semillero_investigacion?.email_contacto,
        reconocimientos_semillero_investigacion: semillero_investigacion?.reconocimientos_semillero_investigacion,
        vision: semillero_investigacion?.vision,
        mision: semillero_investigacion?.mision,
        objetivo_general: semillero_investigacion?.objetivo_general,
        objetivos_especificos: semillero_investigacion?.objetivos_especificos,
        link_semillero: semillero_investigacion?.link_semillero,

        linea_investigacion_id: semillero_investigacion?.linea_investigacion_id,
        lineas_investigacion: semillero_investigacion?.lineas_investigacion_articulados.map((item) => item.id),
        redes_conocimiento: semillero_investigacion?.redes_conocimiento.map((item) => item.id),
        es_semillero_tecnoacademia: semillero_investigacion?.es_semillero_tecnoacademia ? 1 : 2,

        formato_gic_f_021: null,
        formato_gic_f_032: null,
        formato_aval_semillero: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.store', [grupo_investigacion.id, linea_investigacion.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.post(route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.update', [grupo_investigacion.id, linea_investigacion.id, semillero_investigacion.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} semillero de investigación</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="es_semillero_tecnoacademia"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.es_semillero_tecnoacademia}
                                    onChange={(event, newValue) => form.setData('es_semillero_tecnoacademia', newValue.value)}
                                    error={form.errors.es_semillero_tecnoacademia}
                                    label="¿Es semillero de TecnoAcademia?"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="codigo"
                                    type="text"
                                    value={form.data.codigo}
                                    error={form.errors.codigo}
                                    label="Código"
                                    onChange={(e) => form.setData('codigo', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Autocomplete
                                    id="linea_investigacion_id"
                                    options={lineas_investigacion}
                                    selectedValue={form.data.linea_investigacion_id}
                                    onChange={(event, newValue) => form.setData('linea_investigacion_id', newValue.value)}
                                    error={form.errors.linea_investigacion_id}
                                    label="Línea de investigación principal"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <SelectMultiple
                                    id="lineas_investigacion"
                                    bdValues={form.data.lineas_investigacion}
                                    options={lineas_investigacion}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            lineas_investigacion: selected_values,
                                        }))
                                    }}
                                    label="Articulación con líneas de investigación"
                                    error={form.errors.lineas_investigacion}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    value={form.data.nombre}
                                    error={form.errors.nombre}
                                    label="Nombre del semillero de investigación"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="fecha_creacion_semillero" value="Fecha creación del semillero" />
                                <DatePicker
                                    id="fecha_creacion_semillero"
                                    className="block w-full p-4"
                                    value={form.data.fecha_creacion_semillero}
                                    onChange={(e) => form.setData('fecha_creacion_semillero', e.target.value)}
                                    error={form.errors.fecha_creacion_semillero}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="nombre_lider_semillero"
                                    type="text"
                                    value={form.data.nombre_lider_semillero}
                                    onChange={(e) => form.setData('nombre_lider_semillero', e.target.value)}
                                    error={form.errors.nombre_lider_semillero}
                                    label="Nombre del líder del semillero"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="email_contacto"
                                    type="email"
                                    value={form.data.email_contacto}
                                    error={form.errors.email_contacto}
                                    label="Email de contacto"
                                    onChange={(e) => form.setData('email_contacto', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="reconocimientos_semillero_investigacion"
                                    label="Reconocimientos del semillero de investigación"
                                    value={form.data.reconocimientos_semillero_investigacion}
                                    onChange={(e) => form.setData('reconocimientos_semillero_investigacion', e.target.value)}
                                    error={form.errors.reconocimientos_semillero_investigacion}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea id="vision" value={form.data.vision} error={form.errors.vision} label="Visión" onChange={(e) => form.setData('vision', e.target.value)} required />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea id="mision" value={form.data.mision} error={form.errors.mision} label="Misión" onChange={(e) => form.setData('mision', e.target.value)} required />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="objetivo_general"
                                    value={form.data.objetivo_general}
                                    error={form.errors.objetivo_general}
                                    label="Objetivo general"
                                    onChange={(e) => form.setData('objetivo_general', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="objetivos_especificos"
                                    value={form.data.objetivos_especificos}
                                    error={form.errors.objetivos_especificos}
                                    label="Objetivos específicos"
                                    onChange={(e) => form.setData('objetivos_especificos', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="link_semillero"
                                    type="url"
                                    value={form.data.link_semillero}
                                    onChange={(e) => form.setData('link_semillero', e.target.value)}
                                    error={form.errors.link_semillero}
                                    label="Link del semillero"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <SelectMultiple
                                    id="redes_conocimiento"
                                    bdValues={form.data.redes_conocimiento}
                                    options={redes_conocimiento}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            redes_conocimiento: selected_values,
                                        }))
                                    }}
                                    label="Redes de conocimiento afines al Semillero de Investigación"
                                    error={form.errors.redes_conocimiento}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label className="mb-4 mt-8" labelFor="formato_gic_f_021" value="Formato GIC – F – 021" />

                                <FileInput
                                    id="formato_gic_f_021"
                                    value={form.data.formato_gic_f_021}
                                    filename={semillero_investigacion?.filename.formato_gic_f_021_filename}
                                    extension={semillero_investigacion?.extension.formato_gic_f_021_extension}
                                    label="Seleccione un archivo"
                                    downloadRoute={
                                        semillero_investigacion?.formato_gic_f_021
                                            ? semillero_investigacion?.formato_gic_f_021.includes('http') == true || semillero_investigacion?.formato_gic_f_021.includes('http') == undefined
                                                ? semillero_investigacion?.formato_gic_f_021
                                                : route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint', [
                                                      grupo_investigacion.id,
                                                      linea_investigacion.id,
                                                      semillero_investigacion.id,
                                                      'formato_gic_f_021',
                                                  ])
                                            : null
                                    }
                                    onChange={(e) => form.setData('formato_gic_f_021', e.target.files[0])}
                                    error={form.errors.formato_gic_f_021}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label className="mb-4 mt-8" labelFor="formato_gic_f_032" value="Formato GIC – F – 032" />
                                <FileInput
                                    id="formato_gic_f_032"
                                    value={form.data.formato_gic_f_032}
                                    filename={semillero_investigacion?.filename.formato_gic_f_032_filename}
                                    extension={semillero_investigacion?.extension.formato_gic_f_032_extension}
                                    label="Seleccione un archivo"
                                    downloadRoute={
                                        semillero_investigacion?.formato_gic_f_032
                                            ? semillero_investigacion?.formato_gic_f_032.includes('http') == true || semillero_investigacion?.formato_gic_f_032.includes('http') == undefined
                                                ? semillero_investigacion?.formato_gic_f_032
                                                : route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint', [
                                                      grupo_investigacion.id,
                                                      linea_investigacion.id,
                                                      semillero_investigacion.id,
                                                      'formato_gic_f_032',
                                                  ])
                                            : null
                                    }
                                    onChange={(e) => form.setData('formato_gic_f_032', e.target.files[0])}
                                    error={form.errors.formato_gic_f_032}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label className="mb-4 mt-8" labelFor="formato_aval_semillero" value="Aval del semillero" />
                                <FileInput
                                    id="formato_aval_semillero"
                                    value={form.data.formato_aval_semillero}
                                    filename={semillero_investigacion?.filename.formato_aval_semillero_filename}
                                    extension={semillero_investigacion?.extension.formato_aval_semillero_extension}
                                    label="Seleccione un archivo"
                                    downloadRoute={
                                        semillero_investigacion?.formato_aval_semillero
                                            ? semillero_investigacion?.formato_aval_semillero.includes('http') == true || semillero_investigacion?.formato_aval_semillero.includes('http') == undefined
                                                ? semillero_investigacion?.formato_aval_semillero
                                                : route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint', [
                                                      grupo_investigacion.id,
                                                      linea_investigacion.id,
                                                      semillero_investigacion.id,
                                                      'formato_aval_semillero',
                                                  ])
                                            : null
                                    }
                                    onChange={(e) => form.setData('formato_aval_semillero', e.target.files[0])}
                                    error={form.errors.formato_aval_semillero}
                                />
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

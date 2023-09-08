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

const Form = ({ method = '', setDialogStatus, is_super_admin, grupo_investigacion, centros_formacion, categorias_minciencias, redes_conocimiento, allowed_to_create, ...props }) => {
    const form = useForm({
        _method: method,
        nombre: grupo_investigacion?.nombre,
        acronimo: grupo_investigacion?.acronimo,
        email: grupo_investigacion?.email,
        enlace_gruplac: grupo_investigacion?.enlace_gruplac,
        codigo_minciencias: grupo_investigacion?.codigo_minciencias,
        categoria_minciencias: grupo_investigacion?.categoria_minciencias,
        fecha_creacion_grupo: grupo_investigacion?.fecha_creacion_grupo,
        nombre_lider_grupo: grupo_investigacion?.nombre_lider_grupo,
        email_contacto: grupo_investigacion?.email_contacto,
        reconocimientos_grupo_investigacion: grupo_investigacion?.reconocimientos_grupo_investigacion,
        programa_nal_ctei_principal: grupo_investigacion?.programa_nal_ctei_principal,
        programa_nal_ctei_secundaria: grupo_investigacion?.programa_nal_ctei_secundaria,
        vision: grupo_investigacion?.vision,
        mision: grupo_investigacion?.mision,
        objetivo_general: grupo_investigacion?.objetivo_general,
        objetivos_especificos: grupo_investigacion?.objetivos_especificos,
        link_propio_grupo: grupo_investigacion?.link_propio_grupo,
        redes_conocimiento: grupo_investigacion?.redes_conocimiento.map((item) => item.id),
        centro_formacion_id: grupo_investigacion?.centro_formacion_id,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('grupos-investigacion.store'), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
            : form.post(route('grupos-investigacion.update', [grupo_investigacion.id]), {
                  onSuccess: () => setDialogStatus(false),
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} grupo de investigación</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="centro_formacion_id"
                                    options={centros_formacion}
                                    selectedValue={form.data.centro_formacion_id}
                                    onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                                    disabled={!is_super_admin}
                                    error={form.errors.centro_formacion_id}
                                    label="Centro de formación"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    value={form.data.nombre}
                                    error={form.errors.nombre}
                                    label="Nombre del grupo de investigación"
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    disabled={!is_super_admin}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="acronimo"
                                    type="text"
                                    value={form.data.acronimo}
                                    error={form.errors.acronimo}
                                    label="Acrónimo"
                                    onChange={(e) => form.setData('acronimo', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    error={form.errors.email}
                                    label="Correo electrónico"
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="enlace_gruplac"
                                    type="url"
                                    value={form.data.enlace_gruplac}
                                    error={form.errors.enlace_gruplac}
                                    label="Enlace GrupLAC"
                                    onChange={(e) => form.setData('enlace_gruplac', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="codigo_minciencias"
                                    type="text"
                                    value={form.data.codigo_minciencias}
                                    error={form.errors.codigo_minciencias}
                                    label="Código Minciencias"
                                    onChange={(e) => form.setData('codigo_minciencias', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Autocomplete
                                    id="categoria_minciencias"
                                    options={categorias_minciencias}
                                    selectedValue={form.data.categoria_minciencias}
                                    onChange={(event, newValue) => form.setData('categoria_minciencias', newValue.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    error={form.errors.categoria_minciencias}
                                    label="Clasificación MinCiencias 894 – 2021"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label required labelFor="fecha_creacion_grupo" value="Fecha creación del grupo" />
                                <DatePicker
                                    id="fecha_creacion_grupo"
                                    className="block w-full p-4"
                                    value={form.data.fecha_creacion_grupo}
                                    onChange={(e) => form.setData('fecha_creacion_grupo', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    error={form.errors.fecha_creacion_grupo}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="nombre_lider_grupo"
                                    type="text"
                                    value={form.data.nombre_lider_grupo}
                                    onChange={(e) => form.setData('nombre_lider_grupo', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    error={form.errors.nombre_lider_grupo}
                                    label="Nombre del líder del grupo"
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
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="reconocimientos_grupo_investigacion"
                                    label="Reconocimientos del grupo de investigación"
                                    value={form.data.reconocimientos_grupo_investigacion}
                                    onChange={(e) => form.setData('reconocimientos_grupo_investigacion', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    error={form.errors.reconocimientos_grupo_investigacion}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="vision"
                                    value={form.data.vision}
                                    error={form.errors.vision}
                                    label="Visión"
                                    onChange={(e) => form.setData('vision', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="mision"
                                    value={form.data.mision}
                                    error={form.errors.mision}
                                    label="Misión"
                                    onChange={(e) => form.setData('mision', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Textarea
                                    id="objetivo_general"
                                    value={form.data.objetivo_general}
                                    error={form.errors.objetivo_general}
                                    label="Objetivo general"
                                    onChange={(e) => form.setData('objetivo_general', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
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
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="programa_nal_ctei_principal"
                                    type="text"
                                    value={form.data.programa_nal_ctei_principal}
                                    onChange={(e) => form.setData('programa_nal_ctei_principal', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    error={form.errors.programa_nal_ctei_principal}
                                    label="Programa Nal. CTeI (Principal)"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="programa_nal_ctei_secundaria"
                                    type="text"
                                    value={form.data.programa_nal_ctei_secundaria}
                                    onChange={(e) => form.setData('programa_nal_ctei_secundaria', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    error={form.errors.programa_nal_ctei_secundaria}
                                    label="Programa Nal. CTeI (Secundaria)"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <TextInput
                                    id="link_propio_grupo"
                                    type="url"
                                    value={form.data.link_propio_grupo}
                                    error={form.errors.link_propio_grupo}
                                    label="Link propio del grupo"
                                    onChange={(e) => form.setData('link_propio_grupo', e.target.value)}
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
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
                                    disabled={(allowed_to_create == true && grupo_investigacion?.allowed?.to_update == null) || grupo_investigacion?.allowed?.to_update == true ? false : true}
                                    label="Redes de conocimiento"
                                    error={form.errors.redes_conocimiento}
                                    required
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

import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, entidad_aliada, actividades, tipos_entidad_aliada, naturaleza_entidad_aliada, tipos_empresa, ...props }) => {
    const form = useForm({
        _method: method,
        tipo: entidad_aliada?.tipo ?? '',
        nombre: entidad_aliada?.nombre ?? '',
        naturaleza: entidad_aliada?.naturaleza ?? '',
        tipo_empresa: entidad_aliada?.tipo_empresa ?? '',
        nit: entidad_aliada?.nit ?? '',

        tiene_convenio: entidad_aliada?.entidad_aliada_linea66_82?.descripcion_convenio != null,

        tiene_grupo_investigacion: entidad_aliada?.entidad_aliada_linea66_82?.grupo_investigacion != null,
        descripcion_convenio: entidad_aliada?.entidad_aliada_linea66_82?.descripcion_convenio ?? '',
        grupo_investigacion: entidad_aliada?.entidad_aliada_linea66_82?.grupo_investigacion ?? '',
        codigo_gruplac: entidad_aliada?.entidad_aliada_linea66_82?.codigo_gruplac ?? '',
        enlace_gruplac: entidad_aliada?.entidad_aliada_linea66_82?.enlace_gruplac ?? '',
        actividades_transferencia_conocimiento: entidad_aliada?.entidad_aliada_linea66_82?.actividades_transferencia_conocimiento ?? '',
        recursos_especie: entidad_aliada?.entidad_aliada_linea66_82?.recursos_especie ?? '',
        descripcion_recursos_especie: entidad_aliada?.entidad_aliada_linea66_82?.descripcion_recursos_especie ?? '',
        recursos_dinero: entidad_aliada?.entidad_aliada_linea66_82?.recursos_dinero ?? '',
        descripcion_recursos_dinero: entidad_aliada?.entidad_aliada_linea66_82?.descripcion_recursos_dinero ?? '',

        actividad_id: entidad_aliada?.actividades.map((item) => item.id),

        fecha_inicio_convenio:
            entidad_aliada?.entidad_aliada_linea69?.fecha_inicio_convenio ??
            entidad_aliada?.entidad_aliada_linea70?.fecha_inicio_convenio ??
            entidad_aliada?.entidad_aliada_linea83?.fecha_inicio_convenio ??
            '',
        fecha_fin_convenio:
            entidad_aliada?.entidad_aliada_linea69?.fecha_fin_convenio ??
            entidad_aliada?.entidad_aliada_linea70?.fecha_fin_convenio ??
            entidad_aliada?.entidad_aliada_linea83?.fecha_fin_convenio ??
            '',
    })

    const soporte_convenio_url = entidad_aliada?.entidad_aliada_linea69 ? entidad_aliada.entidad_aliada_linea69.soporte_convenio : entidad_aliada?.entidad_aliada_linea70?.soporte_convenio

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.entidades-aliadas.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.post(route('convocatorias.proyectos.entidades-aliadas.update', [convocatoria.id, proyecto.id, entidad_aliada.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} entidad aliada</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={8}>
                                <Grid item md={12}>
                                    <Autocomplete
                                        id="tipo"
                                        options={tipos_entidad_aliada}
                                        selectedValue={form.data.tipo}
                                        onChange={(event, newValue) => form.setData('tipo', newValue.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.tipo}
                                        label="Tipo de entidad aliada"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        label="Nombre de la entidad aliada/Centro de formación"
                                        id="nombre"
                                        error={form.errors.nombre}
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Autocomplete
                                        id="naturaleza"
                                        options={naturaleza_entidad_aliada}
                                        selectedValue={form.data.naturaleza}
                                        onChange={(event, newValue) => form.setData('naturaleza', newValue.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.naturaleza}
                                        label="Naturaleza de la entidad"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Autocomplete
                                        id="tipo_empresa"
                                        options={tipos_empresa}
                                        selectedValue={form.data.tipo_empresa}
                                        onChange={(event, newValue) => form.setData('tipo_empresa', newValue.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.tipo_empresa}
                                        label="Tipo de empresa"
                                        required
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <TextInput
                                        label="NIT"
                                        id="nit"
                                        type="text"
                                        value={form.data.nit}
                                        onChange={(e) => form.setData('nit', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        error={form.errors.nit}
                                        required
                                    />
                                </Grid>

                                {proyecto.tipo_formulario_convocatoria_id == 8 || proyecto.tipo_formulario_convocatoria_id == 6 ? (
                                    <>
                                        <Grid item md={12}>
                                            <p>¿Hay convenio?</p>
                                            <SwitchMui checked={form.data.tiene_convenio} onChange={(e) => form.setData('tiene_convenio', e.target.checked)} disabled={!proyecto?.allowed?.to_update} />
                                        </Grid>
                                        {form.data.tiene_convenio == 1 && (
                                            <Grid item md={12}>
                                                <Textarea
                                                    label="Descipción del convenio"
                                                    id="descripcion_convenio"
                                                    error={form.errors.descripcion_convenio}
                                                    value={form.data.descripcion_convenio}
                                                    onChange={(e) => form.setData('descripcion_convenio', e.target.value)}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    required
                                                />
                                            </Grid>
                                        )}

                                        <Grid item md={12}>
                                            <p>¿La entidad aliada tiene grupo de investigación?</p>
                                            <SwitchMui checked={form.data.tiene_grupo_investigacion} onChange={(e) => form.setData('tiene_grupo_investigacion', e.target.checked)} />
                                        </Grid>
                                        {form.data.tiene_grupo_investigacion == 1 && (
                                            <>
                                                <Grid item md={12}>
                                                    <Textarea
                                                        label="Grupo de investigación"
                                                        id="grupo_investigacion"
                                                        error={form.errors.grupo_investigacion}
                                                        value={form.data.grupo_investigacion}
                                                        onChange={(e) => form.setData('grupo_investigacion', e.target.value)}
                                                        disabled={!proyecto?.allowed?.to_update}
                                                        required
                                                    />
                                                </Grid>

                                                <Grid item md={12}>
                                                    <TextInput
                                                        label="Código del GrupLAC"
                                                        id="codigo_gruplac"
                                                        type="text"
                                                        error={form.errors.codigo_gruplac}
                                                        placeholder="Ejemplo: COL0000000"
                                                        value={form.data.codigo_gruplac}
                                                        onChange={(e) => form.setData('codigo_gruplac', e.target.value)}
                                                        disabled={!proyecto?.allowed?.to_update}
                                                        required={!form.tiene_grupo_investigacion ? undefined : 'required'}
                                                    />
                                                </Grid>

                                                <Grid item md={12}>
                                                    <TextInput
                                                        label="Enlace del GrupLAC"
                                                        id="enlace_gruplac"
                                                        type="url"
                                                        error={form.errors.enlace_gruplac}
                                                        placeholder="Ejemplo: https://scienti.minciencias.gov.co/gruplac/jsp/Medicion/graficas/verPerfiles.jsp?id_convocatoria=0nroIdGrupo=0000000"
                                                        value={form.data.enlace_gruplac}
                                                        onChange={(e) => form.setData('enlace_gruplac', e.target.value)}
                                                        disabled={!proyecto?.allowed?.to_update}
                                                        required={!form.tiene_grupo_investigacion ? undefined : 'required'}
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item md={12}>
                                            <TextInput
                                                label="Recursos en especie entidad aliada ($COP)"
                                                id="recursos_especie"
                                                isCurrency={true}
                                                inputProps={{ min: 0, prefix: '$' }}
                                                error={form.errors.recursos_especie}
                                                placeholder="COP"
                                                value={form.data.recursos_especie}
                                                onChange={(e) => form.setData('recursos_especie', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                label="Descripción de los recursos en especie aportados"
                                                id="descripcion_recursos_especie"
                                                error={form.errors.descripcion_recursos_especie}
                                                value={form.data.descripcion_recursos_especie}
                                                onChange={(e) => form.setData('descripcion_recursos_especie', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <TextInput
                                                label="Recursos en dinero entidad aliada ($COP)"
                                                id="recursos_dinero"
                                                isCurrency={true}
                                                inputProps={{ min: 0, prefix: '$' }}
                                                error={form.errors.recursos_dinero}
                                                placeholder="COP"
                                                value={form.data.recursos_dinero}
                                                onChange={(e) => form.setData('recursos_dinero', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                label="Descripción de la destinación del dinero aportado"
                                                id="descripcion_recursos_dinero"
                                                error={form.errors.descripcion_recursos_dinero}
                                                value={form.data.descripcion_recursos_dinero}
                                                onChange={(e) => form.setData('descripcion_recursos_dinero', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                label="Metodología o actividades de transferencia al centro de formación"
                                                id="actividades_transferencia_conocimiento"
                                                error={form.errors.actividades_transferencia_conocimiento}
                                                value={form.data.actividades_transferencia_conocimiento}
                                                onChange={(e) => form.setData('actividades_transferencia_conocimiento', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        </Grid>
                                    </>
                                ) : proyecto.tipo_formulario_convocatoria_id == 5 || proyecto.tipo_formulario_convocatoria_id == 4 || proyecto.tipo_formulario_convocatoria_id == 11 ? (
                                    <>
                                        <Grid item md={12}>
                                            <p className="text-center">Fechas de vigencia Convenio/Acuerdos</p>
                                            <div className="ml-2 mt-4">
                                                <div>
                                                    <Label required labelFor="fecha_inicio_convenio" value="Fecha de inicio" />
                                                    <DatePicker
                                                        id="fecha_inicio_convenio"
                                                        className="mt-1 block w-full p-4"
                                                        value={form.data.fecha_inicio_convenio}
                                                        onChange={(e) => form.setData('fecha_inicio_convenio', e.target.value)}
                                                        disabled={!proyecto?.allowed?.to_update}
                                                        error={form.errors.fecha_inicio_convenio}
                                                        required
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <Label required labelFor="fecha_fin_convenio" value="Fecha de finalización" />
                                                    <DatePicker
                                                        id="fecha_fin_convenio"
                                                        className="mt-1 block w-full p-4"
                                                        value={form.data.fecha_fin_convenio}
                                                        onChange={(e) => form.setData('fecha_fin_convenio', e.target.value)}
                                                        disabled={!proyecto?.allowed?.to_update}
                                                        error={form.errors.fecha_fin_convenio}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                    </>
                                ) : null}

                                <Grid item md={12}>
                                    <h6 className="mt-20 mb-12 text-2xl" id="actividades">
                                        Actividades a desarrollar
                                    </h6>

                                    <div className="py-4">
                                        <Label required className="mb-4" labelFor="actividad_id" value="Relacione alguna actividad" />
                                    </div>
                                    <div>
                                        <SelectMultiple
                                            id="actividad_id"
                                            bdValues={form.data.actividad_id}
                                            options={actividades}
                                            error={form.errors.actividad_id}
                                            onChange={(event, newValue) => {
                                                const selectedValues = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    actividad_id: selectedValues,
                                                }))
                                            }}
                                            disabled={!proyecto?.allowed?.to_update}
                                            required
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </fieldset>

                        {entidad_aliada && <small className=" my-10 inline-block text-app-700">{entidad_aliada.updated_at}</small>}

                        <div className="flex items-center justify-between py-4">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} entidad aliada
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

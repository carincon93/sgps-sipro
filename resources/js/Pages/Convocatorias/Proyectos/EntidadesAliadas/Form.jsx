import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import FileInput from '@/Components/FileInput'
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
        tipo: entidad_aliada?.tipo ?? '',
        nombre: entidad_aliada?.nombre ?? '',
        naturaleza: entidad_aliada?.naturaleza ?? '',
        tipo_empresa: entidad_aliada?.tipo_empresa ?? '',
        nit: entidad_aliada?.nit ?? '',

        tiene_convenio: entidad_aliada?.entidad_aliada_linea66?.descripcion_convenio ?? '',

        tiene_grupo_investigacion: entidad_aliada?.entidad_aliada_linea66?.grupo_investigacion ?? '',
        descripcion_convenio: entidad_aliada?.entidad_aliada_linea66?.descripcion_convenio ?? '',
        grupo_investigacion: entidad_aliada?.entidad_aliada_linea66?.grupo_investigacion ?? '',
        codigo_gruplac: entidad_aliada?.entidad_aliada_linea66?.codigo_gruplac ?? '',
        enlace_gruplac: entidad_aliada?.entidad_aliada_linea66?.enlace_gruplac ?? '',
        actividades_transferencia_conocimiento: entidad_aliada?.entidad_aliada_linea66?.actividades_transferencia_conocimiento ?? '',
        recursos_especie: entidad_aliada?.entidad_aliada_linea66?.recursos_especie ?? '',
        descripcion_recursos_especie: entidad_aliada?.entidad_aliada_linea66?.descripcion_recursos_especie ?? '',
        recursos_dinero: entidad_aliada?.entidad_aliada_linea66?.recursos_dinero ?? '',
        descripcion_recursos_dinero: entidad_aliada?.entidad_aliada_linea66?.descripcion_recursos_dinero ?? '',

        carta_intencion: null,
        carta_propiedad_intelectual: null,
        actividad_id: entidad_aliada?.actividades.map((item) => item.id),

        soporte_convenio: null,
        fecha_inicio_convenio: entidad_aliada?.entidad_aliada_linea69?.fecha_inicio_convenio ?? entidad_aliada?.entidad_aliada_linea70?.fecha_inicio_convenio ?? '',
        fecha_fin_convenio: entidad_aliada?.entidad_aliada_linea69?.fecha_fin_convenio ?? entidad_aliada?.entidad_aliada_linea70?.fecha_fin_convenio ?? '',
    })

    const soporte_convenio_url = entidad_aliada?.entidad_aliada_linea69 ? entidad_aliada.entidad_aliada_linea69.soporte_convenio : entidad_aliada?.entidad_aliada_linea70?.soporte_convenio

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.entidades-aliadas.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.entidades-aliadas.update', [convocatoria.id, proyecto.id, entidad_aliada.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">{method == 'crear' ? 'Agregar' : 'Modificar'} entidad aliada</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo"
                                    options={tipos_entidad_aliada}
                                    selectedValue={form.data.tipo}
                                    onChange={(event, newValue) => form.setData('tipo', newValue.value)}
                                    error={form.errors.tipo}
                                    label="Tipo de entidad aliada"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    label="Nombre de la entidad aliada/Centro de formación"
                                    id="nombre"
                                    error={form.errors.nombre}
                                    value={form.data.nombre}
                                    onChange={(e) => form.setData('nombre', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="naturaleza"
                                    options={naturaleza_entidad_aliada}
                                    selectedValue={form.data.naturaleza}
                                    onChange={(event, newValue) => form.setData('naturaleza', newValue.value)}
                                    error={form.errors.naturaleza}
                                    label="Naturaleza de la entidad"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo_empresa"
                                    options={tipos_empresa}
                                    selectedValue={form.data.tipo_empresa}
                                    onChange={(event, newValue) => form.setData('tipo_empresa', newValue.value)}
                                    error={form.errors.tipo_empresa}
                                    label="Tipo de empresa"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <TextInput label="NIT" id="nit" type="text" value={form.data.nit} onChange={(e) => form.setData('nit', e.target.value)} error={form.errors.nit} required />
                            </div>

                            {proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                                <>
                                    <div className="mt-8">
                                        <p>¿Hay convenio?</p>
                                        <SwitchMui checked={form.data.tiene_convenio} onChange={(e) => form.setData('tiene_convenio', e.target.checked)} />
                                    </div>
                                    {form.data.tiene_convenio == 1 && (
                                        <div className="mt-8">
                                            <Textarea
                                                label="Descipción del convenio"
                                                id="descripcion_convenio"
                                                error={form.errors.descripcion_convenio}
                                                value={form.data.descripcion_convenio}
                                                onChange={(e) => form.setData('descripcion_convenio', e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <p>¿La entidad aliada tiene grupo de investigación?</p>
                                        <SwitchMui checked={form.data.tiene_grupo_investigacion} onChange={(e) => form.setData('tiene_grupo_investigacion', e.target.checked)} />
                                    </div>
                                    {form.data.tiene_grupo_investigacion == 1 && (
                                        <>
                                            <div className="mt-8">
                                                <Textarea
                                                    label="Grupo de investigación"
                                                    id="grupo_investigacion"
                                                    error={form.errors.grupo_investigacion}
                                                    value={form.data.grupo_investigacion}
                                                    onChange={(e) => form.setData('grupo_investigacion', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="mt-8">
                                                <TextInput
                                                    label="Código del GrupLAC"
                                                    id="codigo_gruplac"
                                                    type="text"
                                                    error={form.errors.codigo_gruplac}
                                                    placeholder="Ejemplo: COL0000000"
                                                    value={form.data.codigo_gruplac}
                                                    onChange={(e) => form.setData('codigo_gruplac', e.target.value)}
                                                    required={!form.tiene_grupo_investigacion ? undefined : 'required'}
                                                />
                                            </div>

                                            <div className="mt-8">
                                                <TextInput
                                                    label="Enlace del GrupLAC"
                                                    id="enlace_gruplac"
                                                    type="url"
                                                    error={form.errors.enlace_gruplac}
                                                    placeholder="Ejemplo: https://scienti.minciencias.gov.co/gruplac/jsp/Medicion/graficas/verPerfiles.jsp?id_convocatoria=0nroIdGrupo=0000000"
                                                    value={form.data.enlace_gruplac}
                                                    onChange={(e) => form.setData('enlace_gruplac', e.target.value)}
                                                    required={!form.tiene_grupo_investigacion ? undefined : 'required'}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="mt-8">
                                        <TextInput
                                            label="Recursos en especie entidad aliada ($COP)"
                                            id="recursos_especie"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            error={form.errors.recursos_especie}
                                            placeholder="COP"
                                            value={form.data.recursos_especie}
                                            onChange={(e) => form.setData('recursos_especie', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea
                                            label="Descripción de los recursos en especie aportados"
                                            id="descripcion_recursos_especie"
                                            error={form.errors.descripcion_recursos_especie}
                                            value={form.data.descripcion_recursos_especie}
                                            onChange={(e) => form.setData('descripcion_recursos_especie', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <TextInput
                                            label="Recursos en dinero entidad aliada ($COP)"
                                            id="recursos_dinero"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            error={form.errors.recursos_dinero}
                                            placeholder="COP"
                                            value={form.data.recursos_dinero}
                                            onChange={(e) => form.setData('recursos_dinero', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea
                                            label="Descripción de la destinación del dinero aportado"
                                            id="descripcion_recursos_dinero"
                                            error={form.errors.descripcion_recursos_dinero}
                                            value={form.data.descripcion_recursos_dinero}
                                            onChange={(e) => form.setData('descripcion_recursos_dinero', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea
                                            label="Metodología o actividades de transferencia al centro de formación"
                                            id="actividades_transferencia_conocimiento"
                                            error={form.errors.actividades_transferencia_conocimiento}
                                            value={form.data.actividades_transferencia_conocimiento}
                                            onChange={(e) => form.setData('actividades_transferencia_conocimiento', e.target.value)}
                                            required
                                        />
                                    </div>

                                    {convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3 ? (
                                        <>
                                            <div className="mt-8">
                                                <Label
                                                    className="mb-4"
                                                    labelFor="carta_intencion"
                                                    value="ANEXO 7. Carta de intención o acta que soporta el trabajo articulado con entidades aliadas (diferentes al SENA)"
                                                />

                                                <FileInput
                                                    id="carta_intencion"
                                                    value={form.data.carta_intencion}
                                                    filename={entidad_aliada?.entidad_aliada_linea66?.filename.cartaIntencionFilename}
                                                    extension={entidad_aliada?.entidad_aliada_linea66?.extension.cartaIntencionExtension}
                                                    label="Seleccione un archivo"
                                                    accept="application/pdf"
                                                    downloadRoute={
                                                        entidad_aliada?.carta_intencion
                                                            ? entidad_aliada?.carta_intencion?.includes('http')
                                                                ? null
                                                                : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [
                                                                      convocatoria,
                                                                      proyecto,
                                                                      entidad_aliada.id,
                                                                      'carta_intencion',
                                                                  ])
                                                            : null
                                                    }
                                                    onChange={(e) => form.setData('carta_intencion', e.target.files[0])}
                                                    error={form.errors.carta_intencion}
                                                />
                                            </div>

                                            <div className="mt-8">
                                                <Label className="mb-4" labelFor="carta_propiedad_intelectual" value="ANEXO 8. Propiedad intelectual" />

                                                <FileInput
                                                    id="carta_propiedad_intelectual"
                                                    value={form.data.carta_propiedad_intelectual}
                                                    filename={entidad_aliada?.entidad_aliada_linea66?.filename.cartaPropiedadIntelectualFilename}
                                                    extension={entidad_aliada?.entidad_aliada_linea66?.extension.cartaPropiedadIntelectualExtension}
                                                    label="Seleccione un archivo"
                                                    accept="application/pdf"
                                                    downloadRoute={
                                                        entidad_aliada?.carta_propiedad_intelectual
                                                            ? entidad_aliada?.carta_propiedad_intelectual?.includes('http')
                                                                ? null
                                                                : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [
                                                                      convocatoria,
                                                                      proyecto,
                                                                      entidad_aliada.id,
                                                                      'carta_propiedad_intelectual',
                                                                  ])
                                                            : null
                                                    }
                                                    onChange={(e) => form.setData('carta_propiedad_intelectual', e.target.files[0])}
                                                    error={form.errors.carta_propiedad_intelectual}
                                                />
                                            </div>
                                        </>
                                    ) : null}
                                </>
                            ) : proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70 ? (
                                <>
                                    <div className="mt-8">
                                        <Label className="mb-4" labelFor="soporte_convenio" value="Archivo del convenio" />
                                        {proyecto.codigo_linea_programatica == 70 && (
                                            <AlertMui>
                                                En el caso de tener un acuerdo, convenio o contrato de arrendamiento para la operación de la TecnoAcademia en una infraestructura de un tercero, es
                                                indispensable, adjuntar el documento contractual una vez este creando la entidad aliada.
                                            </AlertMui>
                                        )}

                                        <FileInput
                                            id="soporte_convenio"
                                            value={form.data.soporte_convenio}
                                            filename={entidad_aliada?.entidad_aliada_linea69 ? entidad_aliada?.entidad_aliada_linea69?.filename : entidad_aliada?.entidad_aliada_linea70?.filename}
                                            extension={entidad_aliada?.entidad_aliada_linea69 ? entidad_aliada?.entidad_aliada_linea69?.extension : entidad_aliada?.entidad_aliada_linea70?.extension}
                                            label="Seleccione un archivo"
                                            accept="application/pdf"
                                            downloadRoute={
                                                soporte_convenio_url?.includes('http')
                                                    ? null
                                                    : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidad_aliada.id, 'soporte_convenio'])
                                            }
                                            onChange={(e) => form.setData('soporte_convenio', e.target.files[0])}
                                            error={form.errors.soporte_convenio}
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <p className="text-center">Fechas de vigencia Convenio/Acuerdos</p>
                                        <div className="ml-2 mt-4">
                                            <div>
                                                <Label required labelFor="fecha_inicio_convenio" value="Fecha de inicio" />
                                                <div className="ml-14">
                                                    <DatePicker
                                                        id="fecha_inicio_convenio"
                                                        className="mt-1 block w-full p-4"
                                                        value={form.data.fecha_inicio_convenio}
                                                        onChange={(e) => form.setData('fecha_inicio_convenio', e.target.value)}
                                                        error={form.errors.fecha_inicio_convenio}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label required labelFor="fecha_fin_convenio" value="Fecha de finalización" />
                                                <div className="ml-4">
                                                    <DatePicker
                                                        id="fecha_fin_convenio"
                                                        className="mt-1 block w-full p-4"
                                                        value={form.data.fecha_fin_convenio}
                                                        onChange={(e) => form.setData('fecha_fin_convenio', e.target.value)}
                                                        error={form.errors.fecha_fin_convenio}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            {proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                                <>
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
                                            required
                                        />
                                    </div>
                                </>
                            ) : null}
                        </fieldset>

                        {entidad_aliada && <small className=" my-10 inline-block text-app-700">{entidad_aliada.updated_at}</small>}

                        <div className="flex items-center justify-between py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Agregar' : 'Modificar'} entidad aliada
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

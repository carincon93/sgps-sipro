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

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, entidadAliada, actividades, tiposEntidadAliada, naturalezaEntidadAliada, tiposEmpresa, ...props }) => {
    const form = useForm({
        tipo: entidadAliada?.tipo ?? '',
        nombre: entidadAliada?.nombre ?? '',
        naturaleza: entidadAliada?.naturaleza ?? '',
        tipo_empresa: entidadAliada?.tipo_empresa ?? '',
        nit: entidadAliada?.nit ?? '',
        tiene_convenio: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.descripcion_convenio : '',
        tiene_grupo_investigacion: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.grupo_investigacion : '',
        descripcion_convenio: entidadAliada?.entidad_aliada_idi?.descripcion_convenio ? entidadAliada.entidad_aliada_idi?.descripcion_convenio : '',
        grupo_investigacion: entidadAliada?.entidad_aliada_idi?.grupo_investigacion ? entidadAliada.entidad_aliada_idi?.grupo_investigacion : '',
        codigo_gruplac: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.codigo_gruplac : '',
        enlace_gruplac: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.enlace_gruplac : '',
        actividades_transferencia_conocimiento: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.actividades_transferencia_conocimiento : '',
        recursos_especie: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.recursos_especie : '',
        descripcion_recursos_especie: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.descripcion_recursos_especie : '',
        recursos_dinero: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.recursos_dinero : '',
        descripcion_recursos_dinero: entidadAliada?.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.descripcion_recursos_dinero : '',
        carta_intencion: null,
        carta_propiedad_intelectual: null,
        actividad_id: [],
        soporte_convenio: null,
        fecha_inicio_convenio: entidadAliada?.entidad_aliada_ta_tp?.fecha_inicio_convenio ?? '',
        fecha_fin_convenio: entidadAliada?.entidad_aliada_ta_tp?.fecha_fin_convenio ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.entidades-aliadas.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.entidades-aliadas.update', [convocatoria.id, proyecto.id, entidadAliada.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">{method == 'crear' ? 'Añadir' : 'Modificar'} entidad aliada</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <Autocomplete id="tipo" options={tiposEntidadAliada} selectedValue={form.data.tipo} onChange={(event, newValue) => form.setData('tipo', newValue.value)} error={form.errors.tipo} label="Tipo de entidad aliada" required />
                            </div>

                            <div className="mt-8">
                                <Textarea label="Nombre de la entidad aliada/Centro de formación" id="nombre" error={form.errors.nombre} value={form.data.nombre} onChange={(e) => form.setData('nombre', e.target.value)} required />
                            </div>

                            <div className="mt-8">
                                <Autocomplete id="naturaleza" options={naturalezaEntidadAliada} selectedValue={form.data.naturaleza} onChange={(event, newValue) => form.setData('naturaleza', newValue.value)} error={form.errors.naturaleza} label="Naturaleza de la entidad" required />
                            </div>

                            <div className="mt-8">
                                <Autocomplete id="tipo_empresa" options={tiposEmpresa} selectedValue={form.data.tipo_empresa} onChange={(event, newValue) => form.setData('tipo_empresa', newValue.value)} error={form.errors.tipo_empresa} label="Tipo de empresa" required />
                            </div>

                            <div className="mt-8">
                                <TextInput label="NIT" id="nit" type="text" value={form.data.nit} onChange={(e) => form.setData('nit', e.target.value)} error={form.errors.nit} required />
                            </div>

                            {proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                                <>
                                    <div className="mt-8">
                                        <p>¿Hay convenio?</p>
                                        <SwitchMui checked={form.data.tiene_convenio} />
                                    </div>
                                    {form.tiene_convenio && (
                                        <div className="mt-8">
                                            <Textarea label="Descipción del convenio" id="descripcion_convenio" error={form.errors.descripcion_convenio} value={form.data.descripcion_convenio} onChange={(e) => form.setData('descripcion_convenio', e.target.value)} required />
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <p>¿La entidad aliada tiene grupo de investigación?</p>
                                        <Switch checked={form.data.tiene_grupo_investigacion} />
                                    </div>
                                    {form.tiene_grupo_investigacion && (
                                        <>
                                            <div className="mt-8">
                                                <Textarea label="Grupo de investigación" id="grupo_investigacion" error={form.errors.grupo_investigacion} value={form.data.grupo_investigacion} onChange={(e) => form.setData('grupo_investigacion', e.target.value)} required />
                                            </div>

                                            <div className="mt-8">
                                                <TextInput label="Código del GrupLAC" id="codigo_gruplac" type="text" error={form.errors.codigo_gruplac} placeholder="Ejemplo: COL0000000" value={form.data.codigo_gruplac} onChange={(e) => form.setData('codigo_gruplac', e.target.value)} required={!form.tiene_grupo_investigacion ? undefined : 'required'} />
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
                                        <TextInput label="Recursos en especie entidad aliada ($COP)" id="recursos_especie" type="number" inputProps={{ min: 0 }} error={form.errors.recursos_especie} placeholder="COP" value={form.data.recursos_especie} onChange={(e) => form.setData('recursos_especie', e.target.value)} required />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea label="Descripción de los recursos en especie aportados" id="descripcion_recursos_especie" error={form.errors.descripcion_recursos_especie} value={form.data.descripcion_recursos_especie} onChange={(e) => form.setData('descripcion_recursos_especie', e.target.value)} required />
                                    </div>

                                    <div className="mt-8">
                                        <TextInput label="Recursos en dinero entidad aliada ($COP)" id="recursos_dinero" type="number" inputProps={{ min: 0 }} error={form.errors.recursos_dinero} placeholder="COP" value={form.data.recursos_dinero} onChange={(e) => form.setData('recursos_dinero', e.target.value)} required />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea label="Descripción de la destinación del dinero aportado" id="descripcion_recursos_dinero" error={form.errors.descripcion_recursos_dinero} value={form.data.descripcion_recursos_dinero} onChange={(e) => form.setData('descripcion_recursos_dinero', e.target.value)} required />
                                    </div>

                                    <div className="mt-8">
                                        <Textarea label="Metodología o actividades de transferencia al centro de formación" id="actividades_transferencia_conocimiento" error={form.errors.actividades_transferencia_conocimiento} value={form.data.actividades_transferencia_conocimiento} onChange={(e) => form.setData('actividades_transferencia_conocimiento', e.target.value)} required />
                                    </div>

                                    {convocatoria.tipo_convocatoria == 1 ||
                                        (convocatoria.tipo_convocatoria == 3 && (
                                            <>
                                                <div className="mt-8">
                                                    <Label className="mb-4" labelFor="carta_intencion" value="ANEXO 7. Carta de intención o acta que soporta el trabajo articulado con entidades aliadas (diferentes al SENA)" />

                                                    <FileInput
                                                        id="carta_intencion"
                                                        value={form.data.carta_intencion}
                                                        filename={entidadAliada?.filename}
                                                        extension={entidadAliada?.extension}
                                                        label="Seleccione un archivo"
                                                        accept="application/pdf"
                                                        downloadRoute={entidadAliada?.carta_intencion ? (entidadAliada?.carta_intencion?.includes('http') ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidadAliada.id, 'carta_intencion'])) : null}
                                                        onChange={(e) => form.setData('carta_intencion', e.target.files[0])}
                                                        error={form.errors.carta_intencion}
                                                    />
                                                </div>

                                                <div className="mt-8">
                                                    <Label className="mb-4" labelFor="carta_propiedad_intelectual" value="ANEXO 8. Propiedad intelectual" />

                                                    <FileInput
                                                        id="carta_propiedad_intelectual"
                                                        value={form.data.carta_propiedad_intelectual}
                                                        filename={entidadAliada?.filename}
                                                        extension={entidadAliada?.extension}
                                                        label="Seleccione un archivo"
                                                        accept="application/pdf"
                                                        downloadRoute={entidadAliada?.carta_propiedad_intelectual ? (entidadAliada?.carta_propiedad_intelectual?.includes('http') ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidadAliada.id, 'carta_propiedad_intelectual'])) : null}
                                                        onChange={(e) => form.setData('carta_propiedad_intelectual', e.target.files[0])}
                                                        error={form.errors.carta_propiedad_intelectual}
                                                    />
                                                </div>
                                            </>
                                        ))}
                                </>
                            ) : (
                                proyecto.codigo_linea_programatica == 69 ||
                                (proyecto.codigo_linea_programatica == 70 && (
                                    <>
                                        <div className="mt-8">
                                            <Label className="mb-4" labelFor="soporte_convenio" value="Archivo del convenio" />

                                            <FileInput
                                                id="soporte_convenio"
                                                value={form.data.soporte_convenio}
                                                filename={entidadAliada?.filename}
                                                extension={entidadAliada?.extension}
                                                label="Seleccione un archivo"
                                                accept="application/pdf"
                                                downloadRoute={entidadAliada?.soporte_convenio ? (entidadAliada?.soporte_convenio?.includes('http') ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidadAliada.id, 'soporte_convenio'])) : null}
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
                                                        <DatePicker id="fecha_inicio_convenio" className="mt-1 block w-full p-4" value={form.data.fecha_inicio_convenio} onChange={(e) => form.setData('fecha_inicio_convenio', e.target.value)} error={form.errors.fecha_inicio_convenio} required />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label required labelFor="fecha_fin_convenio" value="Fecha de finalización" />
                                                    <div className="ml-4">
                                                        <DatePicker id="fecha_fin_convenio" className="mt-1 block w-full p-4" value={form.data.fecha_fin_convenio} onChange={(e) => form.setData('fecha_fin_convenio', e.target.value)} error={form.errors.fecha_fin_convenio} required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            )}

                            {proyecto.codigo_linea_programatica == 66 ||
                                (proyecto.codigo_linea_programatica == 82 && (
                                    <>
                                        <h6 className="mt-20 mb-12 text-2xl" id="actividades">
                                            Actividades
                                        </h6>

                                        <div className="bg-white rounded shadow overflow-hidden">
                                            <div className="p-4">
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
                                        </div>
                                    </>
                                ))}
                        </fieldset>

                        {entidadAliada && <small className="flex items-center text-app-700">{entidadAliada.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} entidad aliada
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import DownloadFile from '@/Components/DownloadFile'
import FileInput from '@/Components/FileInput'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'
import { Head, Link, router, useForm } from '@inertiajs/react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'

import Form from './Form'
import Evaluacion from './Evaluacion'

const EntidadesAliadas = ({ auth, convocatoria, proyecto, evaluacion, entidades_aliadas, actividades, tipos_entidad_aliada, naturaleza_entidad_aliada, tipos_empresa, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [entidad_aliada_to_destroy, setEntidadAliadaToDestroy] = useState(null)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_formato_status, setDialogFormatoStatus] = useState(false)
    const [tipo_archivo, setTipoArchivo] = useState('')
    const [method, setMethod] = useState('')
    const [entidad_aliada, setEntidadAliada] = useState(null)

    const form = useForm({
        _method: 'PUT',
        carta_intencion: null,
        carta_propiedad_intelectual: null,
        soporte_convenio: null,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('convocatorias.proyectos.entidades-aliadas.upload-soporte', [convocatoria.id, proyecto.id, entidad_aliada.id]), {
            onSuccess: () => setDialogFormatoStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Entidades aliadas" />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            {/* <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid>

            {is_super_admin || proyecto.mostrar_recomendaciones ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <ToolTipMui
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.evaluacion_proyecto_linea66 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea66?.entidad_aliada_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea66.entidad_aliada_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        )}
                                        {evaluacion.evaluacion_proyecto_linea70 && (
                                            <p className="whitespace-pre-line text-xs">
                                                {evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario
                                                    ? evaluacion.evaluacion_proyecto_linea70.entidad_aliada_comentario
                                                    : 'Sin recomendación'}
                                            </p>
                                        )}
                                    </div>
                                }>
                                Evaluación {i + 1}
                            </ToolTipMui>
                        ) : null,
                    )}
                    {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                </>
            ) : null} */}

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Entidades aliadas</h1>
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Nombre', 'Soportes', 'Miembros', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyecto.allowed.to_update ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setEntidadAliada(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={5}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar entidad aliada
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {entidades_aliadas.data.map((entidad_aliada, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Chip className="mb-2" label={tipos_entidad_aliada.find((item) => item.value == entidad_aliada.tipo).label} />
                                <br />
                                {entidad_aliada.nombre}
                            </TableCell>
                            <TableCell>
                                {entidad_aliada?.entidad_aliada_linea66_82 && (
                                    <>
                                        <DownloadFile
                                            label="carta de intención"
                                            className="!p-2"
                                            filename={entidad_aliada?.entidad_aliada_linea66_82.filename.carta_intencion_filename}
                                            extension={entidad_aliada?.entidad_aliada_linea66_82.extension.carta_intencion_extension}
                                            downloadRoute={
                                                entidad_aliada?.entidad_aliada_linea66_82.carta_intencion
                                                    ? entidad_aliada?.entidad_aliada_linea66_82.carta_intencion?.includes('http')
                                                        ? entidad_aliada?.entidad_aliada_linea66_82.carta_intencion
                                                        : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidad_aliada.id, 'carta_intencion'])
                                                    : null
                                            }
                                        />
                                        <ButtonMui
                                            onClick={() => (setDialogFormatoStatus(true), setEntidadAliada(entidad_aliada), setTipoArchivo('carta_intencion'))}
                                            className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                            <AutorenewIcon className="mr-2" />
                                            {entidad_aliada?.entidad_aliada_linea66_82.filename.carta_intencion_filename ? 'Reemplazar' : 'Cargar'} carta de intención
                                        </ButtonMui>

                                        <DownloadFile
                                            label="carta de propiedad intelectual"
                                            className="mt-10 !p-2"
                                            filename={entidad_aliada?.entidad_aliada_linea66_82.filename.carta_propiedad_intelectual_filename}
                                            extension={entidad_aliada?.entidad_aliada_linea66_82.extension.carta_propiedad_intelectual_extension}
                                            downloadRoute={
                                                entidad_aliada?.entidad_aliada_linea66_82.carta_propiedad_intelectual
                                                    ? entidad_aliada?.entidad_aliada_linea66_82.carta_propiedad_intelectual?.includes('http')
                                                        ? entidad_aliada?.entidad_aliada_linea66_82.carta_propiedad_intelectual
                                                        : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [
                                                              convocatoria,
                                                              proyecto,
                                                              entidad_aliada.id,
                                                              'carta_propiedad_intelectual',
                                                          ])
                                                    : null
                                            }
                                        />
                                        <ButtonMui
                                            onClick={() => (setDialogFormatoStatus(true), setEntidadAliada(entidad_aliada), setTipoArchivo('carta_propiedad_intelectual'))}
                                            className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                            <AutorenewIcon className="mr-2" />
                                            {entidad_aliada?.entidad_aliada_linea66_82.filename.carta_propiedad_intelectual_filename ? 'Reemplazar' : 'Cargar'} carta de propiedad intelectual
                                        </ButtonMui>
                                    </>
                                )}

                                {entidad_aliada?.entidad_aliada_linea69 && (
                                    <>
                                        <DownloadFile
                                            label="convenio"
                                            className="mt-10 !p-2"
                                            filename={entidad_aliada?.entidad_aliada_linea69.filename}
                                            extension={entidad_aliada?.entidad_aliada_linea69.extension}
                                            downloadRoute={
                                                entidad_aliada?.entidad_aliada_linea69.soporte_convenio
                                                    ? entidad_aliada?.entidad_aliada_linea69.soporte_convenio?.includes('http')
                                                        ? entidad_aliada?.entidad_aliada_linea69.soporte_convenio
                                                        : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidad_aliada.id, 'soporte_convenio'])
                                                    : null
                                            }
                                        />
                                        <ButtonMui
                                            onClick={() => (setDialogFormatoStatus(true), setEntidadAliada(entidad_aliada), setTipoArchivo('soporte_convenio'))}
                                            className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                            {entidad_aliada?.entidad_aliada_linea69.filename ? 'Reemplazar' : 'Cargar'} convenio
                                        </ButtonMui>
                                    </>
                                )}

                                {entidad_aliada?.entidad_aliada_linea70 && (
                                    <>
                                        <DownloadFile
                                            label="convenio"
                                            className="mt-10 !p-2"
                                            filename={entidad_aliada?.entidad_aliada_linea70.filename}
                                            extension={entidad_aliada?.entidad_aliada_linea70.extension}
                                            downloadRoute={
                                                entidad_aliada?.entidad_aliada_linea70.soporte_convenio
                                                    ? entidad_aliada?.entidad_aliada_linea70.soporte_convenio?.includes('http')
                                                        ? entidad_aliada?.entidad_aliada_linea70.soporte_convenio
                                                        : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidad_aliada.id, 'soporte_convenio'])
                                                    : null
                                            }
                                        />
                                        <ButtonMui
                                            onClick={() => (setDialogFormatoStatus(true), setEntidadAliada(entidad_aliada), setTipoArchivo('soporte_convenio'))}
                                            className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                            <AutorenewIcon className="mr-2" />
                                            {entidad_aliada?.entidad_aliada_linea70.filename ? 'Reemplazar' : 'Cargar'} convenio
                                        </ButtonMui>
                                    </>
                                )}

                                {entidad_aliada?.entidad_aliada_linea83 && (
                                    <>
                                        <DownloadFile
                                            label="convenio"
                                            className="mt-10 !p-2"
                                            filename={entidad_aliada?.entidad_aliada_linea83.filename}
                                            extension={entidad_aliada?.entidad_aliada_linea83.extension}
                                            downloadRoute={
                                                entidad_aliada?.entidad_aliada_linea83.soporte_convenio
                                                    ? entidad_aliada?.entidad_aliada_linea83.soporte_convenio?.includes('http')
                                                        ? entidad_aliada?.entidad_aliada_linea83.soporte_convenio
                                                        : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria, proyecto, entidad_aliada.id, 'soporte_convenio'])
                                                    : null
                                            }
                                        />
                                        <ButtonMui
                                            onClick={() => (setDialogFormatoStatus(true), setEntidadAliada(entidad_aliada), setTipoArchivo('soporte_convenio'))}
                                            className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                            <AutorenewIcon className="mr-2" />
                                            {entidad_aliada?.entidad_aliada_linea83.filename ? 'Reemplazar' : 'Cargar'} convenio
                                        </ButtonMui>
                                    </>
                                )}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.index', [convocatoria.id, proyecto.id, entidad_aliada.id])}
                                    className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                    <GroupAddIcon className="mr-2" /> Agregar miembros de la entidad
                                </Link>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {entidad_aliada.id !== entidad_aliada_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setEntidadAliada(entidad_aliada))} disabled={!proyecto?.allowed?.to_view}>
                                                {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setEntidadAliadaToDestroy(entidad_aliada.id)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setEntidadAliadaToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.entidades-aliadas.destroy', [convocatoria.id, proyecto.id, entidad_aliada.id]), {
                                                            preserveScroll: true,
                                                        })
                                                    }
                                                }}>
                                                Confirmar
                                            </MenuItem>
                                        </div>
                                    )}
                                </MenuMui>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableMui>

                <PaginationMui links={entidades_aliadas.links} />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            entidad_aliada={entidad_aliada}
                            actividades={actividades}
                            tipos_entidad_aliada={tipos_entidad_aliada}
                            naturaleza_entidad_aliada={naturaleza_entidad_aliada}
                            tipos_empresa={tipos_empresa}
                        />
                    }
                />

                <DialogMui
                    open={dialog_formato_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <form onSubmit={submit}>
                            <FileInput
                                id={tipo_archivo}
                                value={form.data[tipo_archivo]}
                                label={`Seleccione: ${tipo_archivo} `}
                                accept="application/pdf"
                                onChange={(e) => form.setData(tipo_archivo, e)}
                                error={form.errors[tipo_archivo]}
                            />
                            <div className="flex items-center justify-between mt-14 py-4">
                                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                    Cargar soporte
                                </PrimaryButton>
                                <ButtonMui type="button" primary={false} onClick={() => setDialogFormatoStatus(false)} className="!ml-2 !bg-transparent">
                                    Cancelar
                                </ButtonMui>
                            </div>
                        </form>
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default EntidadesAliadas

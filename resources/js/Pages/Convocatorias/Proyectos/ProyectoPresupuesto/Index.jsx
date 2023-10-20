import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

import React from 'react'
import FormServiciosEdicionInfo from './FormNodoEditorial'
import FormSoftwareInfo from './FormSoftwareInfo'

const RubrosPresupuestales = ({
    auth,
    convocatoria,
    proyecto,
    evaluacion,
    rubros_presupuestales,
    segundo_grupo_presupuestal,
    tercer_grupo_presupuestal,
    usos_presupuestales,
    tipos_licencia,
    tipos_software,
    opciones_servicios_edicion,
    valor_total_por_concepto_interno_sena,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_software_info_status, setDialogSoftwareInfoStatus] = useState(false)
    const [dialog_servicio_edicion_info_status, setDialogServicioEdicionInfoStatus] = useState(false)
    const [dialog_status, setDialogStatus] = useState(false)
    const [proyecto_presupuesto_a_evaluar, setPresupuestoAEvaluar] = useState(null)

    const [method, setMethod] = useState('')
    const [rubro_presupuestal, setRubroPresupuestal] = useState(null)
    const [rubro_presupuestal_to_destroy, setRubroPresupuestalToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Rubros presupuestales" />
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>
            <Grid item md={12}>
                <h1 className="mt-24 mb-8 text-center text-3xl">Rubros presupuestales</h1>
            </Grid>
            <Grid item md={12}>
                <AlertMui className="mt-20">
                    <strong>Actualmente el total del costo de los productos o servicios requeridos es de:</strong> $
                    {new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_proyecto_presupuesto) ? proyecto.total_proyecto_presupuesto : 0)} COP
                    {/* <br />
                    <br />
                    <p className="mb-4">A continuación, los valores totales por CONCEPTO INTERNO SENA:</p>
                    <ul className="list-disc">
                        {valor_total_por_concepto_interno_sena.map((valor, i) => (
                            <li key={i}>
                                {i + 1}.
                                <p className="first-letter:uppercase inline-block ml-2">
                                    {valor.nombre} - <strong>${new Intl.NumberFormat('de-DE').format(valor.total_valor)} COP</strong> <small className="inline-block">(Código: {valor.codigo})</small>
                                </p>
                            </li>
                        ))}

                        {valor_total_por_concepto_interno_sena.length == 0 && <li>Sin información registrada.</li>}
                    </ul> */}
                </AlertMui>
                <TableMui
                    className="mb-8"
                    rows={['Descripción del bien o servicio', 'Subtotal del costo de los productos o servicios requeridos', 'Evaluación', 'Acciones']}
                    sxCellThead={{ width: '320px' }}>
                    {proyecto.allowed.to_update && (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setRubroPresupuestal(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar rubro presupuestal
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    )}

                    {rubros_presupuestales.data.map((presupuesto, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex flex-col focus:text-app-500 px-6 py-4" id={presupuesto.id}>
                                    <Chip size="small" label={<>Código: #{presupuesto.id}</>} />
                                    <div className="mt-3">
                                        <p className="whitespace-pre-line line-clamp-6">{presupuesto.descripcion}</p>
                                    </div>

                                    <div className="mt-3">
                                        <small className="underline">Usos presupuestales</small>
                                        <ul className="list-disc ml-4">
                                            {presupuesto.convocatoria_proyecto_rubros_presupuestales.map((convocatoria_rubro_presupuestal, i) => (
                                                <li key={i}>
                                                    <p className="first-letter:uppercase mb-2">
                                                        <small>{convocatoria_rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.nombre}: </small>
                                                        <br />
                                                        <small>{convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.codigo}: </small>
                                                        {convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.descripcion}{' '}
                                                        {convocatoria_rubro_presupuestal.habilitado ? null : (
                                                            <Chip label="Deshabilitado" size="small" className="!bg-red-200 !text-[10px] hover:!bg-red-50 mr-1 !text-red-500 mt-1" />
                                                        )}
                                                        {convocatoria_rubro_presupuestal.sumar_al_presupuesto ? null : (
                                                            <Chip label="No suma al presupuesto" size="small" className="!bg-red-200 !text-[10px] hover:!bg-red-50 !text-red-500 mt-1" />
                                                        )}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>${new Intl.NumberFormat('de-DE').format(presupuesto.valor_total)} COP</div>
                                {presupuesto.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado ? (
                                    <Link
                                        href={route('convocatorias.proyectos.presupuesto.soportes.index', [
                                            convocatoria.id,
                                            proyecto.id,
                                            presupuesto.id,
                                            evaluacion ? { evaluacion_id: evaluacion?.id } : null,
                                        ])}
                                        className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                        <FolderSharedIcon className=" !mr-2" />
                                        {presupuesto.soportes_estudio_mercado.length < 2 ? (
                                            <>Cargar el estudio de mercado y los soportes (Mínimo 2 soportes)</>
                                        ) : (
                                            <>Revisar estudio de mercado y soportes</>
                                        )}
                                    </Link>
                                ) : (
                                    <Chip
                                        icon={<InfoOutlinedIcon className="!text-blue-500 !ml-2" />}
                                        label="No requiere de estudios de mercado"
                                        className="!bg-blue-200 hover:!bg-blue-50 !text-blue-500 mt-4"
                                    />
                                )}
                                {proyecto.tipo_formulario_convocatoria_id == 4 && (
                                    <>
                                        {usos_presupuestales
                                            .filter((item1) => presupuesto?.convocatoria_proyecto_rubros_presupuestales?.some((item2) => item2.id == item1.value))
                                            .map((item) => item.codigo_uso_presupuestal)
                                            .includes('20202008005096') && (
                                            <Link
                                                href={route('convocatorias.proyectos.presupuesto.edt.index', [
                                                    convocatoria.id,
                                                    proyecto.id,
                                                    presupuesto.id,
                                                    evaluacion ? { evaluacion_id: evaluacion?.id } : null,
                                                ])}
                                                className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                                <strong>E D T : </strong>
                                                Generar los respectivos EDTs
                                            </Link>
                                        )}
                                    </>
                                )}
                                {presupuesto.convocatoria_proyecto_rubros_presupuestales.some(
                                    (rubro_presupuestal) =>
                                        rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo === '2041102' ||
                                        rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo === '2041101' ||
                                        rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo === '2041104',
                                ) && (
                                    <Link
                                        href={route('convocatorias.proyectos.presupuesto.municipios.index', [
                                            convocatoria.id,
                                            proyecto.id,
                                            presupuesto.id,
                                            evaluacion ? { evaluacion_id: evaluacion?.id } : null,
                                        ])}
                                        className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                        <AirplaneTicketIcon className="mr-2" />
                                        Relacionar los municipios a visitar
                                    </Link>
                                )}
                                {presupuesto.convocatoria_proyecto_rubros_presupuestales.some(
                                    (rubro_presupuestal) => rubro_presupuestal.rubro_presupuestal.uso_presupuestal.codigo === '2020200800901',
                                ) && (
                                    <ButtonMui
                                        onClick={() => {
                                            setRubroPresupuestal(presupuesto), setDialogServicioEdicionInfoStatus(true)
                                        }}
                                        className="!my-1 !text-left !normal-case">
                                        <MenuBookOutlinedIcon className="mr-2" />
                                        Información del nodo editorial
                                    </ButtonMui>
                                )}
                                {presupuesto.convocatoria_proyecto_rubros_presupuestales.some(
                                    (rubro_presupuestal) =>
                                        rubro_presupuestal.rubro_presupuestal.uso_presupuestal.codigo === '2010100600203101' ||
                                        rubro_presupuestal.rubro_presupuestal.uso_presupuestal.codigo === '2020100400708',
                                ) && (
                                    <ButtonMui
                                        onClick={() => {
                                            setRubroPresupuestal(presupuesto), setDialogSoftwareInfoStatus(true)
                                        }}
                                        className="!my-1 !text-left !normal-case">
                                        <TerminalOutlinedIcon className="mr-2" />
                                        Información del software
                                    </ButtonMui>
                                )}
                            </TableCell>
                            <TableCell>
                                {is_super_admin || proyecto.mostrar_recomendaciones ? (
                                    <>
                                        {presupuesto.proyecto_presupuestos_evaluaciones.map((evaluacion, i) =>
                                            is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                                <ToolTipMui
                                                    key={i}
                                                    title={
                                                        <div>
                                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                            {evaluacion.correcto == false && evaluacion.evaluacion.habilitado ? (
                                                                <>{evaluacion.comentario ? evaluacion.comentario : 'Sin recomendación'}</>
                                                            ) : (
                                                                <>Aprobado</>
                                                            )}
                                                        </div>
                                                    }>
                                                    Evaluación {i + 1}
                                                </ToolTipMui>
                                            ) : null,
                                        )}
                                        {presupuesto.proyecto_presupuestos_evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El ítem no ha sido evaluado aún.</p> : null}
                                    </>
                                ) : null}
                            </TableCell>
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {presupuesto.id !== rubro_presupuestal_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setRubroPresupuestal(presupuesto))} disabled={!proyecto?.allowed?.to_view}>
                                                {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setRubroPresupuestalToDestroy(presupuesto.id)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setRubroPresupuestalToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.presupuesto.destroy', [convocatoria.id, proyecto.id, presupuesto.id]), {
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

                <PaginationMui links={rubros_presupuestales.links} />

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
                            rubro_presupuestal={rubro_presupuestal}
                            segundo_grupo_presupuestal={segundo_grupo_presupuestal}
                            tercer_grupo_presupuestal={tercer_grupo_presupuestal}
                            usos_presupuestales={usos_presupuestales}
                        />
                    }
                />

                <DialogMui
                    open={dialog_servicio_edicion_info_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <FormServiciosEdicionInfo
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogServicioEdicionInfoStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            rubro_presupuestal={rubro_presupuestal}
                            opciones_servicios_edicion={opciones_servicios_edicion}
                        />
                    }
                />

                <DialogMui
                    open={dialog_software_info_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <FormSoftwareInfo
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogSoftwareInfoStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            rubro_presupuestal={rubro_presupuestal}
                            tipos_licencia={tipos_licencia}
                            tipos_software={tipos_software}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default RubrosPresupuestales

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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { Link, router } from '@inertiajs/react'
import { useState } from 'react'

import { route, checkRole } from '@/Utils'

import Evaluacion from './Evaluacion'
import Form from './Form'

import React from 'react'

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
    conceptos_viaticos,
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [proyecto_presupuesto_a_evaluar, setPresupuestoAEvaluar] = useState(null)

    const [method, setMethod] = useState('')
    const [rubro_presupuestal, setRubroPresupuestal] = useState(null)
    const [rubro_presupuestal_to_destroy, setRubroPresupuestalToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
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
                                <div className="flex flex-col focus:text-app-500 px-6 py-4" id={`PRE-${presupuesto.id}`}>
                                    <small>Código: PRE-{presupuesto.id}</small>
                                    <div className="mt-3">
                                        <p className="whitespace-pre-line line-clamp-6">{presupuesto.descripcion}</p>
                                    </div>

                                    <div className="mt-3">
                                        <small className="underline">Usos presupuestales</small>
                                        <ul className="list-disc ml-4">
                                            {presupuesto.convocatoria_proyecto_rubros_presupuestales.map((convocatoria_rubro_presupuestal, i) => (
                                                <li key={i}>
                                                    <p className="first-letter:uppercase mb-2">
                                                        {convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.descripcion}{' '}
                                                        {convocatoria_rubro_presupuestal.sumar_al_presupuesto ? null : (
                                                            <Chip label="No suma al presupuesto" size="small" className="!bg-blue-200 hover:!bg-blue-50 !text-blue-500 mt-1" />
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
                                        href={route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, presupuesto.id])}
                                        className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                        <FolderSharedIcon className=" !mr-2" />
                                        Debe cargar los estudios de mercado
                                    </Link>
                                ) : (
                                    <Chip
                                        icon={<InfoOutlinedIcon className="!text-blue-500 !ml-2" />}
                                        label="No requiere de estudios de mercado"
                                        className="!bg-blue-200 hover:!bg-blue-50 !text-blue-500 mt-4"
                                    />
                                )}

                                {proyecto.codigo_linea_programatica == 70 && (
                                    <>
                                        {usos_presupuestales
                                            .filter((item1) => presupuesto?.convocatoria_proyecto_rubros_presupuestales?.some((item2) => item2.id == item1.value))
                                            .map((item) => item.codigo_uso_presupuestal)
                                            .includes('20202008005096') && (
                                            <Link
                                                href={route('convocatorias.proyectos.presupuesto.edt.index', [convocatoria.id, proyecto.id, presupuesto.id])}
                                                className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                                <CelebrationOutlinedIcon className="!mr-2" />
                                                Debe generar los respectivos EDTs
                                            </Link>
                                        )}
                                    </>
                                )}

                                {presupuesto.convocatoria_proyecto_rubros_presupuestales.map((rubro_presupuestal, i) => (
                                    <React.Fragment key={i}>
                                        {rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo == '2041102' ||
                                        rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo == '2041101' ||
                                        rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.codigo == '2041104' ? (
                                            <Link
                                                href={route('convocatorias.proyectos.presupuesto.municipios.index', [convocatoria.id, proyecto.id, presupuesto.id])}
                                                className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                                <AirplaneTicketIcon className="mr-2" />
                                                Debe relacionar los municipios a visitar
                                            </Link>
                                        ) : null}
                                    </React.Fragment>
                                ))}
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
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('PUT'), setRubroPresupuestal(presupuesto))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            {evaluacion && <MenuItem onClick={() => (setPresupuestoAEvaluar(presupuesto), setEvaluacionDialogStatus(true))}>Evaluar</MenuItem>}
                                            <MenuItem
                                                onClick={() => {
                                                    setRubroPresupuestalToDestroy(presupuesto.id)
                                                }}>
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
                    fullWidth={true}
                    maxWidth="lg"
                    open={evaluacion_dialog_status}
                    dialogContent={
                        <>
                            <Evaluacion auth_user={auth_user} proyecto={proyecto} evaluacion={evaluacion} proyecto_presupuesto_a_evaluar={proyecto_presupuesto_a_evaluar} />
                        </>
                    }
                    dialogActions={
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                            Cerrar
                        </ButtonMui>
                    }
                />

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
                            tipos_licencia={tipos_licencia}
                            tipos_software={tipos_software}
                            opciones_servicios_edicion={opciones_servicios_edicion}
                            segundo_grupo_presupuestal={segundo_grupo_presupuestal}
                            tercer_grupo_presupuestal={tercer_grupo_presupuestal}
                            usos_presupuestales={usos_presupuestales}
                            conceptos_viaticos={conceptos_viaticos}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default RubrosPresupuestales

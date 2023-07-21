import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, convocatoria, culturaInnovacion, allowedToCreate }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [proyectoLinea65ToDestroy, setProyectoLinea65ToDestroy] = useState(null)

    return (
        <AuthenticatedLayout user={authUser} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12}>
                <div>
                    Apropiación de la ciencia y la tecnología y cultura de la innovación y la competitividad - Línea 65
                    <AlertMui hiddenIcon={true}>A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>
                </div>

                <div>
                    {allowedToCreate && (
                        <Link href={route('convocatorias.cultura-innovacion.create', [convocatoria.id])} variant="raised">
                            Formular un nuevo proyecto
                        </Link>
                    )}
                </div>
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {culturaInnovacion.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
                        <TableRow key={id}>
                            <TableCell>
                                <div>
                                    <Chip className="mb-4" label={proyecto?.codigo} />

                                    <p className="first-letter:uppercase mb-4">{titulo}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p>{fecha_ejecucion}</p>
                            </TableCell>
                            <TableCell>
                                {isSuperAdmin ||
                                checkRole(authUser, [20]) ||
                                (checkRole(authUser, [4, 15]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                (checkRole(authUser, [4, 15]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ? (
                                    <>
                                        <AlertMui hiddenIcon={true}>
                                            {proyecto?.estado_evaluacion_cultura_innovacion?.estado}
                                            <div>Puntaje: {proyecto?.estado_evaluacion_cultura_innovacion?.puntaje}</div>
                                            <small>
                                                Número de recomendaciones: {proyecto?.estado_evaluacion_cultura_innovacion?.numeroRecomendaciones}
                                                <br />
                                                Evaluaciones: {proyecto?.estado_evaluacion_cultura_innovacion?.evaluacionesHabilitadas} habilitada(s) /{' '}
                                                {proyecto?.estado_evaluacion_cultura_innovacion?.evaluacionesFinalizadas} finalizada(s)
                                            </small>
                                        </AlertMui>
                                        {JSON.parse(proyecto.estado_cord_sennova)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true ? (
                                            <AlertMui hiddenIcon={true} error={true} className="mt-2">
                                                Requiere ser subsanado
                                            </AlertMui>
                                        ) : (
                                            JSON.parse(proyecto.estado)?.requiereSubsanar &&
                                            proyecto.mostrar_recomendaciones == true &&
                                            proyecto.mostrar_requiere_subsanacion == true && (
                                                <AlertMui hiddenIcon={true} error={true} className="mt-2">
                                                    Requiere ser subsanado
                                                </AlertMui>
                                            )
                                        )}
                                    </>
                                ) : (
                                    <AlertMui hiddenIcon={true}>Aún no tiene permisos para ver el estado de evaluación de este proyecto.</AlertMui>
                                )}

                                {isSuperAdmin || checkRole(authUser, [18]) ? (
                                    <>
                                        {proyecto?.estado_evaluacion_cultura_innovacion?.alerta && (
                                            <AlertMui severity="error" className="mt-4" hiddenIcon={true}>
                                                Importante: {proyecto?.estado_evaluacion_cultura_innovacion?.alerta}
                                            </AlertMui>
                                        )}
                                    </>
                                ) : null}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />} className="">
                                    {proyecto.id !== proyectoLinea65ToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => router.visit(route('convocatorias.cultura-innovacion.edit', [convocatoria.id, id]))}
                                                disabled={!proyecto?.allowed?.to_view}
                                                className={!proyecto?.allowed?.to_view ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProyectoLinea65ToDestroy(proyecto.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProyectoLinea65ToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.cultura-innovacion.destroy', [convocatoria.id, proyecto.id]), {
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
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

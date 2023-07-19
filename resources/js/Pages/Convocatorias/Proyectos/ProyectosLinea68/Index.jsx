import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, convocatoria, serviciosTecnologicos, allowedToCreate }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [proyectoLinea68ToDestroy, setProyectoLinea68ToDestroy] = useState(null)

    return (
        <AuthenticatedLayout user={authUser} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12}>
                <div>
                    Fortalecimiento de la oferta de servicios tecnológicos para las empresas - Línea 68
                    <AlertMui hiddenIcon={true}>A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>
                </div>

                <div>
                    {allowedToCreate && (
                        <Link href={route('convocatorias.servicios-tecnologicos.create', [convocatoria.id])} variant="raised">
                            Formular un nuevo proyecto
                        </Link>
                    )}
                </div>
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']}>
                    {serviciosTecnologicos.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
                        <TableRow key={id}>
                            <TableCell>
                                <div>
                                    <Chip className="mb-4" label={proyecto?.codigo} />

                                    {JSON.parse(proyecto.estado_cord_sennova)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true ? (
                                        <AlertMui hiddenIcon={true}>Requiere ser subsanado</AlertMui>
                                    ) : (
                                        JSON.parse(proyecto.estado)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true && <AlertMui hiddenIcon={true}>Requiere ser subsanado</AlertMui>
                                    )}
                                </div>
                                <p>{titulo}</p>
                            </TableCell>
                            <TableCell>
                                <p>{fecha_ejecucion}</p>
                            </TableCell>
                            <TableCell>
                                {isSuperAdmin ||
                                checkRole(authUser, [19]) ||
                                (checkRole(authUser, [4, 13]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                (checkRole(authUser, [4, 13]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ? (
                                    <AlertMui hiddenIcon={true}>
                                        {proyecto?.estado_evaluacion_servicios_tecnologicos?.estado}
                                        <div>Puntaje: {proyecto?.estado_evaluacion_servicios_tecnologicos?.puntaje}</div>
                                        <small>
                                            Número de recomendaciones: {proyecto?.estado_evaluacion_servicios_tecnologicos?.numeroRecomendaciones}
                                            <br />
                                            Evaluaciones: {proyecto?.estado_evaluacion_servicios_tecnologicos?.evaluacionesHabilitadas} habilitada(s) / {proyecto?.estado_evaluacion_servicios_tecnologicos?.evaluacionesFinalizadas} finalizada(s)
                                        </small>
                                    </AlertMui>
                                ) : (
                                    <AlertMui hiddenIcon={true}>Aún no tiene permisos para ver el estado de evaluación de este proyecto.</AlertMui>
                                )}

                                {isSuperAdmin || checkRole(authUser, [18]) ? (
                                    <>
                                        {proyecto?.estado_evaluacion_servicios_tecnologicos?.alerta && (
                                            <AlertMui severity="error" className="mt-4" hiddenIcon={true}>
                                                Importante: {proyecto?.estado_evaluacion_servicios_tecnologicos?.alerta}
                                            </AlertMui>
                                        )}
                                    </>
                                ) : null}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {proyecto.id !== proyectoLinea68ToDestroy ? (
                                        <div>
                                            <MenuItem onClick={() => router.visit(route('convocatorias.servicios-tecnologicos.edit', [convocatoria.id, id]))} disabled={!proyecto?.allowed?.to_view} className={!proyecto?.allowed?.to_view ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProyectoLinea68ToDestroy(proyecto.id)
                                                }}
                                            >
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProyectoLinea68ToDestroy(null)
                                                }}
                                            >
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.servicios-tecnologicos.destroy', [convocatoria.id, proyecto.id]), {
                                                            preserveScroll: true,
                                                        })
                                                    }
                                                }}
                                            >
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

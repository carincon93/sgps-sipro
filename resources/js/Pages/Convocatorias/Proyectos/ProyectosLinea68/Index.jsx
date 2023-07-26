import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, convocatoria, proyectos_linea_68, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [proyecto_linea68_to_destroy, setProyectoLinea68ToDestroy] = useState(null)

    return (
        <AuthenticatedLayout user={auth_user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12}>
                <div>
                    Fortalecimiento de la oferta de servicios tecnológicos para las empresas - Línea 68
                    <AlertMui>A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>
                </div>

                <div>
                    {allowed_to_create && (
                        <Link href={route('convocatorias.proyectos-linea-68.create', [convocatoria.id])} variant="raised">
                            Formular un nuevo proyecto
                        </Link>
                    )}
                </div>
            </Grid>

            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyectos_linea_68.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
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
                                {is_super_admin ||
                                checkRole(auth_user, [19]) ||
                                (checkRole(auth_user, [4, 13]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                (checkRole(auth_user, [4, 13]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 3) ? (
                                    <>
                                        <AlertMui>
                                            {proyecto?.estado_evaluacion_proyecto_linea_68?.estado}
                                            <div>Puntaje: {proyecto?.estado_evaluacion_proyecto_linea_68?.puntaje}</div>
                                            <small>
                                                Número de recomendaciones: {proyecto?.estado_evaluacion_proyecto_linea_68?.numero_recomendaciones}
                                                <br />
                                                Evaluaciones: {proyecto?.estado_evaluacion_proyecto_linea_68?.evaluaciones_habilitadas} habilitada(s) /{' '}
                                                {proyecto?.estado_evaluacion_proyecto_linea_68?.evaluaciones_finalizadas} finalizada(s)
                                            </small>
                                        </AlertMui>

                                        {JSON.parse(proyecto.estado_cord_sennova)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true ? (
                                            <AlertMui error={true} className="mt-2">
                                                Requiere ser subsanado
                                            </AlertMui>
                                        ) : (
                                            JSON.parse(proyecto.estado)?.requiereSubsanar &&
                                            proyecto.mostrar_recomendaciones == true &&
                                            proyecto.mostrar_requiere_subsanacion == true && (
                                                <AlertMui error={true} className="mt-2">
                                                    Requiere ser subsanado
                                                </AlertMui>
                                            )
                                        )}
                                    </>
                                ) : (
                                    <AlertMui>Aún no tiene permisos para ver el estado de evaluación de este proyecto.</AlertMui>
                                )}

                                {is_super_admin || checkRole(auth_user, [18]) ? (
                                    <>
                                        {proyecto?.estado_evaluacion_proyecto_linea_68?.alerta && (
                                            <AlertMui severity="error" className="mt-4">
                                                Importante: {proyecto?.estado_evaluacion_proyecto_linea_68?.alerta}
                                            </AlertMui>
                                        )}
                                    </>
                                ) : null}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {proyecto.id !== proyecto_linea68_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => router.visit(route('convocatorias.proyectos-linea-68.edit', [convocatoria.id, id]))}
                                                disabled={!proyecto?.allowed?.to_view}
                                                className={!proyecto?.allowed?.to_view ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProyectoLinea68ToDestroy(proyecto.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProyectoLinea68ToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos-linea-68.destroy', [convocatoria.id, proyecto.id]), {
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'
import ButtonMui from '@/Components/Button'

const Index = ({ auth, convocatoria, proyectos_hub_linea_69, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [proyecto_linea_83_to_destroy, setProyectoLinea83ToDestroy] = useState(null)

    return (
        <AuthenticatedLayout user={auth_user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12}>
                <h1 className="text-3xl text-center">Asistencia técnica o extensionismo tecnológico - Línea 83</h1>
            </Grid>

            <Grid item md={12}>
                <AlertMui className="mt-20">A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>

                <TableMui rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {allowed_to_create && (
                        <TableRow
                            onClick={() => router.visit(route('convocatorias.proyectos-linea-83.create', [convocatoria.id]))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Formular un nuevo proyecto
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    )}
                    {proyectos_hub_linea_69.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
                        <TableRow key={id}>
                            <TableCell>
                                <div>
                                    <Chip label={proyecto?.codigo} />

                                    <p className="first-letter:uppercase my-4">{titulo}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p>{fecha_ejecucion}</p>
                            </TableCell>
                            <TableCell>
                                {is_super_admin ||
                                checkRole(auth_user, [17]) ||
                                (checkRole(auth_user, [4, 24, 16]) && proyecto?.mostrar_recomendaciones) ||
                                (checkRole(auth_user, [4, 24, 16]) && proyecto?.mostrar_recomendaciones) ||
                                (convocatoria.fase == 5 && proyecto?.mostrar_recomendaciones) ? (
                                    <>
                                        <AlertMui>
                                            {proyecto?.estado_evaluacion_proyecto_linea_83?.estado}
                                            <small>
                                                Número de recomendaciones: {proyecto?.estado_evaluacion_proyecto_linea_83?.numero_recomendaciones}
                                                <br />
                                                Evaluaciones: {proyecto?.estado_evaluacion_proyecto_linea_83?.evaluaciones_habilitadas} habilitada(s) /{' '}
                                                {proyecto?.estado_evaluacion_proyecto_linea_83?.evaluaciones_finalizadas} finalizada(s)
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
                                        {proyecto?.estado_evaluacion_proyecto_linea_83?.alerta && (
                                            <AlertMui severity="error" className="mt-4">
                                                Importante: {proyecto?.estado_evaluacion_proyecto_linea_83?.alerta}
                                            </AlertMui>
                                        )}
                                    </>
                                ) : null}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {proyecto.id !== proyecto_linea_83_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => router.visit(route('convocatorias.proyectos-linea-83.edit', [convocatoria.id, id]))}
                                                disabled={!proyecto?.allowed?.to_view}
                                                className={!proyecto?.allowed?.to_view ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            {proyecto.evaluaciones.map((evaluacion, i) => (
                                                <MenuItem
                                                    key={i}
                                                    onClick={() => router.visit(route('convocatorias.proyectos-linea-83.edit', [convocatoria.id, id, { evaluacion_id: evaluacion?.id }]))}>
                                                    Evaluacion #{evaluacion.id}
                                                </MenuItem>
                                            ))}
                                            <MenuItem
                                                onClick={() => {
                                                    setProyectoLinea83ToDestroy(proyecto.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProyectoLinea83ToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos-linea-83.destroy', [convocatoria.id, proyecto.id]), {
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import { checkRole } from '@/Utils'
import { Head, router } from '@inertiajs/react'
import { Chip, Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { useState } from 'react'
import AlertMui from '@/Components/Alert'

const Index = ({ auth, evaluaciones, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [evaluacion_to_destroy, setEvaluacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Evaluaciones" />

            <Grid container>
                <Grid item md={12}>
                    <SearchBar className="mt-20" />

                    <TableMui
                        className="mt-20"
                        rows={['ID', 'Código', 'Título', 'Convocatoria', 'Evaluador/a', 'Estados evaluación', 'Estado del proyecto', 'Acciones']}
                        sxCellThead={{ width: '320px' }}>
                        {evaluaciones.data.map((evaluacion, i) => (
                            <TableRow key={i}>
                                <TableCell>{evaluacion.id}</TableCell>
                                <TableCell>{evaluacion.proyecto.codigo}</TableCell>
                                <TableCell>
                                    <p className="first-letter:uppercase lowercase line-clamp-4">
                                        {evaluacion.proyecto?.proyecto_formulario7_linea23
                                            ? evaluacion.proyecto?.proyecto_formulario7_linea23.titulo
                                            : evaluacion.proyecto?.proyecto_formulario9_linea23
                                            ? evaluacion.proyecto?.proyecto_formulario9_linea23.titulo
                                            : evaluacion.proyecto?.proyecto_formulario3_linea61
                                            ? evaluacion.proyecto?.proyecto_formulario3_linea61.titulo
                                            : evaluacion.proyecto?.proyecto_formulario1_linea65
                                            ? evaluacion.proyecto?.proyecto_formulario1_linea65.titulo
                                            : evaluacion.proyecto?.proyecto_formulario13_linea65
                                            ? evaluacion.proyecto?.proyecto_formulario13_linea65.titulo
                                            : evaluacion.proyecto?.proyecto_formulario15_linea65
                                            ? evaluacion.proyecto?.proyecto_formulario15_linea65.titulo
                                            : evaluacion.proyecto?.proyecto_formulario16_linea65
                                            ? evaluacion.proyecto?.proyecto_formulario16_linea65.titulo
                                            : evaluacion.proyecto?.proyecto_formulario8_linea66
                                            ? evaluacion.proyecto?.proyecto_formulario8_linea66.titulo
                                            : evaluacion.proyecto?.proyecto_formulario12_linea68
                                            ? evaluacion.proyecto?.proyecto_formulario12_linea68.titulo
                                            : evaluacion.proyecto?.proyecto_formulario5_linea69
                                            ? evaluacion.proyecto?.proyecto_formulario5_linea69.titulo
                                            : evaluacion.proyecto?.proyecto_formulario10_linea69
                                            ? evaluacion.proyecto?.proyecto_formulario10_linea69.titulo
                                            : evaluacion.proyecto?.proyecto_formulario17_linea69
                                            ? evaluacion.proyecto?.proyecto_formulario17_linea69.titulo
                                            : evaluacion.proyecto?.proyecto_formulario4_linea70
                                            ? evaluacion.proyecto?.proyecto_formulario4_linea70.titulo
                                            : evaluacion.proyecto?.proyecto_formulario6_linea82
                                            ? evaluacion.proyecto?.proyecto_formulario6_linea82.titulo
                                            : evaluacion.proyecto?.proyecto_formulario11_linea83
                                            ? evaluacion.proyecto?.proyecto_formulario11_linea83.titulo
                                            : 'Sin información registrada'}
                                    </p>
                                </TableCell>
                                <TableCell>{evaluacion.proyecto.convocatoria.year}</TableCell>
                                <TableCell>{evaluacion.evaluador.nombre}</TableCell>
                                <TableCell>
                                    <Chip className="mr-2 mb-2" size="small" label={evaluacion.verificar_estado_evaluacion ? evaluacion.verificar_estado_evaluacion : 'Sin información'} />
                                    <br />
                                    <Chip
                                        className={`${evaluacion.habilitado ? '!bg-blue-200 !text-blue-500' : '!bg-red-200 !text-red-500'} mb-2`}
                                        size="small"
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{evaluacion.habilitado ? 'Habilitado/a' : 'Deshabilitado/a'}</div>
                                            </>
                                        }
                                    />
                                </TableCell>

                                <TableCell>
                                    <AlertMui>
                                        {evaluacion.proyecto.estado_evaluacion_proyecto_formulario_8_linea_66 ||
                                        evaluacion.proyecto.estado_evaluacion_proyecto_formulario_1_linea_65 ||
                                        evaluacion.proyecto.estado_evaluacion_proyecto_formulario_1_linea_68 ? (
                                            <>
                                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                                {evaluacion.allowed.to_view && (
                                                    <>
                                                        <br />
                                                        <small>
                                                            Puntaje: {evaluacion.total_evaluacion}
                                                            <br />
                                                            Número de recomendaciones: {evaluacion.total_recomendaciones}
                                                        </small>
                                                    </>
                                                )}
                                            </>
                                        ) : evaluacion.proyecto.estado_evaluacion_proyecto_formulario_4_linea_70 ? (
                                            <>
                                                {evaluacion.proyecto.estado_evaluacion_proyecto_formulario_4_linea_70.estado}
                                                <br />| {evaluacion.allowed.to_view && <small>Número de recomendaciones: {evaluacion.total_recomendaciones}</small>}
                                            </>
                                        ) : evaluacion.proyecto.estado_evaluacion_proyecto_formulario_5_linea_69 ? (
                                            <>
                                                {evaluacion.proyecto.estado_evaluacion_proyecto_formulario_5_linea_69.estado}
                                                <br />| {evaluacion.allowed.to_view && <small>Número de recomendaciones: {evaluacion.total_recomendaciones}</small>}
                                            </>
                                        ) : (
                                            'Sin información registrada'
                                        )}
                                    </AlertMui>
                                </TableCell>
                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {evaluacion.id !== evaluacion_to_destroy ? (
                                            <div>
                                                <MenuItem disabled={true}>
                                                    Ver evaluación
                                                </MenuItem>
                                                <MenuItem onClick={() => router.visit(route('evaluaciones.edit', [evaluacion.id]))} disabled={!is_super_admin}>
                                                    Editar
                                                </MenuItem>

                                                <MenuItem
                                                    onClick={(e) =>
                                                        router.put(
                                                            route('evaluaciones.habilitar-evaluacion'),
                                                            {
                                                                user_id: evaluacion?.id,
                                                                habilitado: !evaluacion.habilitado,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }>
                                                    {evaluacion.habilitado ? 'Deshabilitar' : 'Habilitar'}
                                                </MenuItem>

                                                {is_super_admin && (
                                                    <>
                                                        <Divider />
                                                        <MenuItem
                                                            onClick={() => {
                                                                setEvaluacionToDestroy(evaluacion.id)
                                                            }}>
                                                            Eliminar
                                                        </MenuItem>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setEvaluacionToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (evaluacion.allowed.to_update) {
                                                            router.delete(route('evaluaciones.destroy', [evaluacion.id]), {
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

                    <PaginationMui links={evaluaciones.links} className="mt-8" />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

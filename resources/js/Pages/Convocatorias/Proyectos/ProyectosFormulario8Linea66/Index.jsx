import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'
import TabsConvocatoria from '@/Components/TabsConvocatoria'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, convocatoria, proyectos_formulario_8_linea_66, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [proyecto_formulario_8_linea_66_to_destroy, setProyectoFormulario8Linea66ToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Lista de proyectos - Formulario 8 Línea 66" />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="0" convocatoria={convocatoria} tipo_formulario_convocatoria_id="8" />
                    </Grid>
                )}

                <Grid item md={12} className="!mt-20">
                    <div className="text-center text-2xl">Formulario 8: Investigación aplicada y semilleros de investigación en centros de formación - Línea 66</div>
                </Grid>

                <Grid item md={12}>
                    <AlertMui className="mt-20">A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>

                    <SearchBar inputBackground="white" routeParams={[convocatoria.id]} className="my-10" />

                    <TableMui rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {allowed_to_create && (
                            <TableRow
                                onClick={() => router.visit(route('convocatorias.proyectos-formulario-8-linea-66.create', [convocatoria.id]))}
                                variant="raised"
                                className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                <TableCell colSpan={4}>
                                    <ButtonMui>
                                        <AddCircleOutlineOutlinedIcon className="mr-1" /> Formular un nuevo proyecto
                                    </ButtonMui>
                                </TableCell>
                            </TableRow>
                        )}
                        {proyectos_formulario_8_linea_66.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
                            <TableRow key={id}>
                                <TableCell>
                                    <div>
                                        <Chip className="mb-4" label={proyecto?.codigo} />
                                        <p className="uppercase mb-4 line-clamp-3">{titulo}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p>{fecha_ejecucion}</p>
                                </TableCell>
                                <TableCell>
                                    {checkRole(auth_user, [1]) || !['1', '2', '4'].includes(convocatoria.fase) ? (
                                        <>
                                            {convocatoria.esta_activa && proyecto?.estado_evaluacion_proyecto?.requiere_subsanar && ['3', '5'].includes(convocatoria.fase) ? (
                                                <>
                                                    <AlertMui severity="warning" className="!mb-1">
                                                        <small>Requiere subsanación</small>
                                                    </AlertMui>
                                                </>
                                            ) : !convocatoria.esta_activa ? (
                                                <AlertMui className="!leading-4">{proyecto?.estado_evaluacion_proyecto?.estado_evaluacion}</AlertMui>
                                            ) : (
                                                <AlertMui className="!leading-4">Los resultados definitivos se publicarán próximamente.</AlertMui>
                                            )}

                                            {/* <AlertMui className="!leading-4">{proyecto?.estado_evaluacion_proyecto?.estado_evaluacion}</AlertMui> */}

                                            {checkRole(auth_user, [1]) && (
                                                <AlertMui className="!leading-4">
                                                    <div>Puntaje: {proyecto?.estado_evaluacion_proyecto?.puntaje_total}</div>
                                                    <small>
                                                        Número de recomendaciones: {proyecto?.estado_evaluacion_proyecto?.total_recomendaciones}
                                                        <br />
                                                        Evaluaciones: {proyecto?.estado_evaluacion_proyecto?.cantidad_evaluaciones} habilitada(s) /{' '}
                                                        {proyecto?.estado_evaluacion_proyecto?.evaluaciones_finalizadas} finalizada(s)
                                                    </small>
                                                </AlertMui>
                                            )}
                                        </>
                                    ) : (
                                        <AlertMui className="!leading-4">Aún no tiene permisos para ver el estado de evaluación de este proyecto.</AlertMui>
                                    )}

                                    {checkRole(auth_user, [1]) ? (
                                        <>
                                            {proyecto?.estado_evaluacion_proyecto?.alerta && (
                                                <AlertMui severity="error" className="mt-4 !text-xs">
                                                    Importante: {proyecto?.estado_evaluacion_proyecto?.alerta}
                                                </AlertMui>
                                            )}
                                        </>
                                    ) : null}
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {proyecto.id !== proyecto_formulario_8_linea_66_to_destroy ? (
                                            <div>
                                                <MenuItem
                                                    onClick={() => router.visit(route('convocatorias.proyectos-formulario-8-linea-66.edit', [convocatoria.id, id]))}
                                                    disabled={!proyecto?.allowed?.to_view}>
                                                    {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                                </MenuItem>
                                                <MenuItem>
                                                    <a href={route(`convocatorias.proyectos.pdf-formulario8-linea66`, [convocatoria.id, proyecto.id])} target="_blank" className="flex items-center">
                                                        PDF del proyecto
                                                    </a>
                                                </MenuItem>

                                                {checkRole(auth_user, [1]) && (
                                                    <>
                                                        <Divider />
                                                        {proyecto.evaluaciones.map((evaluacion, i) => (
                                                            <MenuItem
                                                                key={i}
                                                                onClick={() =>
                                                                    router.visit(route('convocatorias.proyectos-formulario-8-linea-66.edit', [convocatoria.id, id, { evaluacion_id: evaluacion?.id }]))
                                                                }
                                                                isabled={!is_super_admin}>
                                                                Evaluacion #{evaluacion.id}
                                                            </MenuItem>
                                                        ))}
                                                    </>
                                                )}
                                                <MenuItem
                                                    onClick={() => {
                                                        setProyectoFormulario8Linea66ToDestroy(proyecto.id)
                                                    }}
                                                    disabled={!proyecto?.allowed?.to_destroy}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setProyectoFormulario8Linea66ToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (proyecto.allowed.to_update) {
                                                            router.delete(route('convocatorias.proyectos-formulario-8-linea-66.destroy', [convocatoria.id, proyecto.id]), {
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

                    <PaginationMui links={proyectos_formulario_8_linea_66.links} className="mt-6" />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import SenaLogo from '@/Components/SenaLogo'
import TableMui from '@/Components/Table'
import TabsConvocatoria from '@/Components/TabsConvocatoria'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, convocatoria, proyectos_formulario_1_linea_65, monto_maximo_por_regional, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [proyecto_linea_65_to_destroy, setProyectoFormulario1Linea65ToDestroy] = useState(null)
    const [dialog_status, setDialogStatus] = useState(true)

    return (
        <AuthenticatedLayout>
            <Head title="Lista de proyectos - Formulario 1 Línea 65" />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="0" convocatoria={convocatoria} tipo_formulario_convocatoria_id="1" />
                    </Grid>
                )}

                <Grid item md={12} className="!mt-20">
                    <h1 className="text-3xl text-center">Formulario 1: Evento de Divulgación - Apropiación de la ciencia y la tecnología y cultura de la innovación y la competitividad - Línea 65</h1>
                </Grid>

                <Grid item md={12}>
                    <AlertMui className="mt-20">A continuación, se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</AlertMui>

                    <SearchBar inputBackground="white" routeParams={[convocatoria.id]} className="my-10" />

                    <TableMui rows={['Título', 'Fecha de ejecución', 'Estado (Evaluación)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {allowed_to_create && (
                            <TableRow
                                onClick={() => router.visit(route('convocatorias.proyectos-formulario-1-linea-65.create', [convocatoria.id]))}
                                variant="raised"
                                className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                <TableCell colSpan={4}>
                                    <ButtonMui>
                                        <AddCircleOutlineOutlinedIcon className="mr-1" /> Formular un nuevo proyecto
                                    </ButtonMui>
                                </TableCell>
                            </TableRow>
                        )}
                        {proyectos_formulario_1_linea_65.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
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
                                    {proyecto.tipo_formulario_convocatoria.tipos_formulario_convocatoria.find((item) => item.id == proyecto.convocatoria_id).pivot.mostrar_resultados ||
                                    checkRole(auth_user, [1, 5, 17, 18, 19]) ? (
                                        <AlertMui className="!leading-2">{proyecto?.estado_evaluacion_proyecto?.estado_evaluacion}</AlertMui>
                                    ) : (
                                        <AlertMui className="!leading-4">Los resultados definitivos se publicarán próximamente.</AlertMui>
                                    )}

                                    {convocatoria.esta_activa && proyecto?.estado_evaluacion_proyecto?.requiere_subsanar && ['3'].includes(convocatoria.fase) && (
                                        <>
                                            <AlertMui severity="warning" className="!mb-1">
                                                <small>Requiere subsanación</small>
                                            </AlertMui>
                                        </>
                                    )}

                                    {checkRole(auth_user, [1, 5, 17, 18, 19]) ? (
                                        <>
                                            <AlertMui className="!leading-2">
                                                <Divider className="!my-2" />
                                                <div>Puntaje: {proyecto?.estado_evaluacion_proyecto?.puntaje_total}</div>
                                                <small>
                                                    Número de recomendaciones: {proyecto?.estado_evaluacion_proyecto?.total_recomendaciones}
                                                    <br />
                                                    Evaluaciones: {proyecto?.estado_evaluacion_proyecto?.cantidad_evaluaciones} habilitada(s) /{' '}
                                                    {proyecto?.estado_evaluacion_proyecto?.evaluaciones_finalizadas} finalizada(s)
                                                </small>
                                            </AlertMui>

                                            {proyecto?.estado_evaluacion_proyecto?.alerta && (
                                                <AlertMui severity="error" className="mt-4 !text-xs">
                                                    Importante: {proyecto?.estado_evaluacion_proyecto?.alerta}
                                                </AlertMui>
                                            )}
                                        </>
                                    ) : null}
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />} className="">
                                        {proyecto.id !== proyecto_linea_65_to_destroy ? (
                                            <div>
                                                <MenuItem
                                                    onClick={() => router.visit(route('convocatorias.proyectos-formulario-1-linea-65.edit', [convocatoria.id, id]))}
                                                    disabled={!proyecto?.allowed?.to_view}>
                                                    {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                                </MenuItem>
                                                <MenuItem>
                                                    <a href={route(`convocatorias.proyectos.pdf-formulario1-linea65`, [convocatoria.id, proyecto.id])} target="_blank" className="flex items-center">
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
                                                                    router.visit(route('convocatorias.proyectos-formulario-1-linea-65.edit', [convocatoria.id, id, { evaluacion_id: evaluacion?.id }]))
                                                                }
                                                                isabled={!is_super_admin}>
                                                                Evaluacion #{evaluacion.id}
                                                            </MenuItem>
                                                        ))}
                                                    </>
                                                )}
                                                <MenuItem
                                                    onClick={() => {
                                                        setProyectoFormulario1Linea65ToDestroy(proyecto.id)
                                                    }}
                                                    disabled={!proyecto?.allowed?.to_destroy}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setProyectoFormulario1Linea65ToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (proyecto.allowed.to_update) {
                                                            router.delete(route('convocatorias.proyectos-formulario-1-linea-65.destroy', [convocatoria.id, proyecto.id]), {
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

                    <PaginationMui links={proyectos_formulario_1_linea_65.links} className="mt-6" />

                    <DialogMui
                        fullWidth={true}
                        maxWidth="md"
                        blurEnabled={true}
                        open={dialog_status}
                        enableGradient={true}
                        dialogContent={
                            <div className="text-white">
                                <span className="pointer-events-none place-items-center gap-2 flex py-2" href="/">
                                    SENNOVA | <SenaLogo className="w-10" />
                                </span>

                                <div className="mb-6">
                                    <strong>Información importante:</strong>
                                    <br />
                                    <br />
                                    Tenga en cuenta los siguientes topes máximos para la formulación de proyectos en el{' '}
                                    <strong>Formulario 1: Evento de Divulgación - Apropiación de la ciencia y la tecnología y cultura de la innovación y la competitividad - Línea 65:</strong>
                                </div>

                                <TableMui rows={['Regional', 'Monto máximo ' + convocatoria.year, 'Cantidad máxima de proyectos ' + convocatoria.year]} sxCellThead={{ width: '320px' }}>
                                    <TableRow></TableRow>
                                    {monto_maximo_por_regional ? (
                                        <>
                                            <TableRow>
                                                <TableCell>{monto_maximo_por_regional.regional.nombre}</TableCell>
                                                <TableCell>${new Intl.NumberFormat('de-DE').format(monto_maximo_por_regional.monto_maximo)} COP</TableCell>
                                                <TableCell>{monto_maximo_por_regional.maximo_proyectos}</TableCell>
                                            </TableRow>
                                            <TableRow></TableRow>
                                        </>
                                    ) : (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={3}>Sin información registrada para su regional</TableCell>
                                            </TableRow>
                                            <TableRow></TableRow>
                                        </>
                                    )}
                                </TableMui>
                            </div>
                        }
                        dialogActions={
                            <>
                                <ButtonMui onClick={() => setDialogStatus(false)} className="!mr-4">
                                    Entendido
                                </ButtonMui>
                            </>
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, Grid, TableRow, TableCell } from '@mui/material'

import Form from './Form'
import Evaluacion from './Evaluacion'

import React from 'react'

import { checkRole } from '@/Utils'

import { useState } from 'react'
import { router } from '@inertiajs/react'

const Productos = ({ auth, convocatoria, proyecto, evaluacion, productos, resultados, subtipologias_minciencias, tipos_producto, actividades_sin_resultado }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [producto_to_destroy, setProductoToDestroy] = useState(null)
    const [dialog_productos_minciencias_status, setDialogProductoMincienciasStatus] = useState(false)
    const [dialog_productos_indicadores_status, setDialogProductoIndicadoresStatus] = useState(false)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [producto, setProducto] = useState(null)

    const tabs =
        proyecto?.tipo_formulario_convocatoria_id == 12 || proyecto?.tipo_formulario_convocatoria_id == 5 || proyecto?.proyectoFormulario10Linea69
            ? [{ label: 'Productos indicador de gestión' }, { label: 'Productos Minciencias' }]
            : proyecto?.tipo_formulario_convocatoria_id == 4 || proyecto?.tipo_formulario_convocatoria_id == 11
            ? [{ label: 'Productos indicador de gestión' }]
            : [{ label: 'Productos Minciencias' }]

    return (
        <AuthenticatedLayout>
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
            </Grid> */}

            {/* <Grid item md={12} className="!mt-20">
                        {is_super_admin || proyecto.mostrar_recomendaciones ? (
                            <>
                                {proyecto.evaluaciones.map((evaluacion, i) =>
                                    is_super_admin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                        <ToolTipMui
                                            key={i}
                                            title={
                                                <div>
                                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                                    {evaluacion.evaluacion_proyecto_linea66 ? (
                                                        <p className="whitespace-pre-line text-xs">
                                                            {evaluacion.evaluacion_proyecto_linea66?.productos_comentario
                                                                ? evaluacion.evaluacion_proyecto_linea66.productos_comentario
                                                                : 'Sin recomendación'}
                                                        </p>
                                                    ) : evaluacion.evaluacion_proyecto_linea65 ? (
                                                        <p className="whitespace-pre-line text-xs">
                                                            {evaluacion.evaluacion_proyecto_linea65?.productos_comentario
                                                                ? evaluacion.evaluacion_proyecto_linea65.productos_comentario
                                                                : 'Sin recomendación'}
                                                        </p>
                                                    ) : (
                                                        evaluacion.evaluacion_proyecto_linea68 && (
                                                            <>
                                                                <hr className="mt-10 mb-10 border-black-200" />
                                                                <h1 className="font-black">Productos</h1>

                                                                <ul className="list-disc pl-4">
                                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_primer_obj_comentario
                                                                            ? 'Recomendación productos del primer objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_primer_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_segundo_obj_comentario
                                                                            ? 'Recomendación productos del segundo objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_segundo_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_tercer_obj_comentario
                                                                            ? 'Recomendación productos del tercer objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_tercer_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                    <li className="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_cuarto_obj_comentario
                                                                            ? 'Recomendación productos del cuarto objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_cuarto_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            }>
                                            Evaluación {i + 1}
                                        </ToolTipMui>
                                    ) : null,
                                )}
                                {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                            </>
                        ) : null}
                    </Grid> */}

            <Grid item md={12}>
                <h1 className="text-3xl mt-24 mb-8  text-center">Productos</h1>
            </Grid>

            <Grid item md={12}>
                <AlertMui className="text-justify my-10">
                    Los productos se entienden como los bienes o servicios que se generan y entregan en un proceso productivo. Los productos materializan los objetivos específicos de los proyectos. De
                    esta forma, los productos de un proyecto deben agotar los objetivos específicos del mismo y deben cumplir a cabalidad con el objetivo general del proyecto.
                    {proyecto.tipo_formulario_convocatoria_id == 12 && (
                        <>
                            <br />
                            Tener en cuenta, de acuerdo con la tipología de portafolio, por ejemplo y sin limitarse a: Variedades vegetales; poblaciones mejoradas de razas pecuarias; Esquemas de
                            circuito integrado; conceptos técnicos; conceptos técnicos (Procesos de Apropiación social del conocimiento para el fortalecimiento de cadenas productivas; procesos de
                            apropiación social del conocimiento resultado del trabajo conjunto entre un Centro de Ciencia y un grupo de investigación; eventos científicos con componente de
                            apropiación; consultorías científico-tecnológicas; publicaciones editoriales no especializadas).{' '}
                        </>
                    )}
                </AlertMui>

                {actividades_sin_resultado > 0 && (
                    <AlertMui severity="error">
                        Tiene actividades sin un resultado asociado. Por favor diríjase al paso de <strong>Metodología - Actividades</strong> y en la pestaña <strong>Actividades</strong>, complete la
                        información solicitada.
                    </AlertMui>
                )}
            </Grid>

            <Grid item md={12} className="!mt-10">
                <TableMui className="mb-8" rows={['Descripción', 'Resultado', 'Unidad / Meta', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {(is_super_admin && actividades_sin_resultado == 0) ||
                    (checkRole(auth_user, [5, 17]) && actividades_sin_resultado == 0) ||
                    (proyecto.allowed.to_update && proyecto.tipo_formulario_convocatoria_id != 4 && actividades_sin_resultado == 0) ? (
                        <TableRow
                            onClick={() => (setDialogProductoMincienciasStatus(true), setMethod('POST'), setProducto(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar producto
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}

                    {productos.map((producto, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="line-clamp-3">{producto.nombre}</p>
                            </TableCell>

                            <TableCell>
                                <p className="line-clamp-3">{producto.resultado.descripcion}</p>
                            </TableCell>

                            <TableCell>
                                {producto.unidad_indicador} /{' '}
                                {producto.meta_indicador ? producto.meta_indicador : <span className="text-red-500 bg-red-100 p-1 rounded inline-block">Sin la unidad definida</span>}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {producto.id !== producto_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogProductoMincienciasStatus(true), setMethod('PUT'), setProducto(producto))} disabled={!proyecto?.allowed?.to_view}>
                                                {proyecto?.allowed?.to_view && !proyecto?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProductoToDestroy(producto.id)
                                                }}
                                                disabled={!proyecto?.allowed?.to_update}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProductoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(route('convocatorias.proyectos.productos.destroy', [convocatoria.id, proyecto.id, producto.id]), {
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

                <DialogMui
                    open={dialog_productos_minciencias_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogProductoMincienciasStatus}
                            method={method}
                            convocatoria={convocatoria}
                            proyecto={proyecto}
                            producto={producto}
                            resultados={resultados}
                            subtipologias_minciencias={subtipologias_minciencias}
                            tipos_producto={tipos_producto}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Productos

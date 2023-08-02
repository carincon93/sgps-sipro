import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, Grid, TableRow, TableCell } from '@mui/material'

import Form from './Form'
import Evaluacion from './Evaluacion'
import TabsMui from '@/Components/TabsMui'
import FormProductoIndicador from './FormProductoIndicador'
import React from 'react'

const Productos = ({ auth, convocatoria, proyecto, evaluacion, productos, resultados, subtipologias_minciencias, tipos_producto }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [producto_to_destroy, setProductoToDestroy] = useState(null)
    const [dialog_productos_minciencias_status, setDialogProductoMincienciasStatus] = useState(false)
    const [dialog_productos_indicadores_status, setDialogProductoIndicadoresStatus] = useState(false)
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [producto, setProducto] = useState(null)

    const tabs =
        proyecto?.proyectoLinea68 || proyecto?.proyectoLinea69 || proyecto?.proyectoHubLinea69
            ? [{ label: 'Productos/Indicadores' }, { label: 'Productos Minciencias' }]
            : proyecto?.proyectoLinea68 || proyecto?.proyectoLinea70 || proyecto?.proyectoLinea83
            ? [{ label: 'Productos/Indicadores' }]
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
                                                        <p class="whitespace-pre-line text-xs">
                                                            {evaluacion.evaluacion_proyecto_linea66?.productos_comentario
                                                                ? evaluacion.evaluacion_proyecto_linea66.productos_comentario
                                                                : 'Sin recomendación'}
                                                        </p>
                                                    ) : evaluacion.evaluacion_proyecto_linea65 ? (
                                                        <p class="whitespace-pre-line text-xs">
                                                            {evaluacion.evaluacion_proyecto_linea65?.productos_comentario
                                                                ? evaluacion.evaluacion_proyecto_linea65.productos_comentario
                                                                : 'Sin recomendación'}
                                                        </p>
                                                    ) : (
                                                        evaluacion.evaluacion_proyecto_linea68 && (
                                                            <>
                                                                <hr class="mt-10 mb-10 border-black-200" />
                                                                <h1 class="font-black">Productos</h1>

                                                                <ul class="list-disc pl-4">
                                                                    <li class="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_primer_obj_comentario
                                                                            ? 'Recomendación productos del primer objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_primer_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                    <li class="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_segundo_obj_comentario
                                                                            ? 'Recomendación productos del segundo objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_segundo_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                    <li class="whitespace-pre-line text-xs mb-10">
                                                                        {evaluacion.evaluacion_proyecto_linea68?.productos_tercer_obj_comentario
                                                                            ? 'Recomendación productos del tercer objetivo específico: ' +
                                                                              evaluacion.evaluacion_proyecto_linea68.productos_tercer_obj_comentario
                                                                            : 'Sin recomendación'}
                                                                    </li>
                                                                    <li class="whitespace-pre-line text-xs mb-10">
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
                <AlertMui className="text-justify my-10">
                    Los productos se entienden como los bienes o servicios que se generan y entregan en un proceso productivo. Los productos materializan los objetivos específicos de los proyectos. De
                    esta forma, los productos de un proyecto deben agotar los objetivos específicos del mismo y deben cumplir a cabalidad con el objetivo general del proyecto.
                </AlertMui>
            </Grid>

            <TabsMui tabs={tabs}>
                {proyecto?.proyectoLinea68 || proyecto?.proyectoLinea69 || proyecto?.proyectoHubLinea69 || proyecto?.proyectoLinea70 || proyecto?.proyectoLinea83 ? (
                    <div>
                        <Grid container className="!mt-20">
                            <Grid item md={12}>
                                {proyecto.codigo_linea_programatica == 70 && (
                                    <AlertMui className="mt-20">
                                        Debe asociar las fechas y actividades a cada uno de los productos haciendo clic en los tres puntos, a continuación, clic en 'Editar'.
                                    </AlertMui>
                                )}
                                <TableMui className="mb-8" rows={['Descripción', 'Objetivo específico', 'Meta', 'Acciones']} sxCellThead={{ width: '320px' }}>
                                    {is_super_admin || checkRole(auth_user, [5, 17]) || (proyecto.allowed.to_update && proyecto.codigo_linea_programatica != 70) ? (
                                        <TableRow
                                            onClick={() => (setDialogProductoIndicadoresStatus(true), setMethod('crear'), setProducto(null))}
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
                                        <React.Fragment key={i}>
                                            {producto.producto_linea68 || producto.producto_linea69 || producto.producto_linea70 ? (
                                                <TableRow>
                                                    <TableCell>
                                                        <p className="line-clamp-3">{producto.nombre}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="line-clamp-3">{producto.resultado.objetivo_especifico.descripcion ?? 'Sin información registrada'}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <>
                                                            {proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 83 ? (
                                                                <>
                                                                    {producto.producto_linea69?.valor_proyectado ??
                                                                        producto.producto_linea70?.valor_proyectado ??
                                                                        producto.producto_linea83?.valor_proyectado}
                                                                </>
                                                            ) : null}

                                                            {proyecto.codigo_linea_programatica == 68 ? <>{producto.producto_linea68?.meta_indicador}</> : null}
                                                        </>
                                                    </TableCell>

                                                    <TableCell>
                                                        <MenuMui text={<MoreVertIcon />}>
                                                            {producto.id !== producto_to_destroy ? (
                                                                <div>
                                                                    <MenuItem
                                                                        onClick={() => (setDialogProductoIndicadoresStatus(true), setMethod('editar'), setProducto(producto))}
                                                                        disabled={!proyecto.allowed.to_update}
                                                                        className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                                        Editar
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            setProductoToDestroy(producto.id)
                                                                        }}>
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
                                            ) : null}
                                        </React.Fragment>
                                    ))}
                                </TableMui>

                                <DialogMui
                                    open={dialog_productos_indicadores_status}
                                    fullWidth={true}
                                    maxWidth="lg"
                                    blurEnabled={true}
                                    dialogContent={
                                        <FormProductoIndicador
                                            is_super_admin={is_super_admin}
                                            setDialogStatus={setDialogProductoIndicadoresStatus}
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
                        </Grid>
                    </div>
                ) : null}
                {proyecto?.proyectoLinea65 || proyecto?.proyectoLinea66 || proyecto?.proyectoHubLinea69 ? (
                    <div>
                        <Grid container className="!mt-20">
                            {proyecto.codigo_linea_programatica == 70 && (
                                <AlertMui className="mt-20">
                                    Debe asociar las fechas y actividades a cada uno de los productos haciendo clic en los tres puntos, a continuación, clic en 'Editar'.
                                </AlertMui>
                            )}
                            <TableMui className="mb-8" rows={['Descripción', 'Objetivo específico', 'Resultado', 'Acciones']} sxCellThead={{ width: '320px' }}>
                                {is_super_admin || checkRole(auth_user, [5, 17]) || (proyecto.allowed.to_update && proyecto.codigo_linea_programatica != 70) ? (
                                    <TableRow
                                        onClick={() => (setDialogProductoMincienciasStatus(true), setMethod('crear'), setProducto(null))}
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
                                    <React.Fragment key={i}>
                                        {producto.producto_minciencias_linea65 || producto.producto_minciencias_linea66 || producto.producto_minciencias_linea69 ? (
                                            <TableRow>
                                                <TableCell>{producto.nombre}</TableCell>
                                                <TableCell>
                                                    <p className="line-clamp-3">{producto.resultado.objetivo_especifico.descripcion ?? 'Sin información registrada'}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="line-clamp-3">
                                                        {proyecto.codigo_linea_programatica != 70 && proyecto.codigo_linea_programatica != 83 ? (
                                                            <>Código {producto.resultado.id + ' - ' + producto.resultado.descripcion}</>
                                                        ) : null}
                                                    </p>
                                                </TableCell>

                                                <TableCell>
                                                    <MenuMui text={<MoreVertIcon />}>
                                                        {producto.id !== producto_to_destroy ? (
                                                            <div>
                                                                <MenuItem
                                                                    onClick={() => (setDialogProductoMincienciasStatus(true), setMethod('editar'), setProducto(producto))}
                                                                    disabled={!proyecto.allowed.to_update}
                                                                    className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                                    Editar
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        setProductoToDestroy(producto.id)
                                                                    }}>
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
                                        ) : null}
                                    </React.Fragment>
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
                    </div>
                ) : null}
            </TabsMui>
        </AuthenticatedLayout>
    )
}

export default Productos

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import { checkRole } from '@/Utils'

import { router } from '@inertiajs/react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, Grid, TableRow, TableCell } from '@mui/material'
import { useState } from 'react'
import Form from './Form'

const Productos = ({ auth, convocatoria, proyecto, productos, validacionResultados, resultados, subtipologiasMinciencias, tiposProducto }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [productoToDestroy, setProductoToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [producto, setProducto] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Productos</h1>
                <p className="text-justify mb-10">Los productos se entienden como los bienes o servicios que se generan y entregan en un proceso productivo. Los productos materializan los objetivos específicos de los proyectos. De esta forma, los productos de un proyecto deben agotar los objetivos específicos del mismo y deben cumplir a cabalidad con el objetivo general del proyecto.</p>
                {validacionResultados && (
                    <AlertMui hiddenIcon={true} className="mt-10 mb-10">
                        {validacionResultados}
                    </AlertMui>
                )}

                {isSuperAdmin || checkRole(authUser, [5, 17]) || (proyecto.allowed.to_update && validacionResultados == null && proyecto.modificable == true && proyecto.codigo_linea_programatica != 70) ? (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setProducto(null))} variant="raised">
                        Crear producto
                    </ButtonMui>
                ) : null}
            </Grid>

            <Grid item md={12}>
                {proyecto.codigo_linea_programatica == 70 && <AlertMui hiddenIcon={true}>Debe asociar las fechas y actividades a cada uno de los productos haciendo clic en los tres puntos, a continuación, clic en 'Editar'.</AlertMui>}
                <TableMui rows={['Descripción', 'Objetivo específico', 'Resultado/Meta', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {productos.data.map((producto, i) => (
                        <TableRow key={i}>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell>{producto.resultado.objetivo_especifico.descripcion}</TableCell>
                            <TableCell>{proyecto.codigo_linea_programatica != 69 && proyecto.codigo_linea_programatica != 70 ? <>Código {producto.resultado.id + '-' + producto.resultado.descripcion}</> : proyecto.codigo_linea_programatica == 69 || (proyecto.codigo_linea_programatica == 70 && <>{producto.producto_ta_tp?.valor_proyectado}</>)}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {producto.id !== productoToDestroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('editar'), setProducto(producto))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setProductoToDestroy(producto.id)
                                                }}
                                            >
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProductoToDestroy(null)
                                                }}
                                            >
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

                <PaginationMui links={productos.links} />

                <DialogMui open={dialogStatus} fullWidth={true} maxWidth="lg" blurEnabled={true} dialogContent={<Form isSuperAdmin={isSuperAdmin} setDialogStatus={setDialogStatus} method={method} convocatoria={convocatoria} proyecto={proyecto} producto={producto} resultados={resultados} subtipologiasMinciencias={subtipologiasMinciencias} tiposProducto={tiposProducto} />} />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Productos

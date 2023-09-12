import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import { Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import dayjs from 'dayjs'

const Index = ({ auth, ambientes_modernizacion, codigos_sgps_faltantes }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [ambiente_modernizacion, setAmbienteModernizacion] = useState(null)
    const [ambiente_modernizacion_to_destroy, setAmbienteModernizacionToDestroy] = useState(null)

    const current_year = dayjs().year()

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Seguimiento post cierre - Ambientes de modernización SENNOVA</h2>}>
            <Grid item md={12}>
                <AlertMui className="mb-20">
                    Este espacio está dispuesto para que cada Centro de Formación pueda realizar el registro permanente del seguimiento post cierre de los proyectos ejecutados en vigencias pasadas de
                    la línea 23 SENNOVA con la actualización y/o modernización tecnológica de los ambientes de formación. Tener en cuenta que se debe hacer la validación del registro completo por
                    parte del dinamizador/a SENNOVA y encargado del proyecto o ambiente.
                </AlertMui>

                {codigos_sgps_faltantes.length > 0 && (
                    <AlertMui class="mb-20" severity="error">
                        <h1 class="font-black text-center mb-10">Proyectos sin seguimiento</h1>
                        <ul class="pl-4 list-disc">
                            {codigos_sgps_faltantes.map((sgps) => (
                                <li>
                                    <strong>Título: </strong>
                                    {sgps.titulo}
                                    <br />
                                    <strong>Código: </strong>SGPS-{sgps.codigo_sgps + '-' + sgps.year_ejecucion}
                                </li>
                            ))}
                        </ul>
                    </AlertMui>
                )}

                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Regional', 'Código SGPS del proyecto', 'Estado', 'Equipos', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) ? (
                        <TableRow onClick={() => router.visit(route('ambientes-modernizacion.create'))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={6}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar nuevo ambiente de modernización
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {ambientes_modernizacion.data.map((ambiente_modernizacion, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="line-clamp-4">{ambiente_modernizacion.nombre_ambiente}</p>
                            </TableCell>
                            <TableCell>{ambiente_modernizacion.seguimiento_ambiente_modernizacion.centro_formacion.regional.nombre}</TableCell>
                            <TableCell>
                                SGPS-
                                {ambiente_modernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.codigo_sgps +
                                    '-' +
                                    ambiente_modernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.year_ejecucion}
                            </TableCell>

                            <TableCell>{ambiente_modernizacion.estado}</TableCell>

                            <TableCell>
                                <Link
                                    href={route('equipos-ambiente-modernizacion.index', [ambiente_modernizacion.seguimiento_ambiente_modernizacion.id])}
                                    className="!bg-app-800 hover:!bg-app-50 !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer">
                                    <PrecisionManufacturingIcon className="mr-2" />
                                    Debe relacionar los equipos del ambiente
                                </Link>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {ambiente_modernizacion.id !== ambiente_modernizacion_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setAmbienteModernizacion(ambiente_modernizacion))}>Seguimientos</MenuItem>

                                            <Divider />

                                            <MenuItem
                                                onClick={() => {
                                                    setAmbienteModernizacionToDestroy(ambiente_modernizacion.id)
                                                }}
                                                disabled={!is_super_admin}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setAmbienteModernizacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('ambientes-modernizacion.destroy', [ambiente_modernizacion.id]), {
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
                <PaginationMui links={ambientes_modernizacion.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <>
                            <p className="mb-6">Seleccione una fecha de seguimiento:</p>

                            {ambiente_modernizacion && (
                                <>
                                    {ambiente_modernizacion?.seguimiento_ambiente_modernizacion.ambientes_modernizacion.some((item) => item.year_modernizacion == current_year) ? (
                                        <AlertMui severity="error">No puede agregar otro registro debido a que ya ha generado el respectivo seguimiento para el año {current_year}.</AlertMui>
                                    ) : (
                                        <ButtonMui onClick={() => router.post(route('seguimientos-ambiente-modernizacion.replicate', [ambiente_modernizacion?.seguimiento_ambiente_modernizacion.id]))}>
                                            Agregar seguimiento para el año {current_year}
                                        </ButtonMui>
                                    )}
                                    <ul>
                                        {ambiente_modernizacion.seguimiento_ambiente_modernizacion.ambientes_modernizacion.map((seguimiento, i) => (
                                            <li key={i}>
                                                <Link className="bg-white hover:bg-white/50 shadow p-2 rounded my-2 block" href={route('ambientes-modernizacion.edit', seguimiento.id)}>
                                                    Seguimiento: {seguimiento.fecha_seguimiento}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    }
                    dialogActions={
                        <ButtonMui type="button" onClick={() => setDialogStatus(false)} className="!mr-4">
                            Cancelar
                        </ButtonMui>
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

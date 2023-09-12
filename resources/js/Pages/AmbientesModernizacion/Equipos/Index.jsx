import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'
import AlertMui from '@/Components/Alert'

const Index = ({ auth, ambiente_modernizacion, equipos_ambiente_modernizacion, roles_sennova }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [equipo_ambiente_modernizacion, setEquipo] = useState(null)
    const [equipo_ambiente_modernizacion_to_destroy, setEquipoToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Equipos del ambiente de modernización SENNOVA</h2>}>
            <Grid item md={12}>
                <h1 className="text-center text-2xl mb-32">
                    Equipos del proyecto SGPS-
                    {ambiente_modernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.codigo_sgps +
                        ' | ' +
                        ambiente_modernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.titulo}
                </h1>

                <AlertMui>Relacione únicamente los equipos y maquinaría adquirida con la ejecución del proyecto de modernización SENNOVA</AlertMui>

                <TableMui
                    rows={[
                        'Número de inventario SENA del equipo o maquina',
                        'Información del equipo o maquina',
                        'Información del cuentadante',
                        'Descripción general técnica del equipo o maquina',
                        'Acciones',
                    ]}
                    sxCellThead={{ width: '320px' }}>
                    {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setEquipo(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={6}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar nuevo equipo
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {equipos_ambiente_modernizacion.map((equipo_ambiente_modernizacion, i) => (
                        <TableRow key={i}>
                            <TableCell>{equipo_ambiente_modernizacion.numero_inventario_equipo}</TableCell>
                            <TableCell>{equipo_ambiente_modernizacion.descripcion_tecnica_equipo}</TableCell>
                            <TableCell>
                                <div className="my-4">
                                    <strong>Nombre del cuentadante:</strong>
                                    <br />
                                    {equipo_ambiente_modernizacion.nombre_cuentadante}
                                </div>
                                <div className="my-4">
                                    <strong>Cédula del cuentadante:</strong>
                                    <br />
                                    {equipo_ambiente_modernizacion.cedula_cuentadante}
                                </div>

                                <div className="my-4">
                                    <strong>Rol del cuentadante:</strong>
                                    <br />
                                    {equipo_ambiente_modernizacion.rol_cuentadante}
                                </div>
                            </TableCell>
                            <TableCell>{equipo_ambiente_modernizacion.descripcion_tecnica_equipo}</TableCell>
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {equipo_ambiente_modernizacion.id !== equipo_ambiente_modernizacion_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setEquipo(equipo_ambiente_modernizacion))}>Editar</MenuItem>

                                            <Divider />

                                            <MenuItem
                                                onClick={() => {
                                                    setEquipoToDestroy(equipo_ambiente_modernizacion.id)
                                                }}
                                                disabled={!is_super_admin}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setEquipoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('equipos-ambiente-modernizacion.destroy', [equipo_ambiente_modernizacion.id]), {
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
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            setDialogStatus={setDialogStatus}
                            method={method}
                            ambiente_modernizacion={ambiente_modernizacion}
                            roles_sennova={roles_sennova}
                            equipo_ambiente_modernizacion={equipo_ambiente_modernizacion}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

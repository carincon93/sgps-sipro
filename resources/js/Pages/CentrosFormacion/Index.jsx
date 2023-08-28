import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, centros_formacion, regionales, subdirectores, dinamizadores_sennova }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [centro_formacion, setCentroFormacion] = useState(null)
    const [centro_formacion_to_destroy, setCentroFormacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Centros de formación</h2>}>
            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Regional', 'Dinamizador/a SENNOVA', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {is_super_admin ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setCentroFormacion(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar centro de formación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {centros_formacion.data.map((centro_formacion, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Chip className="mb-2" size="small" label={'Código: ' + centro_formacion.codigo} />
                                <br />
                                {centro_formacion.nombre}
                            </TableCell>

                            <TableCell>{centro_formacion?.regional?.nombre}</TableCell>
                            <TableCell>
                                {centro_formacion.dinamizador_sennova?.nombre}
                                <br />
                                {centro_formacion.dinamizador_sennova?.email}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {centro_formacion.id !== centro_formacion_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setCentroFormacion(centro_formacion))} disabled={!centro_formacion?.allowed?.to_update}>
                                                {centro_formacion?.allowed?.to_view && !centro_formacion?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>

                                            {is_super_admin && (
                                                <MenuItem
                                                    onClick={() => {
                                                        setCentroFormacionToDestroy(centro_formacion.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setCentroFormacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('centros-formacion.destroy', [centro_formacion.id]), {
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

                <PaginationMui links={centros_formacion.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            centro_formacion={centro_formacion}
                            centros_formacion={centros_formacion}
                            regionales={regionales}
                            subdirectores={subdirectores}
                            dinamizadores_sennova={dinamizadores_sennova}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

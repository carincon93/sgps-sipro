import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, roles_sennova, lineas_programaticas }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [rol_sennova, setRolSennova] = useState(null)
    const [rol_sennova_to_destroy, setRolSennovaToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Roles SENNOVA</h2>}>
            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Línea programática', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setRolSennova(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar rol SENNOVA
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {roles_sennova.data.map((rol_sennova, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="first-letter:uppercase">{rol_sennova.nombre}</p>
                            </TableCell>

                            <TableCell>
                                <p className="first-letter:uppercase">{rol_sennova.linea_programatica?.nombre}</p>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {rol_sennova.id !== rol_sennova_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setRolSennova(rol_sennova))}>Editar</MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setRolSennovaToDestroy(rol_sennova.id)
                                                }}
                                                disabled={!is_super_admin}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setRolSennovaToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('roles-sennova.destroy', [rol_sennova.id]), {
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

                <PaginationMui links={roles_sennova.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} rol_sennova={rol_sennova} lineas_programaticas={lineas_programaticas} />}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

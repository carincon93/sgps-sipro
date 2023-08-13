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

const Index = ({ auth, tecnoacademias }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [tecnoacademia, setTecnoacademia] = useState(null)
    const [tecnoacademia_to_destroy, setTecnoacademiaToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">TecnoAcademias</h2>}>
            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['TecnoAcademia', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {is_super_admin ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setTecnoacademia(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar TecnoAcademia
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {tecnoacademias.data.map((tecnoacademia, i) => (
                        <TableRow key={i}>
                            <TableCell>{tecnoacademia.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {tecnoacademia.id !== tecnoacademia_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setTecnoacademia(tecnoacademia))} disabled={!is_super_admin}>
                                                Editar
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setTecnoacademiaToDestroy(tecnoacademia.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setTecnoacademiaToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('hubs-innovacion.destroy', [tecnoacademia.id]), {
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

                <PaginationMui links={tecnoacademias.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} tecnoacademia={tecnoacademia} />}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

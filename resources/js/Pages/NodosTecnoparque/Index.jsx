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
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, nodos_tecnoparque, centros_formacion }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [nodo_tecnoparque, setNodoTecnoparque] = useState(null)
    const [nodo_tecnoparque_to_destroy, setNodoTecnoparqueToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Nodos Tecnoparque" />

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nodo', 'Centro de formación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setNodoTecnoparque(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar Nodo Tecnoparque
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {nodos_tecnoparque.data.map((nodo_tecnoparque, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="first-letter:uppercase">{nodo_tecnoparque.nombre}</p>
                            </TableCell>

                            <TableCell>{nodo_tecnoparque?.centro_formacion?.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {nodo_tecnoparque.id !== nodo_tecnoparque_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setNodoTecnoparque(nodo_tecnoparque))}>Editar</MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setNodoTecnoparqueToDestroy(nodo_tecnoparque.id)
                                                }}
                                                disabled={!is_super_admin}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setNodoTecnoparqueToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('nodos-tecnoparque.destroy', [nodo_tecnoparque.id]), {
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

                <PaginationMui links={nodos_tecnoparque.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} nodo_tecnoparque={nodo_tecnoparque} centros_formacion={centros_formacion} />}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

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
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, tecnoacademias, modalidades, centros_formacion, lineas_tecnoacademia }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [tecnoacademia, setTecnoacademia] = useState(null)
    const [tecnoacademia_to_destroy, setTecnoacademiaToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Tecnoacademias" />

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Modalidad', 'Centro de formación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) ? (
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
                            <TableCell>
                                <p className="capitalize">{tecnoacademia.nombre}</p>
                            </TableCell>
                            <TableCell>
                                <p className="first-letter:uppercase">{modalidades.find((item) => item.value == tecnoacademia.modalidad).label}</p>
                            </TableCell>
                            <TableCell>{tecnoacademia.centro_formacion.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {tecnoacademia.id !== tecnoacademia_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setTecnoacademia(tecnoacademia))}>Editar</MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setTecnoacademiaToDestroy(tecnoacademia.id)
                                                }}
                                                disabled={!is_super_admin}>
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
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            tecnoacademia={tecnoacademia}
                            modalidades={modalidades}
                            centros_formacion={centros_formacion}
                            lineas_tecnoacademia={lineas_tecnoacademia}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

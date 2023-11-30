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

const Index = ({ auth, intangibles, tipos_intangibles }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [intangible, setIntanbible] = useState(null)
    const [intangible_to_destroy, setIntangibleToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Intangibles" />

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Código', 'Nombre', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setIntanbible(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                        <TableCell colSpan={4}>
                            <ButtonMui>
                                <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar intangible
                            </ButtonMui>
                        </TableCell>
                    </TableRow>
                    {intangibles.data.map((intangible, i) => (
                        <TableRow key={i}>
                            <TableCell>{intangible.codigo_intangible}</TableCell>
                            <TableCell>{intangible.nombre_intangible}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {intangible.id !== intangible_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setIntanbible(intangible))} disabled={!is_super_admin}>
                                                {intangible?.allowed?.to_view && !intangible?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>

                                            {is_super_admin && (
                                                <MenuItem
                                                    onClick={() => {
                                                        setIntangibleToDestroy(intangible.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setIntangibleToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('intangibles.destroy', [intangible.id]), {
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

                <PaginationMui links={intangibles.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} intangible={intangible} tipos_intangibles={tipos_intangibles} />}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

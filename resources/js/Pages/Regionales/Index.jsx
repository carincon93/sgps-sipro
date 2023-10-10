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

const Index = ({ auth, regionales, regiones, directores_regionales }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [regional, setRegional] = useState(null)
    const [regional_to_destroy, setRegionalToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Regionales" />

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Director/a', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {is_super_admin ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setRegional(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar regional
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {regionales.data.map((regional, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Chip className="mr-2" size="small" label={'Código: ' + regional.codigo} />
                                {regional.nombre}
                            </TableCell>

                            <TableCell>
                                {regional.director_regional?.nombre}
                                <br />
                                {regional.director_regional?.email}
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {regional.id !== regional_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setRegional(regional))} disabled={!is_super_admin}>
                                                {regional?.allowed?.to_view && !regional?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>

                                            {is_super_admin && (
                                                <MenuItem
                                                    onClick={() => {
                                                        setRegionalToDestroy(regional.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setRegionalToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('centros-formacion.destroy', [regional.id]), {
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

                <PaginationMui links={regionales.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} regional={regional} regiones={regiones} directores_regionales={directores_regionales} />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

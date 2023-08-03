import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, usuarios, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [user_to_destroy, setUserToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}>
            <Grid item md={12}>
                <div>
                    {allowed_to_create && (
                        <Link href={route('users.create')} variant="raised">
                            Crear usuario
                        </Link>
                    )}
                </div>
            </Grid>

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Correo electrónico', 'Centro de formación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {usuarios.data.map((usuario, i) => (
                        <TableRow key={i}>
                            <TableCell>{usuario.nombre}</TableCell>
                            <TableCell>{usuario.email}</TableCell>
                            <TableCell>{usuario.centro_formacion?.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {usuario.id !== user_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => router.visit(route('users.edit', [usuario.id]))}
                                                disabled={!usuario?.allowed?.to_view}
                                                className={!usuario?.allowed?.to_view ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setUserToDestroy(usuario.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setUserToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (usuario.allowed.to_update) {
                                                        router.delete(route('users.destroy', [usuario.id]), {
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

                <PaginationMui links={usuarios.links} className="mt-8" />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

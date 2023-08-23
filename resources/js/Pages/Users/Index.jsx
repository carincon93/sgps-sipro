 import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'
import TabsMui from '@/Components/TabsMui'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, usuarios, dinamizadores_sennova, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [user_to_destroy, setUserToDestroy] = useState(null)

    const tabs = checkRole(auth_user, [1, 20]) ? [{ label: 'Usuarios' }, { label: 'Dinamizadores SENNOVA' }] : [{ label: 'Usuarios' }]
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}>
            <Grid item md={12}>
                <div></div>
            </Grid>

            <TabsMui tabs={tabs}>
                <Grid item md={12}>
                    <SearchBar className="mt-20" />

                    <TableMui className="mt-20" rows={['Nombre', 'Correo electrónico', 'Centro de formación', 'Regional', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {allowed_to_create ? (
                            <TableRow onClick={() => router.visit(route('users.create'))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                <TableCell colSpan={5}>
                                    <ButtonMui>
                                        <AddCircleOutlineOutlinedIcon className="mr-1" /> Crear usuario
                                    </ButtonMui>
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {usuarios.data.map((usuario, i) => (
                            <TableRow key={i}>
                                <TableCell>{usuario.nombre}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.centro_formacion?.nombre}</TableCell>
                                <TableCell>{usuario.centro_formacion?.regional.nombre}</TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {usuario.id !== user_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => router.visit(route('users.edit', [usuario.id]))} disabled={!usuario?.allowed?.to_view}>
                                                    Editar
                                                </MenuItem>

                                                {is_super_admin && (
                                                    <MenuItem
                                                        onClick={() => {
                                                            setUserToDestroy(usuario.id)
                                                        }}>
                                                        Eliminar
                                                    </MenuItem>
                                                )}
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

                <Grid item md={12}>
                    <TableMui className="mt-20" rows={['Nombre', 'Centro de formación al que pertenece', 'Dinamizador/a del centro de formación:', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {dinamizadores_sennova.map((dinamizador_sennova, i) => (
                            <TableRow key={i}>
                                <TableCell>{dinamizador_sennova.nombre}</TableCell>
                                <TableCell>
                                    {dinamizador_sennova.centro_formacion?.nombre} - Código: {dinamizador_sennova.centro_formacion?.codigo}
                                </TableCell>
                                <TableCell>
                                    {dinamizador_sennova.dinamizador_centro_formacion ? (
                                        dinamizador_sennova.dinamizador_centro_formacion?.nombre + ' - Código: ' + dinamizador_sennova.dinamizador_centro_formacion?.codigo
                                    ) : (
                                        <span className="text-red-500 bg-red-100 p-2 block">Tiene rol Dinamizador/a pero no tiene ningún Centro relacionado</span>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {dinamizador_sennova.id !== user_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => router.visit(route('users.edit', [dinamizador_sennova.id]))} disabled={!checkRole(auth_user, [1, 20])}>
                                                    Editar
                                                </MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setUserToDestroy(dinamizador_sennova.id)
                                                    }}
                                                    disabled={!checkRole(auth_user, [1, 20, 18, 19, 5, 17])}>
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
                                                        if (checkRole(auth_user, [1, 20, 18, 19, 5, 17])) {
                                                            router.delete(route('users.destroy', [dinamizador_sennova.id]), {
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
                </Grid>
            </TabsMui>
        </AuthenticatedLayout>
    )
}

export default Index

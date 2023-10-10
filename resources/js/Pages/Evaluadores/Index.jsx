import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'
import ToolTipMui from '@/Components/Tooltip'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Divider, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

const Index = ({ auth, evaluadores }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [user_to_destroy, setUserToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Evaluadores" />

            <Grid container>
                <Grid item md={12}>
                    <SearchBar className="mt-20" />

                    <TableMui className="mt-20" rows={['Nombre', 'Correo electrónico', 'Centro de formación', 'Regional', 'Estado / Rol', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {evaluadores.data.map((evaluador, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex">
                                        {evaluador.habilitado && !evaluador.informacion_completa && (
                                            <ToolTipMui title="El evaluador no ha completado el CENSO SENNOVA" className="text-red-400">
                                                <InfoOutlinedIcon className="mr-1" />
                                            </ToolTipMui>
                                        )}
                                        <p className="uppercase">{evaluador.nombre}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{evaluador.email}</TableCell>
                                <TableCell>{evaluador.centro_formacion?.nombre}</TableCell>
                                <TableCell>{evaluador.centro_formacion?.regional.nombre}</TableCell>
                                <TableCell>
                                    <Chip
                                        className={`${evaluador.habilitado ? '!bg-blue-200 !text-blue-500' : '!bg-red-200 !text-red-500'}`}
                                        size="small"
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{evaluador.habilitado ? 'Habilitado/a' : 'Deshabilitado/a'}</div>
                                            </>
                                        }
                                    />

                                    <Chip
                                        size="small"
                                        className="mt-2"
                                        label={evaluador.roles.find((item) => item.id == 11) ? 'Evaluador interno' : evaluador.roles.find((item) => item.id == 33) ? 'Evaluador externo' : ''}
                                    />
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {evaluador.id !== user_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => router.visit(route('users.edit', [evaluador.id]))} disabled={!is_super_admin}>
                                                    Editar
                                                </MenuItem>

                                                <MenuItem
                                                    onClick={(e) =>
                                                        router.put(
                                                            route('users.habilitar-evaluador'),
                                                            {
                                                                user_id: evaluador?.id,
                                                                habilitado: !evaluador.habilitado,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }>
                                                    {evaluador.habilitado ? 'Deshabilitar' : 'Habilitar'}
                                                </MenuItem>

                                                {is_super_admin && (
                                                    <>
                                                        <Divider />
                                                        <MenuItem
                                                            onClick={() => {
                                                                setUserToDestroy(evaluador.id)
                                                            }}>
                                                            Eliminar
                                                        </MenuItem>
                                                    </>
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
                                                        if (evaluador.allowed.to_update) {
                                                            router.delete(route('users.destroy', [evaluador.id]), {
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

                    <PaginationMui links={evaluadores.links} className="mt-8" />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

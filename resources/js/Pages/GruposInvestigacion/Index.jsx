import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

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
import DialogMui from '@/Components/Dialog'
import Form from './Form'
import ButtonMui from '@/Components/Button'

const Index = ({ auth, grupos_investigacion, grupos_investigacion_centro_formacion, centros_formacion, categorias_minciencias, redes_conocimiento, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [grupo_investigacion, setGrupoInvestigacion] = useState(null)
    const [grupo_investigacion_to_destroy, setGrupoInvestigacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Grupos de investigación de mi centro de formación</h2>}>
            <Grid item md={12}>
                <h1 className="text-2xl text-center my-20">{centros_formacion.find((item) => (item.value = auth_user.centro_formacion_id)).label}</h1>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Centro de formación', 'Regional', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {allowed_to_create ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setGrupoInvestigacion(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar grupo de investigación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {grupos_investigacion_centro_formacion.map((grupo_investigacion, i) => (
                        <TableRow key={i}>
                            <TableCell>{grupo_investigacion.nombre}</TableCell>

                            <TableCell> {grupo_investigacion.centro_formacion?.nombre}</TableCell>
                            <TableCell>{grupo_investigacion.centro_formacion?.regional?.nombre}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {grupo_investigacion.id !== grupo_investigacion_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.visit(route('grupos-investigacion.lineas-investigacion.index', [grupo_investigacion.id]), {
                                                        preserveScroll: true,
                                                    })
                                                }}>
                                                Líneas de investigación
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('PUT'), setGrupoInvestigacion(grupo_investigacion))}
                                                disabled={!grupo_investigacion?.allowed?.to_view}>
                                                Editar
                                            </MenuItem>

                                            {is_super_admin && (
                                                <MenuItem
                                                    onClick={() => {
                                                        setGrupoInvestigacionToDestroy(grupo_investigacion.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setGrupoInvestigacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (grupo_investigacion.allowed.to_update) {
                                                        router.delete(route('grupos-investigacion.destroy', [grupo_investigacion.id]), {
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

                <PaginationMui links={grupos_investigacion_centro_formacion.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            is_super_admin={is_super_admin}
                            setDialogStatus={setDialogStatus}
                            allowed_to_create={allowed_to_create}
                            method={method}
                            grupo_investigacion={grupo_investigacion}
                            centros_formacion={centros_formacion}
                            categorias_minciencias={categorias_minciencias}
                            redes_conocimiento={redes_conocimiento}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

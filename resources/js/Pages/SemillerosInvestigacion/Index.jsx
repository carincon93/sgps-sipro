import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Breadcrumbs, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, grupo_investigacion, linea_investigacion, lineas_investigacion, semilleros_investigacion, redes_conocimiento, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [semillero_investigacion, setSemilleroInvestigacion] = useState(null)
    const [semillero_investigacion_to_destroy, setSemilleroInvestigacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Semilleros de investigación</h2>}>
            <Grid item md={12} className="!mb-20">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href={route('grupos-investigacion.index')}>
                        Grupos de investigación
                    </Link>
                    <Link underline="hover" color="inherit" href="#">
                        {grupo_investigacion.nombre}
                    </Link>
                    <Link underline="hover" href={route('grupos-investigacion.lineas-investigacion.index', [grupo_investigacion.id])}>
                        Líneas de investigación
                    </Link>
                    <Link underline="hover" color="inherit" href="#">
                        {linea_investigacion.nombre}
                    </Link>
                    <Link underline="hover" color="text.primary" href="#" aria-current="page">
                        Semilleros de investigación
                    </Link>
                </Breadcrumbs>
            </Grid>
            <Grid item md={12}>
                <SearchBar routeParams={[grupo_investigacion.id]} />

                <TableMui className="mt-20" rows={['Nombre', 'Línea de investigación principal', 'Centro Código', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {allowed_to_create ? (
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setSemilleroInvestigacion(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar semillero de investigación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {semilleros_investigacion.data.map((semillero_investigacion, i) => (
                        <TableRow key={i}>
                            <TableCell>{semillero_investigacion.nombre}</TableCell>
                            <TableCell> {semillero_investigacion.nombre_linea_principal}</TableCell>
                            <TableCell>{semillero_investigacion.codigo}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {semillero_investigacion.id !== semillero_investigacion_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('PUT'), setSemilleroInvestigacion(semillero_investigacion))}
                                                disabled={!semillero_investigacion?.allowed?.to_view}>
                                                Editar
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setSemilleroInvestigacionToDestroy(semillero_investigacion.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setSemilleroInvestigacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (semillero_investigacion.allowed.to_update) {
                                                        router.delete(
                                                            route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.destroy', [
                                                                grupo_investigacion.id,
                                                                linea_investigacion.id,
                                                                semillero_investigacion.id,
                                                            ]),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
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

                <PaginationMui links={semilleros_investigacion.links} className="mt-8" />

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
                            linea_investigacion={linea_investigacion}
                            lineas_investigacion={lineas_investigacion}
                            semillero_investigacion={semillero_investigacion}
                            redes_conocimiento={redes_conocimiento}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

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

const Index = ({ auth, laboratorios_servicios_tecnologicos, centros_formacion }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [laboratorio_st, setLaboratorioServicioTecnologico] = useState(null)
    const [laboratorio_servicio_tecnologicso_to_destroys, setLaboratorioServicioTecnologicoToDestroy] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laboratorios de Servicios Tecnológicos</h2>}>
            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Laboratorio', 'Regional', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {is_super_admin ? (
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setLaboratorioServicioTecnologico(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar laboratorio
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {laboratorios_servicios_tecnologicos.data.map((laboratorio_st, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <p className="whitespace-break-spaces">{laboratorio_st?.laboratorio}</p>
                            </TableCell>
                            <TableCell>
                                <p className="capitalize">{laboratorio_st?.regional_nombre}</p>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {laboratorio_st.id !== laboratorio_servicio_tecnologicso_to_destroys ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setLaboratorioServicioTecnologico(laboratorio_st))} disabled={!is_super_admin}>
                                                Editar
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setLaboratorioServicioTecnologicoToDestroy(laboratorio_st.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setLaboratorioServicioTecnologicoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('laboratorios-servicios-tecnologicos.destroy', [laboratorio_st.id]), {
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

                <PaginationMui links={laboratorios_servicios_tecnologicos.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} laboratorio_st={laboratorio_st} centros_formacion={centros_formacion} />}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

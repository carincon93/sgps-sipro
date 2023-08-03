import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { checkRole } from '@/Utils'
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const ConvocatoriaAnexos = ({ auth, convocatoria, convocatoria_anexos, anexos, lineas_programaticas }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [convocatoria_anexo_to_destroy, setConvocatoriaAnexoToDestroy] = useState(null)
    const [convocatoria_anexo, setConvocatoriaAnexo] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Nombre', 'Líneas programáticas', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setConvocatoriaAnexo(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                        <TableCell colSpan={4}>
                            <ButtonMui>
                                <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar anexo
                            </ButtonMui>
                        </TableCell>
                    </TableRow>
                    {convocatoria_anexos.map((convocatoria_anexo, i) => (
                        <TableRow key={i}>
                            <TableCell>{convocatoria_anexo.anexo.nombre}</TableCell>
                            <TableCell>
                                {convocatoria_anexo.lineas_programaticas.map((linea_programatica, i) => (
                                    <Chip key={i} className="m-1" label={linea_programatica.nombre + ' - ' + linea_programatica.codigo} />
                                ))}
                            </TableCell>
                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {convocatoria_anexo.id !== convocatoria_anexo_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setConvocatoriaAnexo(convocatoria_anexo))}>Editar</MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setConvocatoriaAnexoToDestroy(convocatoria_anexo.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setConvocatoriaAnexoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.delete(route('convocatorias.convocatoria-anexos.destroy', [convocatoria.id, convocatoria_anexo.id]), {
                                                        preserveScroll: true,
                                                    })
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
                            convocatoria={convocatoria}
                            convocatoria_anexo={convocatoria_anexo}
                            anexos={anexos}
                            lineas_programaticas={lineas_programaticas}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaAnexos

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import StepperMui from '@/Components/Stepper'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { router } from '@inertiajs/react'

import { checkRole } from '@/Utils'
import { useState } from 'react'

import Form from './Form'

const MiembrosEntidadAliada = ({ auth, convocatoria, proyecto, evaluacion, entidad_aliada, miembros_entidad_aliada, tipos_documento, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [miembro_entidad_aliada_to_destroy, setMiembroEntidadAliadaToDestroy] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [miembro_entidad_aliada, setMiembroEntidadAliada] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} label="Miembros entidad aliada" />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Miembros de la entidad aliada</h1>
            </Grid>

            <Grid item md={12}>
                <AlertMui className="mt-20">Por favor ingrese cada uno de los miembros de la entidad aliada.</AlertMui>
                <TableMui className="mb-8" rows={['Nombre', 'Correo electrónico', 'Número de celular', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {proyecto.allowed.to_update && (
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('crear'), setMiembroEntidadAliada(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar miembro de la entidad aliada
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    )}

                    {miembros_entidad_aliada.data.map((miembro_entidad_aliada, i) => (
                        <TableRow key={i}>
                            <TableCell>{miembro_entidad_aliada.nombre}</TableCell>
                            <TableCell>{miembro_entidad_aliada.email}</TableCell>
                            <TableCell>{miembro_entidad_aliada.numero_celular}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {miembro_entidad_aliada.id !== miembro_entidad_aliada_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setMiembroEntidadAliada(miembro_entidad_aliada))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setMiembroEntidadAliadaToDestroy(miembro_entidad_aliada.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setMiembroEntidadAliadaToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(
                                                            route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.destroy', [
                                                                convocatoria.id,
                                                                proyecto.id,
                                                                entidad_aliada.id,
                                                                miembro_entidad_aliada.id,
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

                <PaginationMui links={miembros_entidad_aliada.links} />

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
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            entidad_aliada={entidad_aliada}
                            miembro_entidad_aliada={miembro_entidad_aliada}
                            tipos_documento={tipos_documento}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default MiembrosEntidadAliada

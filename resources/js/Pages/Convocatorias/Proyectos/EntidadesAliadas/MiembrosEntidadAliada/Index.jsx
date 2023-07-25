import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { router } from '@inertiajs/react'

import { checkRole } from '@/Utils'
import { useState } from 'react'

import Form from './Form'

const MiembrosEntidadAliada = ({ auth, convocatoria, proyecto, entidadAliada, miembrosEntidadAliada, tiposDocumento, ...props }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [miembroEntidadAliadaToDestroy, setMiembroEntidadAliadaToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [miembroEntidadAliada, setMiembroEntidadAliada] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Miembros de la entidad aliada</h1>

                <AlertMui hiddenIcon={true}>Por favor ingrese cada uno de los miembros de la entidad aliada.</AlertMui>
                {proyecto.allowed.to_update && (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setMiembroEntidadAliada(null))} variant="raised">
                        Añadir miembro de la entidad aliada
                    </ButtonMui>
                )}
            </Grid>

            <Grid item md={12}>
                <TableMui className="mb-8" rows={['Nombre', 'Correo electrónico', 'Número de celular', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {miembrosEntidadAliada.data.map((miembroEntidadAliada, i) => (
                        <TableRow key={i}>
                            <TableCell>{miembroEntidadAliada.nombre}</TableCell>
                            <TableCell>{miembroEntidadAliada.email}</TableCell>
                            <TableCell>{miembroEntidadAliada.numero_celular}</TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {miembroEntidadAliada.id !== miembroEntidadAliadaToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setMiembroEntidadAliada(miembroEntidadAliada))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setMiembroEntidadAliadaToDestroy(miembroEntidadAliada.id)
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
                                                                entidadAliada.id,
                                                                miembroEntidadAliada.id,
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

                <PaginationMui links={miembrosEntidadAliada.links} />

                <DialogMui
                    open={dialogStatus}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            isSuperAdmin={isSuperAdmin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            entidadAliada={entidadAliada}
                            miembroEntidadAliada={miembroEntidadAliada}
                            tiposDocumento={tiposDocumento}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default MiembrosEntidadAliada

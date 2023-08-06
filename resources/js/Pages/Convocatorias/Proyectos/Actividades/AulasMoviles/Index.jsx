import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import { router } from '@inertiajs/react'
import { useState } from 'react'
import { checkRole } from '@/Utils'

import Form from './Form'

const AulaMovil = ({ auth, convocatoria, proyecto, aulas_moviles, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [aula_movil, setAulaMovil] = useState(null)
    const [aula_movil_to_destroy, setAulaMovilToDestroy] = useState(null)

    return (
        <>
            {proyecto.allowed.to_update && (
                <div className="flex justify-end mt-10">
                    <ButtonMui
                        onClick={() => {
                            setDialogStatus(true), setMethod('POST'), setAulaMovil(null)
                        }}
                        variant="raised"
                        type="button">
                        Añadir aula móvil
                    </ButtonMui>
                </div>
            )}

            <TableMui className="mt-20 mb-8" rows={['Placa / Modelo', 'Estado', 'Acciones']}>
                {aulas_moviles.map((aula_movil, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            {aula_movil.placa} / {aula_movil.modelo}
                        </TableCell>
                        <TableCell>{aula_movil.estado}</TableCell>

                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {aula_movil.id !== aula_movil_to_destroy ? (
                                    <div>
                                        <MenuItem
                                            onClick={() => (setDialogStatus(true), setMethod('PUT'), setAulaMovil(aula_movil))}
                                            disabled={!proyecto.allowed.to_update}
                                            className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                            Editar
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setAulaMovilToDestroy(aula_movil.id)
                                            }}>
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setAulaMovilToDestroy(null)
                                            }}>
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (proyecto.allowed.to_update) {
                                                    router.delete(route('convocatorias.proyectos-linea-70.aulas-moviles.destroy', [convocatoria.id, proyecto.id, aula_movil.id]), {
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

            <DialogMui
                open={dialog_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} proyecto={proyecto} convocatoria={convocatoria} aula_movil={aula_movil} />}
            />
        </>
    )
}

export default AulaMovil

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

const AulaMovil = ({ auth, convocatoria, proyecto, aulasMoviles, ...props }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [aulaMovil, setAulaMovil] = useState(null)
    const [aulaMovilToDestroy, setAulaMovilToDestroy] = useState(null)

    return (
        <>
            <h1 className="text-center text-2xl">Relacione las aulas móviles</h1>
            {proyecto.allowed.to_update && (
                <div className="flex justify-end mt-10">
                    <ButtonMui
                        onClick={() => {
                            setDialogStatus(true), setMethod('crear'), setAulaMovil(null)
                        }}
                        variant="raised"
                        type="button"
                    >
                        Añadir aula móvil
                    </ButtonMui>
                </div>
            )}

            <TableMui className="mt-20" rows={['Placa / Modelo', 'Estado', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {aulasMoviles.map((aulaMovil, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            {aulaMovil.placa} / {aulaMovil.modelo}
                        </TableCell>
                        <TableCell>{aulaMovil.estado}</TableCell>

                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {aulaMovil.id !== aulaMovilToDestroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('editar'), setAulaMovil(aulaMovil))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                            Editar
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setAulaMovilToDestroy(aulaMovil.id)
                                            }}
                                        >
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setAulaMovilToDestroy(null)
                                            }}
                                        >
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (proyecto.allowed.to_update) {
                                                    router.delete(route('convocatorias.ta.aulas-moviles.destroy', [convocatoria.id, proyecto.id, aulaMovil.id]), {
                                                        preserveScroll: true,
                                                    })
                                                }
                                            }}
                                        >
                                            Confirmar
                                        </MenuItem>
                                    </div>
                                )}
                            </MenuMui>
                        </TableCell>
                    </TableRow>
                ))}
            </TableMui>

            <DialogMui open={dialogStatus} fullWidth={true} maxWidth="lg" blurEnabled={true} dialogContent={<Form isSuperAdmin={isSuperAdmin} setDialogStatus={setDialogStatus} method={method} proyecto={proyecto} convocatoria={convocatoria} aulaMovil={aulaMovil} />} />
        </>
    )
}

export default AulaMovil

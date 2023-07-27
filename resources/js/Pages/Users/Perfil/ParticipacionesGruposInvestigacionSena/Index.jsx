import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import { router } from '@inertiajs/react'
import { useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import Form from './Form'

const ParticipacionesGrupoInvestigacionSENA = ({ usuario, participaciones_grupos_investigacion_sena, grupos_investigacion, semilleros_investigacion }) => {
    const [participacion_grupo_investigacion_sena_to_destroy, setParticipacionGrupoInvestigacionSenaToDestroy] = useState(null)
    const [participacion_grupo_investigacion_sena, setParticipacionGrupoInvestigacionSena] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')

    return (
        <>
            <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setParticipacionGrupoInvestigacionSena(null))} variant="raised">
                Agregar participación
            </ButtonMui>

            <TableMui className="mt-20" rows={['Grupo de investigación', 'Semillero de investigación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {participaciones_grupos_investigacion_sena.map((participacion_grupo_investigacion_sena, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <p className="px-6 py-4 focus:text-app-500">
                                {participacion_grupo_investigacion_sena.grupo_investigacion
                                    ? participacion_grupo_investigacion_sena.grupo_investigacion?.nombre
                                    : 'No pertenece al grupo de investigación de su centro'}
                            </p>
                        </TableCell>
                        <TableCell>
                            <p className="px-6 py-4">
                                {participacion_grupo_investigacion_sena.semillero_investigacion
                                    ? participacion_grupo_investigacion_sena.semillero_investigacion.nombre
                                    : 'No pertenece al semillero de investigación de su centro'}
                            </p>
                        </TableCell>

                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {participacion_grupo_investigacion_sena.id !== participacion_grupo_investigacion_sena_to_destroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('editar'), setParticipacionGrupoInvestigacionSena(participacion_grupo_investigacion_sena))}>
                                            Editar
                                        </MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                setParticipacionGrupoInvestigacionSenaToDestroy(participacion_grupo_investigacion_sena.id)
                                            }}>
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setParticipacionGrupoInvestigacionSenaToDestroy(null)
                                            }}>
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.delete(route('participaciones-grupos-investigacion-sena.destroy', [participacion_grupo_investigacion_sena.id]), {
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
                        method={method}
                        setDialogStatus={setDialogStatus}
                        user_id={usuario.id}
                        participacion_grupo_investigacion_sena={participacion_grupo_investigacion_sena}
                        grupos_investigacion={grupos_investigacion}
                        semilleros_investigacion={semilleros_investigacion}
                    />
                }
            />
        </>
    )
}

export default ParticipacionesGrupoInvestigacionSENA

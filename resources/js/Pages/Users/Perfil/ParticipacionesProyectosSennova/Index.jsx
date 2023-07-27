import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import { router } from '@inertiajs/react'
import { useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import Form from './Form'

const ParticipacionesProyectosSENNOVA = ({ usuario, participaciones_proyectos_sennova, tipos_proyectos }) => {
    const [participacion_proyecto_sennova_to_destroy, setParticipacionProyectoSennovaToDestroy] = useState(null)
    const [participacion_proyecto_sennova, setParticipacionProyectoSennova] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')

    return (
        <>
            <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setParticipacionProyectoSennova(null))} variant="raised">
                Agregar participación
            </ButtonMui>

            <TableMui className="mt-20" rows={['Tipo de proyecto', 'Código', 'Título', 'Fecha de inicio', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {participaciones_proyectos_sennova.map((participacion_proyecto_sennova, i) => (
                    <TableRow key={i}>
                        {participacion_proyecto_sennova.ha_formulado_proyectos_sennova ? (
                            <>
                                <TableCell>
                                    <p className="px-6 py-4 focus:text-app-500">{participacion_proyecto_sennova.tipo_proyecto_text}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="px-6 py-4">{participacion_proyecto_sennova.codigo_proyecto}</p>
                                </TableCell>

                                <TableCell>
                                    <p className="px-6 py-4">{participacion_proyecto_sennova.titulo}</p>
                                </TableCell>

                                <TableCell>
                                    <p className="px-6 py-4">{participacion_proyecto_sennova.fecha_inicio_proyecto}</p>
                                </TableCell>
                            </>
                        ) : (
                            <TableCell colSpan={4}>
                                <p className="px-6 py-4">No he participado en proyectos SENNOVA</p>
                            </TableCell>
                        )}

                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {participacion_proyecto_sennova.id !== participacion_proyecto_sennova_to_destroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('editar'), setParticipacionProyectoSennova(participacion_proyecto_sennova))}>Editar</MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                setParticipacionProyectoSennovaToDestroy(participacion_proyecto_sennova.id)
                                            }}>
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setParticipacionProyectoSennovaToDestroy(null)
                                            }}>
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.delete(route('participaciones-proyectos-sennova.destroy', [participacion_proyecto_sennova.id]), {
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
                    <Form method={method} setDialogStatus={setDialogStatus} user_id={usuario.id} participacion_proyecto_sennova={participacion_proyecto_sennova} tipos_proyectos={tipos_proyectos} />
                }
            />
        </>
    )
}

export default ParticipacionesProyectosSENNOVA

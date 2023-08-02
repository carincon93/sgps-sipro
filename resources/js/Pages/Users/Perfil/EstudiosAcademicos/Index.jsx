import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'

import { router } from '@inertiajs/react'
import { useState } from 'react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import Form from './Form'

const EstudiosAcademicos = ({ usuario, estudios_academicos, niveles_academicos }) => {
    const [estudio_academico_to_destroy, setEstudioAcademicoToDestroy] = useState(null)
    const [estudio_academico, setEstudioAcademico] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')

    return (
        <>
            <TableMui rows={['Grado de formación', 'Título obtenido', 'Acciones']} sxCellThead={{ width: '320px' }} className="mt-10">
                <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setEstudioAcademico(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                    <TableCell colSpan={3}>
                        <ButtonMui>
                            <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar estudio académico
                        </ButtonMui>
                    </TableCell>
                </TableRow>
                {estudios_academicos.map((estudio_academico, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <p className="first-letter:uppercase">{niveles_academicos.find((item) => item.value == estudio_academico.grado_formacion).label}</p>
                        </TableCell>
                        <TableCell>{estudio_academico.titulo_obtenido}</TableCell>
                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {estudio_academico.id !== estudio_academico_to_destroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setEstudioAcademico(estudio_academico))}>Editar</MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                setEstudioAcademicoToDestroy(estudio_academico.id)
                                            }}>
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setEstudioAcademicoToDestroy(null)
                                            }}>
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.delete(route('estudios-academicos.destroy', [estudio_academico.id]), {
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
                dialogContent={<Form method={method} setDialogStatus={setDialogStatus} user_id={usuario.id} estudio_academico={estudio_academico} niveles_academicos={niveles_academicos} />}
            />
        </>
    )
}

export default EstudiosAcademicos

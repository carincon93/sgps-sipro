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

const FormacionesAcademicasSena = ({ usuario, formaciones_academicas_sena, modalidades_estudio, niveles_formacion }) => {
    const [formacion_academica_sena_to_destroy, setFormacionAcademicaSenaToDestroy] = useState(null)
    const [formacion_academica_sena, setFormacionAcademicaSena] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')

    return (
        <>
            <TableMui rows={['Modalidad', 'Nivel académico', 'Título obtenido', 'Acciones']} sxCellThead={{ width: '320px' }} className="mt-10">
                <TableRow onClick={() => (setDialogStatus(true), setMethod('crear'), setFormacionAcademicaSena(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                    <TableCell colSpan={4}>
                        <ButtonMui>
                            <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar formacion académica SENA
                        </ButtonMui>
                    </TableCell>
                </TableRow>
                {formaciones_academicas_sena.map((formacion_academica_sena, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <p className="first-letter:uppercase">{modalidades_estudio.find((item) => item.value == formacion_academica_sena.modalidad_sena).label}</p>
                        </TableCell>
                        <TableCell>
                            <p className="first-letter:uppercase">{niveles_formacion.find((item) => item.value == formacion_academica_sena.modalidad_sena).label}</p>
                        </TableCell>
                        <TableCell>
                            <p className="first-letter:uppercase">{formacion_academica_sena.titulo_obtenido}</p>
                        </TableCell>
                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {formacion_academica_sena.id !== formacion_academica_sena_to_destroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('editar'), setFormacionAcademicaSena(formacion_academica_sena))}>Editar</MenuItem>

                                        <MenuItem
                                            onClick={() => {
                                                setFormacionAcademicaSenaToDestroy(formacion_academica_sena.id)
                                            }}>
                                            Eliminar
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <div>
                                        <MenuItem
                                            onClick={(e) => {
                                                setFormacionAcademicaSenaToDestroy(null)
                                            }}>
                                            Cancelar
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.delete(route('formaciones-academicas-sena.destroy', [formacion_academica_sena.id]), {
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
                        formacion_academica_sena={formacion_academica_sena}
                        modalidades_estudio={modalidades_estudio}
                        niveles_formacion={niveles_formacion}
                    />
                }
            />
        </>
    )
}

export default FormacionesAcademicasSena

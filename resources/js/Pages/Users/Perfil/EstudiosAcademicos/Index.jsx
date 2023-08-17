import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import DownloadFile from '@/Components/DownloadFile'
import FileInput from '@/Components/FileInput'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'

import { router, useForm } from '@inertiajs/react'
import { useState } from 'react'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import Form from './Form'

const EstudiosAcademicos = ({ usuario, estudios_academicos, niveles_academicos }) => {
    const [estudio_academico_to_destroy, setEstudioAcademicoToDestroy] = useState(null)
    const [estudio_academico, setEstudioAcademico] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_soporte_status, setDialogSoporteStatus] = useState(false)
    const [method, setMethod] = useState('')

    const form = useForm({
        _method: 'PUT',
        soporte_titulo_obtenido: null,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('estudios-academicos.upload-soporte-titulo-obtenido', [estudio_academico.id]), {
            onSuccess: () => setDialogSoporteStatus(false),
            preserveScroll: true,
        })
    }
    return (
        <>
            <TableMui rows={['Grado de formación', 'Título obtenido', 'Soporte', 'Acciones']} sxCellThead={{ width: '320px' }} className="mt-10">
                <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setEstudioAcademico(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                    <TableCell colSpan={4}>
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
                            <DownloadFile
                                label="soporte del título obtenido"
                                filename={estudio_academico?.filename}
                                extension={estudio_academico?.extension}
                                downloadRoute={
                                    estudio_academico?.soporte_titulo_obtenido
                                        ? estudio_academico?.soporte_titulo_obtenido?.includes('http')
                                            ? estudio_academico?.soporte_titulo_obtenido
                                            : route('estudios-academicos.download-file-sharepoint', [estudio_academico.id, 'soporte_titulo_obtenido'])
                                        : null
                                }
                            />
                            <ButtonMui
                                onClick={() => (setDialogSoporteStatus(true), setEstudioAcademico(estudio_academico))}
                                className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                <AutorenewIcon className="mr-2" />
                                {estudio_academico?.filename ? 'Reemplazar' : 'Cargar'} soporte
                            </ButtonMui>
                        </TableCell>
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

            <DialogMui
                open={dialog_soporte_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={
                    <form onSubmit={submit}>
                        <FileInput
                            id="soporte_titulo_obtenido"
                            value={form.data.soporte_titulo_obtenido}
                            label="Seleccione el soporte del título obtenido"
                            accept="application/pdf"
                            onChange={(e) => form.setData('soporte_titulo_obtenido', e.target.files[0])}
                            error={form.errors.soporte_titulo_obtenido}
                        />
                        <div className="flex items-center justify-between mt-14 py-4">
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Cargar soporte
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogSoporteStatus(false)} className="!ml-2 !bg-transparent">
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                }
            />
        </>
    )
}

export default EstudiosAcademicos

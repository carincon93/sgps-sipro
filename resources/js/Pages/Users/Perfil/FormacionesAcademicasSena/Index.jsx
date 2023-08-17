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

const FormacionesAcademicasSena = ({ usuario, formaciones_academicas_sena, modalidades_estudio, niveles_formacion }) => {
    const [formacion_academica_sena_to_destroy, setFormacionAcademicaSenaToDestroy] = useState(null)
    const [formacion_academica_sena, setFormacionAcademicaSena] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_certificado_status, setDialogCertificadoStatus] = useState(false)
    const [method, setMethod] = useState('')

    const form = useForm({
        _method: 'PUT',
        certificado_formacion: null,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('formaciones-academicas-sena.upload-certificado-formacion', [formacion_academica_sena.id]), {
            onSuccess: () => setDialogCertificadoStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <>
            <TableMui rows={['Modalidad', 'Nivel académico', 'Título obtenido', 'Certificado', 'Acciones']} sxCellThead={{ width: '320px' }} className="mt-10">
                <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setFormacionAcademicaSena(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                    <TableCell colSpan={5}>
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
                            <DownloadFile
                                label="certificado del título obtenido"
                                filename={formacion_academica_sena?.filename}
                                extension={formacion_academica_sena?.extension}
                                downloadRoute={
                                    formacion_academica_sena?.certificado_formacion
                                        ? formacion_academica_sena?.certificado_formacion?.includes('http')
                                            ? formacion_academica_sena?.certificado_formacion
                                            : route('formaciones-academicas-sena.download-file-sharepoint', [formacion_academica_sena.id, 'certificado_formacion'])
                                        : null
                                }
                            />
                            <ButtonMui
                                onClick={() => (setDialogCertificadoStatus(true), setFormacionAcademicaSena(formacion_academica_sena))}
                                className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                <AutorenewIcon className="mr-2" />
                                {formacion_academica_sena?.filename ? 'Reemplazar' : 'Cargar'} soporte
                            </ButtonMui>
                        </TableCell>
                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {formacion_academica_sena.id !== formacion_academica_sena_to_destroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setFormacionAcademicaSena(formacion_academica_sena))}>Editar</MenuItem>

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

            <DialogMui
                open={dialog_certificado_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={
                    <form onSubmit={submit}>
                        <FileInput
                            id="certificado_formacion"
                            value={form.data.certificado_formacion}
                            label="Seleccione el certificado del título obtenido"
                            accept="application/pdf"
                            onChange={(e) => form.setData('certificado_formacion', e.target.files[0])}
                            error={form.errors.certificado_formacion}
                        />
                        <div className="flex items-center justify-between mt-14 py-4">
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Cargar certificado
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogCertificadoStatus(false)} className="!ml-2 !bg-transparent">
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                }
            />
        </>
    )
}

export default FormacionesAcademicasSena

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import DownloadFile from '@/Components/DownloadFile'
import FileInput from '@/Components/FileInput'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import { router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { checkRole } from '@/Utils'

import Form from './Form'

const AulaMovil = ({ auth, convocatoria, proyecto, aulas_moviles, ...props }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_archivo_status, setDialogArchivoStatus] = useState(false)
    const [tipo_archivo, setTipoArchivo] = useState('')
    const [method, setMethod] = useState('')
    const [aula_movil, setAulaMovil] = useState(null)
    const [aula_movil_to_destroy, setAulaMovilToDestroy] = useState(null)

    const form = useForm({
        _method: 'PUT',
        soat: null,
        tecnicomecanica: null,
    })

    const submit = (e) => {
        e.preventDefault()

        if (proyecto?.allowed?.to_update) {
            form.post(route('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.upload-archivo', [convocatoria.id, proyecto.id, aula_movil.id]), {
                onSuccess: () => setDialogArchivoStatus(false),
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            <h1 className="text-3xl mt-24 mb-8 text-center">Aulas móviles</h1>

            <TableMui className="mt-20 mb-8" rows={['Placa / Modelo', 'Archivos', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {proyecto.allowed.to_update ? (
                    <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setAulaMovil(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer w-full">
                        <TableCell colSpan={3}>
                            <ButtonMui>
                                <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar aula móvil
                            </ButtonMui>
                        </TableCell>
                    </TableRow>
                ) : null}
                {aulas_moviles.map((aula_movil, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            {aula_movil.placa} / {aula_movil.modelo}
                        </TableCell>

                        <TableCell>
                            <DownloadFile
                                label="SOAT"
                                className="!p-2"
                                filename={aula_movil?.filename.soat_filename}
                                extension={aula_movil?.extension.soat_extension}
                                downloadRoute={
                                    aula_movil?.soat
                                        ? aula_movil?.soat?.includes('http') == true || aula_movil?.soat?.includes('http') == undefined
                                            ? aula_movil?.soat
                                            : route('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.download-file-sharepoint', [convocatoria.id, proyecto.id, aula_movil.id, 'soat'])
                                        : null
                                }
                            />
                            <ButtonMui
                                disabled={!proyecto?.allowed?.to_update}
                                onClick={() => (setDialogArchivoStatus(true), setAulaMovil(aula_movil), setTipoArchivo('soat'))}
                                className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                <AutorenewIcon className="mr-2" />
                                {aula_movil.filename.soat_filename ? 'Reemplazar' : 'Cargar'} SOAT
                            </ButtonMui>

                            <DownloadFile
                                label="tecnicomecánica"
                                className="mt-10 !p-2"
                                filename={aula_movil?.filename.tecnicomecanica_filename}
                                extension={aula_movil?.extension.tecnicomecanica_extension}
                                downloadRoute={
                                    aula_movil?.tecnicomecanica
                                        ? aula_movil?.tecnicomecanica?.includes('http') || aula_movil?.tecnicomecanica?.includes('http') == undefined
                                            ? aula_movil?.tecnicomecanica
                                            : route('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.download-file-sharepoint', [convocatoria, proyecto, aula_movil.id, 'tecnicomecanica'])
                                        : null
                                }
                            />
                            <ButtonMui
                                disabled={!proyecto?.allowed?.to_update}
                                onClick={() => (setDialogArchivoStatus(true), setAulaMovil(aula_movil), setTipoArchivo('tecnicomecanica'))}
                                className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                <AutorenewIcon className="mr-2" />
                                {aula_movil?.filename.tecnicomecanica_filename ? 'Reemplazar' : 'Cargar'} tecnicomecánica
                            </ButtonMui>
                        </TableCell>

                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                {aula_movil.id !== aula_movil_to_destroy ? (
                                    <div>
                                        <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setAulaMovil(aula_movil))} disabled={!proyecto?.allowed?.to_update}>
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
                                                    router.delete(route('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.destroy', [convocatoria.id, proyecto.id, aula_movil.id]), {
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

            <DialogMui
                open={dialog_archivo_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={
                    <form onSubmit={submit}>
                        <FileInput
                            id={tipo_archivo}
                            value={form.data[tipo_archivo]}
                            label={`${tipo_archivo}`}
                            accept="application/pdf"
                            onChange={(e) => form.setData(tipo_archivo, e)}
                            error={form.errors[tipo_archivo]}
                        />
                        <div className="flex items-center justify-between mt-14 py-4">
                            <PrimaryButton disabled={form.processing || !form.isDirty} className="ml-auto" type="submit">
                                Cargar archivo
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogArchivoStatus(false)} className="!ml-2 !bg-transparent">
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                }
            />
        </>
    )
}

export default AulaMovil

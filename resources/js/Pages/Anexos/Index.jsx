import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { router, useForm } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'
import DownloadFile from '@/Components/DownloadFile'
import PrimaryButton from '@/Components/PrimaryButton'
import FileInput from '@/Components/FileInput'

const Index = ({ auth, anexos, mime_types }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_formato_status, setDialogFormatoStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [anexo, setAnexo] = useState(null)
    const [anexo_to_destroy, setAnexoToDestroy] = useState(null)

    const form = useForm({
        archivo: null,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('anexos.upload-archivo', [anexo.id]), {
            onSuccess: () => setDialogFormatoStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Anexos</h2>}>
            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Archivo', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {is_super_admin ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setAnexo(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar anexo
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {anexos.data.map((anexo, i) => (
                        <TableRow key={i}>
                            <TableCell>{anexo.nombre}</TableCell>

                            <TableCell>
                                <DownloadFile
                                    label="anexo"
                                    className="!p-2"
                                    filename={anexo?.filename}
                                    extension={anexo?.extension}
                                    downloadRoute={
                                        anexo?.archivo
                                            ? anexo?.archivo.includes('http') == true || anexo?.archivo.includes('http') == undefined
                                                ? anexo?.archivo
                                                : route('anexos.download-file-sharepoint', [anexo.id, 'archivo'])
                                            : null
                                    }
                                    required={false}
                                />
                                <ButtonMui
                                    onClick={() => (form.reset(), setDialogFormatoStatus(true), setAnexo(anexo))}
                                    className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                    <AutorenewIcon className="mr-2" />
                                    {anexo?.filename ? 'Reemplazar' : 'Cargar'} anexo
                                </ButtonMui>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {anexo.id !== anexo_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setAnexo(anexo))}>Editar</MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setAnexoToDestroy(anexo.id)
                                                }}
                                                disabled={!is_super_admin}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setAnexoToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('anexos.destroy', [anexo.id]), {
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

                <PaginationMui links={anexos.links} className="mt-8" />

                <DialogMui
                    open={dialog_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={<Form is_super_admin={is_super_admin} setDialogStatus={setDialogStatus} method={method} anexo={anexo} mime_types={mime_types} />}
                />

                <DialogMui
                    open={dialog_formato_status}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <form onSubmit={submit}>
                            <FileInput
                                id="archivo"
                                value={form.data.archivo}
                                label={`Seleccione el archivo`}
                                onChange={(e) => form.setData('archivo', e)}
                                accept="application/vnd.ms-excel.sheet.macroEnabled.12"
                                error={form.errors.archivo}
                            />
                            <div className="flex items-center justify-between mt-14 py-4">
                                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                    Cargar archivo
                                </PrimaryButton>
                                <ButtonMui type="button" primary={false} onClick={() => setDialogFormatoStatus(false)} className="!ml-2 !bg-transparent">
                                    Cancelar
                                </ButtonMui>
                            </div>
                        </form>
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

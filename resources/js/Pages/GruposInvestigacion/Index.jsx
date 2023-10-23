import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import DownloadFile from '@/Components/DownloadFile'
import FileInput from '@/Components/FileInput'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import PrimaryButton from '@/Components/PrimaryButton'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'
import TabsMui from '@/Components/TabsMui'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Divider, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, grupos_investigacion, grupos_investigacion_centro_formacion, centros_formacion, categorias_minciencias, redes_conocimiento, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_formato_status, setDialogFormatoStatus] = useState(false)
    const [tipo_archivo, setTipoArchivo] = useState('')
    const [method, setMethod] = useState('')
    const [grupo_investigacion, setGrupoInvestigacion] = useState(null)
    const [grupo_investigacion_to_destroy, setGrupoInvestigacionToDestroy] = useState(null)

    const form = useForm({
        _method: 'PUT',
        formato_gic_f_020: null,
        formato_gic_f_032: null,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('grupos-investigacion.upload-formato', [grupo_investigacion.id]), {
            onSuccess: () => setDialogFormatoStatus(false),
            preserveScroll: true,
        })
    }

    const tabs = checkRole(auth_user, [1, 5, 17, 18, 19])
        ? [{ label: 'Grupos de investigación - Nivel Nacional' }, { label: 'Grupos de investigación: ' + centros_formacion.find((item) => item.value == auth_user.centro_formacion_id).label }]
        : [{ label: 'Grupos de investigación del ' + centros_formacion.find((item) => item.value == auth_user.centro_formacion_id).label }]

    return (
        <AuthenticatedLayout>
            <Head title="Grupos de investigación" />

            <TabsMui tabs={tabs}>
                {checkRole(auth_user, [1, 5, 17, 18, 19]) ? (
                    <div>
                        <SearchBar className="mt-20" />

                        <TableMui className="mt-20" rows={['Nombre', 'Centro de formación', 'Regional', 'Formatos', 'Acciones']}>
                            {is_super_admin && (
                                <TableRow
                                    onClick={() => (setDialogStatus(true), setMethod('POST'), setGrupoInvestigacion(null))}
                                    variant="raised"
                                    className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                    <TableCell colSpan={5}>
                                        <ButtonMui>
                                            <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar grupo de investigación
                                        </ButtonMui>
                                    </TableCell>
                                </TableRow>
                            )}
                            {grupos_investigacion.data.map((grupo_investigacion, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <p className="uppercase">{grupo_investigacion.nombre}</p>
                                    </TableCell>

                                    <TableCell>{grupo_investigacion.centro_formacion?.nombre}</TableCell>
                                    <TableCell>{grupo_investigacion.centro_formacion?.regional?.nombre}</TableCell>

                                    <TableCell>
                                        {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                                            <>
                                                <DownloadFile
                                                    label="formato GIC F 020"
                                                    className="!p-2"
                                                    filename={grupo_investigacion?.filename.formato_gic_f_020_filename}
                                                    extension={grupo_investigacion?.extension.formato_gic_f_020_extension}
                                                    downloadRoute={
                                                        grupo_investigacion?.formato_gic_f_020
                                                            ? grupo_investigacion?.formato_gic_f_020.includes('http') == true || grupo_investigacion?.formato_gic_f_020.includes('http') == undefined
                                                                ? grupo_investigacion?.formato_gic_f_020
                                                                : route('grupos-investigacion.download-file-sharepoint', [grupo_investigacion.id, 'formato_gic_f_020'])
                                                            : null
                                                    }
                                                />
                                                <ButtonMui
                                                    onClick={() => (form.reset(), setDialogFormatoStatus(true), setGrupoInvestigacion(grupo_investigacion), setTipoArchivo('formato_gic_f_020'))}
                                                    className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                                    <AutorenewIcon className="mr-2" />
                                                    {grupo_investigacion?.filename.formato_gic_f_020_filename ? 'Reemplazar' : 'Cargar'} formato GIC F 020
                                                </ButtonMui>

                                                <DownloadFile
                                                    label="formato GIC F 032"
                                                    className="mt-10 !p-2"
                                                    filename={grupo_investigacion?.filename.formato_gic_f_032_filename}
                                                    extension={grupo_investigacion?.extension.formato_gic_f_032_extension}
                                                    downloadRoute={
                                                        grupo_investigacion?.formato_gic_f_032
                                                            ? grupo_investigacion?.formato_gic_f_032.includes('http') == true || grupo_investigacion?.formato_gic_f_032.includes('http') == undefined
                                                                ? grupo_investigacion?.formato_gic_f_032
                                                                : route('grupos-investigacion.download-file-sharepoint', [grupo_investigacion.id, 'formato_gic_f_032'])
                                                            : null
                                                    }
                                                />
                                                <ButtonMui
                                                    onClick={() => (form.reset(), setDialogFormatoStatus(true), setGrupoInvestigacion(grupo_investigacion), setTipoArchivo('formato_gic_f_032'))}
                                                    className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full">
                                                    <AutorenewIcon className="mr-2" />
                                                    {grupo_investigacion?.filename.formato_gic_f_032_filename ? 'Reemplazar' : 'Cargar'} formato GIC F 032
                                                </ButtonMui>
                                            </>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <MenuMui text={<MoreVertIcon />}>
                                            {grupo_investigacion.id !== grupo_investigacion_to_destroy ? (
                                                <div>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.visit(route('grupos-investigacion.show', [grupo_investigacion.id]), {
                                                                preserveScroll: true,
                                                            })
                                                        }}>
                                                        Ver información
                                                    </MenuItem>

                                                    <MenuItem
                                                        onClick={() => (setDialogStatus(true), setMethod('PUT'), setGrupoInvestigacion(grupo_investigacion))}
                                                        disabled={!grupo_investigacion?.allowed?.to_update}>
                                                        Editar
                                                    </MenuItem>

                                                    <Divider />

                                                    {is_super_admin && (
                                                        <MenuItem
                                                            onClick={() => {
                                                                setGrupoInvestigacionToDestroy(grupo_investigacion.id)
                                                            }}>
                                                            Eliminar
                                                        </MenuItem>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <MenuItem
                                                        onClick={(e) => {
                                                            setGrupoInvestigacionToDestroy(null)
                                                        }}>
                                                        Cancelar
                                                    </MenuItem>
                                                    <MenuItem
                                                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (grupo_investigacion.allowed.to_update) {
                                                                router.delete(route('grupos-investigacion.destroy', [grupo_investigacion.id]), {
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

                        <PaginationMui links={grupos_investigacion.links} className="mt-8" />
                    </div>
                ) : null}
                <div>
                    <h1 className="text-2xl text-center my-20">{centros_formacion.find((item) => item.value == auth_user.centro_formacion_id).label}</h1>
                    <SearchBar />

                    <TableMui className="mt-20" rows={['Nombre', 'Centro de formación', 'Regional', 'Formatos', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        {allowed_to_create && (
                            <TableRow
                                onClick={() => (setDialogStatus(true), setMethod('POST'), setGrupoInvestigacion(null))}
                                variant="raised"
                                className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                                <TableCell colSpan={5}>
                                    <ButtonMui>
                                        <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar grupo de investigación
                                    </ButtonMui>
                                </TableCell>
                            </TableRow>
                        )}
                        {grupos_investigacion_centro_formacion.map((grupo_investigacion, i) => (
                            <TableRow key={i}>
                                <TableCell>{grupo_investigacion.nombre}</TableCell>

                                <TableCell> {grupo_investigacion.centro_formacion?.nombre}</TableCell>
                                <TableCell>{grupo_investigacion.centro_formacion?.regional?.nombre}</TableCell>

                                <TableCell>
                                    <DownloadFile
                                        label="formato GIC F 032"
                                        className="!p-2"
                                        filename={grupo_investigacion?.filename.formato_gic_f_032_filename}
                                        extension={grupo_investigacion?.extension.formato_gic_f_032_extension}
                                        downloadRoute={
                                            grupo_investigacion?.formato_gic_f_032
                                                ? grupo_investigacion?.formato_gic_f_032.includes('http') == true || grupo_investigacion?.formato_gic_f_032.includes('http') == undefined
                                                    ? grupo_investigacion?.formato_gic_f_032
                                                    : route('grupos-investigacion.download-file-sharepoint', [grupo_investigacion.id, 'formato_gic_f_032'])
                                                : null
                                        }
                                    />
                                    <ButtonMui
                                        onClick={() => (setDialogFormatoStatus(true), setGrupoInvestigacion(grupo_investigacion), setTipoArchivo('formato_gic_f_032'))}
                                        className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full"
                                        disabled={!grupo_investigacion?.allowed?.to_update}>
                                        <AutorenewIcon className="mr-2" />
                                        {grupo_investigacion?.filename.formato_gic_f_032_filename ? 'Reemplazar' : 'Cargar'} formato GIC F 032
                                    </ButtonMui>

                                    <DownloadFile
                                        label="formato GIC F 032"
                                        className="mt-10 !p-2"
                                        filename={grupo_investigacion?.filename.formato_gic_f_020_filename}
                                        extension={grupo_investigacion?.extension.formato_gic_f_020_extension}
                                        downloadRoute={
                                            grupo_investigacion?.formato_gic_f_020
                                                ? grupo_investigacion?.formato_gic_f_020.includes('http') == true || grupo_investigacion?.formato_gic_f_020.includes('http') == undefined
                                                    ? grupo_investigacion?.formato_gic_f_020
                                                    : route('grupos-investigacion.download-file-sharepoint', [grupo_investigacion.id, 'formato_gic_f_020'])
                                                : null
                                        }
                                    />
                                    <ButtonMui
                                        onClick={() => (setDialogFormatoStatus(true), setGrupoInvestigacion(grupo_investigacion), setTipoArchivo('formato_gic_f_020'))}
                                        className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full"
                                        disabled={!grupo_investigacion?.allowed?.to_update}>
                                        <AutorenewIcon className="mr-2" />
                                        {grupo_investigacion?.filename.formato_gic_f_020_filename ? 'Reemplazar' : 'Cargar'} formato GIC F 020
                                    </ButtonMui>
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {grupo_investigacion.id !== grupo_investigacion_to_destroy ? (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.visit(route('grupos-investigacion.show', [grupo_investigacion.id]), {
                                                            preserveScroll: true,
                                                        })
                                                    }}>
                                                    Ver detalles
                                                </MenuItem>

                                                <Divider />

                                                <MenuItem
                                                    onClick={() => (setDialogStatus(true), setMethod('PUT'), setGrupoInvestigacion(grupo_investigacion))}
                                                    disabled={!grupo_investigacion?.allowed?.to_update}>
                                                    Editar
                                                </MenuItem>

                                                {is_super_admin && (
                                                    <MenuItem
                                                        onClick={() => {
                                                            setGrupoInvestigacionToDestroy(grupo_investigacion.id)
                                                        }}>
                                                        Eliminar
                                                    </MenuItem>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setGrupoInvestigacionToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (grupo_investigacion.allowed.to_update) {
                                                            router.delete(route('grupos-investigacion.destroy', [grupo_investigacion.id]), {
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
                </div>
            </TabsMui>

            <DialogMui
                open={dialog_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={
                    <Form
                        is_super_admin={is_super_admin}
                        setDialogStatus={setDialogStatus}
                        allowed_to_create={allowed_to_create}
                        method={method}
                        grupo_investigacion={grupo_investigacion}
                        centros_formacion={centros_formacion}
                        categorias_minciencias={categorias_minciencias}
                        redes_conocimiento={redes_conocimiento}
                    />
                }
            />

            <DialogMui
                open={dialog_formato_status}
                fullWidth={true}
                maxWidth="lg"
                blurEnabled={true}
                dialogContent={
                    <form onSubmit={submit}>
                        <FileInput
                            id={tipo_archivo}
                            value={form.data[tipo_archivo]}
                            label={`Seleccione el ${tipo_archivo} `}
                            accept="application/pdf"
                            onChange={(e) => form.setData(tipo_archivo, e)}
                            error={form.errors[tipo_archivo]}
                        />
                        <div className="flex items-center justify-between mt-14 py-4">
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Cargar formato
                            </PrimaryButton>
                            <ButtonMui type="button" primary={false} onClick={() => setDialogFormatoStatus(false)} className="!ml-2 !bg-transparent">
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                }
            />
        </AuthenticatedLayout>
    )
}

export default Index

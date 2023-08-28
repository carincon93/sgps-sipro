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

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Breadcrumbs, Grid, MenuItem, Tab, TableCell, TableRow, Tabs } from '@mui/material'

import { useState } from 'react'
import { Link, router, useForm } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, grupo_investigacion, linea_investigacion, lineas_investigacion, semilleros_investigacion, redes_conocimiento, allowed_to_create }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [dialog_formato_status, setDialogFormatoStatus] = useState(false)
    const [tipo_archivo, setTipoArchivo] = useState('')
    const [method, setMethod] = useState('')
    const [semillero_investigacion, setSemilleroInvestigacion] = useState(null)
    const [semillero_investigacion_to_destroy, setSemilleroInvestigacionToDestroy] = useState(null)

    const form = useForm({
        _method: 'PUT',
        formato_gic_f_021: null,
        formato_gic_f_032: null,
        formato_aval_semillero: null,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.upload-formato', [grupo_investigacion.id, linea_investigacion.id, semillero_investigacion.id]), {
            onSuccess: () => setDialogFormatoStatus(false),
            preserveScroll: true,
        })
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Semilleros de investigación</h2>}>
            <Grid item md={12} className="!mb-20">
                <Tabs value="2" centered={true}>
                    <Tab
                        component="a"
                        onClick={() => {
                            router.visit(route('grupos-investigacion.show', [grupo_investigacion.id]))
                        }}
                        label={grupo_investigacion.nombre}
                        value="0"
                    />
                    <Tab
                        component="a"
                        onClick={() => {
                            router.visit(route('grupos-investigacion.lineas-investigacion.index', [grupo_investigacion.id]))
                        }}
                        label="Líneas de investigación"
                        value="1"
                    />

                    <Tab component="a" label="Semilleros de investigación" value="2" />
                </Tabs>
            </Grid>
            <Grid item md={12}>
                <SearchBar routeParams={[grupo_investigacion.id]} />

                <TableMui className="mt-20" rows={['Nombre', 'Línea de investigación principal', 'Centro Código', 'Formatos', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {allowed_to_create ? (
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setSemilleroInvestigacion(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={5}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar semillero de investigación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {semilleros_investigacion.data.map((semillero_investigacion, i) => (
                        <TableRow key={i}>
                            <TableCell>{semillero_investigacion.nombre}</TableCell>
                            <TableCell> {semillero_investigacion.linea_investigacion.nombre}</TableCell>
                            <TableCell>{semillero_investigacion.codigo}</TableCell>
                            <TableCell>
                                <DownloadFile
                                    label="formato GIC F 021"
                                    className="!p-2"
                                    filename={semillero_investigacion?.filename.formato_gic_f_021_filename}
                                    extension={semillero_investigacion?.extension.formato_gic_f_021_extension}
                                    downloadRoute={
                                        semillero_investigacion?.formato_gic_f_021
                                            ? semillero_investigacion?.formato_gic_f_021.includes('http') == true || semillero_investigacion?.formato_gic_f_021.includes('http') == undefined
                                                ? semillero_investigacion?.formato_gic_f_021
                                                : route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint', [
                                                      grupo_investigacion.id,
                                                      linea_investigacion.id,
                                                      semillero_investigacion.id,
                                                      'formato_gic_f_021',
                                                  ])
                                            : null
                                    }
                                />
                                <ButtonMui
                                    onClick={() => (setDialogFormatoStatus(true), setSemilleroInvestigacion(semillero_investigacion), setTipoArchivo('formato_gic_f_021'))}
                                    className="!bg-app-800 hover:!bg-app-50 !text-left !normal-case !text-white !text-[12px] hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full"
                                    disabled={!semillero_investigacion?.allowed?.to_update}>
                                    <AutorenewIcon className="mr-2" />
                                    {semillero_investigacion?.filename.formato_gic_f_021_filename ? 'Reemplazar' : 'Cargar'} formato GIC F 021
                                </ButtonMui>

                                <DownloadFile
                                    label="formato GIC F 032"
                                    className="mt-10 !p-2"
                                    filename={semillero_investigacion?.filename.formato_gic_f_032_filename}
                                    extension={semillero_investigacion?.extension.formato_gic_f_032_extension}
                                    downloadRoute={
                                        semillero_investigacion?.formato_gic_f_032
                                            ? semillero_investigacion?.formato_gic_f_032.includes('http') == true || semillero_investigacion?.formato_gic_f_032.includes('http') == undefined
                                                ? semillero_investigacion?.formato_gic_f_032
                                                : route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint', [
                                                      grupo_investigacion.id,
                                                      linea_investigacion.id,
                                                      semillero_investigacion.id,
                                                      'formato_gic_f_032',
                                                  ])
                                            : null
                                    }
                                />
                                <ButtonMui
                                    onClick={() => (setDialogFormatoStatus(true), setSemilleroInvestigacion(semillero_investigacion), setTipoArchivo('formato_gic_f_032'))}
                                    className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white !text-[12px] hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full"
                                    disabled={!semillero_investigacion?.allowed?.to_update}>
                                    <AutorenewIcon className="mr-2" />
                                    {semillero_investigacion?.filename.formato_gic_f_032_filename ? 'Reemplazar' : 'Cargar'} formato GIC F 032
                                </ButtonMui>

                                <DownloadFile
                                    label="aval del semillero"
                                    className="mt-10 !p-2"
                                    filename={semillero_investigacion?.filename.formato_aval_semillero_filename}
                                    extension={semillero_investigacion?.extension.formato_aval_semillero_extension}
                                    downloadRoute={
                                        semillero_investigacion?.formato_aval_semillero
                                            ? semillero_investigacion?.formato_aval_semillero.includes('http') == true || semillero_investigacion?.formato_aval_semillero.includes('http') == undefined
                                                ? semillero_investigacion?.formato_aval_semillero
                                                : route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint', [
                                                      grupo_investigacion.id,
                                                      linea_investigacion.id,
                                                      semillero_investigacion.id,
                                                      'formato_aval_semillero',
                                                  ])
                                            : null
                                    }
                                />
                                <ButtonMui
                                    onClick={() => (setDialogFormatoStatus(true), setSemilleroInvestigacion(semillero_investigacion), setTipoArchivo('formato_aval_semillero'))}
                                    className="!bg-app-800 !mt-1 hover:!bg-app-50 !text-left !normal-case !text-white !text-[12px] hover:!text-app-800 rounded-md my-4 p-2 block hover:cursor-pointer w-full"
                                    disabled={!semillero_investigacion?.allowed?.to_update}>
                                    <AutorenewIcon className="mr-2" />
                                    {semillero_investigacion?.filename.formato_aval_semillero_filename ? 'Reemplazar' : 'Cargar'} aval del semillero
                                </ButtonMui>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {semillero_investigacion.id !== semillero_investigacion_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('PUT'), setSemilleroInvestigacion(semillero_investigacion))}
                                                disabled={!semillero_investigacion?.allowed?.to_view}>
                                                {semillero_investigacion?.allowed?.to_view && !semillero_investigacion?.allowed?.to_update ? 'Ver información' : 'Editar'}
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setSemilleroInvestigacionToDestroy(semillero_investigacion.id)
                                                }}
                                                disabled={!semillero_investigacion?.allowed?.to_update}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setSemilleroInvestigacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (semillero_investigacion.allowed.to_update) {
                                                        router.delete(
                                                            route('grupos-investigacion.lineas-investigacion.semilleros-investigacion.destroy', [
                                                                grupo_investigacion.id,
                                                                linea_investigacion.id,
                                                                semillero_investigacion.id,
                                                            ]),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
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

                <PaginationMui links={semilleros_investigacion.links} className="mt-8" />

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
                            linea_investigacion={linea_investigacion}
                            lineas_investigacion={lineas_investigacion}
                            semillero_investigacion={semillero_investigacion}
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
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

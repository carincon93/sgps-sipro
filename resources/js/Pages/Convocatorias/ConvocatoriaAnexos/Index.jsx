import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'
import TabsConvocatoria from '@/Components/TabsConvocatoria'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { checkRole } from '@/Utils'
import { router, usePage } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const ConvocatoriaAnexos = ({ auth, convocatoria, convocatoria_anexos, anexos }) => {
    const { props: page_props } = usePage()

    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [convocatoria_anexo_to_destroy, setConvocatoriaAnexoToDestroy] = useState(null)
    const [convocatoria_anexo, setConvocatoriaAnexo] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="3" convocatoria={convocatoria} tipo_formulario_convocatoria_id={page_props.ziggy.query.tipo_formulario_convocatoria_id} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <TableMui className="mt-20" rows={['Nombre', 'Líneas programáticas', 'Estado', 'Acciones']}>
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setConvocatoriaAnexo(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={5}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar anexo
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {convocatoria_anexos.map((convocatoria_anexo, i) => (
                            <TableRow key={i}>
                                <TableCell>{convocatoria_anexo.anexo.nombre}</TableCell>
                                <TableCell>
                                    <Chip
                                        key={i}
                                        className="m-1"
                                        label={convocatoria_anexo.tipo_formulario_convocatoria.nombre + ' - Línea: ' + convocatoria_anexo.tipo_formulario_convocatoria.linea_programatica.codigo}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-anexos.cambiar-estados', [convocatoria.id, convocatoria_anexo.id]),
                                                {
                                                    habilitado: !convocatoria_anexo.habilitado,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_anexo.habilitado
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{convocatoria_anexo.habilitado ? 'Habilitado' : 'Deshabilitado'}</div>
                                                <div className="hidden group-hover:block">{convocatoria_anexo.habilitado ? 'Deshabilitar' : 'Habilitar'}</div>
                                            </>
                                        }
                                    />

                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-anexos.cambiar-estados', [convocatoria.id, convocatoria_anexo.id]),
                                                {
                                                    obligatorio: !convocatoria_anexo.obligatorio,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_anexo.obligatorio
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{convocatoria_anexo.obligatorio ? 'Obligatorio' : 'No es obligatorio'}</div>
                                                <div className="hidden group-hover:block">{convocatoria_anexo.obligatorio ? 'No es obligatorio' : 'Obligatorio'}</div>
                                            </>
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {convocatoria_anexo.id !== convocatoria_anexo_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setConvocatoriaAnexo(convocatoria_anexo))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setConvocatoriaAnexoToDestroy(convocatoria_anexo.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setConvocatoriaAnexoToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.convocatoria-anexos.destroy', [convocatoria.id, convocatoria_anexo.id]), {
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
                                is_super_admin={is_super_admin}
                                setDialogStatus={setDialogStatus}
                                method={method}
                                convocatoria={convocatoria}
                                convocatoria_anexo={convocatoria_anexo}
                                anexos={anexos}
                                tipo_formulario_convocatoria_id={page_props.ziggy.query.tipo_formulario_convocatoria_id}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaAnexos

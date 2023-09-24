import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import TableMui from '@/Components/Table'
import TabsConvocatoria from '@/Components/TabsConvocatoria'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'
import { checkRole } from '@/Utils'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const ConvocatoriaTopesRolesSennovaHubInnovacion = ({ auth, convocatoria, topes_roles_sennova, hubs_innovacion, roles_sennova, niveles_academicos }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [tope_rol_sennova_hub_innovacion_to_destroy, setTopeRolSennovaHubInnovacionToDestroy] = useState(null)
    const [tope_rol_sennova_hub_innovacion, setTopeRolSennovaHubInnovacion] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Topes Roles SENNOVA`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="4" convocatoria={convocatoria} tipo_formulario_convocatoria_id={10} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <TableMui className="mt-20" rows={['Nombre del hub', 'Rol SENNOVA', 'Nivel académico', 'Cantidad máxima', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setTopeRolSennovaHubInnovacion(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={5}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar tope
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {topes_roles_sennova.map((tope_rol_sennova_hub_innovacion, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">{tope_rol_sennova_hub_innovacion.hub_innovacion.nombre}</p>
                                </TableCell>
                                <TableCell>{tope_rol_sennova_hub_innovacion.convocatoria_rol_sennova.rol_sennova.nombre}</TableCell>
                                <TableCell>
                                    <p className="first-letter:uppercase">
                                        {niveles_academicos.find((item) => item.value == tope_rol_sennova_hub_innovacion.convocatoria_rol_sennova.nivel_academico)?.label}
                                    </p>
                                </TableCell>
                                <TableCell>{tope_rol_sennova_hub_innovacion.cantidad_maxima}</TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {tope_rol_sennova_hub_innovacion.id !== tope_rol_sennova_hub_innovacion_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setTopeRolSennovaHubInnovacion(tope_rol_sennova_hub_innovacion))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setTopeRolSennovaHubInnovacionToDestroy(tope_rol_sennova_hub_innovacion.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setTopeRolSennovaHubInnovacionToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.topes-roles-sennova-hubs-innovacion.destroy', [convocatoria.id, tope_rol_sennova_hub_innovacion.id]), {
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
                                tope_rol_sennova_hub_innovacion={tope_rol_sennova_hub_innovacion}
                                hubs_innovacion={hubs_innovacion}
                                roles_sennova={roles_sennova}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTopesRolesSennovaHubInnovacion

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

const ConvocatoriaTopesRolesSennovaFormulario15 = ({ auth, convocatoria, topes_roles_sennova, centros_formacion, roles_sennova, niveles_academicos }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [tope_rol_sennova_formulario_15_to_destroy, setTopeRolSennovaFormulario15ToDestroy] = useState(null)
    const [tope_rol_sennova_formulario_15, setTopeRolSennovaFormulario15] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Topes Roles SENNOVA`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="4" convocatoria={convocatoria} tipo_formulario_convocatoria_id={15} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <TableMui
                        className="mt-20"
                        rows={['Centro de formación', 'Rol SENNOVA', 'Nivel académico', 'Cantidad máxima / Honorarios ' + convocatoria.year, 'Meses de apoyo (Máx)', 'Acciones']}
                        sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setTopeRolSennovaFormulario15(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={6}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar tope
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {topes_roles_sennova.map((tope_rol_sennova_formulario_15, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">{tope_rol_sennova_formulario_15.centro_formacion.nombre}</p>
                                </TableCell>
                                <TableCell>{tope_rol_sennova_formulario_15.convocatoria_rol_sennova.rol_sennova.nombre}</TableCell>
                                <TableCell>
                                    <p className="first-letter:uppercase">
                                        {niveles_academicos.find((item) => item.value == tope_rol_sennova_formulario_15.convocatoria_rol_sennova.nivel_academico)?.label}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    {tope_rol_sennova_formulario_15.cantidad_maxima} / $
                                    {new Intl.NumberFormat('de-DE').format(tope_rol_sennova_formulario_15.convocatoria_rol_sennova.asignacion_mensual)} COP
                                </TableCell>

                                <TableCell>{tope_rol_sennova_formulario_15.meses_maximos ?? tope_rol_sennova_formulario_15.convocatoria_rol_sennova.meses_maximos}</TableCell>
                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {tope_rol_sennova_formulario_15.id !== tope_rol_sennova_formulario_15_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setTopeRolSennovaFormulario15(tope_rol_sennova_formulario_15))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setTopeRolSennovaFormulario15ToDestroy(tope_rol_sennova_formulario_15.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setTopeRolSennovaFormulario15ToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.topes-roles-sennova-formulario-15.destroy', [convocatoria.id, tope_rol_sennova_formulario_15.id]), {
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
                                tope_rol_sennova_formulario_15={tope_rol_sennova_formulario_15}
                                centros_formacion={centros_formacion}
                                roles_sennova={roles_sennova}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTopesRolesSennovaFormulario15

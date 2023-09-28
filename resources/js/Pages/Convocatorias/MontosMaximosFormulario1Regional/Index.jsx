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

const ConvocatoriaTopesRolesSennovaTecnoacademia = ({ auth, convocatoria, montos_maximos_por_regional, regionales }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [monto_maximo_por_regional_to_destroy, setMontoMaximoFormulario1RegionalToDestroy] = useState(null)
    const [monto_maximo_por_regional, setMontoMaximoFormulario1Regional] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Topes Roles SENNOVA`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="4" convocatoria={convocatoria} tipo_formulario_convocatoria_id={1} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <TableMui
                        className="mt-20"
                        rows={['Regional', 'Monto máximo ' + convocatoria.year, 'Cantidad máxima de proyectos ' + convocatoria.year, 'Acciones']}
                        sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setMontoMaximoFormulario1Regional(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={6}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar monto
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {montos_maximos_por_regional.map((monto_maximo_por_regional, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">{monto_maximo_por_regional.regional.nombre}</p>
                                </TableCell>
                                <TableCell>${new Intl.NumberFormat('de-DE').format(monto_maximo_por_regional.monto_maximo)} COP</TableCell>
                                <TableCell>{monto_maximo_por_regional.maximo_proyectos}</TableCell>
                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {monto_maximo_por_regional.id !== monto_maximo_por_regional_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setMontoMaximoFormulario1Regional(monto_maximo_por_regional))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setMontoMaximoFormulario1RegionalToDestroy(monto_maximo_por_regional.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setMontoMaximoFormulario1RegionalToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.montos-maximos-formulario-1-regional.destroy', [convocatoria.id, monto_maximo_por_regional.id]), {
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
                                monto_maximo_por_regional={monto_maximo_por_regional}
                                regionales={regionales}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTopesRolesSennovaTecnoacademia

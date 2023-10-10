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

const ConvocatoriaTopesRubrosPresupuestalesFormulario7 = ({ auth, convocatoria, topes_presupuestales_formulario_7, segundo_grupo_presupuestal, conceptos_internos_sena }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [tope_presupuestal_formulario_7_to_destroy, setTopePresupuestalFormulario7ToDestroy] = useState(null)
    const [tope_presupuestal_formulario_7, setTopePresupuestalFormulario7] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Topes Rubros Presupuestales`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="4" convocatoria={convocatoria} tipo_formulario_convocatoria_id={7} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <TableMui className="mt-20" rows={['Concepto interno SENA', 'Tope máximo ($)', 'Tope máximo (%)', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setTopePresupuestalFormulario7(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={4}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar tope
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {topes_presupuestales_formulario_7.map((tope_presupuestal_formulario_7, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">{tope_presupuestal_formulario_7?.segundo_grupo_presupuestal.nombre}</p>
                                </TableCell>

                                <TableCell>${new Intl.NumberFormat('de-DE').format(tope_presupuestal_formulario_7.valor)} COP</TableCell>
                                <TableCell>{tope_presupuestal_formulario_7.porcentaje ? tope_presupuestal_formulario_7.porcentaje : 0} % del valor total del proyecto</TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {tope_presupuestal_formulario_7.id !== tope_presupuestal_formulario_7_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setTopePresupuestalFormulario7(tope_presupuestal_formulario_7))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setTopePresupuestalFormulario7ToDestroy(tope_presupuestal_formulario_7.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setTopePresupuestalFormulario7ToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.topes-presupuestales-formulario-7.destroy', [convocatoria.id, tope_presupuestal_formulario_7.id]), {
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
                                tope_presupuestal_formulario_7={tope_presupuestal_formulario_7}
                                segundo_grupo_presupuestal={segundo_grupo_presupuestal}
                                conceptos_internos_sena={conceptos_internos_sena}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTopesRubrosPresupuestalesFormulario7

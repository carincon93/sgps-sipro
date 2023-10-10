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

const ConvocatoriaTopesRubrosPresupuestalesNodosTecnoparque = ({ auth, convocatoria, topes_presupuestales_nodos_tecnoparque, nodos_tecnoparque, segundo_grupo_presupuestal }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [tope_presupuestal_tecnoparque_to_destroy, setTopePresupuestalTecnoparqueToDestroy] = useState(null)
    const [tope_presupuestal_tecnoparque, setTopePresupuestalTecnoparque] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Topes Rubros Presupuestales`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="5" convocatoria={convocatoria} tipo_formulario_convocatoria_id={17} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <TableMui className="mt-20" rows={['Nombre del nodo', 'Concepto interno SENA', 'Valor', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setTopePresupuestalTecnoparque(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={5}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar tope
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {topes_presupuestales_nodos_tecnoparque.map((tope_presupuestal_tecnoparque, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">Red {tope_presupuestal_tecnoparque.nodo_tecnoparque.nombre}</p>
                                </TableCell>
                                <TableCell>
                                    <ul className="list-disc">
                                        {tope_presupuestal_tecnoparque.segundo_grupo_presupuestal.map((concepto_interno_sena, i) => (
                                            <li key={i}>
                                                <p className="first-letter:uppercase">{concepto_interno_sena.nombre}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>

                                <TableCell>${new Intl.NumberFormat('de-DE').format(tope_presupuestal_tecnoparque.valor)} COP</TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {tope_presupuestal_tecnoparque.id !== tope_presupuestal_tecnoparque_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setTopePresupuestalTecnoparque(tope_presupuestal_tecnoparque))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setTopePresupuestalTecnoparqueToDestroy(tope_presupuestal_tecnoparque.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setTopePresupuestalTecnoparqueToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.topes-presupuestales-tecnoparque.destroy', [convocatoria.id, tope_presupuestal_tecnoparque.id]), {
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
                                tope_presupuestal_tecnoparque={tope_presupuestal_tecnoparque}
                                nodos_tecnoparque={nodos_tecnoparque}
                                segundo_grupo_presupuestal={segundo_grupo_presupuestal}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTopesRubrosPresupuestalesNodosTecnoparque

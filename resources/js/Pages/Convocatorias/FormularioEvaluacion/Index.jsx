import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
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

const FormularioEvaluacion = ({ auth, convocatoria, tipo_formulario_convocatoria_id, items_evaluacion, convocatorias }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [item_evaluacion_to_destroy, setItemEvaluacionToDestroy] = useState(null)
    const [item_evaluacion, setItemEvaluacion] = useState(null)

    const sum_puntaje_maximo = items_evaluacion.reduce((accumulator, item) => {
        const puntaje_maximo = parseFloat(item.puntaje_maximo)
        if (!isNaN(puntaje_maximo)) {
            return accumulator + puntaje_maximo
        }
        return accumulator
    }, 0)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Formulario de evaluación`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="6" convocatoria={convocatoria} tipo_formulario_convocatoria_id={tipo_formulario_convocatoria_id} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <AlertMui className="mt-20">
                        Total de la suma de los puntajes máximos: <strong>{sum_puntaje_maximo}</strong>. Recuerde que no debe sobrepasar los 100 puntos.
                    </AlertMui>
                    <TableMui rows={['Campo', 'Criterio', 'Puntaje máximo', 'Convocatorias', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setItemEvaluacion(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={6}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar ítem a evaluar
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {items_evaluacion.map((item_evaluacion, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">{item_evaluacion.campo}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="whitespace-pre-line line-clamp-4">{item_evaluacion.criterio ?? 'Sin criterio definido'}</p>
                                </TableCell>
                                <TableCell>{item_evaluacion.puntaje_maximo ?? 'Sin puntaje máximo definido'}</TableCell>
                                <TableCell>
                                    <ul className="list-disc">
                                        {convocatorias
                                            .filter((item) => item_evaluacion.convocatorias_id.includes(item.value))
                                            .map((convocatoria, i) => (
                                                <li key={i}>{convocatoria.label}</li>
                                            ))}
                                    </ul>
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {item_evaluacion.id !== item_evaluacion_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setItemEvaluacion(item_evaluacion))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setItemEvaluacionToDestroy(item_evaluacion.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setItemEvaluacionToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(
                                                            route('convocatorias.tipos-formulario-convocatoria.destroy-formulario-evaluacion', [
                                                                convocatoria.id,
                                                                tipo_formulario_convocatoria_id,
                                                                item_evaluacion.id,
                                                            ]),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
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
                                tipo_formulario_convocatoria_id={tipo_formulario_convocatoria_id}
                                item_evaluacion={item_evaluacion}
                                convocatorias={convocatorias}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default FormularioEvaluacion

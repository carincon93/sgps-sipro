import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import TabsConvocatoria from '@/Components/TabsConvocatoria'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { checkRole } from '@/Utils'
import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const ConvocatoriaRubroPresupuestales = ({ auth, convocatoria, convocatoria_rubros_presupuestales, rubros_presupuestales }) => {
    const { props: page_props } = usePage()

    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [convocatoria_rubro_presupuestal_to_destroy, setConvocatoriaRubroPresupuestalToDestroy] = useState(null)
    const [convocatoria_rubro_presupuestal, setConvocatoriaRubroPresupuestal] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title={`Convocatoria ${convocatoria.year} - Rubros presupuestales`} />

            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="2" convocatoria={convocatoria} tipo_formulario_convocatoria_id={page_props.ziggy.query.tipo_formulario_convocatoria_id} />
                    </Grid>
                )}

                <Grid item md={12} className="!mt-20">
                    <AlertMui className="mt-20">
                        <strong>Importante:</strong> Si deshabilita o cambia el estado del rubro a <strong>NO SUMA AL PRESUPUESTO</strong> este no sumára al total del precio del proyecto. Es de gran
                        importancia que defina los estados antes de empezar la convocatoria de lo contrario los usuarios pueden asociar el rubro y si posteriormente se hace una modificación el valor
                        del proyecto también se actualizará, haciendo que el usuario perciba inconsistencias en la plataforma. Por favor si lo hace notifique inmediatamente a todos los formuladores de
                        las modificaciones realizadas.
                        <br />
                    </AlertMui>
                    <TableMui rows={['Concepto interno SENA', 'Concepto ministerio de hacienda', 'Uso presupuestal', 'Estado', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setConvocatoriaRubroPresupuestal(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={7}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar rubro presupuestal
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {convocatoria_rubros_presupuestales.data.map((convocatoria_rubro_presupuestal, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <p className="first-letter:uppercase">{convocatoria_rubro_presupuestal.rubro_presupuestal.segundo_grupo_presupuestal.nombre}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="first-letter:uppercase">{convocatoria_rubro_presupuestal.rubro_presupuestal.tercer_grupo_presupuestal.nombre}</p>
                                </TableCell>
                                <TableCell>
                                    <small>{convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.codigo}:</small>
                                    <p className="first-letter:uppercase">{convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.descripcion}</p>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-rubros-presupuestales.cambiar-estados', [convocatoria.id, convocatoria_rubro_presupuestal.id]),
                                                {
                                                    habilitado: !convocatoria_rubro_presupuestal.habilitado,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_rubro_presupuestal.habilitado
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{convocatoria_rubro_presupuestal.habilitado ? 'Habilitado' : 'Deshabilitado'}</div>
                                                <div className="hidden group-hover:block">{convocatoria_rubro_presupuestal.habilitado ? 'Deshabilitar' : 'Habilitar'}</div>
                                            </>
                                        }
                                    />

                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-rubros-presupuestales.cambiar-estados', [convocatoria.id, convocatoria_rubro_presupuestal.id]),
                                                {
                                                    sumar_al_presupuesto: !convocatoria_rubro_presupuestal.sumar_al_presupuesto,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_rubro_presupuestal.sumar_al_presupuesto
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{convocatoria_rubro_presupuestal.sumar_al_presupuesto ? 'Suma al presupuesto' : 'No suma al presupuesto'}</div>
                                                <div className="hidden group-hover:block">
                                                    {convocatoria_rubro_presupuestal.sumar_al_presupuesto ? 'No suma al presupuesto' : 'Suma al presupuesto'}
                                                </div>
                                            </>
                                        }
                                    />

                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-rubros-presupuestales.cambiar-estados', [convocatoria.id, convocatoria_rubro_presupuestal.id]),
                                                {
                                                    requiere_estudio_mercado: !convocatoria_rubro_presupuestal.requiere_estudio_mercado,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_rubro_presupuestal.requiere_estudio_mercado
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">
                                                    {convocatoria_rubro_presupuestal.requiere_estudio_mercado ? 'Requiere estudio de mercado' : 'No requiere estudio de mercado'}
                                                </div>
                                                <div className="hidden group-hover:block">
                                                    {convocatoria_rubro_presupuestal.requiere_estudio_mercado ? 'No requiere estudio de mercado' : 'Requiere estudio de mercado'}
                                                </div>
                                            </>
                                        }
                                    />
                                </TableCell>

                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {convocatoria_rubro_presupuestal.id !== convocatoria_rubro_presupuestal_to_destroy ? (
                                            <div>
                                                <MenuItem
                                                    onClick={() => {
                                                        setConvocatoriaRubroPresupuestalToDestroy(convocatoria_rubro_presupuestal.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setConvocatoriaRubroPresupuestalToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.convocatoria-rubros-presupuestales.destroy', [convocatoria.id, convocatoria_rubro_presupuestal.id]), {
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

                    <PaginationMui
                        links={convocatoria_rubros_presupuestales.links}
                        route_params="tipo_formulario_convocatoria_id"
                        route_params_value={page_props.ziggy.query.tipo_formulario_convocatoria_id}
                        className="mt-6"
                    />

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
                                convocatoria_rubro_presupuestal={convocatoria_rubro_presupuestal}
                                rubros_presupuestales={rubros_presupuestales}
                                tipo_formulario_convocatoria_id={page_props.ziggy.query.tipo_formulario_convocatoria_id}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaRubroPresupuestales

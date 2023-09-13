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
import { router, usePage } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const ConvocatoriaRolesSennova = ({ auth, convocatoria, convocatoria_roles_sennova, roles_sennova, niveles_academicos }) => {
    const { props: page_props } = usePage()

    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [convocatoria_rol_sennova_to_destroy, setConvocatoriaRolSennovaToDestroy] = useState(null)
    const [convocatoria_rol_sennova, setConvocatoriaRolSennova] = useState(null)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Roles SENNOVA</h2>}>
            <Grid container>
                {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                    <Grid item md={12}>
                        <TabsConvocatoria value="1" convocatoria={convocatoria} tipo_formulario_convocatoria_id={page_props.ziggy.query.tipo_formulario_convocatoria_id} />
                    </Grid>
                )}

                <Grid item md={12}>
                    <AlertMui className="mt-20">
                        Por favor diligencie el nivel académico, experiencia, asignación mensual de TODOS los roles SENNOVA que se listan en la tabla. Si hay algún rol con información incompleta se le
                        inactivará al formulador el paso de <strong>Roles</strong>.
                        <br />
                        <br />
                        <strong>Importante:</strong> Si deshabilita o cambia el estado del rol a <strong>NO SUMA AL PRESUPUESTO</strong> este no sumára al total del precio del proyecto. Es de gran
                        importancia que defina los estados y valores antes de empezar la convocatoria de lo contrario los usuarios pueden asociar el rol y si posteriormente se hace una modificación el
                        valor del proyecto también se actualizará, haciendo que el usuario perciba inconsistencias en la plataforma. Por favor si lo hace notifique inmediatamente a todos los
                        formuladores de las modificaciones realizadas.
                        <br />
                    </AlertMui>
                    <TableMui rows={['Nombre', 'Nivel académico', 'Asignación mensual ' + convocatoria.year, 'Estado', 'Acciones']} sxCellThead={{ width: '320px' }}>
                        <TableRow
                            onClick={() => (setDialogStatus(true), setMethod('POST'), setConvocatoriaRolSennova(null))}
                            variant="raised"
                            className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={6}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar rol SENNOVA
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                        {convocatoria_roles_sennova.data.map((convocatoria_rol_sennova, i) => (
                            <TableRow key={i}>
                                <TableCell>{convocatoria_rol_sennova.rol_sennova.nombre}</TableCell>
                                <TableCell>
                                    <p className="first-letter:uppercase">
                                        {convocatoria_rol_sennova.nivel_academico
                                            ? niveles_academicos.find((item) => item.value == convocatoria_rol_sennova?.nivel_academico).label
                                            : 'Sin información registrada'}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div>${new Intl.NumberFormat('de-DE').format(convocatoria_rol_sennova.asignacion_mensual)} COP</div>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-roles-sennova.cambiar-estados', [convocatoria.id, convocatoria_rol_sennova.id]),
                                                {
                                                    habilitado: !convocatoria_rol_sennova.habilitado,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_rol_sennova.habilitado
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{convocatoria_rol_sennova.habilitado ? 'Habilitado' : 'Deshabilitado'}</div>
                                                <div className="hidden group-hover:block">{convocatoria_rol_sennova.habilitado ? 'Deshabilitar' : 'Habilitar'}</div>
                                            </>
                                        }
                                    />
                                    <Chip
                                        onClick={() =>
                                            router.put(
                                                route('convocatorias.convocatoria-roles-sennova.cambiar-estados', [convocatoria.id, convocatoria_rol_sennova.id]),
                                                {
                                                    sumar_al_presupuesto: !convocatoria_rol_sennova.sumar_al_presupuesto,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`${
                                            convocatoria_rol_sennova.sumar_al_presupuesto
                                                ? '!bg-blue-200 !text-blue-500 hover:!bg-red-200 hover:!text-red-500'
                                                : '!bg-red-200 !text-red-500 hover:!bg-blue-200 hover:!text-blue-500'
                                        } mt-1 group w-[220px] !mb-3`}
                                        label={
                                            <>
                                                <div className="group-hover:hidden">{convocatoria_rol_sennova.sumar_al_presupuesto ? 'Suma al presupuesto' : 'No suma al presupuesto'}</div>
                                                <div className="hidden group-hover:block">{convocatoria_rol_sennova.sumar_al_presupuesto ? 'No suma al presupuesto' : 'Suma al presupuesto'}</div>
                                            </>
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <MenuMui text={<MoreVertIcon />}>
                                        {convocatoria_rol_sennova.id !== convocatoria_rol_sennova_to_destroy ? (
                                            <div>
                                                <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setConvocatoriaRolSennova(convocatoria_rol_sennova))}>Editar</MenuItem>

                                                <MenuItem
                                                    onClick={() => {
                                                        setConvocatoriaRolSennovaToDestroy(convocatoria_rol_sennova.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setConvocatoriaRolSennovaToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.delete(route('convocatorias.convocatoria-roles-sennova.destroy', [convocatoria.id, convocatoria_rol_sennova.id]), {
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
                        links={convocatoria_roles_sennova.links}
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
                                convocatoria_rol_sennova={convocatoria_rol_sennova}
                                roles_sennova={roles_sennova}
                                niveles_academicos={niveles_academicos}
                                tipo_formulario_convocatoria_id={page_props.ziggy.query.tipo_formulario_convocatoria_id}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaRolesSennova

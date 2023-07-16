import { router, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import PrimaryButton from '@/Components/PrimaryButton'
import TableMui from '@/Components/Table'
import TextInput from '@/Components/TextInput'

import { Divider, MenuItem, TableCell, TableRow } from '@mui/material'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'

const RolesSennova = ({ auth, convocatoria, proyecto, proyectoRolesSennova }) => {
    const [proyectoRolSennovaIdToDestroy, setProyectoRolSennovaIdToDestroy] = useState(null)

    const form = useForm({
        cantidad_instructores_planta: proyecto.cantidad_instructores_planta,
        cantidad_dinamizadores_planta: proyecto.cantidad_dinamizadores_planta,
        cantidad_psicopedagogos_planta: proyecto.cantidad_psicopedagogos_planta,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.rol-sennova-ta.update', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout>
            <h1 className="mt-24 mb-8 text-center text-3xl">Roles SENNOVA</h1>

            <AlertMui className="my-14" hiddenIcon={true}>
                <p>
                    <strong>Actualmente el total del costo de los roles requeridos es de:</strong> ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_roles_sennova) ? proyecto.total_roles_sennova : 0)} COP. Tenga en cuenta que el rol <strong>Aprendiz SENNOVA (contrato aprendizaje)</strong> no suma al total del presupuesto del proyecto.
                </p>
            </AlertMui>

            <h2 className="text-center mt-10 mb-24">{proyecto.codigo_linea_programatica == 70 ? 'Ingrese el número de instructores de planta, dinamizadores de planta y psicopedagógos de planta que requiere el proyecto.' : 'Ingrese cada uno de los roles SENNOVA que requiere el proyecto.'}</h2>

            {proyecto.codigo_linea_programatica == 70 && (
                <form onSubmit={submit} className="mb-40">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        <div className="mt-8">
                            <TextInput label="Número de instructores de planta" id="cantidad_instructores_planta" type="number" inputProps={{ min: 0, max: 32767 }} className="mt-1" error={form.errors.cantidad_instructores_planta} value={form.data.cantidad_instructores_planta} onChange={(e) => form.setData('cantidad_instructores_planta', e.target.value)} required />
                        </div>

                        <div className="mt-8">
                            <TextInput label="Número de dinamizadores de planta" id="cantidad_dinamizadores_planta" type="number" inputProps={{ min: 0, max: 32767 }} className="mt-1" error={form.errors.cantidad_dinamizadores_planta} value={form.data.cantidad_dinamizadores_planta} onChange={(e) => form.setData('cantidad_dinamizadores_planta', e.target.value)} required />
                        </div>

                        <div className="mt-8">
                            <TextInput label="Número de psicopedagógos de planta" id="cantidad_psicopedagogos_planta" type="number" inputProps={{ min: 0, max: 32767 }} className="mt-1" error={form.errors.cantidad_psicopedagogos_planta} value={form.data.cantidad_psicopedagogos_planta} onChange={(e) => form.setData('cantidad_psicopedagogos_planta', e.target.value)} required />
                        </div>
                    </fieldset>
                    <div className="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                        {proyecto.allowed.to_update && (
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Guardar
                            </PrimaryButton>
                        )}
                    </div>
                </form>
            )}
            {proyecto.allowed.to_update && (
                <ButtonMui onClick={() => router.visit(route('convocatorias.proyectos.proyecto-rol-sennova.create', [convocatoria.id, proyecto.id]))} variant="raised">
                    Añadir Rol SENNOVA
                </ButtonMui>
            )}

            <TableMui className="mt-20" rows={['Nombre', 'Nivel académico', 'Asignación mensual', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {proyectoRolesSennova.data.map((proyectoRolSennova, i) => (
                    <TableRow key={i}>
                        <TableCell>{proyectoRolSennova?.convocatoria_rol_sennova?.rol_sennova?.nombre}</TableCell>
                        <TableCell>{proyectoRolSennova?.convocatoria_rol_sennova?.nivel_academico}</TableCell>
                        <TableCell>
                            ${new Intl.NumberFormat('de-DE').format(!isNaN(proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual) ? proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual : 0)} / Meses: {proyectoRolSennova.numero_meses} / Cantidad: {proyectoRolSennova.numero_roles}
                        </TableCell>
                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                <MenuItem onClick={() => router.visit(route('convocatorias.proyectos.proyecto-rol-sennova.edit', [convocatoria.id, proyecto.id, proyectoRolSennova.id]))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                    Editar
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setProyectoRolSennovaIdToDestroy(proyectoRolSennova.id)
                                    }}
                                >
                                    Eliminar
                                </MenuItem>
                                {proyectoRolSennova.id === proyectoRolSennovaIdToDestroy && (
                                    <MenuItem
                                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (proyecto.allowed.to_update) {
                                                router.delete(route('convocatorias.proyectos.proyecto-rol-sennova.destroy', [convocatoria.id, proyecto.id, proyectoRolSennova.id]), {
                                                    preserveScroll: true,
                                                })
                                            }
                                        }}
                                    >
                                        Confirmar
                                    </MenuItem>
                                )}
                            </MenuMui>
                        </TableCell>
                    </TableRow>
                ))}
            </TableMui>

            <PaginationMui links={proyectoRolesSennova.links} />
        </AuthenticatedLayout>
    )
}

export default RolesSennova

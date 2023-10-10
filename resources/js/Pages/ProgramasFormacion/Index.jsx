import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { useState } from 'react'
import { Head, router } from '@inertiajs/react'

import { route, checkRole } from '@/Utils'

import Form from './Form'

const Index = ({ auth, programas_formacion, modalidades, niveles_formacion }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [programa_formacion, setProgramaFormacion] = useState(null)
    const [programa_formacion_to_destroy, setProgramaFormacionToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Programas de formación" />

            <Grid item md={12}>
                <SearchBar />

                <TableMui className="mt-20" rows={['Nombre', 'Modalidad', '¿Cuenta con registro calificado?', 'Nivel de formación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {is_super_admin ? (
                        <TableRow onClick={() => (setDialogStatus(true), setMethod('POST'), setProgramaFormacion(null))} variant="raised" className="bg-app-100 hover:bg-app-50 hover:cursor-pointer">
                            <TableCell colSpan={5}>
                                <ButtonMui>
                                    <AddCircleOutlineOutlinedIcon className="mr-1" /> Agregar programa de formación
                                </ButtonMui>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {programas_formacion.data.map((programa_formacion, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Chip className="mb-2" size="small" label={programa_formacion.codigo ? 'Código ' + programa_formacion.codigo : 'Sin código'} />
                                <p className="first-letter:uppercase">{programa_formacion.nombre}</p>
                            </TableCell>

                            <TableCell>
                                <p className="first-letter:uppercase">{modalidades.find((item) => item.value == programa_formacion.modalidad)?.label}</p>
                            </TableCell>

                            <TableCell>
                                <Chip
                                    className={`${programa_formacion.registro_calificado ? '!bg-blue-200 !text-blue-500' : '!bg-red-200 !text-red-500'} mt-1 group`}
                                    label={programa_formacion.registro_calificado ? 'Con registro calificado' : 'Sin registro calificado'}
                                />
                            </TableCell>

                            <TableCell>
                                <p className="first-letter:uppercase">{niveles_formacion.find((item) => item.value == programa_formacion.nivel_formacion)?.label}</p>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {programa_formacion.id !== programa_formacion_to_destroy ? (
                                        <div>
                                            <MenuItem onClick={() => (setDialogStatus(true), setMethod('PUT'), setProgramaFormacion(programa_formacion))} disabled={!is_super_admin}>
                                                Editar
                                            </MenuItem>

                                            <MenuItem
                                                onClick={() => {
                                                    setProgramaFormacionToDestroy(programa_formacion.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setProgramaFormacionToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (is_super_admin) {
                                                        router.delete(route('programas-formacion.destroy', [programa_formacion.id]), {
                                                            preserveScroll: true,
                                                        })
                                                    }
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

                <PaginationMui links={programas_formacion.links} className="mt-8" />

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
                            programa_formacion={programa_formacion}
                            modalidades={modalidades}
                            niveles_formacion={niveles_formacion}
                        />
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

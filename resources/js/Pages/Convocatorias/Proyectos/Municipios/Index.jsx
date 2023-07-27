import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import PaginationMui from '@/Components/Pagination'
import TableMui from '@/Components/Table'
import StepperMui from '@/Components/Stepper'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Grid, MenuItem, TableCell, TableRow } from '@mui/material'

import { checkRole } from '@/Utils'
import { router } from '@inertiajs/react'
import { useState } from 'react'

import Form from './Form'

const Municipios = ({
    auth,
    convocatoria,
    proyecto,
    evaluacion,
    presupuesto,
    ta_tp_viaticos_municipios,
    municipios,
    proyecto_roles_sennova,
    distancias_municipios,
    frecuencias_semanales,
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [municipio_to_destroy, setMunicipioToDestroy] = useState(null)
    const [dialog_status, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [municipio, setMunicipio] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} label="Municipios" />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Municipios</h1>

                {is_super_admin || proyecto.allowed.to_update ? (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setMunicipio(null))} variant="raised">
                        Añadir municipio
                    </ButtonMui>
                ) : null}
            </Grid>
            <Grid item md={12}>
                <TableMui className="mt-20 mb-8" rows={['Municipios a visitar', 'Información de la visita', 'Actividades a realizar', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {ta_tp_viaticos_municipios.map((municipio_a_visitar, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {municipios
                                    .filter((item) => JSON.parse(municipio_a_visitar.municipios).includes(item.value))
                                    .map((item) => item.label)
                                    .join(', ')}
                            </TableCell>
                            <TableCell>
                                / Distancia aprox. municipios: {distancias_municipios.find((item) => item.value == municipio_a_visitar.distancia_municipio).label}
                                <br />/ Frecuencia semanal de visita: {frecuencias_semanales.find((item) => item.value == municipio_a_visitar.frecuencia_semanal).label}
                                <br />/ Número de visitas: {municipio_a_visitar.numero_visitas}
                            </TableCell>

                            <TableCell>
                                <p className="line-clamp-4">{municipio_a_visitar.actividad_a_realizar}</p>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {municipio_a_visitar.id !== municipio_to_destroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setMunicipio(municipio_a_visitar))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setMunicipioToDestroy(municipio_a_visitar.id)
                                                }}>
                                                Eliminar
                                            </MenuItem>
                                        </div>
                                    ) : (
                                        <div>
                                            <MenuItem
                                                onClick={(e) => {
                                                    setMunicipioToDestroy(null)
                                                }}>
                                                Cancelar
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (proyecto.allowed.to_update) {
                                                        router.delete(
                                                            route('convocatorias.proyectos.presupuesto.municipios.destroy', [convocatoria.id, proyecto.id, presupuesto.id, municipio_a_visitar.id]),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
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
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            presupuesto={presupuesto}
                            municipio_a_visitar={municipio}
                            municipios={municipios}
                            proyecto_roles_sennova={proyecto_roles_sennova}
                            distancias_municipios={distancias_municipios}
                            frecuencias_semanales={frecuencias_semanales}
                        />
                    }
                />
            </Grid>
            <PaginationMui links={ta_tp_viaticos_municipios.links} />
        </AuthenticatedLayout>
    )
}

export default Municipios

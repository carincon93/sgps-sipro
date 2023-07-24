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

const Municipios = ({ auth, convocatoria, proyecto, presupuesto, taTpViaticosMunicipios, municipios, proyectoRolesSennova, distanciasMunicipios, frecuenciasSemanales, ...props }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const [municipioToDestroy, setMunicipioToDestroy] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const [method, setMethod] = useState('')
    const [municipio, setMunicipio] = useState(null)

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} label="Municipios" />
            </Grid>

            <Grid item md={12}>
                <h1 className="text-3xl mb-8 text-center">Municipios</h1>

                {isSuperAdmin || proyecto.allowed.to_update ? (
                    <ButtonMui onClick={() => (setDialogStatus(true), setMethod('crear'), setMunicipio(null))} variant="raised">
                        Añadir municipio
                    </ButtonMui>
                ) : null}
            </Grid>
            <Grid item md={12}>
                <TableMui className="mt-20" rows={['Municipios a visitar', 'Información de la visita', 'Actividades a realizar', 'Acciones']} sxCellThead={{ width: '320px' }}>
                    {taTpViaticosMunicipios.map((municipioAVisitar, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                {municipios
                                    .filter((item) => JSON.parse(municipioAVisitar.municipios).includes(item.value))
                                    .map((item) => item.label)
                                    .join(', ')}
                            </TableCell>
                            <TableCell>
                                / Distancia aprox. municipios: {distanciasMunicipios.find((item) => item.value == municipioAVisitar.distancia_municipio).label}
                                <br />/ Frecuencia semanal de visita: {frecuenciasSemanales.find((item) => item.value == municipioAVisitar.frecuencia_semanal).label}
                                <br />/ Número de visitas: {municipioAVisitar.numero_visitas}
                            </TableCell>

                            <TableCell>
                                <p className="line-clamp-4">{municipioAVisitar.actividad_a_realizar}</p>
                            </TableCell>

                            <TableCell>
                                <MenuMui text={<MoreVertIcon />}>
                                    {municipioAVisitar.id !== municipioToDestroy ? (
                                        <div>
                                            <MenuItem
                                                onClick={() => (setDialogStatus(true), setMethod('editar'), setMunicipio(municipioAVisitar))}
                                                disabled={!proyecto.allowed.to_update}
                                                className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                                Editar
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setMunicipioToDestroy(municipioAVisitar.id)
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
                                                            route('convocatorias.proyectos.presupuesto.municipios.destroy', [convocatoria.id, proyecto.id, presupuesto.id, municipioAVisitar.id]),
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
                    open={dialogStatus}
                    fullWidth={true}
                    maxWidth="lg"
                    blurEnabled={true}
                    dialogContent={
                        <Form
                            isSuperAdmin={isSuperAdmin}
                            setDialogStatus={setDialogStatus}
                            method={method}
                            proyecto={proyecto}
                            convocatoria={convocatoria}
                            presupuesto={presupuesto}
                            municipioAVisitar={municipio}
                            municipios={municipios}
                            proyectoRolesSennova={proyectoRolesSennova}
                            distanciasMunicipios={distanciasMunicipios}
                            frecuenciasSemanales={frecuenciasSemanales}
                        />
                    }
                />
            </Grid>
            <PaginationMui links={taTpViaticosMunicipios.links} />
        </AuthenticatedLayout>
    )
}

export default Municipios

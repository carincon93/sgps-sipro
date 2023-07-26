import AlertMui from '@/Components/Alert'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MenuItem, TableCell, TableRow } from '@mui/material'

import { router } from '@inertiajs/react'
import { route } from '@/Utils'

const SemillerosInvestigacion = ({ auth_user, convocatoria, proyecto, nuevo_semillero_investigacion }) => {
    return (
        <>
            <h1 className="mt-24 mb-8 text-center text-3xl">Semilleros de investigación vinculados</h1>

            <TableMui className="mt-20" rows={['Nombre', 'Línea de investigación', 'Grupo de investigación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {proyecto.semillerosInvestigacion.map((semilleroInvestigacion, i) => (
                    <TableRow key={i}>
                        <TableCell>{semilleroInvestigacion.nombre}</TableCell>
                        <TableCell>{semilleroInvestigacion.linea_investigacion.nombre}</TableCell>
                        <TableCell>
                            {semilleroInvestigacion.linea_investigacion.grupo_investigacion.nombre} - {semilleroInvestigacion.linea_investigacion.grupo_investigacion.acronimo}
                        </TableCell>
                        <TableCell>
                            <MenuMui text={<MoreVertIcon />}>
                                <MenuItem
                                    onClick={() =>
                                        router.delete(
                                            route('convocatorias.proyectos.participantes.semilleros-investigacion.unlink', {
                                                proyecto: proyecto.id,
                                                convocatoria: convocatoria.id,
                                                semillero_investigacion: semilleroInvestigacion.id,
                                            }),
                                            { preserveScroll: true },
                                        )
                                    }
                                    disabled={!proyecto.allowed.to_update}
                                    className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                    Quitar
                                </MenuItem>
                            </MenuMui>
                        </TableCell>
                    </TableRow>
                ))}

                {nuevo_semillero_investigacion && (
                    <TableRow sx={{ backgroundColor: '#e5f6fd' }}>
                        <TableCell>{nuevo_semillero_investigacion.nombre}</TableCell>
                        <TableCell>{nuevo_semillero_investigacion.linea_investigacion.nombre}</TableCell>
                        <TableCell>
                            {nuevo_semillero_investigacion.linea_investigacion.grupo_investigacion.nombre} - {nuevo_semillero_investigacion.linea_investigacion.grupo_investigacion.acronimo}
                        </TableCell>

                        <TableCell>
                            <PrimaryButton
                                onClick={() => {
                                    router.post(
                                        route('convocatorias.proyectos.participantes.semilleros-investigacion.link', {
                                            proyecto: proyecto.id,
                                            convocatoria: convocatoria.id,
                                            semillero_investigacion: nuevo_semillero_investigacion.id,
                                        }),
                                        { preserveScroll: true },
                                    )
                                }}>
                                Vincular
                            </PrimaryButton>
                        </TableCell>
                    </TableRow>
                )}
                <TableRow sx={{ backgroundColor: '#e5f6fd' }}>
                    <TableCell colSpan={6} className="!align-top">
                        <p>Agregar semillero de investigación</p>
                        <AlertMui className="mt-5">1. Escriba el nombre del semillero de investigación.</AlertMui>
                        <SearchBar placeholder="Buscar semillero de investigación" inputBackground="white" routeParams={[convocatoria.id, proyecto.id]} />
                    </TableCell>
                </TableRow>
            </TableMui>
        </>
    )
}

export default SemillerosInvestigacion

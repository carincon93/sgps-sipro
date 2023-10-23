import AlertMui from '@/Components/Alert'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import SearchBar from '@/Components/SearchBar'
import TableMui from '@/Components/Table'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, MenuItem, TableCell, TableRow } from '@mui/material'

import { router } from '@inertiajs/react'
import { route } from '@/Utils'

const SemillerosInvestigacion = ({ auth_user, convocatoria, proyecto, nuevo_semillero_investigacion }) => {
    return (
        <>
            <h1 className="mt-24 mb-8 text-center text-3xl">Semilleros de investigación vinculados</h1>

            <TableMui className="mt-20" rows={['Nombre', 'Línea de investigación', 'Grupo de investigación', 'Acciones']} sxCellThead={{ width: '320px' }}>
                {proyecto.semilleros_investigacion?.map((semilleroInvestigacion, i) => (
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
                                    disabled={!proyecto.allowed.to_update}>
                                    Quitar
                                </MenuItem>
                            </MenuMui>
                        </TableCell>
                    </TableRow>
                ))}

                {nuevo_semillero_investigacion && (
                    <TableRow sx={{ backgroundColor: '#e5f6fd' }}>
                        <TableCell>
                            <p className="uppercase">{nuevo_semillero_investigacion.nombre}</p>
                            <Chip label={nuevo_semillero_investigacion.codigo} />
                        </TableCell>
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
                                }}
                                disabled={!proyecto.allowed.to_update}>
                                Vincular
                            </PrimaryButton>
                        </TableCell>
                    </TableRow>
                )}
                <TableRow sx={{ backgroundColor: '#e5f6fd' }}>
                    <TableCell colSpan={6} className="!align-top">
                        <p>
                            <strong>Agregar semillero</strong>
                        </p>

                        <AlertMui className="mt-6">
                            En una nueva pestaña, diríjase al módulo de semilleros de investigación, consulte el código del semillero (SGPS-SEM-XX), luego en el siguiente campo de búsqueda escriba el
                            código y haga clic en <strong>'Buscar'</strong>.
                        </AlertMui>

                        <AlertMui className="mt-5">Escriba el nombre del semillero. Es recomendable buscar por el código del semillero para que el resultado sea exacto.</AlertMui>
                        <SearchBar placeholder="Buscar semillero de investigación (SGPS-SEM-XX)" inputBackground="white" routeParams={[convocatoria.id, proyecto.id]} />
                    </TableCell>
                </TableRow>
            </TableMui>
        </>
    )
}

export default SemillerosInvestigacion

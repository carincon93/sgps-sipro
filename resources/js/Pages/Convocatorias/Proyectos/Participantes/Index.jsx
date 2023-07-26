import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import StepperMui from '@/Components/Stepper'

import { Grid } from '@mui/material'

import Participantes from './Participantes'
import SemillerosInvestigacion from './SemillerosInvestigacion'

const Index = ({ convocatoria, proyecto, evaluacion, nuevo_participante, nuevo_semillero_investigacion, roles_sennova, autorPrincipal }) => {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <Participantes autorPrincipal={autorPrincipal} convocatoria={convocatoria} roles_sennova={roles_sennova} proyecto={proyecto} nuevo_participante={nuevo_participante} />

                {proyecto.codigo_linea_programatica === 66 ||
                proyecto.codigo_linea_programatica === 82 ||
                proyecto.codigo_linea_programatica === 69 ||
                proyecto.codigo_linea_programatica === 70 ||
                proyecto.codigo_linea_programatica === 65 ? (
                    <SemillerosInvestigacion convocatoria={convocatoria} proyecto={proyecto} nuevo_semillero_investigacion={nuevo_semillero_investigacion} />
                ) : null}
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

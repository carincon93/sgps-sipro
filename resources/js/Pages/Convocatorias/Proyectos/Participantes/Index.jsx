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

                {proyecto.tipo_formulario_convocatoria_id == 8 ||
                proyecto.tipo_formulario_convocatoria_id == 6 ||
                proyecto.tipo_formulario_convocatoria_id == 5 ||
                proyecto.tipo_formulario_convocatoria_id == 4 ||
                proyecto.tipo_formulario_convocatoria_id == 1 ? (
                    <SemillerosInvestigacion convocatoria={convocatoria} proyecto={proyecto} nuevo_semillero_investigacion={nuevo_semillero_investigacion} />
                ) : null}
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Index

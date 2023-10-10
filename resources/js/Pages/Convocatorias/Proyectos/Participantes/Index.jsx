import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import StepperMui from '@/Components/Stepper'

import Participantes from './Participantes'
import SemillerosInvestigacion from './SemillerosInvestigacion'

import { Head } from '@inertiajs/react'
import { Grid } from '@mui/material'

const Index = ({ auth, convocatoria, proyecto, evaluacion, nuevo_participante, nuevo_semillero_investigacion, roles_sennova, autor_principal }) => {
    const auth_user = auth.user

    return (
        <AuthenticatedLayout>
            <Head title="Participantes" />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <Participantes
                    auth_user={auth_user}
                    autor_principal={autor_principal}
                    convocatoria={convocatoria}
                    roles_sennova={roles_sennova}
                    proyecto={proyecto}
                    nuevo_participante={nuevo_participante}
                />

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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ArbolProblemasComponent from './ArbolProblemasComponent'
import StepperMui from '@/Components/Stepper'

import { Grid } from '@mui/material'

const ArbolProblemas = ({ auth, convocatoria, proyecto, efectosDirectos, causasDirectas }) => {
    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <ArbolProblemasComponent auth={auth} convocatoria={convocatoria} proyecto={proyecto} efectosDirectos={efectosDirectos} causasDirectas={causasDirectas} />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArbolProblemas

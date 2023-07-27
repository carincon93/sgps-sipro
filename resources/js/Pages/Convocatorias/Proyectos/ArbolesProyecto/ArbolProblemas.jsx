import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ArbolProblemasComponent from './ArbolProblemasComponent'
import StepperMui from '@/Components/Stepper'

import { Grid } from '@mui/material'

const ArbolProblemas = ({ auth, convocatoria, proyecto, evaluacion }) => {
    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <ArbolProblemasComponent auth={auth} convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArbolProblemas

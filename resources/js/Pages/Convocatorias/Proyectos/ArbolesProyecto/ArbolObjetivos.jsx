import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import StepperMui from '@/Components/Stepper'

import ArbolObjetivosComponent from './ArbolObjetivosComponent'

import { Grid } from '@mui/material'

const ArbolObjetivos = ({ auth, convocatoria, proyecto, efectosDirectos, causasDirectas, tiposImpacto, resultados, objetivosEspecificos }) => {
    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <ArbolObjetivosComponent
                    auth={auth}
                    convocatoria={convocatoria}
                    proyecto={proyecto}
                    efectosDirectos={efectosDirectos}
                    causasDirectas={causasDirectas}
                    tiposImpacto={tiposImpacto}
                    resultados={resultados}
                    objetivosEspecificos={objetivosEspecificos}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArbolObjetivos

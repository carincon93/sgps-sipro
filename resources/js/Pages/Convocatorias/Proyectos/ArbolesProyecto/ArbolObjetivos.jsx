import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import StepperMui from '@/Components/Stepper'

import ArbolObjetivosComponent from './ArbolObjetivosComponent'

import { Grid } from '@mui/material'

const ArbolObjetivos = ({ auth, convocatoria, proyecto, efectos_directos, causas_directas, tipos_impacto, resultados, objetivos_especificos }) => {
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
                    efectos_directos={efectos_directos}
                    causas_directas={causas_directas}
                    tipos_impacto={tipos_impacto}
                    resultados={resultados}
                    objetivos_especificos={objetivos_especificos}
                />
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArbolObjetivos

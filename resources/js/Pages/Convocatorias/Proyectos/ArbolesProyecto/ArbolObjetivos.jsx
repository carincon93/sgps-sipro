import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import StepperMui from '@/Components/Stepper'

import ArbolObjetivosComponent from './ArbolObjetivosComponent'

import { Grid } from '@mui/material'
import { useState } from 'react'
import { Head } from '@inertiajs/react'

const ArbolObjetivos = ({ auth, convocatoria, proyecto, evaluacion, efectos_directos, causas_directas, tipos_impacto, resultados, objetivos_especificos }) => {
    const auth_user = auth.user
    const [dialog_status, setDialogStatus] = useState(false)

    return (
        <AuthenticatedLayout>
            <Head title="Objetivos, resultados, impactos y actividades" />

            <Grid item md={12} className="!mb-20">
                <StepperMui auth_user={auth_user} convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import StepperMui from '@/Components/Stepper'

import ArbolObjetivosComponent from './ArbolObjetivosComponent'
import Evaluacion from './Evaluacion'

import { Grid } from '@mui/material'
import { useState } from 'react'
import { Head } from '@inertiajs/react'

const ArbolObjetivos = ({ auth, convocatoria, proyecto, evaluacion, efectos_directos, causas_directas, tipos_impacto, resultados, objetivos_especificos }) => {
    const [dialog_status, setDialogStatus] = useState(false)

    return (
        <AuthenticatedLayout>
            <Head title="Objetivos, resultados, impactos y actividades" />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
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

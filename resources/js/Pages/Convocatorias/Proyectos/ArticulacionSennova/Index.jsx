import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import { useState } from 'react'
import { Grid } from '@mui/material'

import Participantes from '../Participantes/Participantes'
import Evaluacion from './Evaluacion'
import TabsMui from '@/Components/TabsMui'
import AulaMovil from '../AulasMoviles/Index'
import ArticulacionFormulario4Linea70 from './ArticulacionFormulario4Linea70'
import ArticulacionFormulario5Linea69 from './ArticulacionFormulario5Linea69'
import ArtituclacionFormulario10Linea69 from './ArticulacionFormulario10Linea69'
import ArticulacionFormulario17Linea69 from './ArticulacionFormulario17Linea69'
import ArticulacionFormulario11Linea83 from './ArticulacionFormulario11Linea83'

const ArticulacionSennova = ({
    auth,
    convocatoria,
    proyecto,
    evaluacion,
    disciplinas_subarea_conocimiento,
    lineas_investigacion,
    grupos_investigacion,
    semilleros_investigacion,
    redes_conocimiento,
    tematicas_estrategicas,
    actividades_economicas,
    proyectos_idi_tecnoacademia,
    centros_formacion,
    autor_principal,
    tipos_documento,
    tipos_vinculacion,
    roles_sennova,
    nuevo_participante,
    tecnoacademia_relacionada,
    aulas_moviles,
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)

    const tabs =
        proyecto.tipo_formulario_convocatoria_id == 4 && tecnoacademia_relacionada?.modalidad == 2
            ? [{ label: 'Articulación' }, { label: 'Participantes' }, { label: 'Aulas móviles' }]
            : proyecto.tipo_formulario_convocatoria_id == 4 ||
              proyecto.tipo_formulario_convocatoria_id == 5 ||
              proyecto.tipo_formulario_convocatoria_id == 10 ||
              proyecto.tipo_formulario_convocatoria_id == 17 ||
              proyecto.tipo_formulario_convocatoria_id == 11
            ? [{ label: 'Articulación' }, { label: 'Participantes' }]
            : [{ label: 'Participantes' }]

    return (
        <AuthenticatedLayout>
            <Grid container>
                <Grid item md={12} className="!mb-20">
                    <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
                </Grid>

                {/* <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid> */}

                <Grid item md={12}>
                    <TabsMui tabs={tabs}>
                        <div>
                            <h1 className="text-3xl mt-24 mb-8 text-center">Articulación</h1>
                            <AlertMui className="text-center my-10">
                                A continuación, registre la información relacionada con la articulación de la línea de
                                {proyecto.tipo_formulario_convocatoria_id == 4 ? 'TecnoAcademia' : proyecto.tipo_formulario_convocatoria_id == 5 ? 'TecnoParque' : ''} con las otras líneas de SENNOVA
                                en el centro y la regional:
                            </AlertMui>
                            {proyecto.tipo_formulario_convocatoria_id == 4 && (
                                <ArticulacionFormulario4Linea70
                                    actividades_economicas={actividades_economicas}
                                    convocatoria={convocatoria}
                                    disciplinas_subarea_conocimiento={disciplinas_subarea_conocimiento}
                                    grupos_investigacion={grupos_investigacion}
                                    proyecto={proyecto}
                                    lineas_investigacion={lineas_investigacion}
                                    proyectos_idi_tecnoacademia={proyectos_idi_tecnoacademia}
                                    redes_conocimiento={redes_conocimiento}
                                    semilleros_investigacion={semilleros_investigacion}
                                    tematicas_estrategicas={tematicas_estrategicas}
                                />
                            )}

                            {proyecto.tipo_formulario_convocatoria_id == 5 && (
                                <ArticulacionFormulario5Linea69
                                    convocatoria={convocatoria}
                                    grupos_investigacion={grupos_investigacion}
                                    lineas_investigacion={lineas_investigacion}
                                    proyecto={proyecto}
                                    semilleros_investigacion={semilleros_investigacion}
                                />
                            )}

                            {proyecto.tipo_formulario_convocatoria_id == 10 && (
                                <ArtituclacionFormulario10Linea69
                                    convocatoria={convocatoria}
                                    grupos_investigacion={grupos_investigacion}
                                    proyecto={proyecto}
                                    semilleros_investigacion={semilleros_investigacion}
                                />
                            )}

                            {proyecto.tipo_formulario_convocatoria_id == 17 && (
                                <ArticulacionFormulario17Linea69
                                    convocatoria={convocatoria}
                                    grupos_investigacion={grupos_investigacion}
                                    proyecto={proyecto}
                                    semilleros_investigacion={semilleros_investigacion}
                                />
                            )}

                            {proyecto.tipo_formulario_convocatoria_id == 11 && (
                                <ArticulacionFormulario11Linea83 convocatoria={convocatoria} grupos_investigacion={grupos_investigacion} proyecto={proyecto} />
                            )}
                        </div>

                        <div>
                            <Participantes
                                centros_formacion={centros_formacion}
                                autor_principal={autor_principal}
                                convocatoria={convocatoria}
                                proyecto={proyecto}
                                tipos_documento={tipos_documento}
                                tipos_vinculacion={tipos_vinculacion}
                                roles_sennova={roles_sennova}
                                nuevo_participante={nuevo_participante}
                            />
                        </div>

                        {tecnoacademia_relacionada?.modalidad == 2 ? (
                            <div>
                                <AulaMovil auth={auth} convocatoria={convocatoria} proyecto={proyecto} aulas_moviles={aulas_moviles} />
                            </div>
                        ) : null}
                    </TabsMui>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArticulacionSennova

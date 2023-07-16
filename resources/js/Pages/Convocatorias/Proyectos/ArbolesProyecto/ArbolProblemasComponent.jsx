import { useForm } from '@inertiajs/react'
import { route, checkRole, checkPermissionByUser } from '@/Utils'

import AlertMui from '@/Components/Alert'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'
import { Tooltip, Typography } from '@mui/material'

const ArbolProblemasComponent = ({ auth, proyecto, faseEvaluacion }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const formProblemaCentral = useForm({
        identificacion_problema: proyecto.identificacion_problema,
        problema_central: proyecto.problema_central,
        justificacion_problema: proyecto.justificacion_problema,
        pregunta_formulacion_problema: proyecto.pregunta_formulacion_problema,
        objetivo_general: proyecto.objetivo_general,
    })

    const submitProblemaCentral = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formProblemaCentral.post(route('proyectos.problema-central', proyecto.id), {
                preserveScroll: true,
            })
        }
    }

    return (
        <div>
            {(isSuperAdmin) || (proyecto.mostrar_recomendaciones && faseEvaluacion == false) ? (
                <>
                    {proyecto.evaluaciones.map((evaluacion, i) =>
                        isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                            <Tooltip
                                key={i}
                                title={
                                    <div>
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        {evaluacion.idi_evaluacion && <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.problema_central_comentario || 'Sin recomendación'}</p>}
                                        {evaluacion.cultura_innovacion_evaluacion && <p className="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion.arbol_problemas_comentario || 'Sin recomendación'}</p>}
                                        {evaluacion.servicio_tecnologico_evaluacion && <p className="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion.arbol_problemas_comentario || 'Sin recomendación'}</p>}
                                        {evaluacion.ta_evaluacion && <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.arbol_problemas_comentario || 'Sin recomendación'}</p>}
                                        {evaluacion.tp_evaluacion && <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.arbol_problemas_comentario || 'Sin recomendación'}</p>}
                                    </div>
                                }
                            >
                                <Typography className="inline-block">Evaluación {i + 1}</Typography>
                            </Tooltip>
                        ) : null,
                    )}
                    {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                </>
            ) : null}

            <div className="efecto-directo-container">
                <div className="p-2">
                    <div className="text-5xl font-extrabold my-10">
                        <span className="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max">1. Problema central</span>
                    </div>

                    <form onSubmit={submitProblemaCentral} id="problema-central">
                        <fieldset className="space-y-20" disabled={proyecto.allowed.to_update ? undefined : true}>
                            {proyecto.codigo_linea_programatica !== 68 || (proyecto.codigo_linea_programatica === 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica === 70 && checkPermissionByUser(authUser, [24])) ? (
                                <div>
                                    <Label required className="mb-4" labelFor="identificacion_problema" value="Identificación y descripción del problema" />
                                    <AlertMui hiddenIcon={true}>
                                        1. Descripción de la necesidad, problema u oportunidad identificada del plan tecnológico y/o agendas departamentales de innovación y competitividad.
                                        <br />
                                        2. Descripción del problema que se atiende con el proyecto, sustentado en el contexto, la caracterización, los datos, las estadísticas, de la regional, entre otros, citar toda la información consignada utilizando normas APA última edición. La información debe ser de fuentes primarias de información, ejemplo: Secretarías, DANE, Artículos científicos, entre
                                        otros.
                                    </AlertMui>
                                    <Textarea id="identificacion_problema" value={formProblemaCentral.data.identificacion_problema} error={formProblemaCentral.errors.identificacion_problema} onChange={(e) => formProblemaCentral.setData('identificacion_problema', e.target.value)} disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false} required />
                                </div>
                            ) : null}

                            {proyecto.codigo_linea_programatica !== 68 || (proyecto.codigo_linea_programatica === 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica === 70 && checkPermissionByUser(authUser, [24])) ? (
                                <div className="mt-10">
                                    <Label required className="mb-4" labelFor="justificacion_problema" value="Justificación" />
                                    <AlertMui hiddenIcon={true}>Descripción de la solución al problema (descrito anteriormente) que se presenta en la regional, así como las consideraciones que justifican la elección del proyecto. De igual forma, describir la pertinencia y viabilidad del proyecto en el marco del impacto regional identificado en el instrumento de planeación.</AlertMui>

                                    <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false} id="justificacion_problema" error={formProblemaCentral.errors.justificacion_problema} value={formProblemaCentral.data.justificacion_problema} onChange={(e) => formProblemaCentral.setData('justificacion_problema', e.target.value)} required />
                                </div>
                            ) : null}

                            <div className="mt-10">
                                <Label required className="mb-4" labelFor="problema_central" value="Problema central (tronco)" />
                                <AlertMui hiddenIcon={true}>
                                    Para la redacción del problema central se debe tener en cuenta: a) Se debe referir a una situación existente, teniendo en cuenta la mayoría de los siguientes componentes: social, económico, tecnológico, ambiental. b) Su redacción debe ser una oración corta con sujeto, verbo y predicado. c) Se debe comprender con total claridad; el problema se debe formular
                                    mediante una oración clara y sin ambigüedades.
                                </AlertMui>
                                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false} id="problema_central" error={formProblemaCentral.errors.problema_central} value={formProblemaCentral.data.problema_central} onChange={(e) => formProblemaCentral.setData('problema_central', e.target.value)} required />
                            </div>

                            <div className="text-5xl font-extrabold my-10">
                                <span className="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max">2. Objetivo general</span>
                            </div>

                            {proyecto.codigo_linea_programatica === 68 ? (
                                <AlertMui hiddenIcon={true}>
                                    El objetivo general se origina al convertir en positivo el problema principal (tronco) identificado en el árbol de problemas.
                                    <br />
                                    La redacción deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en "ar", "er" o "ir". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos.
                                    <br />
                                    El objetivo general debe expresar el fin concreto del proyecto en correspondencia directa con el título del proyecto y la pregunta de la formulación del problema, el cual debe ser claro, medible, alcanzable y consistente con el proyecto que está formulando. Debe responde al ¿Qué?, ¿Cómo? y el ¿Para qué?
                                </AlertMui>
                            ) : (
                                <AlertMui hiddenIcon={true}>Establece que pretende alcanzar la investigación. Se inicia con un verbo en modo infinitivo, es medible y alcanzable. Responde al Qué, Cómo y el Para qué</AlertMui>
                            )}

                            <div>
                                <Label required className="mb-4" labelFor="objetivo-general" value="Objetivo general" />
                                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica === 70 ? true : false} id="objetivo-general" error={formProblemaCentral.errors.objetivo_general} value={formProblemaCentral.data.objetivo_general} onChange={(e) => formProblemaCentral.setData('objetivo_general', e.target.value)} required />
                            </div>
                        </fieldset>

                        {proyecto.allowed.to_update && (
                            <PrimaryButton disabled={formProblemaCentral.processing} className="my-10" type="submit" form="problema-central">
                                1. Guardar información sobre el problema central
                            </PrimaryButton>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ArbolProblemasComponent

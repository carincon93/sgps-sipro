import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Checkbox from '@/Components/Checkbox'
import StepperMui from '@/Components/Stepper'

import { Divider, Grid } from '@mui/material'

import { Head, router, useForm, usePage } from '@inertiajs/react'
import React from 'react'
import { checkRole } from '@/Utils'
import Textarea from '@/Components/Textarea'
import PrimaryButton from '@/Components/PrimaryButton'

const ResumenFinal = ({
    auth,

    convocatoria,
    proyecto,
    evaluacion,
    validaciones,
    topes_por_nodo,
}) => {
    const auth_user = auth.user
    const { props: page_props } = usePage()

    const any_validation_is_false = Object.values(validaciones).includes(false)

    const evaluacion_id = page_props.ziggy.query.evaluacion_id

    const form_comentario_evaluador = useForm({
        comentario_evaluador: evaluacion[0]?.comentario_evaluador,
    })

    const submitComentarioEvaluador = (e) => {
        e.preventDefault()

        if (evaluacion[0]?.allowed.to_update) {
            form_comentario_evaluador.post(route('convocatorias.evaluaciones.comentario-evaluador', [convocatoria.id, evaluacion_id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Resumen final" />

            <Grid item md={12} className="!mb-20">
                <StepperMui auth_user={auth_user} convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="mt-10">
                {convocatoria.esta_activa || proyecto?.formulacion_fuera_convocatoria || checkRole(auth_user, [1, 5, 17, 18, 19, 20]) ? (
                    <>
                        {checkRole(auth_user, [4]) && (
                            <AlertMui className="mb-10">
                                <h1>¡Hola {auth_user.nombre}!</h1>
                                <p className="mt-4">
                                    <strong>Importante:</strong>
                                    <br />
                                    Este año no debe avalar ningún proyecto. Pero si es recomendable revisar cada uno de los proyectos de su centro, puede hacer modificaciones si así lo considera,
                                    descargar el PDF y finalmente verificar que todos estén con el estado de <strong>finalizados</strong>.
                                </p>
                            </AlertMui>
                        )}

                        {proyecto.tipo_formulario_convocatoria_id == 17 && (
                            <AlertMui severity="warning" className="my-10">
                                Antes de finalizar el proyecto asegúrese que no ha superado los valores máximos de algún tope presupuestal asignado a su nodo. Se recomienda revisar los lineamientos. A
                                continuación, se listan los valores asignados:
                                <br />
                                <ul className="ml-4 mt-2 list-disc">
                                    {topes_por_nodo.map((tope_presupuestal, i) => (
                                        <React.Fragment key={i}>
                                            {tope_presupuestal.segundo_grupo_presupuestal.map((concepto_interno_sena, j) => (
                                                <li key={j}>
                                                    <p className="first-letter:uppercase">{concepto_interno_sena.nombre}</p>
                                                </li>
                                            ))}

                                            <li className="list-none mb-4">
                                                <strong>${new Intl.NumberFormat('de-DE').format(tope_presupuestal.valor)} COP</strong>
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </AlertMui>
                        )}

                        {(proyecto?.formulacion_fuera_convocatoria && any_validation_is_false && evaluacion_id == null) ||
                        ([('1', '3')].includes(convocatoria.fase) && convocatoria.esta_activa && proyecto.finalizado == false && any_validation_is_false && evaluacion_id == null) ? (
                            <AlertMui severity="error">
                                <p>
                                    <strong>La información del proyecto está incompleta. Para poder finalizar el proyecto debe completar / corregir los siguientes ítems:</strong>
                                </p>
                                <ul className="list-decimal p-4">
                                    {!validaciones?.generalidades && <li>Generalidades</li>}
                                    {!validaciones?.problemaCentral && <li>Problema central</li>}
                                    {!validaciones?.efectosDirectos && (
                                        <li>
                                            Efectos directos. (Asegúrese que no hayan casillas en el paso de definición del problema con el mensaje{' '}
                                            <strong>Debe diligenciar este efecto directo'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.efectosIndirectos && (
                                        <li>
                                            Efectos indirectos. (Asegúrese que no hayan casillas en el paso de definición del problema con el mensaje{' '}
                                            <strong>Debe diligenciar este efecto indirecto'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.causasDirectas && (
                                        <li>
                                            Causas directas. (Asegúrese que no hayan casillas en el paso de definición del problema con el mensaje{' '}
                                            <strong>Debe diligenciar esta causa directa'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.causasIndirectas && (
                                        <li>
                                            Causas indirectas. (Asegúrese que no hayan casillas en el paso de definición del problema con el mensaje{' '}
                                            <strong>Debe diligenciar esta causa indirecta'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.objetivoGeneral && <li>Objetivo general</li>}
                                    {!validaciones?.resultados && (
                                        <li>
                                            Resultados. (Asegúrese que no hayan casillas en el paso de objetivos con el mensaje <strong>Debe diligenciar este resultado'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.objetivosEspecificos && (
                                        <li>
                                            Objetivos específicos. (Asegúrese que no hayan casillas en el paso de objetivos con el mensaje <strong>Debe diligenciar este objetivo específico'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.actividades && (
                                        <li>
                                            Actividades. (Asegúrese que no hayan casillas en el paso de objetivos con el mensaje <strong>Debe diligenciar esta actividad'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.impactos && (
                                        <li>
                                            Impactos. (Asegúrese que no hayan casillas en el paso de objetivos con el mensaje <strong>Debe diligenciar este impacto'.</strong>)
                                        </li>
                                    )}
                                    {!validaciones?.metodologia && <li>Metodología (Metodología y actividades)</li>}
                                    {!validaciones?.propuestaSostenibilidad && <li>Propuesta de sostenibilidad (Cadena de valor)</li>}
                                    {proyecto.tipo_formulario_convocatoria_id == 4 && !validaciones?.edt && (
                                        <li>Tiene un rubro presupuestal 'Servicios de organización y asistencia de convenciones y ferias' y le debe asociar al menos un EDT</li>
                                    )}
                                    {!validaciones?.productosActividades && (
                                        <li>
                                            Hay productos sin actividades relacionadas. (Debe revisar cada producto en el paso <strong>Productos</strong> y asegúrese que tengan actividades
                                            relacionadas)
                                        </li>
                                    )}
                                    {!validaciones?.resultadoProducto && (
                                        <li>
                                            Hay resultados sin productos relacionados. Todos los resultados deben generar al menos un producto. (En el paso <strong>Productos</strong> genere mínimo un
                                            producto por resultado)
                                        </li>
                                    )}
                                    {!validaciones?.analisisRiesgo && (
                                        <li>
                                            Faltan análisis de riesgos. (Asegúrese que ha generado análisis de riesgo en los siguientes niveles: A nivel del objetivo general - A nivel de actividades -
                                            A nivel de productos)
                                        </li>
                                    )}
                                    {!validaciones?.anexos && <li>No se han cargado todos los anexos obligatorios</li>}
                                    {!validaciones?.soportesEstudioMercado && <li>Hay estudios de mercado con menos de dos soportes</li>}
                                    {!validaciones?.estudiosMercadoArchivo && <li>Hay rubros presupuestales que no tienen el estudio de mercado cargado</li>}
                                    {!validaciones?.minAprendicesEnSemilleros && (
                                        <li>
                                            En el paso de <strong>participantes</strong> debe relacionar mínimo 2 aprendices con el rol de "Aprendiz en semillero de investigación"
                                        </li>
                                    )}
                                    {!validaciones?.minInstructoresInvestigadores && (
                                        <li>
                                            En el paso de <strong>participantes</strong> debe relacionar mínimo 1 instructor con el rol de "Instructor investigador"
                                        </li>
                                    )}
                                    {!validaciones?.topes_roles_sennova && (
                                        <li>
                                            Ha superado el número máximo, ya sea de cantidad o meses de vinculación, de uno o varios roles que ha asociado al proyecto. Por favor, revise en los
                                            lineamientos los valores máximos.
                                        </li>
                                    )}
                                    {validaciones?.topes_presupuestales_formulario7 != null && <li>{validaciones.topes_presupuestales_formulario7}</li>}
                                </ul>
                            </AlertMui>
                        ) : (checkRole(auth_user, [1])) || (proyecto?.formulacion_fuera_convocatoria && evaluacion_id == null) || ([('1', '3')].includes(convocatoria.fase) && convocatoria.esta_activa && evaluacion_id == null) ? (
                            <AlertMui>
                                <strong className="block mb-8">El proyecto ha sido diligenciado correctamente.</strong>
                                {proyecto?.finalizado
                                    ? 'Si desea seguir modificando el proyecto haga clic en la casilla "Modificar"'
                                    : 'Por favor habilite la casilla para confirmar que ha finalizado el proyecto'}
                                <br />

                                <Checkbox
                                    name="modificar_proyecto"
                                    className="mt-3"
                                    checked={!proyecto.finalizado}
                                    onChange={(e) =>
                                        router.put(
                                            route('convocatorias.proyectos.finalizar', [convocatoria.id, proyecto.id]),
                                            {
                                                modificar: e.target.checked,
                                            },
                                            {
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    label="Modificar proyecto"
                                />
                                <Checkbox
                                    name="finalizar_proyecto"
                                    className="mt-3"
                                    checked={proyecto.finalizado}
                                    onChange={(e) =>
                                        router.put(
                                            route('convocatorias.proyectos.finalizar', [convocatoria.id, proyecto.id]),
                                            {
                                                finalizado: e.target.checked,
                                            },
                                            {
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    label="Finalizar proyecto"
                                />
                            </AlertMui>
                        ) : (
                            <AlertMui>La convocatoria ha finalizado.</AlertMui>
                        )}

                        {evaluacion_id && (
                            <AlertMui>
                                {evaluacion?.finalizado
                                    ? 'Si desea seguir modificando la evaluación haga clic en la casilla "Modificar"'
                                    : 'Por favor habilite la casilla para confirmar que ha finalizado la evaluación'}
                                <br />

                                <Checkbox
                                    name="modificar_evaluacion"
                                    className="mt-3"
                                    checked={!evaluacion[0]?.finalizado}
                                    onChange={(e) =>
                                        router.put(
                                            route('convocatorias.evaluaciones.finalizar', [convocatoria.id, evaluacion_id]),
                                            {
                                                modificar: e.target.checked,
                                            },
                                            {
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    label="Modificar evaluación"
                                />
                                <Checkbox
                                    name="finalizar_evaluacion"
                                    className="mt-3"
                                    checked={evaluacion[0]?.finalizado}
                                    onChange={(e) =>
                                        router.put(
                                            route('convocatorias.evaluaciones.finalizar', [convocatoria.id, evaluacion_id]),
                                            {
                                                finalizado: e.target.checked,
                                            },
                                            {
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                    label="Finalizar evaluación"
                                />

                                <Divider className="text-2xl !my-10">Comentario / Observación / Dudas</Divider>

                                <p>
                                    Si requiere hacer un comentario, tiene una duda u observación sobre la formulación del proyecto y que el/la formulador/a deba responder en la fase de subsanación,
                                    por favor diligencie el siguiente campo:
                                </p>

                                <form onSubmit={submitComentarioEvaluador}>
                                    <Textarea
                                        label="Comentario"
                                        className="!mt-4"
                                        inputBackground="#fff"
                                        id="comentario_evaluador"
                                        onChange={(e) => form_comentario_evaluador.setData('comentario_evaluador', e.target.value)}
                                        value={form_comentario_evaluador.data.comentario_evaluador}
                                        error={form_comentario_evaluador.errors.comentario_evaluador}
                                        disabled={evaluacion[0]?.finalizado}
                                    />

                                    <div className="flex items-center justify-between py-4">
                                        <PrimaryButton type="submit" className="ml-auto" disabled={form_comentario_evaluador.processing || !form_comentario_evaluador.isDirty}>
                                            Guardar
                                        </PrimaryButton>
                                    </div>
                                </form>

                                <h1></h1>
                            </AlertMui>
                        )}
                    </>
                ) : (
                    <AlertMui severity="error">La convocatoria {convocatoria.year} ha finalizado</AlertMui>
                )}
            </Grid>
        </AuthenticatedLayout>
    )
}
export default ResumenFinal

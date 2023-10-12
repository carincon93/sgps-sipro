import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Checkbox from '@/Components/Checkbox'
import CircularProgressMui from '@/Components/CircularProgress'
import StepperMui from '@/Components/Stepper'

import { Grid } from '@mui/material'
import { useEffect, useState, useRef } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import React from 'react'

const ResumenFinal = ({
    convocatoria,
    proyecto,
    evaluacion,
    problemaCentral,
    efectosDirectos,
    causasIndirectas,
    causasDirectas,
    efectosIndirectos,
    objetivoGeneral,
    resultados,
    objetivosEspecificos,
    actividades,
    impactos,
    resultadoProducto,
    analisisRiesgo,
    anexos,
    generalidades,
    metodologia,
    propuestaSostenibilidad,
    productosActividades,
    articulacionSennova,
    soportesEstudioMercado,
    estudiosMercadoArchivo,
    topes_presupuestales_tecnoparque,
    topes_presupuestales_formulario7,
    topes_por_nodo,
    topes_roles_sennova,
    edt,
}) => {
    const ul_ref = useRef(null)

    const { props: page_props } = usePage()
    console.log()

    const [list_item_count, setListItemCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (ul_ref.current) {
            const li_elements = ul_ref.current.querySelectorAll('li')
            setListItemCount(li_elements.length)
        }

        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    return (
        <AuthenticatedLayout>
            <Head title="Resumen final" />

            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="mt-10">
                {convocatoria.activa ? (
                    <>
                        {proyecto.finalizado == false && evaluacion?.finalizado && (
                            <AlertMui severity="error">
                                <p>
                                    <strong>La información del proyecto está incompleta. Para poder finalizar el proyecto debe completar / corregir los siguientes ítems:</strong>
                                </p>
                                <ul className="list-decimal p-4" ref={ul_ref}>
                                    {!generalidades && <li>Generalidades</li>}
                                    {!articulacionSennova && proyecto.tipo_formulario_convocatoria_id == 4 && <li>Articulación SENNOVA</li>}
                                    {!problemaCentral && <li>Problema central</li>}
                                    {!efectosDirectos && (
                                        <li>
                                            Efectos directos (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>'Por favor diligencie este efecto directo'.</strong>
                                        </li>
                                    )}
                                    {!efectosIndirectos && (
                                        <li>
                                            Efectos indirectos (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>'Por favor diligencie este efecto indirecto'.</strong>
                                        </li>
                                    )}
                                    {!causasDirectas && (
                                        <li>
                                            Causas directas (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>'Por favor diligencie esta causa directa'.</strong>
                                        </li>
                                    )}
                                    {!causasIndirectas && (
                                        <li>
                                            Causas indirectas (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>'Por favor diligencie esta causa indirecta'.</strong>
                                        </li>
                                    )}
                                    {!objetivoGeneral && <li>Objetivo general</li>}
                                    {!resultados && (
                                        <li>
                                            Resultados (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>'Por favor diligencie este resultado'.</strong>
                                        </li>
                                    )}
                                    {!objetivosEspecificos && (
                                        <li>
                                            Objetivos específicos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje{' '}
                                            <strong>'Por favor diligencie este objetivo específico'.</strong>
                                        </li>
                                    )}
                                    {!actividades && (
                                        <li>
                                            Actividades (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>'Por favor diligencie esta actividad'.</strong>
                                        </li>
                                    )}
                                    {!impactos && (
                                        <li>
                                            Impactos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>'Por favor diligencie este impacto'.</strong>
                                        </li>
                                    )}
                                    {!metodologia && <li>Metodología (Metodología y actividades)</li>}
                                    {!propuestaSostenibilidad && <li>Propuesta de sostenibilidad (Cadena de valor)</li>}
                                    {proyecto.tipo_formulario_convocatoria_id == 4 && (
                                        <>{!edt && <li>Tiene un rubro presupuestal 'Servicios de organización y asistencia de convenciones y ferias' y le debe asociar al menos un EDT</li>}</>
                                    )}
                                    {!productosActividades && (
                                        <li>
                                            Hay productos sin actividades relacionadas (Debe revisar cada producto en el numeral <strong>Productos</strong> y asegúrese que tengan actividades
                                            relacionadas)
                                        </li>
                                    )}
                                    {!resultadoProducto && (
                                        <li>
                                            Hay resultados sin productos relacionados (Debe revisar cada producto en el numeral <strong>Productos</strong> y asegúrese que tenga algún resultado
                                            asociado)
                                        </li>
                                    )}
                                    {!analisisRiesgo && (
                                        <li>
                                            Faltan análisis de riesgos (Asegúrese que ha generado análisis de riesgo en los siguientes niveles: A nivel del objetivo general - A nivel de actividades -
                                            A nivel de productos)
                                        </li>
                                    )}
                                    {!anexos && <li>No se han cargado todos los anexos obligatorios</li>}
                                    {!soportesEstudioMercado && <li>Hay estudios de mercado con menos de dos soportes</li>}
                                    {!estudiosMercadoArchivo && <li>Hay rubros presupuestales que no tienen el estudio de mercado cargado</li>}
                                    {!topes_roles_sennova && (
                                        <li>
                                            Ha superado el número máximo, ya sea de cantidad o meses de vinculación, de uno o varios roles que ha asociado al proyecto. Por favor, revise en los
                                            lineamientos los valores máximos.
                                        </li>
                                    )}
                                    {topes_presupuestales_formulario7 != null && <li>{topes_presupuestales_formulario7}</li>}
                                    {!topes_presupuestales_tecnoparque && proyecto.tipo_formulario_convocatoria_id == 17 && (
                                        <li>
                                            Ha superado los valores máximos de algún tope presupuestal asignado a su nodo. Se recomienda revisar los lineamientos. A continuación, se listan los valores
                                            asignados:
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
                                        </li>
                                    )}
                                </ul>
                            </AlertMui>
                        )}

                        {page_props.ziggy.query.evaluacion_id == null ? (
                            <>
                                {list_item_count == 0 && proyecto?.allowed?.to_update && (
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
                                            label="Proyecto finalizado"
                                        />
                                    </AlertMui>
                                )}
                            </>
                        ) : (
                            evaluacion && (
                                <AlertMui>
                                    {evaluacion?.finalizado
                                        ? 'Si desea seguir modificando la evaluación haga clic en la casilla "Modificar"'
                                        : 'Por favor habilite la casilla para confirmar que ha finalizado la evaluación'}
                                    <br />
                                    <Checkbox
                                        name="modificar_evaluacion"
                                        className="mt-3"
                                        checked={!evaluacion?.finalizado}
                                        onChange={(e) =>
                                            router.put(
                                                route('convocatorias.evaluaciones.finalizar', [convocatoria.id, evaluacion.id]),
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
                                        checked={evaluacion?.finalizado}
                                        onChange={(e) =>
                                            router.put(
                                                route('convocatorias.evaluaciones.finalizar', [convocatoria.id, evaluacion.id]),
                                                {
                                                    finalizado: e.target.checked,
                                                },
                                                {
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        label="Evaluación finalizada"
                                    />
                                </AlertMui>
                            )
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

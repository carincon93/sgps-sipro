import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import StepperMui from '@/Components/Stepper'

import { Grid } from '@mui/material'
import { useEffect, useState, useRef } from 'react'
import Checkbox from '@/Components/Checkbox'
import { router } from '@inertiajs/react'

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
    edt,
}) => {
    const ul_ref = useRef(null)

    const [list_item_count, setListItemCount] = useState(0)

    useEffect(() => {
        if (ul_ref.current) {
            const li_elements = ul_ref.current.querySelectorAll('li')
            setListItemCount(li_elements.length)
        }
    }, [])
    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12}>
                {proyecto.finalizado == false && (
                    <AlertMui severity="error">
                        <p>
                            <strong>La información del proyecto está incompleta. Para poder finalizar el proyecto debe completar los siguientes ítems:</strong>
                        </p>
                        <ul className="list-disc p-4" ref={ul_ref}>
                            {!generalidades && <li>Generalidades</li>}
                            {!articulacionSennova && proyecto.codigo_linea_programatica == 70 && <li>Articulación SENNOVA</li>}
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
                                    Objetivos específicos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>'Por favor diligencie este objetivo específico'.</strong>
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
                            {proyecto.codigo_linea_programatica == 70 && (
                                <>{!edt && <li>Tiene un rubro presupuestal 'Servicios de organización y asistencia de convenciones y ferias' y le debe asociar al menos un EDT</li>}</>
                            )}
                            {!productosActividades && (
                                <li>
                                    Hay productos sin actividades relacionadas (Debe revisar cada producto en el numeral <strong>Productos</strong> y asegúrese que tengan actividades relacionadas)
                                </li>
                            )}
                            {!resultadoProducto && (
                                <li>
                                    Hay resultados sin productos relacionados (Debe revisar cada producto en el numeral <strong>Productos</strong> y asegúrese que tenga algún resultado asociado)
                                </li>
                            )}
                            {!analisisRiesgo && (
                                <li>
                                    Faltan análisis de riesgos (Asegúrese que ha generado análisis de riesgo en los siguientes niveles: A nivel del objetivo general - A nivel de actividades - A nivel
                                    de productos)
                                </li>
                            )}
                            {!anexos && <li>No se han cargado todos los anexos obligatorios</li>}
                            {!soportesEstudioMercado && <li>Hay estudios de mercado con menos de dos soportes</li>}
                            {!estudiosMercadoArchivo && <li>Hay rubros presupuestales que no tienen el estudio de mercado cargado</li>}
                        </ul>
                    </AlertMui>
                )}
                {list_item_count == 0 && (
                    <>
                        <AlertMui className="mt-10">
                            {proyecto?.finalizado
                                ? 'Si desea seguir modificando el proyecto de clic en la casilla Modificar'
                                : 'Por favor habilite la casilla para confirmar que ha finalizado el proyecto'}
                            <br />
                            <Checkbox
                                name="default_password"
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
                                name="default_password"
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
                    </>
                )}
            </Grid>
        </AuthenticatedLayout>
    )
}
export default ResumenFinal

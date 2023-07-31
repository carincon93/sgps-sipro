import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import StepperMui from '@/Components/Stepper'

import { Grid } from '@mui/material'

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
                        <ul className="list-disc p-4">
                            {!generalidades && <li>Generalidades</li>}
                            {!articulacionSennova && proyecto.codigo_linea_programatica == 70 && <li>Articulación SENNOVA</li>}
                            {!problemaCentral && <li>Problema central</li>}
                            {!efectosDirectos && (
                                <li>
                                    Efectos directos (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!efectosIndirectos && (
                                <li>
                                    Efectos indirectos (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!causasDirectas && (
                                <li>
                                    Causas directas (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!causasIndirectas && (
                                <li>
                                    Causas indirectas (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!objetivoGeneral && (
                                <li>
                                    Objetivo general (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!resultados && (
                                <li>
                                    Resultados (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!objetivosEspecificos && (
                                <li>
                                    Objetivos específicos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!actividades && (
                                <li>
                                    Actividades (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)
                                </li>
                            )}
                            {!impactos && (
                                <li>
                                    Impactos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)
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
                            {!anexos && <li>No se han cargado todos los anexos</li>}
                            {!soportesEstudioMercado && <li>Hay estudios de mercado con menos de dos soportes</li>}
                            {!estudiosMercadoArchivo && <li>Hay rubros presupuestales que no tienen el estudio de mercado cargado</li>}
                        </ul>
                    </AlertMui>
                )}
            </Grid>
        </AuthenticatedLayout>
    )
}
export default ResumenFinal

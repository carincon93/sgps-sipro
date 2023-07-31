import AlertMui from '@/Components/Alert'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    console.log(evaluacion)
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
        objetivos_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.objetivos_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.objetivos_puntaje
            : null,
        objetivos_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.objetivos_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.objetivos_comentario
            : null,
        objetivos_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.objetivos_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.objetivos_comentario == null
                ? true
                : false
            : null,

        resultados_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.resultados_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.resultados_puntaje
            : null,
        resultados_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.resultados_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.resultados_comentario
            : null,
        resultados_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.resultados_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.resultados_comentario == null
                ? true
                : false
            : null,
    })
    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        objetivo_general_puntaje: evaluacion.evaluacion_proyecto_linea68?.objetivo_general_puntaje,
        objetivo_general_comentario: evaluacion.evaluacion_proyecto_linea68?.objetivo_general_comentario ? evaluacion.evaluacion_proyecto_linea68?.objetivo_general_comentario : '',
        objetivo_general_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.objetivo_general_comentario == null ? true : false,

        primer_objetivo_puntaje: evaluacion.evaluacion_proyecto_linea68?.primer_objetivo_puntaje,
        primer_objetivo_comentario: evaluacion.evaluacion_proyecto_linea68?.primer_objetivo_comentario ? evaluacion.evaluacion_proyecto_linea68?.primer_objetivo_comentario : '',
        primer_objetivo_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.primer_objetivo_comentario == null ? true : false,

        segundo_objetivo_puntaje: evaluacion.evaluacion_proyecto_linea68?.segundo_objetivo_puntaje,
        segundo_objetivo_comentario: evaluacion.evaluacion_proyecto_linea68?.segundo_objetivo_comentario ? evaluacion.evaluacion_proyecto_linea68?.segundo_objetivo_comentario : '',
        segundo_objetivo_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.segundo_objetivo_comentario == null ? true : false,

        tercer_objetivo_puntaje: evaluacion.evaluacion_proyecto_linea68?.tercer_objetivo_puntaje,
        tercer_objetivo_comentario: evaluacion.evaluacion_proyecto_linea68?.tercer_objetivo_comentario ? evaluacion.evaluacion_proyecto_linea68?.tercer_objetivo_comentario : '',
        tercer_objetivo_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.tercer_objetivo_comentario == null ? true : false,

        cuarto_objetivo_puntaje: evaluacion.evaluacion_proyecto_linea68?.cuarto_objetivo_puntaje,
        cuarto_objetivo_comentario: evaluacion.evaluacion_proyecto_linea68?.cuarto_objetivo_comentario ? evaluacion.evaluacion_proyecto_linea68?.cuarto_objetivo_comentario : '',
        cuarto_objetivo_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.cuarto_objetivo_comentario == null ? true : false,

        resultados_primer_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.resultados_primer_obj_puntaje,
        resultados_primer_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_primer_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.resultados_primer_obj_comentario : '',
        resultados_primer_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_primer_obj_comentario == null ? true : false,

        resultados_segundo_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.resultados_segundo_obj_puntaje,
        resultados_segundo_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_segundo_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.resultados_segundo_obj_comentario : '',
        resultados_segundo_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_segundo_obj_comentario == null ? true : false,

        resultados_tercer_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.resultados_tercer_obj_puntaje,
        resultados_tercer_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_tercer_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.resultados_tercer_obj_comentario : '',
        resultados_tercer_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_tercer_obj_comentario == null ? true : false,

        resultados_cuarto_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.resultados_cuarto_obj_puntaje,
        resultados_cuarto_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_cuarto_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.resultados_cuarto_obj_comentario : '',
        resultados_cuarto_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.resultados_cuarto_obj_comentario == null ? true : false,
    })
    const submitEvaluacionLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_69 = useForm({
        arbol_objetivos_comentario: evaluacion.evaluacion_proyecto_linea69?.arbol_objetivos_comentario ? evaluacion.evaluacion_proyecto_linea69?.arbol_objetivos_comentario : '',
        arbol_objetivos_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.arbol_objetivos_comentario == null ? true : false,
    })
    const submitEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69.put(route('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    // Árbol de problemas

    const form_evaluacion_arbol_problemas_estrategia_regional = useForm({
        problema_central_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.problema_central_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.problema_central_puntaje
            : null,
        problema_central_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.problema_central_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.problema_central_comentario
            : null,
        problema_central_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66.problema_central_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.problema_central_comentario == null
                ? true
                : false
            : null,
    })

    const submitEvaluacionArbolProblemasEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_arbol_problemas_estrategia_regional.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_arbol_problemas_linea_68 = useForm({
        arbol_problemas_puntaje: evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_puntaje,
        arbol_problemas_comentario: evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_comentario ? evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_comentario == null ? true : false,
    })
    const submitEvaluacionArbolProblemasLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_arbol_problemas_linea_68.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_arbol_problemas_linea_69 = useForm({
        arbol_problemas_comentario: evaluacion.evaluacion_proyecto_linea69?.arbol_problemas_comentario ? evaluacion.evaluacion_proyecto_linea69?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.arbol_problemas_comentario == null ? true : false,
    })
    const submitEvaluacionArbolProblemasLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_arbol_problemas_linea_69.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                <>
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <form onSubmit={submitEvaluacionArbolProblemasEstrategiaRegional}>
                        <AlertMui>
                            <h1>Criterios de evaluacion</h1>
                            <ul className="list-disc p-4">
                                <li>
                                    <strong>Puntaje: 0 a 7</strong> El problema no ha sido identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes
                                    tecnológicos y no se encuentra coherencia con los antecedentes, la justificación y el marco conceptual.
                                </li>
                                <li>
                                    <strong>Puntaje: 8 a 13</strong> El problema se ha identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes
                                    tecnológicos y se encuentra coherencia entre los antecedentes, la justificación y el marco conceptual. Sin embargo, es susceptible de ajustes en términos de
                                    coherencia en la propuesta
                                </li>
                                <li>
                                    <strong>Puntaje: 14 a 15</strong> El problema se ha identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes
                                    tecnológicos y guarda una coherencia global entre los antecedentes, la justificación y el marco conceptual.
                                </li>
                            </ul>

                            <Label className="mt-4 mb-4" labelFor="problema_central_puntaje" value="Puntaje (Máximo 15)" />
                            <TextInput
                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                label="Puntaje"
                                id="problema_central_puntaje"
                                type="number"
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 15,
                                }}
                                value={form_evaluacion_arbol_problemas_estrategia_regional.data.problema_central_puntaje}
                                placeholder="Puntaje"
                                error={form_evaluacion_arbol_problemas_estrategia_regional.errors.problema_central_puntaje}
                            />
                            <div className="mt-4">
                                <p>
                                    ¿Los antecedentes, árbol de problemas, identificación y descripción del problema, justificación y el marco conceptual son correctos? Por favor seleccione si Cumple
                                    o No cumple.
                                </p>
                                <SwitchMui
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    checked={form_evaluacion_arbol_problemas_estrategia_regional.data.problema_central_requiere_comentario}
                                />
                                {form_evaluacion_arbol_problemas_estrategia_regional.data.problema_central_requiere_comentario == false && (
                                    <Textarea
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        label="Comentario"
                                        className="mt-4"
                                        id="problema_central_comentario"
                                        value={form_evaluacion_arbol_problemas_estrategia_regional.data.problema_central_comentario}
                                        error={form_evaluacion_arbol_problemas_estrategia_regional.errors.problema_central_comentario}
                                        required
                                    />
                                )}
                            </div>
                        </AlertMui>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                <PrimaryButton disabled={form_evaluacion_arbol_problemas_estrategia_regional.data.processing} className="ml-auto" type="submit">
                                    Guardar
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </form>
                </>
            ) : proyecto.codigo_linea_programatica == 68 ? (
                <>
                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionArbolProblemasLinea68}>
                            <AlertMui>
                                <h1>Criterios de evaluacion</h1>
                                <p>
                                    El árbol de objetivos se obtiene al transformar en positivo el árbol de problema manteniendo la misma estructura y niveles de jerarquía. Es una versión de lo que se
                                    esperará que suceda bajo las siguientes consideraciones:
                                </p>
                                <ul className="list-disc p-4">
                                    <li>El problema principal del árbol de problemas se convertirá en el objetivo general.</li>
                                    <li>Las causas directas serán los objetivos específicos.</li>
                                    <li>Las causas indirectas serán las actividades.</li>
                                    <li>Los efectos directos se convertirán en resultados.</li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="arbol_problemas_puntaje" value="Puntaje (Máximo 5)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="arbol_problemas_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 5,
                                    }}
                                    value={form_evaluacion_arbol_problemas_linea_68.data.arbol_problemas_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_arbol_problemas_linea_68.errors.arbol_problemas_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El árbol de problemas es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_arbol_problemas_linea_68.data.arbol_problemas_requiere_comentario}
                                    />
                                    {form_evaluacion_arbol_problemas_linea_68.data.arbol_problemas_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="arbol_problemas_comentario"
                                            value={form_evaluacion_arbol_problemas_linea_68.data.arbol_problemas_comentario}
                                            error={form_evaluacion_arbol_problemas_linea_68.errors.arbol_problemas_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_arbol_problemas_linea_68.data.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                proyecto.codigo_linea_programatica == 69 && (
                    <>
                        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                            Evaluación
                        </h1>
                        <div className="mt-16">
                            <form onSubmit={submitEvaluacionArbolProblemasLinea69}>
                                <AlertMui>
                                    <div className="mt-4">
                                        <p>¿El árbol de problemas es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                        <SwitchMui
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            checked={form_evaluacion_arbol_problemas_linea_69.data.arbol_problemas_requiere_comentario}
                                        />
                                        {form_evaluacion_arbol_problemas_linea_69.data.arbol_problemas_requiere_comentario == false && (
                                            <Textarea
                                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                                label="Comentario"
                                                className="mt-4"
                                                id="arbol_problemas_comentario"
                                                value={form_evaluacion_arbol_problemas_linea_69.data.arbol_problemas_comentario}
                                                error={form_evaluacion_arbol_problemas_linea_69.errors.arbol_problemas_comentario}
                                                required
                                            />
                                        )}
                                    </div>
                                </AlertMui>
                                <div className="flex items-center justify-between mt-14 px-8 py-4">
                                    {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                        <PrimaryButton disabled={form_evaluacion_arbol_problemas_linea_69.data.processing} className="ml-auto" type="submit">
                                            Guardar
                                        </PrimaryButton>
                                    ) : (
                                        <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    </>
                )
            )}

            {proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionEstrategiaRegional}>
                            <AlertMui>
                                <h1 className="text-2xl text-center mb-10">Resultados</h1>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a 4</strong> No son claros los beneficios y ventajas de los resultados en el marco del proyecto, no se generan por el desarrollo de las
                                        actividades y tampoco evidencian la materialización de la solución propuesta para resolver el problema del proyecto.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 5 a 7</strong> Los resultados se generan por el desarrollo de las actividades y se identifican sus ventajas y beneficios para dar solución al
                                        problema identificado. Son susceptibles de mejora para evidenciar de forma clara la materialización de la solución propuesta.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 8 a 9</strong> Los resultados se generan por el desarrollo de las actividades, sus beneficios y ventajas sobresalen en pro de dar una solución
                                        contundente al problema identificado y evidencian de forma clara la materialización de la solución propuesta.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="resultados_puntaje" value="Puntaje (Máximo 9)" />
                                <TextInput
                                    disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                    label="Puntaje"
                                    id="resultados_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 9,
                                    }}
                                    value={form_evaluacion_estrategia_regional.data.resultados_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_estrategia_regional.errors.resultados_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿Los resultados son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.resultados_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.resultados_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="resultados_comentario"
                                            value={form_evaluacion_estrategia_regional.data.resultados_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.resultados_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10" />
                                <h1 className="text-2xl text-center mb-10">Árbol de objetivos / Objetivo general / Objetivos específicos</h1>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a 7</strong> El objetivo general y los objetivos específicos (solución identificada) no dan respuesta al problema, tampo estan relacionados
                                        entre ellos, y los objetivos específicos no presentan una secuencia lógica para alcanzar el objetivo general.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 8 a 13</strong> El objetivo general y los objetivos específicos (solución identificada) dan respuesta parcial al problema; hay relación entre
                                        ellos y los objetivos específicos están formulados como una secuencia lógica para alcanzar el objetivo general, pero susceptibles de ajustes y mejoras.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 14 a 15</strong> El objetivo general y los objetivos específicos (solución identificada) dan respuesta integral al problema; hay relación entre
                                        ellos y los objetivos específicos están formulados como una secuencia lógica para alcanzar el objetivo general.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="objetivos_puntaje" value="Puntaje (Máximo 15)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="objetivos_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 15,
                                    }}
                                    value={form_evaluacion_estrategia_regional.data.objetivos_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_estrategia_regional.errors.objetivos_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El árbol de objetivos, objetivo general o los objetivos específicos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.objetivos_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.objetivos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="objetivos_comentario"
                                            value={form_evaluacion_estrategia_regional.data.objetivos_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.objetivos_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_estrategia_regional.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : proyecto.codigo_linea_programatica == 68 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea68}>
                            <AlertMui>
                                <h1 className="text-2xl text-center mb-10">Objetivo general</h1>

                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a 2</strong> El objetivo general se origina al convertir en positivo el problema principal (tronco) identificado en el árbol de problemas. La
                                        redacción deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en ""ar"", ""er"" o ""ir"". La estructura del objetivo debe
                                        contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o
                                        descriptivos. El objetivo general debe expresar el fin concreto del proyecto en correspondencia directa con el título del proyecto y la pregunta de la
                                        formulación del problema, el cual debe ser claro, medible, alcanzable y consistente con el proyecto que está formulando. Debe responde al ¿Qué?, ¿Cómo? y el
                                        ¿Para qué? Nota: A continuación, se describen algunos errores comunes al momento de estructurar el objetivo general: - Incluir en el objetivo general del
                                        proyecto las alternativas de solución (por ejemplo: mediante, por intermedio de, a través de, entre otros). - Incluir en el objetivo general los fines o efectos
                                        del proyecto (por ejemplo: “… para mejorar la calidad de vida”)
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="objetivo_general_puntaje" value="Puntaje (Máximo 2)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="objetivo_general_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 2,
                                    }}
                                    value={form_evaluacion_linea_68.data.objetivo_general_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.objetivo_general_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El objetivo general es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.objetivo_general_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.objetivo_general_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="objetivo_general_comentario"
                                            value={form_evaluacion_linea_68.data.objetivo_general_comentario}
                                            error={form_evaluacion_linea_68.errors.objetivo_general_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="text-2xl text-center mb-10">Objetivos específicos</h1>

                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a {proyecto.cantidad_objetivos > 0 ? (8 / proyecto.cantidad_objetivos).toFixed(2) : 0}</strong> Los objetivos específicos son los medios
                                        cuantificables que llevarán al cumplimiento del objetivo general. Estos surgen de pasar a positivo las causas directas identificadas en el árbol de problemas.
                                        La redacción de los objetivos específicos deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en ""ar"", ""er"" o ""ir"". La
                                        estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3)
                                        elementos adicionales de contexto o descriptivos. Nota: A continuación, se describen algunos errores comunes al momento de estructurar los objetivos
                                        específicos: - Describir los objetivos específicos del proyecto de forma demasiado amplia, es decir, los objetivos específicos parecen objetivos generales. -
                                        Confundir los objetivos específicos con las actividades del proyecto. Es decir, utilizar verbos que hacen referencia a aspectos demasiado operativos para
                                        describir los objetivos específicos de la iniciativa, por ejemplo: contratar, instalar, entre otros.
                                    </li>
                                </ul>
                                {proyecto.cantidad_objetivos == 0 && (
                                    <AlertMui className="mt-10" alertMsg={true}>
                                        Este proyecto no tiene objetivos específicos generados. No se puede evaluar
                                    </AlertMui>
                                )}

                                {[...Array(proyecto.cantidad_objetivos)].map((_, j) => (
                                    <>
                                        {j == 0 ? (
                                            <>
                                                <h1 className="text-black">Primer objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="primer_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="primer_objetivo_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (8 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.primer_objetivo_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.primer_objetivo_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿El primer objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.primer_objetivo_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.primer_objetivo_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="primer_objetivo_comentario"
                                                            value={form_evaluacion_linea_68.data.primer_objetivo_comentario}
                                                            error={form_evaluacion_linea_68.errors.primer_objetivo_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 1 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Segundo objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="segundo_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />

                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="segundo_objetivo_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (8 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.segundo_objetivo_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.segundo_objetivo_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿El segundo objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.segundo_objetivo_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.segundo_objetivo_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="segundo_objetivo_comentario"
                                                            value={form_evaluacion_linea_68.data.segundo_objetivo_comentario}
                                                            error={form_evaluacion_linea_68.errors.segundo_objetivo_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 2 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Tercer objetivo específico</h1>
                                                <Label className="mt-4 mb-4" labelFor="tercer_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />

                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="tercer_objetivo_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (8 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.tercer_objetivo_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿El tercer objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.tercer_objetivo_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.tercer_objetivo_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="tercer_objetivo_comentario"
                                                            value={form_evaluacion_linea_68.data.tercer_objetivo_comentario}
                                                            error={form_evaluacion_linea_68.errors.tercer_objetivo_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 3 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Cuardo objetivo específico</h1>
                                                <Label className="mt-4 mb-4" labelFor="cuarto_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />

                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="cuarto_objetivo_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (8 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.cuarto_objetivo_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.cuarto_objetivo_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿El cuarto objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.cuarto_objetivo_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.cuarto_objetivo_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="cuarto_objetivo_comentario"
                                                            value={form_evaluacion_linea_68.data.cuarto_objetivo_comentario}
                                                            error={form_evaluacion_linea_68.errors.cuarto_objetivo_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : null}
                                    </>
                                ))}

                                <hr className="mt-10 mb-10 border-app-300" />
                                <h1 className="text-2xl text-center mb-10">Resultados</h1>

                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a {proyecto.cantidad_objetivos > 0 ? (10 / proyecto.cantidad_objetivos).toFixed(2) : 0}</strong> Se debe evidenciar que los resultados son
                                        directos, medibles y cuantificables que se alcanzarán con el desarrollo de cada uno de los objetivos específicos del proyecto.
                                        <br />
                                        Nota: Los resultados son, en contraste, intangibles, tales como conocimientos y habilidades nuevas, compromisos adquiridos, etc.
                                    </li>
                                </ul>
                                {proyecto.cantidad_objetivos == 0 && (
                                    <AlertMui className="mt-10" alertMsg={true}>
                                        Este proyecto no tiene objetivos específicos generados. No se puede evaluar
                                    </AlertMui>
                                )}

                                {[...Array(proyecto.cantidad_objetivos)].map((_, j) => (
                                    <>
                                        {j == 0 ? (
                                            <>
                                                <h1 className="text-black">Resultados del primer objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="resultados_primer_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="resultados_primer_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (10 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.resultados_primer_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.resultados_primer_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Los resultados del primer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.resultados_primer_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.resultados_primer_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="resultados_primer_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.resultados_primer_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.resultados_primer_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 1 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Resultados del segundo objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="resultados_segundo_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="resultados_segundo_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (10 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.resultados_segundo_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.resultados_segundo_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Los resultados del segundo objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.resultados_segundo_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.resultados_segundo_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="resultados_segundo_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.resultados_segundo_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.resultados_segundo_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : j == 2 ? (
                                            <>
                                                <hr className="mt-10 mb-10 border-app-300" />

                                                <h1 className="text-black">Resultados del tercer objetivo específico</h1>

                                                <Label className="mt-4 mb-4" labelFor="resultados_tercer_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                <TextInput
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    label="Puntaje"
                                                    id="resultados_tercer_obj_puntaje"
                                                    type="number"
                                                    inputProps={{
                                                        step: 0.1,
                                                        min: 0,
                                                        max: (10 / proyecto.cantidad_objetivos).toFixed(2),
                                                    }}
                                                    value={form_evaluacion_linea_68.data.resultados_tercer_obj_puntaje}
                                                    placeholder="Puntaje"
                                                    error={form_evaluacion_linea_68.errors.resultados_tercer_obj_puntaje}
                                                />

                                                <div className="mt-4">
                                                    <p>¿Los resultados del tercer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                    <SwitchMui
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        checked={form_evaluacion_linea_68.data.resultados_tercer_obj_requiere_comentario}
                                                    />
                                                    {form_evaluacion_linea_68.data.resultados_tercer_obj_requiere_comentario == false && (
                                                        <Textarea
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            label="Comentario"
                                                            className="mt-4"
                                                            id="resultados_tercer_obj_comentario"
                                                            value={form_evaluacion_linea_68.data.resultados_tercer_obj_comentario}
                                                            error={form_evaluacion_linea_68.errors.resultados_tercer_obj_comentario}
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            j == 3 && (
                                                <>
                                                    <hr className="mt-10 mb-10 border-app-300" />

                                                    <h1 className="text-black">Resultados del cuarto objetivo específico</h1>

                                                    <Label className="mt-4 mb-4" labelFor="resultados_cuarto_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                                    <TextInput
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        label="Puntaje"
                                                        id="resultados_cuarto_obj_puntaje"
                                                        type="number"
                                                        inputProps={{
                                                            step: 0.1,
                                                            min: 0,
                                                            max: (10 / proyecto.cantidad_objetivos).toFixed(2),
                                                        }}
                                                        value={form_evaluacion_linea_68.data.resultados_cuarto_obj_puntaje}
                                                        placeholder="Puntaje"
                                                        error={form_evaluacion_linea_68.errors.resultados_cuarto_obj_puntaje}
                                                    />

                                                    <div className="mt-4">
                                                        <p>¿Los resultados del cuarto objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                        <SwitchMui
                                                            disabled={
                                                                is_super_admin
                                                                    ? false
                                                                    : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                    ? true
                                                                    : false
                                                            }
                                                            checked={form_evaluacion_linea_68.data.resultados_cuarto_obj_requiere_comentario}
                                                        />
                                                        {(form_evaluacion_linea_68.data.resultados_cuarto_obj_requiere_comentario == false) &
                                                            6(
                                                                <Textarea
                                                                    disabled={
                                                                        is_super_admin
                                                                            ? undefined
                                                                            : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false
                                                                            ? true
                                                                            : undefined
                                                                    }
                                                                    label="Comentario"
                                                                    className="mt-4"
                                                                    id="resultados_cuarto_obj_comentario"
                                                                    value={form_evaluacion_linea_68.data.resultados_cuarto_obj_comentario}
                                                                    error={form_evaluacion_linea_68.errors.resultados_cuarto_obj_comentario}
                                                                    required
                                                                />,
                                                            )}
                                                    </div>
                                                </>
                                            )
                                        )}
                                    </>
                                ))}
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_68.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : proyecto.codigo_linea_programatica == 69 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>
                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea69}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿El árbol de objetivos es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        checked={form_evaluacion_linea_69.data.arbol_objetivos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_69.data.arbol_objetivos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={
                                                is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined
                                            }
                                            label="Comentario"
                                            className="mt-4"
                                            id="arbol_objetivos_comentario"
                                            value={form_evaluacion_linea_69.data.arbol_objetivos_comentario}
                                            error={form_evaluacion_linea_69.errors.arbol_objetivos_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_69.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                ) : (
                                    <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            ) : null}
        </>
    )
}

export default Evaluacion

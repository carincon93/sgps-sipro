const { default: AlertMui } = require('@/Components/Alert')
const { default: PrimaryButton } = require('@/Components/PrimaryButton')
const { default: TextInput } = require('@/Components/TextInput')
const { checkRole } = require('@/Utils')
const { useForm } = require('@inertiajs/react')

const EvaluacionArbolProblemas = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
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

    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        arbol_problemas_puntaje: evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_puntaje,
        arbol_problemas_comentario: evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_comentario ? evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.arbol_problemas_comentario == null ? true : false,
    })
    const submitEvaluacionLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_69 = useForm({
        arbol_problemas_comentario: evaluacion.evaluacion_proyecto_linea69?.arbol_problemas_comentario ? evaluacion.evaluacion_proyecto_linea69?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.arbol_problemas_comentario == null ? true : false,
    })
    const submitEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
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

                    <form onSubmit={submitEvaluacionEstrategiaRegional}>
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
                                value={form_evaluacion_estrategia_regional.data.problema_central_puntaje}
                                placeholder="Puntaje"
                                error={errors.problema_central_puntaje}
                            />
                            <div className="mt-4">
                                <p>
                                    ¿Los antecedentes, árbol de problemas, identificación y descripción del problema, justificación y el marco conceptual son correctos? Por favor seleccione si Cumple
                                    o No cumple.
                                </p>
                                <SwitchMui
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    checked={form_evaluacion_estrategia_regional.data.problema_central_requiere_comentario}
                                />
                                {form_evaluacion_estrategia_regional.data.problema_central_requiere_comentario == false && (
                                    <Textarea
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        label="Comentario"
                                        className="mt-4"
                                        id="problema_central_comentario"
                                        value={form_evaluacion_estrategia_regional.data.problema_central_comentario}
                                        error={form_evaluacion_estrategia_regional.errors.problema_central_comentario}
                                        required
                                    />
                                )}
                            </div>
                        </AlertMui>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                <PrimaryButton disabled={form_evaluacion_estrategia_regional.data.processing} className="ml-auto" type="submit">
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
                        <form onSubmit={submitEvaluacionLinea68}>
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
                                    value={form_evaluacion_linea_68.data.arbol_problemas_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.arbol_problemas_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿El árbol de problemas es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.arbol_problemas_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.arbol_problemas_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="arbol_problemas_comentario"
                                            value={form_evaluacion_linea_68.data.arbol_problemas_comentario}
                                            error={form_evaluacion_linea_68.errors.arbol_problemas_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_68.data.processing} className="ml-auto" type="submit">
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
                            <form onSubmit={submitEvaluacionLinea69}>
                                <AlertMui>
                                    <div className="mt-4">
                                        <p>¿El árbol de problemas es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                        <SwitchMui
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            checked={form_evaluacion_linea_69.data.arbol_problemas_requiere_comentario}
                                        />
                                        {form_evaluacion_linea_69.data.arbol_problemas_requiere_comentario == false && (
                                            <Textarea
                                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                                label="Comentario"
                                                className="mt-4"
                                                id="arbol_problemas_comentario"
                                                value={form_evaluacion_linea_69.data.arbol_problemas_comentario}
                                                error={form_evaluacion_linea_69.errors.arbol_problemas_comentario}
                                                required
                                            />
                                        )}
                                    </div>
                                </AlertMui>
                                <div className="flex items-center justify-between mt-14 px-8 py-4">
                                    {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                        <PrimaryButton disabled={form_evaluacion_linea_69.data.processing} className="ml-auto" type="submit">
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
        </>
    )
}

export default EvaluacionArbolProblemas

import AlertMui from '@/Components/Alert'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'

import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_estrategia_regional = useForm({
        analisis_riesgos_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.analisis_riesgos_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.analisis_riesgos_puntaje
            : null,
        analisis_riesgos_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.analisis_riesgos_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.analisis_riesgos_comentario
            : null,
        analisis_riesgos_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.analisis_riesgos_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.analisis_riesgos_comentario == null
                ? true
                : false
            : null,
    })
    const submitEstrategiaRegionalEvaluacion = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_70 = useForm({
        analisis_riesgos_comentario: evaluacion.evaluacion_proyecto_linea70?.analisis_riesgos_comentario ? evaluacion.evaluacion_proyecto_linea70?.analisis_riesgos_comentario : '',
        analisis_riesgos_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.analisis_riesgos_comentario == null ? true : false,
    })
    const submitEvaluacionLinea70 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_70.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_69 = useForm({
        analisis_riesgos_comentario: evaluacion.evaluacion_proyecto_linea69?.analisis_riesgos_comentario ? evaluacion.evaluacion_proyecto_linea69?.analisis_riesgos_comentario : '',
        analisis_riesgos_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.analisis_riesgos_comentario == null ? true : false,
    })
    const submitEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        riesgos_objetivo_general_puntaje: evaluacion.evaluacion_proyecto_linea68?.riesgos_objetivo_general_puntaje,
        riesgos_objetivo_general_comentario: evaluacion.evaluacion_proyecto_linea68?.riesgos_objetivo_general_comentario
            ? evaluacion.evaluacion_proyecto_linea68?.riesgos_objetivo_general_comentario
            : '',
        riesgos_objetivo_general_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.riesgos_objetivo_general_comentario == null ? true : false,

        riesgos_productos_puntaje: evaluacion.evaluacion_proyecto_linea68?.riesgos_productos_puntaje,
        riesgos_productos_comentario: evaluacion.evaluacion_proyecto_linea68?.riesgos_productos_comentario ? evaluacion.evaluacion_proyecto_linea68?.riesgos_productos_comentario : '',
        riesgos_productos_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.riesgos_productos_comentario == null ? true : false,

        riesgos_actividades_puntaje: evaluacion.evaluacion_proyecto_linea68?.riesgos_actividades_puntaje,
        riesgos_actividades_comentario: evaluacion.evaluacion_proyecto_linea68?.riesgos_actividades_comentario ? evaluacion.evaluacion_proyecto_linea68?.riesgos_actividades_comentario : '',
        riesgos_actividades_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.riesgos_actividades_comentario == null ? true : false,
    })
    const submitServicioTecnologicoEvaluacion = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
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

                    <div className="mt-16">
                        <form onSubmit={submitEstrategiaRegionalEvaluacion}>
                            <AlertMui>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0,0 a 2,0</strong> Los riesgos descritos en los tres niveles de análisis no son coherentes con las situaciones que se presentarán en el
                                        desarrollo del proyecto y las medidas de mitigación son insuficientes para darles solución.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 2,1 a 3,9</strong> Los riesgos descritos en los tres niveles de análisis son coherentes con las situaciones que se presentarán en el desarrollo
                                        del proyecto y las medidas de mitigación son susceptibles de mejora para dar un tratamiento más acertado a los riesgos.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 4,0 a 5,0</strong> Los riesgos descritos en los tres niveles de análisis son coherentes con las situaciones que se presentarán en el desarrollo
                                        del proyecto y las medidas de mitigación son suficientes para dar tratamiento a los riesgos.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="analisis_riesgos_puntaje" value="Puntaje (Máximo 5)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="analisis_riesgos_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 0.1,
                                        min: 0,
                                        max: 5,
                                    }}
                                    value={form_evaluacion_estrategia_regional.data.analisis_riesgos_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_estrategia_regional.errors.analisis_riesgos_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿Los análisis de riesgos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.data.analisis_riesgos_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.analisis_riesgos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="analisis_riesgos_comentario"
                                            value={form_evaluacion_estrategia_regional.data.analisis_riesgos_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.analisis_riesgos_comentario}
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
                        <form onSubmit={submitServicioTecnologicoEvaluacion}>
                            <AlertMui>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica claramente el tipo de riesgo (mercados, operacionales, legales, administrativos)
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Describe adecuamente el riesgo identificado para el Objetivo general
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica la probabilidad de ocurrencia del riesgo
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica el impacto generado por el riesgo
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica los posibles efectos que puede causar el riegos
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Se debe evidenciar las medidas de mitigación del riesgo
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica claramente el tipo de riesgo (mercados, operacionales, legales, administrativos)
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Describe adecuamente el riesgo identificado para el Objetivo general
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica la probabilidad de ocurrencia del riesgo
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica el impacto generado por el riesgo
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Identifica los posibles efectos que puede causar el riegos
                                    </li>
                                    <li>
                                        <strong>Puntaje: 0,0 a 0,2</strong> Se debe evidenciar las medidas de mitigación del riesgo
                                    </li>
                                    <li>
                                        <strong>Puntaje máximo por nivel de análisis de riesgos</strong> 2,4
                                    </li>
                                </ul>

                                <hr className="mt-10 mb-10 border-app-300" />

                                <h1 className="font-black">Análisis de riesgos a nivel de objetivo general</h1>

                                <Label className="mt-4 mb-4" labelFor="riesgos_objetivo_general_puntaje" value="Puntaje (Máximo 2,4)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="riesgos_objetivo_general_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 0.1,
                                        min: 0,
                                        max: 2.4,
                                    }}
                                    value={form_evaluacion_linea_68.data.riesgos_objetivo_general_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.riesgos_objetivo_general_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿Los análisis de riesgos a nivel de objetivo general son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.riesgos_objetivo_general_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.riesgos_objetivo_general_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="riesgos_objetivo_general_comentario"
                                            value={form_evaluacion_linea_68.data.riesgos_objetivo_general_comentario}
                                            error={form_evaluacion_linea_68.errors.riesgos_objetivo_general_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />

                                <h1 className="font-black">Análisis de riesgos a nivel de productos</h1>

                                <Label className="mt-4 mb-4" labelFor="riesgos_productos_puntaje" value="Puntaje (Máximo 2,4)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="riesgos_productos_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 0.1,
                                        min: 0,
                                        max: 2.4,
                                    }}
                                    value={form_evaluacion_linea_68.data.riesgos_productos_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.riesgos_productos_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿Los análisis de riesgos a nivel de productos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.riesgos_productos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.riesgos_productos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="riesgos_productos_comentario"
                                            value={form_evaluacion_linea_68.data.riesgos_productos_comentario}
                                            error={form_evaluacion_linea_68.errors.riesgos_productos_comentario}
                                            required
                                        />
                                    )}
                                </div>

                                <hr className="mt-10 mb-10 border-app-300" />

                                <h1 className="font-black">Análisis de riesgos a nivel de actividades</h1>

                                <Label className="mt-4 mb-4" labelFor="riesgos_actividades_puntaje" value="Puntaje (Máximo 2,4)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="riesgos_actividades_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 0.1,
                                        min: 0,
                                        max: 2.4,
                                    }}
                                    value={form_evaluacion_linea_68.data.riesgos_actividades_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_linea_68.errors.riesgos_actividades_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿Los análisis de riesgos a nivel de actividades son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_68.data.riesgos_actividades_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_68.data.riesgos_actividades_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="riesgos_actividades_comentario"
                                            value={form_evaluacion_linea_68.data.riesgos_actividades_comentario}
                                            error={form_evaluacion_linea_68.errors.riesgos_actividades_comentario}
                                            required
                                        />
                                    )}
                                </div>
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
            ) : proyecto.codigo_linea_programatica == 70 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionLinea70}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Los análisis de riesgos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.analisis_riesgos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.analisis_riesgos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            class="mt-4"
                                            id="analisis_riesgos_comentario"
                                            bind:value={form_evaluacion_linea_70.data.analisis_riesgos_comentario}
                                            error={form_evaluacion_linea_70.errors.analisis_riesgos_comentario}
                                            required
                                        />
                                    )}
                                </div>
                            </AlertMui>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                                    <PrimaryButton disabled={form_evaluacion_linea_70.processing} className="ml-auto" type="submit">
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
                                    <p>¿Los análisis de riesgos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_69.data.analisis_riesgos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_69.data.analisis_riesgos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            class="mt-4"
                                            id="analisis_riesgos_comentario"
                                            bind:value={form_evaluacion_linea_69.data.analisis_riesgos_comentario}
                                            error={form_evaluacion_linea_69.errors.analisis_riesgos_comentario}
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

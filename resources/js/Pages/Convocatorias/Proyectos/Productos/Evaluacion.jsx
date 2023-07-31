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
        productos_puntaje: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.productos_puntaje
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.productos_puntaje
            : null,
        productos_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.productos_comentario
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.productos_comentario
            : null,
        productos_requiere_comentario: evaluacion.evaluacion_proyecto_linea66
            ? evaluacion.evaluacion_proyecto_linea66?.productos_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea65
            ? evaluacion.evaluacion_proyecto_linea65.productos_comentario == null
                ? true
                : false
            : null,
    })
    const submitEvaluacionEstrategiaRegional = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_estrategia_regional.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_70 = useForm({
        productos_comentario: evaluacion.evaluacion_proyecto_linea70?.productos_comentario ? evaluacion.evaluacion_proyecto_linea70?.productos_comentario : '',
        productos_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.productos_comentario == null ? true : false,
    })
    const submitTaEvaluacion = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_70.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_69 = useForm({
        productos_comentario: evaluacion.evaluacion_proyecto_linea69?.productos_comentario ? evaluacion.evaluacion_proyecto_linea69?.productos_comentario : '',
        productos_requiere_comentario: evaluacion.evaluacion_proyecto_linea69?.productos_comentario == null ? true : false,
    })
    const submitEvaluacionLinea69 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    const form_evaluacion_linea_68 = useForm({
        productos_primer_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.productos_primer_obj_puntaje,
        productos_primer_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_primer_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.productos_primer_obj_comentario : '',
        productos_primer_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_primer_obj_comentario == null ? true : false,

        productos_segundo_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.productos_segundo_obj_puntaje,
        productos_segundo_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_segundo_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.productos_segundo_obj_comentario : '',
        productos_segundo_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_segundo_obj_comentario == null ? true : false,

        productos_tercer_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.productos_tercer_obj_puntaje,
        productos_tercer_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_tercer_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.productos_tercer_obj_comentario : '',
        productos_tercer_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_tercer_obj_comentario == null ? true : false,

        productos_cuarto_obj_puntaje: evaluacion.evaluacion_proyecto_linea68?.productos_cuarto_obj_puntaje,
        productos_cuarto_obj_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_cuarto_obj_comentario ? evaluacion.evaluacion_proyecto_linea68?.productos_cuarto_obj_comentario : '',
        productos_cuarto_obj_requiere_comentario: evaluacion.evaluacion_proyecto_linea68?.productos_cuarto_obj_comentario == null ? true : false,
    })
    const submitEvaluacionLinea68 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_68.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            {proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 ? (
                <>
                    <hr className="mt-10 mb-10" />

                    <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                        Evaluación
                    </h1>

                    <div className="mt-16">
                        <form onSubmit={submitEvaluacionEstrategiaRegional}>
                            <AlertMui>
                                <h1>Criterios de evaluacion</h1>
                                <ul className="list-disc p-4">
                                    <li>
                                        <strong>Puntaje: 0 a 4</strong> Los productos esperados no son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación
                                        con el cronograma de actividades) y la formulación de los indicadores dificulta su medición.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 5 a 7</strong> La mayoría de productos esperados son pertinentes para atender la problemática identificada en un corto o mediano plazo
                                        (correlación con el cronograma de actividades) y son susceptibles de mejora en cuanto a su alcance, así como lo es la formulación de los indicadores para
                                        realizar mediciones precisas en el tiempo.
                                    </li>
                                    <li>
                                        <strong>Puntaje: 8 a 9</strong> Todos los productos esperados son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación
                                        con el cronograma de actividades) y la formulación de los indicadores permitirá realizar mediciones precisas en el tiempo.
                                    </li>
                                </ul>

                                <Label className="mt-4 mb-4" labelFor="productos_puntaje" value="Puntaje (Máximo 9)" />
                                <TextInput
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Puntaje"
                                    id="productos_puntaje"
                                    type="number"
                                    inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 9,
                                    }}
                                    value={form_evaluacion_estrategia_regional.data.productos_puntaje}
                                    placeholder="Puntaje"
                                    error={form_evaluacion_estrategia_regional.errors.productos_puntaje}
                                />

                                <div className="mt-4">
                                    <p>¿Los productos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_estrategia_regional.data.productos_requiere_comentario}
                                    />
                                    {form_evaluacion_estrategia_regional.data.productos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="productos_comentario"
                                            value={form_evaluacion_estrategia_regional.data.productos_comentario}
                                            error={form_evaluacion_estrategia_regional.errors.productos_comentario}
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
                            {[...Array(proyecto.cantidad_objetivos)].map((_, j) => (
                                <>
                                    {j == 0 ? (
                                        <>
                                            <h1 className="text-black">Productos del primer objetivo específico</h1>

                                            <Label className="mt-4 mb-4" labelFor="productos_primer_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                            <TextInput
                                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                                label="Puntaje"
                                                id="productos_primer_obj_puntaje"
                                                type="number"
                                                inputProps={{
                                                    step: 0.1,
                                                    min: 0,
                                                    max: (20.8 / proyecto.cantidad_objetivos).toFixed(2),
                                                }}
                                                value={form_evaluacion_linea_68.data.productos_primer_obj_puntaje}
                                                placeholder="Puntaje"
                                                error={form_evaluacion_linea_68.errors.productos_primer_obj_puntaje}
                                            />

                                            <div className="mt-4">
                                                <p>¿Los productos del primer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                <SwitchMui
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    checked={form_evaluacion_linea_68.data.productos_primer_obj_requiere_comentario}
                                                />
                                                {form_evaluacion_linea_68.data.productos_primer_obj_requiere_comentario == false && (
                                                    <Textarea
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        label="Comentario"
                                                        className="mt-4"
                                                        id="productos_primer_obj_comentario"
                                                        value={form_evaluacion_linea_68.data.productos_primer_obj_comentario}
                                                        error={form_evaluacion_linea_68.errors.productos_primer_obj_comentario}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ) : j == 1 ? (
                                        <>
                                            <hr className="mt-10 mb-10 border-app-300" />

                                            <h1 className="text-black">Productos del segundo objetivo específico</h1>

                                            <Label className="mt-4 mb-4" labelFor="productos_segundo_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                            <TextInput
                                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                                label="Puntaje"
                                                id="productos_segundo_obj_puntaje"
                                                type="number"
                                                inputProps={{
                                                    step: 0.1,
                                                    min: 0,
                                                    max: (20.8 / proyecto.cantidad_objetivos).toFixed(2),
                                                }}
                                                value={form_evaluacion_linea_68.data.productos_segundo_obj_puntaje}
                                                placeholder="Puntaje"
                                                error={form_evaluacion_linea_68.errors.productos_segundo_obj_puntaje}
                                            />

                                            <div className="mt-4">
                                                <p>¿Los productos del segundo objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                <SwitchMui
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    checked={form_evaluacion_linea_68.data.productos_segundo_obj_requiere_comentario}
                                                />
                                                {form_evaluacion_linea_68.data.productos_segundo_obj_requiere_comentario == false && (
                                                    <Textarea
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        label="Comentario"
                                                        className="mt-4"
                                                        id="productos_segundo_obj_comentario"
                                                        value={form_evaluacion_linea_68.data.productos_segundo_obj_comentario}
                                                        error={form_evaluacion_linea_68.errors.productos_segundo_obj_comentario}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ) : j == 2 ? (
                                        <>
                                            <hr className="mt-10 mb-10 border-app-300" />

                                            <h1 className="text-black">Productos del tercer objetivo específico</h1>

                                            <Label className="mt-4 mb-4" labelFor="productos_tercer_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                            <TextInput
                                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                                label="Puntaje"
                                                id="productos_tercer_obj_puntaje"
                                                type="number"
                                                inputProps={{
                                                    step: 0.1,
                                                    min: 0,
                                                    max: (20.8 / proyecto.cantidad_objetivos).toFixed(2),
                                                }}
                                                value={form_evaluacion_linea_68.data.productos_tercer_obj_puntaje}
                                                placeholder="Puntaje"
                                                error={form_evaluacion_linea_68.errors.productos_tercer_obj_puntaje}
                                            />

                                            <div className="mt-4">
                                                <p>¿Los productos del tercer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                <SwitchMui
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    checked={form_evaluacion_linea_68.data.productos_tercer_obj_requiere_comentario}
                                                />
                                                {form_evaluacion_linea_68.data.productos_tercer_obj_requiere_comentario == false && (
                                                    <Textarea
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        label="Comentario"
                                                        className="mt-4"
                                                        id="productos_tercer_obj_comentario"
                                                        value={form_evaluacion_linea_68.data.productos_tercer_obj_comentario}
                                                        error={form_evaluacion_linea_68.errors.productos_tercer_obj_comentario}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ) : j == 3 ? (
                                        <>
                                            <hr className="mt-10 mb-10 border-app-300" />

                                            <h1 className="text-black">Productos del cuarto objetivo específico</h1>

                                            <Label className="mt-4 mb-4" labelFor="productos_cuarto_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                                            <TextInput
                                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                                label="Puntaje"
                                                id="productos_cuarto_obj_puntaje"
                                                type="number"
                                                inputProps={{
                                                    step: 0.1,
                                                    min: 0,
                                                    max: (20.8 / proyecto.cantidad_objetivos).toFixed(2),
                                                }}
                                                value={form_evaluacion_linea_68.data.productos_cuarto_obj_puntaje}
                                                placeholder="Puntaje"
                                                error={form_evaluacion_linea_68.errors.productos_cuarto_obj_puntaje}
                                            />

                                            <div className="mt-4">
                                                <p>¿Los productos del cuarto objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                                <SwitchMui
                                                    disabled={
                                                        is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                    }
                                                    checked={form_evaluacion_linea_68.data.productos_cuarto_obj_requiere_comentario}
                                                />
                                                {form_evaluacion_linea_68.data.productos_cuarto_obj_requiere_comentario == false && (
                                                    <Textarea
                                                        disabled={
                                                            is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false
                                                        }
                                                        label="Comentario"
                                                        className="mt-4"
                                                        id="productos_cuarto_obj_comentario"
                                                        value={form_evaluacion_linea_68.data.productos_cuarto_obj_comentario}
                                                        error={form_evaluacion_linea_68.errors.productos_cuarto_obj_comentario}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ) : null}
                                </>
                            ))}

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
                        <form onSubmit={submitTaEvaluacion}>
                            <AlertMui>
                                <div className="mt-4">
                                    <p>¿Los productos y las metas están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_70.data.productos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_70.data.productos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="productos_comentario"
                                            value={form_evaluacion_linea_70.data.productos_comentario}
                                            error={form_evaluacion_linea_70.errors.productos_comentario}
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
                                    <p>¿Los productos y las metas están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                                    <SwitchMui
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        checked={form_evaluacion_linea_69.data.productos_requiere_comentario}
                                    />
                                    {form_evaluacion_linea_69.data.productos_requiere_comentario == false && (
                                        <Textarea
                                            disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                            label="Comentario"
                                            className="mt-4"
                                            id="productos_comentario"
                                            value={form_evaluacion_linea_69.data.productos_comentario}
                                            error={form_evaluacion_linea_69.errors.productos_comentario}
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

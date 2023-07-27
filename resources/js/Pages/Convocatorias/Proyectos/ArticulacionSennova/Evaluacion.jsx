import AlertMui from '@/Components/Alert'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form_evaluacion_linea_69_70 = useForm({
        articulacion_sennova_comentario: evaluacion.evaluacion_proyecto_linea70
            ? evaluacion.evaluacion_proyecto_linea70.articulacion_sennova_comentario
                ? evaluacion.evaluacion_proyecto_linea70.articulacion_sennova_comentario
                : ''
            : evaluacion.evaluacion_proyecto_linea69
            ? evaluacion.evaluacion_proyecto_linea69.articulacion_sennova_comentario
                ? evaluacion.evaluacion_proyecto_linea69.articulacion_sennova_comentario
                : ''
            : '',
        articulacion_sennova_requiere_comentario: evaluacion.evaluacion_proyecto_linea70
            ? evaluacion.evaluacion_proyecto_linea70.articulacion_sennova_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea69
            ? evaluacion.evaluacion_proyecto_linea69.articulacion_sennova_comentario == null
                ? true
                : false
            : null,
        impacto_centro_formacion_comentario: evaluacion.evaluacion_proyecto_linea70
            ? evaluacion.evaluacion_proyecto_linea70.impacto_centro_formacion_comentario
                ? evaluacion.evaluacion_proyecto_linea70.impacto_centro_formacion_comentario
                : ''
            : evaluacion.evaluacion_proyecto_linea69
            ? evaluacion.evaluacion_proyecto_linea69.impacto_centro_formacion_comentario
                ? evaluacion.evaluacion_proyecto_linea69.impacto_centro_formacion_comentario
                : ''
            : '',
        impacto_centro_formacion_requiere_comentario: evaluacion.evaluacion_proyecto_linea70
            ? evaluacion.evaluacion_proyecto_linea70.impacto_centro_formacion_comentario == null
                ? true
                : false
            : evaluacion.evaluacion_proyecto_linea69
            ? evaluacion.evaluacion_proyecto_linea69.impacto_centro_formacion_comentario == null
                ? true
                : false
            : null,

        lineas_medulares_centro_comentario: evaluacion.evaluacion_proyecto_linea70.lineas_medulares_centro_comentario ? evaluacion.evaluacion_proyecto_linea70.lineas_medulares_centro_comentario : '',
        lineas_medulares_centro_requiere_comentario: evaluacion.evaluacion_proyecto_linea70 ? (evaluacion.evaluacion_proyecto_linea70.lineas_medulares_centro_comentario == null ? true : false) : null,
    })
    const submitEvaluacionLinea6970 = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form_evaluacion_linea_69_70.put(route('convocatorias.evaluaciones.articulacion-sennova.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            <div className="mt-16">
                <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                    Evaluación
                </h1>
                <form onSubmit={submitEvaluacionLinea6970}>
                    <div className="mt-16">
                        <AlertMui>
                            <div className="mt-4">
                                <p>¿La articulación SENNOVA está definida correctamente? Por favor seleccione si Cumple o No cumple.</p>
                                <SwitchMui
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    checked={form_evaluacion_linea_69_70.data.articulacion_sennova_requiere_comentario}
                                />
                                {form_evaluacion_linea_69_70.articulacion_sennova_requiere_comentario == false && (
                                    <Textarea
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        label="Comentario"
                                        className="mt-4"
                                        id="articulacion_sennova_comentario"
                                        value={form_evaluacion_linea_69_70.data.articulacion_sennova_comentario}
                                        error={form_evaluacion_linea_69_70.errors.articulacion_sennova_comentario}
                                        required
                                    />
                                )}
                            </div>
                        </AlertMui>
                    </div>
                    <AlertMui>
                        <div className="mt-4">
                            <p>¿El impacto en el centro de formación es correcto? Por favor seleccione si Cumple o No cumple</p>
                            <SwitchMui
                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                checked={form_evaluacion_linea_69_70.data.impacto_centro_formacion_requiere_comentario}
                            />
                            {form_evaluacion_linea_69_70.data.impacto_centro_formacion_requiere_comentario == false && (
                                <Textarea
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Comentario"
                                    className="mt-4"
                                    id="impacto_centro_formacion_comentario"
                                    value={form_evaluacion_linea_69_70.data.impacto_centro_formacion_comentario}
                                    error={form_evaluacion_linea_69_70.errors.impacto_centro_formacion_comentario}
                                    required
                                />
                            )}
                        </div>
                    </AlertMui>
                    {proyecto.codigo_linea_programatica == 70 && (
                        <AlertMui>
                            <div className="mt-4">
                                <p>¿La información sobre las líneas medulares es correcta? Por favor seleccione si Cumple o No cumple.</p>
                                <SwitchMui
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    checked={form_evaluacion_linea_69_70.data.lineas_medulares_centro_requiere_comentario}
                                />
                                {form_evaluacion_linea_69_70.data.lineas_medulares_centro_requiere_comentario == false && (
                                    <Textarea
                                        disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                        label="Comentario"
                                        className="mt-4"
                                        id="lineas_medulares_centro_comentario"
                                        value={form_evaluacion_linea_69_70.data.lineas_medulares_centro_comentario}
                                        error={form_evaluacion_linea_69_70.errors.lineas_medulares_centro_comentario}
                                        required
                                    />
                                )}
                            </div>
                        </AlertMui>
                    )}
                    <div className="flex items-center justify-between mt-14 px-8 py-4">
                        {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                            <PrimaryButton disabled={form_evaluacion_linea_69_70.processing} className="ml-auto" type="submit">
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
}

export default Evaluacion

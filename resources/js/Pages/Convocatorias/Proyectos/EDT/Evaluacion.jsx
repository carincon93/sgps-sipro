import AlertMui from '@/Components/Alert'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { checkRole } from '@/Utils'
import { useForm } from '@inertiajs/react'

const Evaluacion = ({ auth_user, proyecto, evaluacion }) => {
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        edt_comentario: evaluacion.evaluacion_proyecto_linea70.edt_comentario ? evaluacion.evaluacion_proyecto_linea70.edt_comentario : '',
        edt_requiere_comentario: evaluacion.evaluacion_proyecto_linea70.edt_comentario == null ? true : false,
    })
    const submitEvaluacion = (e) => {
        e.preventDefault()
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            form.put(route('convocatorias.evaluaciones.edt.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <>
            <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">
                Evaluación
            </h1>

            <div className="mt-16">
                <form onSubmit={submitEvaluacion}>
                    <AlertMui>
                        <div className="mt-4">
                            <p>¿Las EDT son correctas? Por favor seleccione si Cumple o No cumple.</p>
                            <SwitchMui
                                disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                bind:checked={form.data.edt_requiere_comentario}
                            />
                            {form.data.edt_requiere_comentario == false && (
                                <Textarea
                                    disabled={is_super_admin ? false : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : false}
                                    label="Comentario"
                                    className="!mt-4"
                                    id="edt_comentario"
                                    bind:value={form.data.edt_comentario}
                                    error={form.errors.edt_comentario}
                                    required
                                />
                            )}
                        </div>
                    </AlertMui>
                    <div className="flex items-center justify-between mt-14 px-8 py-4">
                        {is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true) ? (
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
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

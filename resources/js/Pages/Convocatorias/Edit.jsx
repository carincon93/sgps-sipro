import { useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'
import SelectMultiple from '@/Components/SelectMultiple'

import { Paper } from '@mui/material'

const Edit = ({ auth, errors, convocatoria, lineasProgramaticas, lineasProgramaticasActivasRelacionadas, fases }) => {
    // Validar si el usuario autenticado es SuperAdmin
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const submitFase = (e) => {
        e.preventDefault()

        postFase(route('convocatorias.update-fase', convocatoria.id))
    }

    const {
        data: dataFase,
        setData: setDataFase,
        post: postFase,
        processing: processingFase,
        errors: errorsFase,
        reset: resetFase,
    } = useForm({
        fase: fases.find((item) => item.value == convocatoria.fase),
        fecha_finalizacion_fase: convocatoria.fecha_finalizacion_fase,
        hora_finalizacion_fase: convocatoria.hora_finalizacion_fase,
    })

    const {
        data: dataConvocatoria,
        setData: setDataConvocatoria,
        put: putConvocatoria,
        processing: processingConvocatoria,
        errors: errorsConvocatoria,
        reset: resetConvocatoria,
    } = useForm({
        descripcion: convocatoria.descripcion,
        esta_activa: convocatoria.esta_activa,
        visible: convocatoria.visible,
        mostrar_recomendaciones: convocatoria.mostrar_recomendaciones,
        lineas_programaticas_activas: lineasProgramaticasActivasRelacionadas.length > 0 ? lineasProgramaticasActivasRelacionadas : null,
    })

    const submitInfo = (e) => {
        e.preventDefault()

        if (isSuperAdmin) {
            putConvocatoria(route('convocatorias.update', convocatoria.id), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <div className="grid grid-cols-3">
                <div>
                    <h1 className="font-black text-2xl">Fase</h1>
                </div>
                {convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3 ? (
                    <Paper elevation={0} sx={{ padding: 2 }} className="col-span-2 drop-shadow-lg">
                        <form onSubmit={submitFase}>
                            <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
                                <div className="grid grid-cols-2 space-y-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="fase" value="Fase" />
                                    </div>
                                    <div>
                                        <Autocomplete id="fase" options={fases} value={dataFase.fase} onChange={(e) => setDataFase('fase', e.target.value)} error={errors.fase} autoComplete={false} placeholder="Seleccione una fase" required />
                                    </div>

                                    {dataFase.fase?.label && (
                                        <>
                                            <div>
                                                <Label required labelFor="fecha_finalizacion_fase" value={`Fecha de finalización de la fase: ${dataFase.fase.label.toLowerCase()}`} />
                                            </div>
                                            <div>
                                                <DatePicker variant="outlined" id="fecha_finalizacion_fase" className="w-full" value={dataFase.fecha_finalizacion_fase} onChange={(e) => setDataFase('fecha_finalizacion_fase', e.target.value)} required />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label required labelFor="hora_finalizacion_fase" value="Hora límite" />
                                    </div>
                                    <div>
                                        <input id="hora_finalizacion_fase" type="time" step="1" className="p-2 border rounded border-gray-300" value={dataFase.hora_finalizacion_fase} onChange={(e) => setDataFase('hora_finalizacion_fase', e.target.value)} required />
                                    </div>
                                </div>

                                <AlertMui className="mt-10" hiddenIcon={true}>
                                    {dataFase.fase?.value === 1 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {dataFase.fase.label.toLowerCase()} permitirá a los formuladores crear, modificar y eliminar proyectos.</p>
                                        </>
                                    )}
                                    {dataFase.fase?.value === 2 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {dataFase.fase.label.toLowerCase()} bloqueará a los formuladores las acciones de crear, modificar y eliminar proyectos.</p>
                                        </>
                                    )}
                                    {dataFase.fase?.value === 3 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {dataFase.fase.label.toLowerCase()} permitirá a los formuladores modificar aquellos proyectos que pueden ser subsanados y a los evaluadores se le bloqueará la acción de modificar las evaluaciones.</p>
                                        </>
                                    )}
                                    {dataFase.fase?.value === 4 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {dataFase.fase.label.toLowerCase()} bloqueará a los formuladores la acción de modificar aquellos proyectos que pasaron a etapa de subsanación y a los evaluadores se le habilitarán aquellas evaluaciones de proyectos subsanados.</p>
                                        </>
                                    )}
                                    {dataFase.fase?.value === 5 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {dataFase.fase.label.toLowerCase()} bloqueará a los formuladores la modificación de proyectos y a los evaluadores la modificación de las evaluaciones.</p>
                                        </>
                                    )}
                                </AlertMui>
                            </fieldset>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {isSuperAdmin && (
                                    <PrimaryButton className="ml-auto" type="submit" disabled={processingFase}>
                                        Guardar información sobre la fase
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </Paper>
                ) : null}
            </div>

            <div className="grid grid-cols-3 mt-10">
                <div>
                    <h1 className="font-black text-2xl">Información de la convocatoria</h1>
                </div>
                <Paper elevation={0} sx={{ padding: 2 }} className="col-span-2 drop-shadow-lg">
                    <form onSubmit={submitInfo}>
                        <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
                            <div className="mt-8">
                                <Textarea label="Descripción" id="descripcion" error={errors.descripcion} value={dataConvocatoria.descripcion} onChange={(e) => setDataConvocatoria('descripcion', e.target.value)} required />
                            </div>

                            <div className="mt-10 mb-20">
                                <Label required labelFor="esta_activa" value="¿Desea activar esta convocatoria? (Si la opción está habilitada permite a los usuarios formular proyectos. Tenga en cuenta que solo puede activar una convocatoria por tipo --Proyectos de convocatoria - Proyectos de ejecicio DEMO)" className="inline-block mb-4" />
                                <br />
                                <SwitchMui checked={dataConvocatoria.esta_activa} onChange={(e) => setDataConvocatoria('esta_activa', e.target.checked)} />
                            </div>

                            <div>
                                <div className="mt-10 mb-20">
                                    <Label required labelFor="lineas_programaticas_activas" className="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                                    <SelectMultiple
                                        id="lineas_programaticas_activas"
                                        bdValues={dataConvocatoria.lineas_programaticas_activas}
                                        options={lineasProgramaticas}
                                        error={errors.lineas_programaticas_activas}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            setDataConvocatoria((prevData) => ({
                                                ...prevData,
                                                lineas_programaticas_activas: selectedValues,
                                            }))
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-10 mb-20">
                                <Label required labelFor="visible" value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)" className="inline-block mb-4" />
                                <br />
                                <SwitchMui checked={dataConvocatoria.visible} onChange={(e) => setDataConvocatoria('visible', e.target.checked)} onMessage="Visible" offMessage="Oculta" />
                            </div>

                            {(convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3) && (
                                <div className="mt-4 mb-20">
                                    <Label required labelFor="mostrar_recomendaciones" value="¿Desea que el formulador visualice las recomendaciones hechas por los evaluadores?" className="inline-block mb-4" />
                                    <br />
                                    <SwitchMui checked={dataConvocatoria.mostrar_recomendaciones} onChange={(e) => setDataConvocatoria('mostrar_recomendaciones', e.target.checked)} />
                                </div>
                            )}
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {isSuperAdmin && (
                                <PrimaryButton className="ml-auto" type="submit" disabled={processingConvocatoria}>
                                    Guardar información sobre la convocatoria
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </Paper>
            </div>
        </AuthenticatedLayout>
    )
}

export default Edit

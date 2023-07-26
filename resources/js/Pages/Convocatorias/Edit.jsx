import { useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { Grid, Paper } from '@mui/material'

const Edit = ({ auth, errors, convocatoria, lineasProgramaticas, fases }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const submitFase = (e) => {
        e.preventDefault()

        postFase(route('convocatorias.update-fase', convocatoria.id))
    }

    const formFase = useForm({
        fase: fases.find((item) => item.value == convocatoria.fase),
        fecha_finalizacion_fase: convocatoria.fecha_finalizacion_fase,
        hora_finalizacion_fase: convocatoria.hora_finalizacion_fase,
    })

    const formConvocatoria = useForm({
        descripcion: convocatoria.descripcion,
        esta_activa: convocatoria.esta_activa,
        visible: convocatoria.visible,
        mostrar_recomendaciones: convocatoria.mostrar_recomendaciones,
        lineas_programaticas_activas: JSON.parse(convocatoria.lineas_programaticas_activas) ?? null,
    })

    const submitInfo = (e) => {
        e.preventDefault()

        if (is_super_admin) {
            putConvocatoria(route('convocatorias.update', convocatoria.id), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <Grid item md={4}>
                <h1 className="font-black text-2xl">Fase</h1>
            </Grid>

            <Grid item md={8} className="drop-shadow-lg">
                {convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3 ? (
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <form onSubmit={submitFase}>
                            <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
                                <div className="grid grid-cols-2 space-y-2">
                                    <div>
                                        <Label required className="mb-4" labelFor="fase" value="Fase" />
                                    </div>
                                    <div>
                                        <Autocomplete
                                            id="fase"
                                            options={fases}
                                            value={formFase.data.fase}
                                            onChange={(event, newValue) => formFase.setData('fase', newValue.value)}
                                            error={errors.fase}
                                            autoComplete={false}
                                            placeholder="Seleccione una fase"
                                            required
                                        />
                                    </div>

                                    {formFase.data.fase?.label && (
                                        <>
                                            <div>
                                                <Label required labelFor="fecha_finalizacion_fase" value={`Fecha de finalización de la fase: ${formFase.data.fase.label.toLowerCase()}`} />
                                            </div>
                                            <div>
                                                <DatePicker
                                                    variant="outlined"
                                                    id="fecha_finalizacion_fase"
                                                    className="w-full"
                                                    value={formFase.data.fecha_finalizacion_fase}
                                                    onChange={(e) => formFase.setData('fecha_finalizacion_fase', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label required labelFor="hora_finalizacion_fase" value="Hora límite" />
                                    </div>
                                    <div>
                                        <input
                                            id="hora_finalizacion_fase"
                                            type="time"
                                            step="1"
                                            className="p-2 border rounded border-gray-300"
                                            value={formFase.data.hora_finalizacion_fase}
                                            onChange={(e) => formFase.setData('hora_finalizacion_fase', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <AlertMui className="mt-10">
                                    {formFase.data.fase?.value === 1 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {formFase.data.fase.label.toLowerCase()} permitirá a los formuladores crear, modificar y eliminar proyectos.</p>
                                        </>
                                    )}
                                    {formFase.data.fase?.value === 2 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {formFase.data.fase.label.toLowerCase()} bloqueará a los formuladores las acciones de crear, modificar y eliminar proyectos.</p>
                                        </>
                                    )}
                                    {formFase.data.fase?.value === 3 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>
                                                La fase de {formFase.data.fase.label.toLowerCase()} permitirá a los formuladores modificar aquellos proyectos que pueden ser subsanados y a los
                                                evaluadores se le bloqueará la acción de modificar las evaluaciones.
                                            </p>
                                        </>
                                    )}
                                    {formFase.data.fase?.value === 4 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>
                                                La fase de {formFase.data.fase.label.toLowerCase()} bloqueará a los formuladores la acción de modificar aquellos proyectos que pasaron a etapa de
                                                subsanación y a los evaluadores se le habilitarán aquellas evaluaciones de proyectos subsanados.
                                            </p>
                                        </>
                                    )}
                                    {formFase.data.fase?.value === 5 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>
                                                La fase de {formFase.data.fase.label.toLowerCase()} bloqueará a los formuladores la modificación de proyectos y a los evaluadores la modificación de las
                                                evaluaciones.
                                            </p>
                                        </>
                                    )}
                                </AlertMui>
                            </fieldset>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin && (
                                    <PrimaryButton className="ml-auto" type="submit" disabled={formFase.processing}>
                                        Guardar información sobre la fase
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </Paper>
                ) : null}
            </Grid>

            <Grid item md={4}>
                <h1 className="font-black text-2xl">Información de la convocatoria</h1>
            </Grid>

            <Grid item md={8} className="drop-shadow-lg">
                <Paper elevation={0} sx={{ padding: 2 }}>
                    <form onSubmit={submitInfo}>
                        <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
                            <div className="mt-8">
                                <Textarea
                                    label="Descripción"
                                    id="descripcion"
                                    error={errors.descripcion}
                                    value={formConvocatoria.data.descripcion}
                                    onChange={(e) => formConvocatoria.setData('descripcion', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-10 mb-20">
                                <Label
                                    required
                                    labelFor="esta_activa"
                                    value="¿Desea activar esta convocatoria? (Si la opción está habilitada permite a los usuarios formular proyectos. Tenga en cuenta que solo puede activar una convocatoria por tipo --Proyectos de convocatoria - Proyectos de ejecicio DEMO)"
                                    className="inline-block mb-4"
                                />
                                <br />
                                <SwitchMui checked={formConvocatoria.data.esta_activa} onChange={(e) => formConvocatoria.setData('esta_activa', e.target.checked)} />
                            </div>

                            <div>
                                <div className="mt-10 mb-20">
                                    <Label required labelFor="lineas_programaticas_activas" className="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                                    <SelectMultiple
                                        id="lineas_programaticas_activas"
                                        bdValues={formConvocatoria.data.lineas_programaticas_activas}
                                        options={lineasProgramaticas}
                                        error={errors.lineas_programaticas_activas}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            formConvocatoria.setData((prevData) => ({
                                                ...prevData,
                                                lineas_programaticas_activas: selectedValues,
                                            }))
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-10 mb-20">
                                <Label
                                    required
                                    labelFor="visible"
                                    value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)"
                                    className="inline-block mb-4"
                                />
                                <br />
                                <SwitchMui checked={formConvocatoria.data.visible} onChange={(e) => formConvocatoria.setData('visible', e.target.checked)} onMessage="Visible" offMessage="Oculta" />
                            </div>

                            {(convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3) && (
                                <div className="mt-4 mb-20">
                                    <Label
                                        required
                                        labelFor="mostrar_recomendaciones"
                                        value="¿Desea que el formulador visualice las recomendaciones hechas por los evaluadores?"
                                        className="inline-block mb-4"
                                    />
                                    <br />
                                    <SwitchMui checked={formConvocatoria.data.mostrar_recomendaciones} onChange={(e) => formConvocatoria.setData('mostrar_recomendaciones', e.target.checked)} />
                                </div>
                            )}
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {is_super_admin && (
                                <PrimaryButton className="ml-auto" type="submit" disabled={formConvocatoria.processing}>
                                    Guardar información sobre la convocatoria
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </Paper>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit

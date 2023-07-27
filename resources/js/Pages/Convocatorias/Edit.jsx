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

import { useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'

const Edit = ({ auth, errors, convocatoria, lineas_programaticas, fases }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const submitFase = (e) => {
        e.preventDefault()

        postFase(route('convocatorias.update-fase', convocatoria.id))
    }

    const form_fase = useForm({
        fase: fases.find((item) => item.value == convocatoria.fase),
        fecha_finalizacion_fase: convocatoria.fecha_finalizacion_fase,
        hora_finalizacion_fase: convocatoria.hora_finalizacion_fase,
    })

    const form_convocatoria = useForm({
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
                                            value={form_fase.data.fase}
                                            onChange={(event, newValue) => form_fase.setData('fase', newValue.value)}
                                            error={errors.fase}
                                            autoComplete={false}
                                            placeholder="Seleccione una fase"
                                            required
                                        />
                                    </div>

                                    {form_fase.data.fase?.label && (
                                        <>
                                            <div>
                                                <Label required labelFor="fecha_finalizacion_fase" value={`Fecha de finalización de la fase: ${form_fase.data.fase.label.toLowerCase()}`} />
                                            </div>
                                            <div>
                                                <DatePicker
                                                    variant="outlined"
                                                    id="fecha_finalizacion_fase"
                                                    className="w-full"
                                                    value={form_fase.data.fecha_finalizacion_fase}
                                                    onChange={(e) => form_fase.setData('fecha_finalizacion_fase', e.target.value)}
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
                                            value={form_fase.data.hora_finalizacion_fase}
                                            onChange={(e) => form_fase.setData('hora_finalizacion_fase', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <AlertMui className="mt-10">
                                    {form_fase.data.fase?.value === 1 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {form_fase.data.fase.label.toLowerCase()} permitirá a los formuladores crear, modificar y eliminar proyectos.</p>
                                        </>
                                    )}
                                    {form_fase.data.fase?.value === 2 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>La fase de {form_fase.data.fase.label.toLowerCase()} bloqueará a los formuladores las acciones de crear, modificar y eliminar proyectos.</p>
                                        </>
                                    )}
                                    {form_fase.data.fase?.value === 3 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>
                                                La fase de {form_fase.data.fase.label.toLowerCase()} permitirá a los formuladores modificar aquellos proyectos que pueden ser subsanados y a los
                                                evaluadores se le bloqueará la acción de modificar las evaluaciones.
                                            </p>
                                        </>
                                    )}
                                    {form_fase.data.fase?.value === 4 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>
                                                La fase de {form_fase.data.fase.label.toLowerCase()} bloqueará a los formuladores la acción de modificar aquellos proyectos que pasaron a etapa de
                                                subsanación y a los evaluadores se le habilitarán aquellas evaluaciones de proyectos subsanados.
                                            </p>
                                        </>
                                    )}
                                    {form_fase.data.fase?.value === 5 && (
                                        <>
                                            <strong>Tenga en cuenta</strong>
                                            <p>
                                                La fase de {form_fase.data.fase.label.toLowerCase()} bloqueará a los formuladores la modificación de proyectos y a los evaluadores la modificación de
                                                las evaluaciones.
                                            </p>
                                        </>
                                    )}
                                </AlertMui>
                            </fieldset>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin && (
                                    <PrimaryButton className="ml-auto" type="submit" disabled={form_fase.processing}>
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
                                    value={form_convocatoria.data.descripcion}
                                    onChange={(e) => form_convocatoria.setData('descripcion', e.target.value)}
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
                                <SwitchMui checked={form_convocatoria.data.esta_activa} onChange={(e) => form_convocatoria.setData('esta_activa', e.target.checked)} />
                            </div>

                            <div>
                                <div className="mt-10 mb-20">
                                    <Label required labelFor="lineas_programaticas_activas" className="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                                    <SelectMultiple
                                        id="lineas_programaticas_activas"
                                        bdValues={form_convocatoria.data.lineas_programaticas_activas}
                                        options={lineas_programaticas}
                                        error={errors.lineas_programaticas_activas}
                                        onChange={(event, newValue) => {
                                            const selectedValues = newValue.map((option) => option.value)
                                            form_convocatoria.setData((prevData) => ({
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
                                    value="¿La convocatoria es visible para todos los usuarios?. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)"
                                    className="inline-block mb-4"
                                />
                                <br />
                                <SwitchMui checked={form_convocatoria.data.visible} onChange={(e) => form_convocatoria.setData('visible', e.target.checked)} />
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
                                    <SwitchMui checked={form_convocatoria.data.mostrar_recomendaciones} onChange={(e) => form_convocatoria.setData('mostrar_recomendaciones', e.target.checked)} />
                                </div>
                            )}
                        </fieldset>
                        <div className="flex items-center justify-between mt-14 px-8 py-4">
                            {is_super_admin && (
                                <PrimaryButton className="ml-auto" type="submit" disabled={form_convocatoria.processing}>
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

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { route, checkRole } from '@/Utils'
import { Grid, Paper } from '@mui/material'
import AlertMui from '@/Components/Alert'
import TextInput from '@/Components/TextInput'

const CreateConvocatoria = ({ auth, convocatorias, lineas_programaticas, tipos_convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        descripcion: '',
        esta_activa: false,
        year: '',
        lineas_programaticas_activas: null,
        visible: false,
        fecha_finalizacion_fase: '',
        hora_finalizacion_fase: '',
        convocatoria_id: null,
        tipo_convocatoria: null,
    })

    const submit = (e) => {
        e.preventDefault()
        if (is_super_admin) {
            form.post(route('convocatorias.store'))
        }
    }

    const currentYear = new Date().getFullYear()

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <Grid container>
                <Grid item md={4}>
                    <h1 className="font-black text-2xl">Nueva convocatoria</h1>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <form onSubmit={submit}>
                            <fieldset disabled={is_super_admin ? undefined : true}>
                                <Grid container rowSpacing={10} padding={4}>
                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="fase" value="Fase" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <div>Formulación</div>
                                    </Grid>

                                    <Grid item md={6}>
                                        {form.data.fase && <p className="text-center">Fecha de finalización de la fase: {data.fase.label.toLowerCase()}</p>}
                                        <Label required labelFor="fecha_finalizacion_fase" value="Fecha límite de la fase de formulación" />
                                        <DatePicker
                                            variant="outlined"
                                            id="fecha_finalizacion_fase"
                                            className="w-full"
                                            value={form.data.fecha_finalizacion_fase}
                                            onChange={(e) => form.setData('fecha_finalizacion_fase', e.target.value)}
                                            error={form.errors.fecha_finalizacion_fase}
                                            required
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Label required labelFor="hora_finalizacion_fase" value="Hora límite de la fase de formulación" />
                                        <input
                                            id="hora_finalizacion_fase"
                                            type="time"
                                            step="1"
                                            className="mt-1 p-2 border rounded border-gray-300"
                                            value={form.data.hora_finalizacion_fase}
                                            onChange={(e) => form.setData('hora_finalizacion_fase', e.target.value)}
                                            error={form.errors.hora_finalizacion_fase}
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="year" value="Año de ejecución de proyectos" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            id="year"
                                            name="year"
                                            type="number"
                                            value={form.data.year}
                                            onChange={(e) => form.setData('year', e.target.value)}
                                            inputProps={{
                                                min: 2010,
                                                max: currentYear + 1,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="tipo_convocatoria" value="Seleccione un tipo de convocatoria" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Autocomplete
                                            id="tipo_convocatoria"
                                            options={tipos_convocatoria}
                                            selectedValue={form.data.tipo_convocatoria}
                                            onChange={(event, newValue) => form.setData('tipo_convocatoria', newValue.value)}
                                            error={form.errors.tipo_convocatoria}
                                            placeholder="Seleccione un tipo de convocatoria"
                                            required
                                        />
                                        <AlertMui>
                                            <strong>Proyectos de convocatoria</strong> para habilitar la formulación de proyectos de todas las líneas.
                                            <br />
                                            <strong>Proyectos demo I+D+i</strong> para permitir el ejercicio de formulación.
                                        </AlertMui>
                                    </Grid>

                                    <Grid item md={6}>
                                        <Label required className="mb-4" labelFor="convocatoria_id" value="Seleccione una convocatoria de la cual desee copiar los presupuestos y roles SENNOVA" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <Autocomplete
                                            id="convocatoria_id"
                                            options={convocatorias}
                                            selectedValue={form.data.convocatoria_id}
                                            onChange={(event, newValue) => form.setData('convocatoria_id', newValue.value)}
                                            error={form.errors.convocatoria_id}
                                            label="Seleccione una convocatoria"
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={6}>
                                        <Label required labelFor="lineas_programaticas_activas" className="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                                    </Grid>
                                    <Grid item md={6}>
                                        <SelectMultiple
                                            id="lineas_programaticas_activas"
                                            bdValues={form.data.lineas_programaticas_activas}
                                            options={lineas_programaticas}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    lineas_programaticas_activas: selected_values,
                                                }))
                                            }}
                                            error={form.errors.lineas_programaticas_activas}
                                            label="Seleccione las líneas programáticas"
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Textarea
                                            label="Descripción"
                                            id="descripcion"
                                            error={form.errors.descripcion}
                                            value={form.data.descripcion}
                                            onChange={(e) => form.setData('descripcion', e.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={9}>
                                        <Label
                                            required
                                            labelFor="esta_activa"
                                            value="¿Desea activar esta convocatoria? (Si la opción está habilitada permite a los usuarios formular proyectos. Tenga en cuenta que solo puede activar una convocatoria por tipo --Proyectos de convocatoria - Proyectos de ejecicio DEMO)"
                                            className="inline-block text-justify mb-4"
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                        <SwitchMui className="!ml-4" checked={form.data.esta_activa} onChange={(e) => form.setData('esta_activa', e.target.checked)} />
                                    </Grid>

                                    <Grid item md={9}>
                                        <Label
                                            required
                                            labelFor="visible"
                                            value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)"
                                            className="inline-block mb-4"
                                        />
                                    </Grid>
                                    <Grid item md={3}>
                                        <SwitchMui className="!ml-4" checked={form.data.visible} onChange={(e) => form.setData('visible', e.target.checked)} />
                                    </Grid>
                                </Grid>
                            </fieldset>
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                {is_super_admin && (
                                    <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                        Crear convocatoria
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default CreateConvocatoria

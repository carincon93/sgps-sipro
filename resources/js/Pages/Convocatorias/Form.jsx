import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Checkbox from '@/Components/Checkbox'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'
import Textarea from '@/Components/Textarea'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'
import { Grid, FormControlLabel, FormGroup } from '@mui/material'

const Form = ({ is_super_admin, method = '', convocatoria, convocatorias, tipos_formulario_convocatoria, tipos_convocatoria, fases }) => {
    const form = useForm({
        descripcion: convocatoria?.descripcion,
        esta_activa: convocatoria?.esta_activa,
        fase: convocatoria?.fase,
        year: convocatoria?.year,
        tipos_formulario_convocatoria: convocatoria?.tipos_formulario_convocatoria.map((item) => item.id),
        formularios_visibles: convocatoria?.tipos_formulario_convocatoria.filter((item) => item.pivot.visible).map((item) => item.id),
        visible: convocatoria?.visible ?? false,
        fecha_finalizacion_fase: convocatoria?.fecha_finalizacion_fase,
        hora_finalizacion_fase: convocatoria?.hora_finalizacion_fase,
        convocatoria_id: convocatoria?.convocatoria_id,
        tipo_convocatoria: convocatoria?.tipo_convocatoria,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.store'), {
                  preserveScroll: true,
              })
            : form.put(route('convocatorias.update', [convocatoria.id]), {
                  preserveScroll: true,
              })
    }

    const handleCheckboxChange = (value) => {
        if (form.data.formularios_visibles.includes(value)) {
            form.setData((prevData) => ({
                ...prevData,
                formularios_visibles: prevData.formularios_visibles.filter((formulario_visible) => formulario_visible !== value),
            }))
        } else {
            form.setData((prevData) => ({
                ...prevData,
                formularios_visibles: [...prevData.formularios_visibles, value],
            }))
        }
    }

    const current_year = new Date().getFullYear()

    return (
        <form onSubmit={submit}>
            <fieldset>
                <Grid container rowSpacing={10} padding={4}>
                    <Grid item md={6}>
                        <Label required className="mb-4" labelFor="fase" value="Fase" />
                    </Grid>
                    <Grid item md={6}>
                        {method == 'POST' ? (
                            <div>Formulación</div>
                        ) : (
                            <Autocomplete
                                id="fase"
                                options={fases}
                                selectedValue={form.data.fase}
                                onChange={(event, newValue) => form.setData('fase', newValue.value)}
                                error={form.errors.fase}
                                placeholder="Seleccione una fase"
                                required
                            />
                        )}
                    </Grid>

                    <Grid item md={6}>
                        <Label required labelFor="fecha_finalizacion_fase" value="Fecha límite de la fase" />
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

                    {method == 'POST' && (
                        <>
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
                        </>
                    )}

                    {/* <Grid item md={6}>
                        <Label required labelFor="tipos_formulario_convocatoria" className="mb-4" value="Seleccione los formularios correspondientes a la convococatoria" />
                    </Grid>
                    <Grid item md={6}>
                        <SelectMultiple
                            id="tipos_formulario_convocatoria"
                            bdValues={form.data.tipos_formulario_convocatoria}
                            options={tipos_formulario_convocatoria}
                            onChange={(event, newValue) => {
                                const selected_values = newValue.map((option) => option.value)
                                form.setData((prevData) => ({
                                    ...prevData,
                                    tipos_formulario_convocatoria: selected_values,
                                }))
                            }}
                            error={form.errors.tipos_formulario_convocatoria}
                            label="Seleccione las líneas programáticas"
                            required
                        />
                    </Grid> */}

                    <Grid item md={6}>
                        <Label required labelFor="formularios_visibles" className="mb-4" value="Seleccione los formularios que serán visibles para todos los usuarios" />
                    </Grid>
                    <Grid item md={6}>
                        <FormGroup>
                            {convocatoria?.tipos_formulario_convocatoria.map((tipo_formulario_convocatoria, i) => (
                                <FormControlLabel
                                    key={i}
                                    className="mb-10"
                                    label={tipo_formulario_convocatoria.nombre}
                                    control={
                                        <Checkbox
                                            checked={form.data.formularios_visibles?.includes(tipo_formulario_convocatoria.id)}
                                            name={tipo_formulario_convocatoria.nombre}
                                            onChange={() => handleCheckboxChange(tipo_formulario_convocatoria.id)}
                                        />
                                    }
                                />
                            ))}
                        </FormGroup>
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
                                max: current_year + 1,
                            }}
                        />
                    </Grid>

                    <Grid item md={12}>
                        <Textarea
                            label="Título"
                            id="descripcion"
                            error={form.errors.descripcion}
                            value={form.data.descripcion}
                            onChange={(e) => form.setData('descripcion', e.target.value)}
                            required
                        />
                    </Grid>

                    <Grid item md={9}>
                        <Label required labelFor="esta_activa" value="¿Desea activar esta convocatoria para que los usuarios formulen proyectos?" className="inline-block text-justify mb-4" />
                    </Grid>
                    <Grid item md={3}>
                        <SwitchMui className="!ml-4" checked={form.data.esta_activa} onChange={(e) => form.setData('esta_activa', e.target.checked)} />
                    </Grid>

                    <Grid item md={9}>
                        <Label required labelFor="visible" value="¿Desea que la convocatoria sea visible para todos los usuarios?" className="inline-block mb-4" />
                    </Grid>
                    <Grid item md={3}>
                        <SwitchMui className="!ml-4" checked={form.data.visible} onChange={(e) => form.setData('visible', e.target.checked)} />
                    </Grid>
                </Grid>
            </fieldset>
            <div className="flex items-center justify-between mt-14 px-8 py-4">
                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                    {method == 'POST' ? 'Crear' : 'Modificar'} convocatoria
                </PrimaryButton>
            </div>
        </form>
    )
}

export default Form

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'

const Form = ({ method = '', setDialogStatus, is_super_admin, convocatoria, proyecto, producto, resultados, subtipologias_minciencias, tipos_producto, ...props }) => {
    const [tipo_producto, setTipoProducto] = useState(null)

    const form = useForm({
        nombre: producto?.nombre,

        resultado_id: producto?.resultado_id,
        fecha_inicio: producto?.fecha_inicio,
        fecha_finalizacion: producto?.fecha_finalizacion,

        meta_indicador: producto?.meta_indicador,
        medio_verificacion: producto?.medio_verificacion ?? '',
        formula_indicador: producto?.formula_indicador,
        unidad_indicador: producto?.unidad_indicador,

        tipo: producto?.producto_minciencias?.tipo ?? null,
        trl: producto?.producto_minciencias?.trl ?? null,
        subtipologia_minciencias_id: producto?.producto_minciencias?.subtipologia_minciencias_id ?? null,

        actividad_id: producto?.actividades.map((item) => item.id),
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.productos.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.productos.update', [convocatoria.id, proyecto.id, producto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    const [actividades, setActividades] = useState([])
    useEffect(() => {
        if (resultados.find((item) => item.value == producto?.resultado_id)?.actividades) {
            const tmp_options_filtered = resultados
                .find((item) => item.value == producto?.resultado_id)
                ?.actividades.map((option) => {
                    const { id, descripcion } = option
                    return { value: id, label: descripcion }
                })

            setActividades(tmp_options_filtered)
        }
    }, [producto])

    useEffect(() => {
        if (resultados.find((item) => item.value == form.data.resultado_id)?.actividades) {
            const tmp_options_filtered = resultados
                .find((item) => item.value == form.data.resultado_id)
                ?.actividades.map((option) => {
                    const { id, descripcion } = option
                    return { value: id, label: descripcion }
                })

            setActividades(tmp_options_filtered)
        }
    }, [form.data.resultado_id])

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10"> {method == 'POST' ? 'Agregar' : 'Modificar'} producto</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset>
                            <Grid container rowSpacing={10}>
                                {method == 'POST' && (
                                    <>
                                        <Grid item md={3}>
                                            <Label required labelFor="tipo_producto" value="Tipo de producto" />
                                        </Grid>
                                        <Grid item md={9}>
                                            <Autocomplete
                                                id="tipo_producto"
                                                options={[
                                                    { value: 1, label: 'Indicadores de Gestión' },
                                                    { value: 2, label: 'Producto CTI' },
                                                ]}
                                                selectedValue={tipo_producto}
                                                onChange={(event, newValue) => setTipoProducto(newValue.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                label="Selecione el tipo de producto"
                                                required
                                            />
                                        </Grid>
                                    </>
                                )}
                                {(tipo_producto && method == 'POST') || method == 'PUT' ? (
                                    <>
                                        <Grid item md={12}>
                                            <AlertMui>
                                                <p>
                                                    Los productos pueden corresponder a bienes o servicios. Un bien es un objeto tangible, almacenable o transportable, mientras que el servicio es una
                                                    prestación intangible.
                                                    <br />
                                                    <br />
                                                    <strong>El producto debe cumplir con la siguiente estructura:</strong>
                                                    <br />
                                                    Cuando el producto es un bien: nombre del bien + la condición deseada. Ejemplo: - Vía construida.
                                                    <br />
                                                    - Piezas mecanizadas, PCB's construidos.
                                                    <br />
                                                    Cuando el producto es un servicio: nombre del servicio + el complemento. Ejemplo: - Servicio de asistencia técnica para el mejoramiento de hábitos
                                                    alimentarios
                                                    <br />
                                                    Servicio de asistencia técnica para el análisis de datos, servicios de toma de muestras para análisis de pesticidas.
                                                </p>
                                            </AlertMui>
                                        </Grid>

                                        <Grid item md={3}>
                                            <Label required labelFor="fecha_inicio" value="Fecha de inicio" />
                                        </Grid>
                                        <Grid item md={9}>
                                            <DatePicker
                                                id="fecha_inicio"
                                                className="block w-full p-4"
                                                minDate={proyecto.fecha_inicio}
                                                maxDate={proyecto.fecha_finalizacion}
                                                value={form.data.fecha_inicio}
                                                onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                error={form.errors.fecha_inicio}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={3}>
                                            <Label required labelFor="fecha_finalizacion" value="Fecha de finalización" />
                                        </Grid>
                                        <Grid item md={9}>
                                            <DatePicker
                                                id="fecha_finalizacion"
                                                className="block w-full p-4"
                                                minDate={proyecto.fecha_inicio}
                                                maxDate={proyecto.fecha_finalizacion}
                                                value={form.data.fecha_finalizacion}
                                                onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                error={form.errors.fecha_finalizacion}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={3}>
                                            <Label required labelFor="resultado_id" value="Resultado asociado" />
                                        </Grid>
                                        <Grid item md={9}>
                                            <Autocomplete
                                                id="resultado_id"
                                                options={resultados}
                                                selectedValue={form.data.resultado_id}
                                                onChange={(event, newValue) => form.setData('resultado_id', newValue.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                error={form.errors.resultado_id}
                                                label="Selecione el resultado"
                                                placeholder="Seleccione un resultado"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                label="Descripción del producto a obtener"
                                                id="nombre"
                                                error={form.errors.nombre}
                                                value={form.data.nombre}
                                                onChange={(e) => form.setData('nombre', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                label="Unidad del indicador"
                                                id="unidad_indicador"
                                                error={form.errors.unidad_indicador}
                                                value={form.data.unidad_indicador}
                                                onChange={(e) => form.setData('unidad_indicador', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                required
                                            />
                                            <AlertMui>
                                                El indicador debe mantener una estructura coherente. Esta se compone de dos elementos: en primer lugar, debe ir el objeto a cuantificar, descrito por un
                                                sujeto y posteriormente la condición deseada, definida a través de un verbo en participio. <strong>Por ejemplo:</strong> Kilómetros de red vial nacional
                                                construidos.
                                            </AlertMui>

                                            <TextInput
                                                id="meta_indicador"
                                                type="number"
                                                className="!mt-10"
                                                error={form.errors.meta_indicador}
                                                value={form.data.meta_indicador}
                                                onChange={(e) => form.setData('meta_indicador', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                label="Meta del indicador"
                                                required
                                            />
                                            <AlertMui>
                                                ¿Cuál es la meta para la unidad: <strong>{form.data.unidad_indicador}</strong>? Debe indicar un número.
                                            </AlertMui>
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                id="medio_verificacion"
                                                error={form.errors.medio_verificacion}
                                                value={form.data.medio_verificacion}
                                                onChange={(e) => form.setData('medio_verificacion', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                label="Medio de verificación"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Textarea
                                                id="formula_indicador"
                                                error={form.errors.formula_indicador}
                                                value={form.data.formula_indicador}
                                                onChange={(e) => form.setData('formula_indicador', e.target.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                label="Fórmula del indicador del producto"
                                                required
                                            />
                                            <AlertMui>
                                                El método de cálculo debe ser una expresión matemática definida de manera adecuada y de fácil comprensión, es decir, deben quedar claras cuáles son las
                                                variables utilizadas. Los métodos de cálculo más comunes son el porcentaje, la tasa de variación, la razón y el número índice. Aunque éstos no son las
                                                únicas expresiones para los indicadores, sí son las más frecuentes.
                                            </AlertMui>
                                        </Grid>

                                        {(form.data.subtipologia_minciencias_id && form.data.trl && form.data.tipo) || (method == 'POST' && tipo_producto == 2) ? (
                                            <Grid item md={12}>
                                                <Autocomplete
                                                    id="subtipologia_minciencias_id"
                                                    options={subtipologias_minciencias}
                                                    selectedValue={form.data.subtipologia_minciencias_id}
                                                    onChange={(event, newValue) => form.setData('subtipologia_minciencias_id', newValue.value)}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    error={form.errors.subtipologia_minciencias_id}
                                                    label="Subtipología Minciencias"
                                                    required
                                                />

                                                <Autocomplete
                                                    className="mt-8"
                                                    id="tipo"
                                                    options={tipos_producto}
                                                    selectedValue={form.data.tipo}
                                                    onChange={(event, newValue) => form.setData('tipo', newValue.value)}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    error={form.errors.tipo}
                                                    label="Seleccione un tipo"
                                                    required
                                                />

                                                <TextInput
                                                    className="!mt-8"
                                                    id="trl"
                                                    type="number"
                                                    label="Diligencie el TRL para este producto (1 a 9)"
                                                    value={form.data.trl}
                                                    inputProps={{ min: 0, max: 9, step: 1 }}
                                                    onChange={(e) => form.setData('trl', e.target.value)}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    error={form.errors.trl}
                                                    required
                                                />
                                            </Grid>
                                        ) : null}

                                        <Grid item md={12}>
                                            <h6 className="mt-20 mb-12 text-2xl">Actividades a desarrollar</h6>
                                            {actividades?.length > 0 ? (
                                                <SelectMultiple
                                                    id="actividad_id"
                                                    bdValues={form.data.actividad_id}
                                                    options={actividades}
                                                    error={form.errors.actividad_id}
                                                    label="Seleccione las actividades a desarrollar"
                                                    onChange={(event, newValue) => {
                                                        const selectedValues = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            actividad_id: selectedValues,
                                                        }))
                                                    }}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    required
                                                />
                                            ) : (
                                                <AlertMui severity="error">
                                                    El resultado seleccionado no tiene actividades asociadas. Debe completar la información de cada actividad en el numeral de{' '}
                                                    <strong>Metodología y actividades</strong>. Para ello diríjase a la parte inferior de la ventanta, haga clic en los tres puntos de cada actividad |
                                                    Ver detalles. En el formulario que visualiza deberá completar el resto de información.
                                                </AlertMui>
                                            )}
                                        </Grid>
                                    </>
                                ) : null}
                            </Grid>
                        </fieldset>

                        {producto && <small className="inline-block my-10 text-app-700">{producto.updated_at}</small>}

                        <div className="flex items-center justify-between py-4">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton
                                    disabled={actividades?.length == 0 || (actividades?.length > 0 && form.processing) || (actividades?.length > 0 && !form.isDirty)}
                                    className="mr-2 ml-auto"
                                    type="submit">
                                    {method == 'POST' ? 'Agregar' : 'Modificar'} producto
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
                                Cancelar
                            </ButtonMui>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form

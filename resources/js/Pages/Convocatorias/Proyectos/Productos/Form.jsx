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
    const form = useForm({
        nombre: producto?.nombre,
        resultado_id: producto?.resultado_id,
        fecha_inicio: producto?.fecha_inicio,
        fecha_finalizacion: producto?.fecha_finalizacion,

        indicador: producto?.indicador,

        tipo:
            producto?.producto_minciencias_linea65?.tipo ??
            producto?.producto_minciencias_linea66?.tipo ??
            producto?.producto_minciencias_linea68?.tipo ??
            producto?.producto_minciencias_linea69?.tipo ??
            '',
        trl:
            producto?.producto_minciencias_linea65?.trl ??
            producto?.producto_minciencias_linea66?.trl ??
            producto?.producto_minciencias_linea68?.trl ??
            producto?.producto_minciencias_linea69?.trl ??
            '',
        subtipologia_minciencias_id:
            producto?.producto_minciencias_linea65?.subtipologia_minciencias_id ??
            producto?.producto_minciencias_linea66?.subtipologia_minciencias_id ??
            producto?.producto_minciencias_linea68?.subtipologia_minciencias_id ??
            producto?.producto_minciencias_linea69?.subtipologia_minciencias_id ??
            null,

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
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <Grid container rowSpacing={10}>
                                <Grid item md={12}>
                                    {proyecto.tipo_formulario_convocatoria_id == 4 && (
                                        <AlertMui>
                                            <p>
                                                <strong>Importante:</strong> Debe modifcar las fechas de ejecución, meta y las actividades a asociar.
                                            </p>
                                        </AlertMui>
                                    )}
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
                                        error={form.errors.fecha_finalizacion}
                                        required
                                    />
                                </Grid>

                                <Grid item md={3}>
                                    <Label required labelFor="resultado_id" value="Resultado" />
                                </Grid>
                                <Grid item md={9}>
                                    <Autocomplete
                                        id="resultado_id"
                                        options={resultados}
                                        selectedValue={form.data.resultado_id}
                                        onChange={(event, newValue) => form.setData('resultado_id', newValue.value)}
                                        error={form.errors.resultado_id}
                                        label="Resultado"
                                        placeholder="Seleccione un resultado"
                                        required
                                        disabled={proyecto.tipo_formulario_convocatoria_id == 4}
                                    />
                                </Grid>

                                <Grid item md={12}>
                                    <Textarea
                                        disabled={is_super_admin ? false : proyecto.tipo_formulario_convocatoria_id == 4 ? true : false}
                                        label="Descripción"
                                        id="nombre"
                                        error={form.errors.nombre}
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        required
                                    />
                                    {proyecto.tipo_formulario_convocatoria_id == 12 || proyecto.tipo_formulario_convocatoria_id == 5 ? (
                                        <AlertMui>
                                            <p>
                                                Los productos pueden corresponder a bienes o servicios. Un bien es un objeto tangible, almacenable o transportable, mientras que el servicio es una
                                                prestación intangible.
                                                <br />
                                                El producto debe cumplir con la siguiente estructura:
                                                <br />
                                                Cuando el producto es un bien: nombre del bien + la condición deseada. Ejemplo: Vía construida.
                                                <br />
                                                Cuando el producto es un servicio: nombre del servicio + el complemento. Ejemplo: Servicio de asistencia técnica para el mejoramiento de hábitos
                                                alimentarios
                                            </p>
                                        </AlertMui>
                                    ) : null}
                                </Grid>

                                {proyecto.tipo_formulario_convocatoria_id != 12 && (
                                    <Grid item md={12}>
                                        <Textarea
                                            disabled={is_super_admin ? false : proyecto.tipo_formulario_convocatoria_id == 4 ? true : false}
                                            id="indicador"
                                            error={form.errors.indicador}
                                            value={form.data.indicador}
                                            onChange={(e) => form.setData('indicador', e.target.value)}
                                            label="Indicador"
                                            required
                                        />

                                        {proyecto.tipo_formulario_convocatoria_id != 4 && (
                                            <>
                                                {proyecto.tipo_formulario_convocatoria_id == 5 ? (
                                                    <AlertMui>Deber ser medible y con una fórmula. Por ejemplo: (# metodologías validadas/# metodologías totales) X 100</AlertMui>
                                                ) : (
                                                    <AlertMui>Especifique los medios de verificación para validar los logros del proyecto.</AlertMui>
                                                )}
                                            </>
                                        )}
                                    </Grid>
                                )}

                                <Grid item md={12}>
                                    {proyecto.tipo_formulario_convocatoria_id == 8 ||
                                    proyecto.tipo_formulario_convocatoria_id == 6 ||
                                    proyecto.tipo_formulario_convocatoria_id == 7 ||
                                    proyecto.tipo_formulario_convocatoria_id == 9 ||
                                    proyecto.tipo_formulario_convocatoria_id == 5 ||
                                    proyecto.tipo_formulario_convocatoria_id == 1 ? (
                                        <>
                                            <Autocomplete
                                                id="subtipologia_minciencias_id"
                                                options={subtipologias_minciencias}
                                                selectedValue={form.data.subtipologia_minciencias_id}
                                                onChange={(event, newValue) => form.setData('subtipologia_minciencias_id', newValue.value)}
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
                                                error={form.errors.tipo}
                                                label="Seleccione un tipo"
                                                required
                                            />

                                            <TextInput
                                                className="!mt-8"
                                                id="trl"
                                                type="number"
                                                label="Diligencie el TRL para este producto"
                                                value={form.data.trl}
                                                inputProps={{ min: 0, max: 9, step: 1 }}
                                                onChange={(e) => form.setData('trl', e.target.value)}
                                                error={form.errors.trl}
                                                required
                                            />
                                        </>
                                    ) : null}
                                </Grid>

                                <Grid item md={12}>
                                    <h6 className="mt-20 mb-12 text-2xl">Actividades a desarrollar</h6>
                                    <div className="bg-white rounded shadow overflow-hidden">
                                        <div className="p-4">
                                            <Label required className="mb-4" labelFor="actividad_id" value="Relacione las actividades respectivas" />
                                        </div>
                                        <div>
                                            {actividades?.length > 0 ? (
                                                <SelectMultiple
                                                    id="actividad_id"
                                                    bdValues={form.data.actividad_id}
                                                    options={actividades}
                                                    error={form.errors.actividad_id}
                                                    onChange={(event, newValue) => {
                                                        const selectedValues = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            actividad_id: selectedValues,
                                                        }))
                                                    }}
                                                    required
                                                />
                                            ) : (
                                                <AlertMui severity="error">
                                                    El resultado seleccionado no tiene actividades asociadas. Debe completar la información de cada actividad en el numeral de{' '}
                                                    <strong>Metodología y actividades</strong>. Para ello diríjase a la parte inferior de la ventanta, haga clic en los tres puntos de cada actividad |
                                                    Ver detalles. En el formulario que visualiza deberá completar el resto de información.
                                                </AlertMui>
                                            )}
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </fieldset>

                        {producto && <small className="inline-block my-10 text-app-700">{producto.updated_at}</small>}

                        <div className="flex items-center justify-between py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton
                                        disabled={actividades?.length == 0 || (actividades?.length > 0 && form.processing) || (actividades?.length > 0 && !form.isDirty)}
                                        className="mr-2 ml-auto"
                                        type="submit">
                                        {method == 'POST' ? 'Agregar' : 'Modificar'} producto
                                    </PrimaryButton>
                                    <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)}>
                                        Cancelar
                                    </ButtonMui>
                                </>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form

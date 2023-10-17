import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import SwitchMui from '@/Components/Switch'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Chip, Grid, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

const Form = ({ is_super_admin, method = '', setDialogStatus, convocatoria, proyecto, rubro_presupuestal, segundo_grupo_presupuestal, tercer_grupo_presupuestal, usos_presupuestales }) => {
    const [array_tecer_grupo_presupuestal, setArrayTecerGrupoPresupuestal] = useState([])
    const [array_usos_presupuestales, setArrayUsosPresupuestales] = useState([])
    const [requiere_estudio_mercado, setRequiereEstudioMercado] = useState(true)
    const [same_values_requiere_estudio_mercado, setSameValuesRequiereEstudioMercado] = useState(false)
    const [modificar_usos_presupuestales, setModificarUsosPresupuestales] = useState(false)
    const [equipo_requiere_actualizacion, setEquipoRequiereActualizacion] = useState(false)

    const form = useForm({
        segundo_grupo_presupuestal_id: null,
        tercer_grupo_presupuestal_id: null,
        convocatoria_presupuesto_id: rubro_presupuestal?.convocatoria_proyecto_rubros_presupuestales.map((item) => item.id),
        descripcion: rubro_presupuestal?.descripcion ?? '',
        justificacion: rubro_presupuestal?.justificacion ?? '',
        valor_total: rubro_presupuestal?.valor_total ?? '',
        equipo_para_modernizar: false,
    })

    // Concepto interno SENA
    useEffect(() => {
        if (form.data.segundo_grupo_presupuestal_id) {
            setEquipoRequiereActualizacion(false)
            setRequiereEstudioMercado(true)
            setArrayTecerGrupoPresupuestal([])
            setArrayUsosPresupuestales([])
            form.reset('tercer_grupo_presupuestal_id', 'convocatoria_presupuesto_id')

            if (
                segundo_grupo_presupuestal.find((item) => item.value == form.data.segundo_grupo_presupuestal_id)?.codigo == '2040115' ||
                segundo_grupo_presupuestal.find((item) => item.value == form.data.segundo_grupo_presupuestal_id)?.codigo == '2040125'
            ) {
                setEquipoRequiereActualizacion(true)
            }

            setTimeout(() => {
                const filtered_tecer_grupo_presupuestal = tercer_grupo_presupuestal.filter((item) => item.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id)
                setArrayTecerGrupoPresupuestal(filtered_tecer_grupo_presupuestal)
            }, 500)
        }
    }, [form.data.segundo_grupo_presupuestal_id])

    // Rubro concepto ministerio de hacienda
    useEffect(() => {
        setArrayUsosPresupuestales([])
        form.reset('convocatoria_presupuesto_id')

        if (form.data.tercer_grupo_presupuestal_id) {
            setRequiereEstudioMercado(true)

            setTimeout(() => {
                const filtered_usos_presupuestales = usos_presupuestales.filter(
                    (item) => item.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id && item.tercer_grupo_presupuestal_id == form.data.tercer_grupo_presupuestal_id,
                )

                setArrayUsosPresupuestales((prevArray) => [...prevArray, ...filtered_usos_presupuestales])
            }, 500)
        }
    }, [form.data.tercer_grupo_presupuestal_id])

    // Uso presupuestal
    useEffect(() => {
        if (form.data.convocatoria_presupuesto_id) {
            if (form.data.convocatoria_presupuesto_id.length > 1) {
                console.log(array_usos_presupuestales.filter((item) => form.data.convocatoria_presupuesto_id?.includes(item.value)))
                setSameValuesRequiereEstudioMercado(
                    array_usos_presupuestales
                        .filter((item) => form.data.convocatoria_presupuesto_id?.includes(item.value))
                        .every(
                            (item) =>
                                item.requiere_estudio_mercado ===
                                array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])
                                    ?.requiere_estudio_mercado,
                        ),
                )

                if (
                    same_values_requiere_estudio_mercado &&
                    array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])?.requiere_estudio_mercado
                ) {
                    setRequiereEstudioMercado(true)
                } else if (
                    same_values_requiere_estudio_mercado &&
                    array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])?.requiere_estudio_mercado == false
                ) {
                    setRequiereEstudioMercado(false)
                }
            } else if (form.data.convocatoria_presupuesto_id.length == 1) {
                setSameValuesRequiereEstudioMercado(true)
                if (
                    array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id)?.requiere_estudio_mercado == false ||
                    array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id)?.requiere_estudio_mercado == null
                ) {
                    setRequiereEstudioMercado(false)
                }
            }
        }
    }, [form.data.convocatoria_presupuesto_id])

    useEffect(() => {
        if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado == true) {
            setRequiereEstudioMercado(true)
        } else if (
            (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado) == false ||
            (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado) == null
        ) {
            setRequiereEstudioMercado(false)
        }

        if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales.length > 0) {
            setModificarUsosPresupuestales(true)
        }
    }, [rubro_presupuestal])

    const submit = (e) => {
        e.preventDefault()

        if (proyecto.allowed.to_update) {
            method == 'POST'
                ? form.post(route('convocatorias.proyectos.presupuesto.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.presupuesto.update', [convocatoria.id, proyecto.id, rubro_presupuestal.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-white text-2xl mr-10">Rubro presupuestal</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    {modificar_usos_presupuestales && (
                        <>
                            <h1>Usos presupuestales</h1>

                            <ul className="mt-6 space-y-2 list-disc">
                                {rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales.map((convocatoria_rubro_presupuestal, i) => (
                                    <li key={i}>
                                        <p className="first-letter:uppercase">
                                            {convocatoria_rubro_presupuestal.rubro_presupuestal.uso_presupuestal.descripcion}
                                            <Chip
                                                component="span"
                                                label={convocatoria_rubro_presupuestal.requiere_estudio_mercado ? 'Requiere estudio de mercado' : 'No requiere estudio de mercado'}
                                                className="ml-2"
                                                size="small"
                                            />
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <form onSubmit={submit} id="form-proyecto-presupuesto">
                        <fieldset>
                            <Grid container rowSpacing={8}>
                                {!modificar_usos_presupuestales && (
                                    <>
                                        <Grid item md={12} className={`${array_tecer_grupo_presupuestal.length == 0 ? 'mb-[13.8rem]' : 'mb-0'}`}>
                                            <Autocomplete
                                                id="segundo_grupo_presupuestal_id"
                                                options={segundo_grupo_presupuestal}
                                                selectedValue={form.data.segundo_grupo_presupuestal_id}
                                                onChange={(e, newValue) => form.setData('segundo_grupo_presupuestal_id', newValue.value)}
                                                disabled={!proyecto?.allowed?.to_update}
                                                error={form.errors.segundo_grupo_presupuestal_id}
                                                label="Rubro concepto interno SENA"
                                                required
                                            />
                                        </Grid>

                                        {array_tecer_grupo_presupuestal.length > 0 && (
                                            <Grid item md={12} className={`mt-8 ${array_usos_presupuestales.length == 0 ? 'mb-[7rem]' : 'mb-0'}`}>
                                                <Autocomplete
                                                    id="tercer_grupo_presupuestal_id"
                                                    options={array_tecer_grupo_presupuestal}
                                                    selectedValue={form.data.tercer_grupo_presupuestal_id}
                                                    onChange={(e, newValue) => form.setData('tercer_grupo_presupuestal_id', newValue.value)}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    error={form.errors.tercer_grupo_presupuestal_id}
                                                    label="Rubro concepto ministerio de hacienda"
                                                    required
                                                />
                                            </Grid>
                                        )}

                                        {array_usos_presupuestales.length > 0 && (
                                            <Grid item md={12}>
                                                <SelectMultiple
                                                    id="convocatoria_presupuesto_id"
                                                    options={array_usos_presupuestales}
                                                    bdValues={form.data.convocatoria_presupuesto_id}
                                                    onChange={(event, newValue) => {
                                                        const selected_values = newValue.map((option) => option.value)

                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            convocatoria_presupuesto_id: selected_values,
                                                        }))
                                                    }}
                                                    disabled={!proyecto?.allowed?.to_update}
                                                    error={form.errors.convocatoria_presupuesto_id}
                                                    label="Usos presupuestales"
                                                    required
                                                />
                                            </Grid>
                                        )}
                                    </>
                                )}

                                {method === 'PUT' && (
                                    <Grid item md={12}>
                                        <ButtonMui
                                            onClick={() => {
                                                setModificarUsosPresupuestales(!modificar_usos_presupuestales)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    segundo_grupo_presupuestal_id: [],
                                                    tercer_grupo_presupuestal_id: [],
                                                    convocatoria_presupuesto_id: [],
                                                }))
                                            }}
                                            className="!my-6">
                                            {modificar_usos_presupuestales ? 'Modificar usos presupuestales' : 'Cancelar'}
                                        </ButtonMui>
                                    </Grid>
                                )}

                                <Grid item md={12}>
                                    <Textarea
                                        label="Describa los bienes o servicios a adquirir. Sea específico"
                                        id="descripcion"
                                        error={form.errors.descripcion}
                                        value={form.data.descripcion}
                                        onChange={(e) => form.setData('descripcion', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        required
                                    />
                                </Grid>

                                {equipo_requiere_actualizacion && proyecto.tipo_formulario_convocatoria_id == 12 && (
                                    <Grid item md={12}>
                                        <Label required labelFor="equipo_para_modernizar" value="¿El equipo se requiere para modernizar uno ya existente en el área técnica?" />
                                        <SwitchMui
                                            id="equipo_para_modernizar"
                                            checked={form.data.equipo_para_modernizar}
                                            onChange={(e) => form.setData('equipo_para_modernizar', e.target.checked)}
                                            disabled={!proyecto?.allowed?.to_update}
                                            error={form.errors.equipo_para_modernizar}
                                        />
                                    </Grid>
                                )}

                                <Grid item md={12}>
                                    <Textarea
                                        label="Justificación de la necesidad: ¿por qué se requiere este producto o servicio?"
                                        id="justificacion"
                                        error={form.errors.justificacion}
                                        value={form.data.justificacion}
                                        onChange={(e) => form.setData('justificacion', e.target.value)}
                                        disabled={!proyecto?.allowed?.to_update}
                                        required
                                    />
                                </Grid>
                                {requiere_estudio_mercado == false && (
                                    <Grid item md={12}>
                                        <TextInput
                                            label="Valor total"
                                            id="valor_total"
                                            isCurrency={true}
                                            inputProps={{ min: 0, prefix: '$' }}
                                            value={form.data.valor_total}
                                            onChange={(e) => form.setData('valor_total', e.target.value)}
                                            disabled={!proyecto?.allowed?.to_update}
                                            error={form.errors.valor_total}
                                            required
                                        />
                                        <AlertMui>
                                            <strong>Importante:</strong> El uso presupuestal seleccionado no requiere de estudio de mercado. Por favor diligencie el VALOR TOTAL.
                                        </AlertMui>
                                    </Grid>
                                )}
                            </Grid>
                        </fieldset>

                        {rubro_presupuestal && <small className="flex items-center mt-14 text-app-700">{rubro_presupuestal.updated_at}</small>}

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <>
                                    {same_values_requiere_estudio_mercado ? (
                                        <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                            {method == 'POST' ? 'Agregar' : 'Modificar'} rubro presupuestal
                                        </PrimaryButton>
                                    ) : (
                                        form.data.convocatoria_presupuesto_id?.length > 0 && (
                                            <AlertMui severity="error" className="r-10">
                                                Hay algunos usos presupuestales que requieren de estudios de mercado y otros no, por favor seleccione primero los que si requieren. Aquellos usos
                                                presupuestales que no requieren estudios debe agruparlos en otro formulario.
                                            </AlertMui>
                                        )
                                    )}
                                </>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                            <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)} className={!same_values_requiere_estudio_mercado ? '!ml-2 w-full' : ''}>
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

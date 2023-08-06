import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Chip, Grid, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

const Form = ({
    is_super_admin,
    method = '',
    setDialogStatus,
    convocatoria,
    proyecto,
    rubro_presupuestal,
    segundo_grupo_presupuestal,
    tercer_grupo_presupuestal,
    usos_presupuestales,
    conceptos_viaticos,
}) => {
    const [array_tecer_grupo_presupuestal, setArrayTecerGrupoPresupuestal] = useState([])
    const [array_usos_presupuestales, setArrayUsosPresupuestales] = useState([])
    const [requiere_estudio_mercado, setRequiereEstudioMercado] = useState(true)
    const [codigo_segundo_grupo_presupuestal, setCodigoSegundoGrupoPresupuestal] = useState('')
    const [same_values_requiere_estudio_mercado, setSameValuesRequiereEstudioMercado] = useState(false)
    const [modificar_usos_presupuestales, setModificarUsosPresupuestales] = useState(false)

    const form = useForm({
        segundo_grupo_presupuestal_id: null,
        tercer_grupo_presupuestal_id: null,
        convocatoria_presupuesto_id: rubro_presupuestal?.convocatoria_proyecto_rubros_presupuestales.map((item) => item.id),
        descripcion: rubro_presupuestal?.descripcion ?? '',
        justificacion: rubro_presupuestal?.justificacion ?? '',
        valor_total: rubro_presupuestal?.valor_total ?? '',
        concepto_viaticos: rubro_presupuestal?.concepto_viaticos ?? '',
    })

    useEffect(() => {
        if (form.data.segundo_grupo_presupuestal_id) {
            setRequiereEstudioMercado(true)
            setArrayTecerGrupoPresupuestal([])
            setArrayUsosPresupuestales([])

            setTimeout(() => {
                const filtered_tecer_grupo_presupuestal = tercer_grupo_presupuestal.filter((item) => item.segundo_grupo_presupuestal_id == form.data.segundo_grupo_presupuestal_id)
                setArrayTecerGrupoPresupuestal(filtered_tecer_grupo_presupuestal)
            }, 500)
        }
    }, [form.data.segundo_grupo_presupuestal_id])

    useEffect(() => {
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

    useEffect(() => {
        if (form.data.convocatoria_presupuesto_id) {
            setSameValuesRequiereEstudioMercado(
                array_usos_presupuestales
                    .filter((item) => form.data.convocatoria_presupuesto_id?.includes(item.value))
                    .every(
                        (item) =>
                            item.requiere_estudio_mercado ===
                            array_usos_presupuestales.find((item) => item.value == form.data.convocatoria_presupuesto_id[form.data.convocatoria_presupuesto_id.length - 1])?.requiere_estudio_mercado,
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
        }
    }, [form.data.convocatoria_presupuesto_id])

    useEffect(() => {
        if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado === true) {
            setRequiereEstudioMercado(true)
        } else if (rubro_presupuestal && rubro_presupuestal.convocatoria_proyecto_rubros_presupuestales[0]?.requiere_estudio_mercado === false) {
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
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            {!modificar_usos_presupuestales && (
                                <>
                                    <div className={`${array_tecer_grupo_presupuestal.length == 0 ? 'mb-[13.8rem]' : 'mb-0'}`}>
                                        <Label required labelFor="segundo_grupo_presupuestal_id" value="Rubro concepto interno SENA" />
                                        <Autocomplete
                                            id="segundo_grupo_presupuestal_id"
                                            options={segundo_grupo_presupuestal}
                                            selectedValue={form.data.segundo_grupo_presupuestal_id}
                                            onChange={(e, newValue) => form.setData('segundo_grupo_presupuestal_id', newValue.value)}
                                            error={form.errors.segundo_grupo_presupuestal_id}
                                            placeholder="Seleccione una opción"
                                            required
                                        />
                                    </div>

                                    {array_tecer_grupo_presupuestal.length > 0 && (
                                        <div className={`mt-8 ${array_usos_presupuestales.length == 0 ? 'mb-[7rem]' : 'mb-0'}`}>
                                            <Label required labelFor="tercer_grupo_presupuestal_id" value="Rubro concepto ministerio de hacienda" />
                                            <Autocomplete
                                                id="tercer_grupo_presupuestal_id"
                                                options={array_tecer_grupo_presupuestal}
                                                selectedValue={form.data.tercer_grupo_presupuestal_id}
                                                onChange={(e, newValue) => form.setData('tercer_grupo_presupuestal_id', newValue.value)}
                                                error={form.errors.tercer_grupo_presupuestal_id}
                                                placeholder="Seleccione una opción"
                                                required
                                            />
                                        </div>
                                    )}

                                    {array_usos_presupuestales.length > 0 && (
                                        <div className="mt-8">
                                            <Label required labelFor="convocatoria_presupuesto_id" value="Usos presupuestales" />
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
                                                error={form.errors.convocatoria_presupuesto_id}
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {method === 'PUT' && (
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
                            )}

                            {requiere_estudio_mercado == false && (
                                <>
                                    <div className="mt-10">
                                        <TextInput
                                            label="Valor total"
                                            id="valor_total"
                                            isCurrency={true}
                                            inputProps={{ min: 0, prefix: '$' }}
                                            value={form.data.valor_total}
                                            onChange={(e) => form.setData('valor_total', e.target.value)}
                                            error={form.errors.valor_total}
                                            required
                                        />
                                        <AlertMui>
                                            <strong>Importante:</strong> El uso presupuestal seleccionado no requiere de estudio de mercado. Por favor diligencie el VALOR TOTAL.
                                        </AlertMui>
                                    </div>
                                </>
                            )}
                            <div className="mt-8">
                                <Textarea
                                    label="Describa los bienes o servicios a adquirir. Sea específico"
                                    id="descripcion"
                                    error={form.errors.descripcion}
                                    value={form.data.descripcion}
                                    onChange={(e) => form.setData('descripcion', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-8">
                                <Textarea
                                    label="Justificación de la necesidad: ¿por qué se requiere este producto o servicio?"
                                    id="justificacion"
                                    error={form.errors.justificacion}
                                    value={form.data.justificacion}
                                    onChange={(e) => form.setData('justificacion', e.target.value)}
                                    required
                                />
                            </div>

                            {proyecto.codigo_linea_programatica == 69 && (
                                <>
                                    {(form.data.concepto_viaticos ||
                                        codigo_segundo_grupo_presupuestal == '2041102' ||
                                        codigo_segundo_grupo_presupuestal == '2041101' ||
                                        codigo_segundo_grupo_presupuestal == '2041104') && (
                                        <div className="mt-8">
                                            <Label required labelFor="concepto_viaticos" value="Concepto" />
                                            <Autocomplete
                                                id="concepto_viaticos"
                                                options={conceptos_viaticos}
                                                selectedValue={form.data.concepto_viaticos}
                                                error={form.errors.concepto_viaticos}
                                                onChange={(e, newValue) => form.setData('concepto_viaticos', newValue.value)}
                                                placeholder="Seleccione una opción"
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}
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
                                        method == 'PUT' && (
                                            <AlertMui severity="error" className="r-10">
                                                Hay algunos usos presupuestales que requieren de estudios de mercado y otros no, por favor seleccione primero los que si requieren. Aquellos usos
                                                presupuestales que no requieren estudios debe agruparlos en otro formulario.
                                            </AlertMui>
                                        )
                                    )}

                                    <ButtonMui type="button" primary={false} onClick={() => setDialogStatus(false)} className={!same_values_requiere_estudio_mercado ? '!ml-2 w-full' : ''}>
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

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'

import { useForm } from '@inertiajs/react'
import { Grid, Paper } from '@mui/material'

const Form = ({ method = '', setDialogStatus, convocatoria, proyecto, analisis_riesgo, niveles_riesgo, tipos_riesgo, probabilidades_riesgo, impactos_riesgo, ...props }) => {
    const form = useForm({
        nivel: analisis_riesgo?.nivel ?? '',
        tipo: analisis_riesgo?.tipo ?? '',
        descripcion: analisis_riesgo?.descripcion ?? '',
        impacto: analisis_riesgo?.impacto ?? '',
        probabilidad: analisis_riesgo?.probabilidad ?? '',
        efectos: analisis_riesgo?.efectos ?? '',
        medidas_mitigacion: analisis_riesgo?.medidas_mitigacion ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            method == 'crear'
                ? form.post(route('convocatorias.proyectos.analisis-riesgos.store', [convocatoria.id, proyecto.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
                : form.put(route('convocatorias.proyectos.analisis-riesgos.update', [convocatoria.id, proyecto.id, analisis_riesgo.id]), {
                      onSuccess: () => setDialogStatus(false),
                      preserveScroll: true,
                  })
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">Modificar actividad</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <div className="mt-8">
                                <Autocomplete
                                    id="nivel"
                                    options={niveles_riesgo}
                                    selectedValue={form.data.nivel}
                                    onChange={(event, newValue) => form.setData('nivel', newValue.value)}
                                    error={form.errors.nivel}
                                    label="Nivel de riesgo"
                                    placeholder="Seleccione el nivel del riesgo"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="tipo"
                                    options={tipos_riesgo}
                                    selectedValue={form.data.tipo}
                                    onChange={(event, newValue) => form.setData('tipo', newValue.value)}
                                    error={form.errors.tipo}
                                    label="Tipo de riesgo"
                                    placeholder="Seleccione el tipo de riesgo"
                                    required
                                />
                                {form.data.tipo == 1 ? (
                                    <AlertMui>
                                        Es la probabilidad de variaciones en las condiciones del mercado como el precio, la calidad y la disponibilidad de los materiales e insumos, la competencia
                                        (oferta/demanda) del producto/servicios ofrecidos, la tasa de cambiaria y los asociados a la tecnología utilizada (obsolescencia).
                                    </AlertMui>
                                ) : form.data.tipo == 2 ? (
                                    <AlertMui>
                                        Es toda posible contingencia que pueda provocar pérdidas en el desarrollo del proyecto por causa de errores humanos, de errores tecnológicos, de procesos
                                        internos defectuosos o fallidos. Esta clase de riesgo es inherente a todos los sistemas y procesos realizados por humanos.
                                    </AlertMui>
                                ) : form.data.tipo == 3 ? (
                                    <AlertMui>
                                        Son los obstáculos legales o normativos que pueden afectar el desarrollo del proyecto. Por ejemplo: nuevos requisitos legales, cambios reglamentarios o
                                        gubernamentales directamente relacionados con el entorno que se desarrolla el proyecto, ausencia y/o deficiencia de documentación, errores en los contratos,
                                        incapacidad del proyecto de cumplir lo pactado.
                                    </AlertMui>
                                ) : (
                                    form.data.tipo == 4 && (
                                        <AlertMui>
                                            Es la probabilidad de incurrir en pérdidas originadas por la deficiencia en la planeación, procesos, controles y/o falta de idoneidad y competencia del
                                            personal. Por ejemplo: falta de planeación del proyecto, estructura organizacional incoherente, falta de liderazgo, falta de integración entre la dirección
                                            y la parte operativa y/o productiva, ineficiencia en la adaptación a los cambios del entorno, toma de decisiones por información incompleta.
                                        </AlertMui>
                                    )
                                )}
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    label="Descripción"
                                    id="descripcion"
                                    error={form.errors.descripcion}
                                    value={form.data.descripcion}
                                    onChange={(e) => form.setData('descripcion', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="probabilidad"
                                    options={probabilidades_riesgo}
                                    selectedValue={form.data.probabilidad}
                                    error={form.errors.probabilidad}
                                    onChange={(evente, newValue) => form.setData('probabilidad', newValue.value)}
                                    label="Probabilidad"
                                    placeholder="Seleccione la probabilidad"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Autocomplete
                                    id="impacto"
                                    options={impactos_riesgo}
                                    selectedValue={form.data.impacto}
                                    error={form.errors.impacto}
                                    onChange={(event, newValue) => form.setData('impacto', newValue.value)}
                                    label="Impacto"
                                    placeholder="Seleccione la probabilidad"
                                    required
                                />
                            </div>

                            <div className="mt-8">
                                <Textarea label="Efectos" id="efectos" error={form.errors.efectos} value={form.data.efectos} onChange={(e) => form.setData('efectos', e.target.value)} required />
                            </div>

                            <div className="mt-8">
                                <Textarea
                                    label="Medidas de mitigación"
                                    id="medidas_mitigacion"
                                    error={form.errors.medidas_mitigacion}
                                    onChange={(e) => form.setData('medidas_mitigacion', e.target.value)}
                                    value={form.data.medidas_mitigacion}
                                    required
                                />
                            </div>
                        </fieldset>
                        {analisis_riesgo && <small>{analisis_riesgo.updated_at}</small>}
                        <div className="flex items-center justify-between mt-14 py-4 ">
                            {proyecto.allowed.to_update ? (
                                <>
                                    <PrimaryButton disabled={form.processing} className="mr-2 ml-auto" type="submit">
                                        {method == 'crear' ? 'Añadir' : 'Modificar'} análisis de riesgo
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

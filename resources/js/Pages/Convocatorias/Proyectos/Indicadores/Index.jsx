import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'
import StepperMui from '@/Components/Stepper'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const Indicadores = ({ auth, convocatoria, proyecto, evaluacion, ...props }) => {
    const form = useForm({
        productividad_beneficiaros:
            proyecto.proyecto_formulario8_linea66?.productividad_beneficiaros ??
            proyecto.proyecto_formulario7_linea23?.productividad_beneficiaros ??
            proyecto.proyecto_formulario9_linea23?.productividad_beneficiaros ??
            '',
        generacion_empleo_beneficiarios:
            proyecto.proyecto_formulario8_linea66?.generacion_empleo_beneficiarios ??
            proyecto.proyecto_formulario7_linea23?.generacion_empleo_beneficiarios ??
            proyecto.proyecto_formulario9_linea23?.generacion_empleo_beneficiarios ??
            '',
        creacion_nuevos_desarrollos:
            proyecto.proyecto_formulario8_linea66?.creacion_nuevos_desarrollos ??
            proyecto.proyecto_formulario7_linea23?.creacion_nuevos_desarrollos ??
            proyecto.proyecto_formulario9_linea23?.creacion_nuevos_desarrollos ??
            '',
        generacion_conocimientos_beneficiarios:
            proyecto.proyecto_formulario8_linea66?.generacion_conocimientos_beneficiarios ??
            proyecto.proyecto_formulario7_linea23?.generacion_conocimientos_beneficiarios ??
            proyecto.proyecto_formulario9_linea23?.generacion_conocimientos_beneficiarios ??
            proyecto.proyecto_formulario6_linea82?.generacion_conocimientos_beneficiarios ??
            '',
        generacion_valor_beneficiarios:
            proyecto.proyecto_formulario8_linea66?.generacion_valor_beneficiarios ??
            proyecto.proyecto_formulario7_linea23?.generacion_valor_beneficiarios ??
            proyecto.proyecto_formulario9_linea23?.generacion_valor_beneficiarios ??
            proyecto.proyecto_formulario6_linea82?.generacion_valor_beneficiarios ??
            '',
        fortalecimiento_programas_formacion:
            proyecto.proyecto_formulario8_linea66?.fortalecimiento_programas_formacion ??
            proyecto.proyecto_formulario7_linea23?.fortalecimiento_programas_formacion ??
            proyecto.proyecto_formulario9_linea23?.fortalecimiento_programas_formacion ??
            proyecto.proyecto_formulario6_linea82?.fortalecimiento_programas_formacion ??
            '',
        transferencia_tecnologias:
            proyecto.proyecto_formulario8_linea66?.transferencia_tecnologias ??
            proyecto.proyecto_formulario7_linea23?.transferencia_tecnologias ??
            proyecto.proyecto_formulario9_linea23?.transferencia_tecnologias ??
            proyecto.proyecto_formulario6_linea82?.transferencia_tecnologias ??
            '',
        calidad_formacion:
            proyecto.proyecto_formulario8_linea66?.calidad_formacion ??
            proyecto.proyecto_formulario7_linea23?.calidad_formacion ??
            proyecto.proyecto_formulario9_linea23?.calidad_formacion ??
            proyecto.proyecto_formulario6_linea82?.calidad_formacion ??
            '',
        impacto_ambiental_proyectos:
            proyecto.proyecto_formulario8_linea66?.impacto_ambiental_proyectos ??
            proyecto.proyecto_formulario7_linea23?.impacto_ambiental_proyectos ??
            proyecto.proyecto_formulario9_linea23?.impacto_ambiental_proyectos ??
            proyecto.proyecto_formulario6_linea82?.impacto_ambiental_proyectos ??
            '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.indicadores.store', [convocatoria.id, proyecto.id]))
        }
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.indicadores.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
                    { [column]: data ? data : form.data[column], is_array: Array.isArray(form.data[column]) },
                    {
                        onError: (resp) => console.log(resp),
                        onFinish: () => console.log('Request finished'),
                        preserveScroll: true,
                    },
                )
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <p className="text-center">
                    Describa de forma general (en los que aplique) el aporte del proyecto a los indicadores de los proyectos relacionados en el artículo 5 del acuerdo 003 del 02 de febrero de 2012 (
                    <strong>Mínimo debe relacionar uno</strong>).
                </p>

                <form onSubmit={submit}>
                    <fieldset className="p-8 divide-y" disabled={proyecto.allowed.to_update ? false : true}>
                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="productividad_beneficiaros" value="a) Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto" />
                            </div>
                            <div>
                                <Textarea
                                    id="productividad_beneficiaros"
                                    error={form.errors.productividad_beneficiaros}
                                    value={form.data.productividad_beneficiaros}
                                    onChange={(e) => form.setData('productividad_beneficiaros', e.target.value)}
                                    onBlur={() => syncColumnLong('productividad_beneficiaros', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="generacion_empleo_beneficiarios" value="b) Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto" />
                            </div>
                            <div>
                                <Textarea
                                    id="generacion_empleo_beneficiarios"
                                    error={form.errors.generacion_empleo_beneficiarios}
                                    value={form.data.generacion_empleo_beneficiarios}
                                    onChange={(e) => form.setData('generacion_empleo_beneficiarios', e.target.value)}
                                    onBlur={() => syncColumnLong('generacion_empleo_beneficiarios', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label
                                    className="mb-4"
                                    labelFor="creacion_nuevos_desarrollos"
                                    value=" c) Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios"
                                />
                            </div>
                            <div>
                                <Textarea
                                    id="creacion_nuevos_desarrollos"
                                    error={form.errors.creacion_nuevos_desarrollos}
                                    value={form.data.creacion_nuevos_desarrollos}
                                    onChange={(e) => form.setData('creacion_nuevos_desarrollos', e.target.value)}
                                    onBlur={() => syncColumnLong('creacion_nuevos_desarrollos', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label
                                    className="mb-4"
                                    labelFor="generacion_conocimientos_beneficiarios"
                                    value="d) Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto"
                                />
                            </div>
                            <div>
                                <Textarea
                                    id="generacion_conocimientos_beneficiarios"
                                    error={form.errors.generacion_conocimientos_beneficiarios}
                                    value={form.data.generacion_conocimientos_beneficiarios}
                                    onChange={(e) => form.setData('generacion_conocimientos_beneficiarios', e.target.value)}
                                    onBlur={() => syncColumnLong('generacion_conocimientos_beneficiarios', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="generacion_valor_beneficiarios" value="e) Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto" />
                            </div>
                            <div>
                                <Textarea
                                    id="generacion_valor_beneficiarios"
                                    error={form.errors.generacion_valor_beneficiarios}
                                    value={form.data.generacion_valor_beneficiarios}
                                    onChange={(e) => form.setData('generacion_valor_beneficiarios', e.target.value)}
                                    onBlur={() => syncColumnLong('generacion_valor_beneficiarios', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="fortalecimiento_programas_formacion" value="f) Fortalecimiento de programas de formación del Sena" />
                            </div>
                            <div>
                                <Textarea
                                    id="fortalecimiento_programas_formacion"
                                    error={form.errors.fortalecimiento_programas_formacion}
                                    value={form.data.fortalecimiento_programas_formacion}
                                    onChange={(e) => form.setData('fortalecimiento_programas_formacion', e.target.value)}
                                    onBlur={() => syncColumnLong('fortalecimiento_programas_formacion', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="transferencia_tecnologias" value="g) Transferencia de tecnologías al Sena y a los sectores productivos relacionados" />
                            </div>
                            <div>
                                <Textarea
                                    id="transferencia_tecnologias"
                                    error={form.errors.transferencia_tecnologias}
                                    value={form.data.transferencia_tecnologias}
                                    onChange={(e) => form.setData('transferencia_tecnologias', e.target.value)}
                                    onBlur={() => syncColumnLong('transferencia_tecnologias', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="calidad_formacion" value="h) Cobertura, calidad y pertinencia de la formación." />
                            </div>
                            <div>
                                <Textarea
                                    id="calidad_formacion"
                                    error={form.errors.calidad_formacion}
                                    value={form.data.calidad_formacion}
                                    onChange={(e) => form.setData('calidad_formacion', e.target.value)}
                                    onBlur={() => syncColumnLong('calidad_formacion', form)}
                                />
                            </div>
                        </div>

                        <div className="py-24 grid grid-cols-2">
                            <div>
                                <Label className="mb-4" labelFor="impacto_ambiental_proyectos" value="i) Impacto ambiental de Proyectos de Innovación e investigación aplicada. " />
                            </div>
                            <div>
                                <Textarea
                                    id="impacto_ambiental_proyectos"
                                    error={form.errors.impacto_ambiental_proyectos}
                                    value={form.data.impacto_ambiental_proyectos}
                                    onChange={(e) => form.setData('impacto_ambiental_proyectos', e.target.value)}
                                    onBlur={() => syncColumnLong('impacto_ambiental_proyectos', form)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto.allowed.to_update ? (
                                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                    Guardar
                                </PrimaryButton>
                            ) : (
                                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
                            )}
                        </div>
                    </fieldset>
                </form>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Indicadores

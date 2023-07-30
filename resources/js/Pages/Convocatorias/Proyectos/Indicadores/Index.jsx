import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import Textarea from '@/Components/Textarea'
import StepperMui from '@/Components/Stepper'

import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const Indicadores = ({ auth, convocatoria, proyecto_linea_66, evaluacion, ...props }) => {
    const form = useForm({
        productividad_beneficiaros: proyecto_linea_66.productividad_beneficiaros ? proyecto_linea_66.productividad_beneficiaros : '',
        generacion_empleo_beneficiarios: proyecto_linea_66.generacion_empleo_beneficiarios ? proyecto_linea_66.generacion_empleo_beneficiarios : '',
        creacion_nuevos_desarrollos: proyecto_linea_66.creacion_nuevos_desarrollos ? proyecto_linea_66.creacion_nuevos_desarrollos : '',
        generacion_conocimientos_beneficiarios: proyecto_linea_66.generacion_conocimientos_beneficiarios ? proyecto_linea_66.generacion_conocimientos_beneficiarios : '',
        generacion_valor_beneficiarios: proyecto_linea_66.generacion_valor_beneficiarios ? proyecto_linea_66.generacion_valor_beneficiarios : '',
        fortalecimiento_programas_formacion: proyecto_linea_66.fortalecimiento_programas_formacion ? proyecto_linea_66.fortalecimiento_programas_formacion : '',
        transferencia_tecnologias: proyecto_linea_66.transferencia_tecnologias ? proyecto_linea_66.transferencia_tecnologias : '',
        calidad_formacion: proyecto_linea_66.calidad_formacion ? proyecto_linea_66.calidad_formacion : '',
        impacto_ambiental_proyectos: proyecto_linea_66.impacto_ambiental_proyectos ? proyecto_linea_66.impacto_ambiental_proyectos : '',
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto_linea_66.proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos-linea-66.indicadores.store', [convocatoria.id, proyecto_linea_66.id]))
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto_linea_66.proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={12} className="!mb-20">
                <p className="text-center">
                    Describa de forma general (en los que aplique) el aporte del proyecto a los indicadores de los proyectos relacionados en el artículo 5 del acuerdo 003 del 02 de febrero de 2012 (
                    <strong>Mínimo debe relacionar uno</strong>).
                </p>

                <form onSubmit={submit}>
                    <fieldset className="p-8 divide-y" disabled={proyecto_linea_66.proyecto.allowed.to_update ? false : true}>
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
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-14 py-4">
                            {proyecto_linea_66.proyecto.allowed.to_update ? (
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

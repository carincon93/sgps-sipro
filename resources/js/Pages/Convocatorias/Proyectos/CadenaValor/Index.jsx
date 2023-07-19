import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Label from '@/Components/Label'
import Textarea from '@/Components/Textarea'
import PrimaryButton from '@/Components/PrimaryButton'

import SwipeRightOutlinedIcon from '@mui/icons-material/SwipeRightOutlined'

import ScrollBooster from 'scrollbooster'
import { checkRole } from '@/Utils'
import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import ToolTipMui from '@/Components/Tooltip'

const CadenaValor = ({ auth, convocatoria, proyecto, objetivos, objetivoGeneral, productos, ...props }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const form = useForm({
        propuesta_sostenibilidad: proyecto.propuesta_sostenibilidad,
        propuesta_sostenibilidad_social: proyecto.propuesta_sostenibilidad_social,
        propuesta_sostenibilidad_ambiental: proyecto.propuesta_sostenibilidad_ambiental,
        propuesta_sostenibilidad_financiera: proyecto.propuesta_sostenibilidad_financiera,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.put(route('convocatorias.proyectos.propuesta-sostenibilidad', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    useEffect(() => {
        google.charts.setOnLoadCallback(drawChart)
    }, [])

    const drawChart = () => {
        var data = new google.visualization.DataTable()
        data.addColumn('string', 'Name')
        data.addColumn('string', 'Manager')
        data.addColumn('string', 'ToolTip')

        var options = {
            nodeClass: 'bg-app-500 text-white shadow',
            selectedNodeClass: 'bg-app-700',
            allowHtml: true,
            size: 'small',
        }

        // For each orgchart box, provide the name, manager, and tooltip to show.

        data.addRows([[{ v: 'Objetivo general', f: '<strong>Objetivo general</strong><div>' + objetivoGeneral + '</div>' }, '', 'Objetivo general']])

        objetivos.map((objetivo) => {
            data.addRows([[{ v: 'Objetivo específico ' + objetivo.numero, f: '<strong>Objetivo específico ' + objetivo.numero + '</strong><div>' + objetivo.descripcion ? objetivo.descripcion : 'Sin descripción registrada aún' + '</div>' }, 'Objetivo general', 'Objetivo específico ' + objetivo.numero]])
        })

        let totalProyecto = 0

        productos.map((producto) => {
            data.addRows([[{ v: producto.v, f: '<strong>Producto</strong><div>' + producto.f + '</div>' }, producto.fkey, producto.tooltip]])
            producto.actividades.map((actividad) => {
                data.addRows([
                    [
                        {
                            v: 'act' + producto.v + actividad.id,
                            f: '<strong>Actividad</strong><div>' + actividad.descripcion + '</div><div><strong>Roles:</strong><ul className="list-inside">' + actividad.proyecto_roles_sennova.map((proyectoRol) => '<li>' + proyectoRol.convocatoria_rol_sennova.rol_sennova.nombre + '</li>') + '</ul></div>',
                        },
                        producto.v,
                        actividad.descripcion,
                    ],
                ])
                totalProyecto += actividad.costo_actividad
                data.addRows([[{ v: 'cost' + producto.v + actividad.id, f: '<strong>Costo</strong><div>$ ' + new Intl.NumberFormat('de-DE').format(!isNaN(actividad.costo_actividad) ? actividad.costo_actividad : 0) + ' COP</div>' }, 'act' + producto.v + actividad.id, new Intl.NumberFormat('de-DE').format(!isNaN(actividad.costo_actividad) ? actividad.costo_actividad : 0)]])
            })
        })

        // Create the chart.
        var chart = new google.visualization.OrgChart(document.getElementById('orgchart_div'))
        if (typeof chart.draw === 'function') {
            // Draw the chart, setting the allowHtml option to true for the tooltips.
            chart.draw(data, options)

            new ScrollBooster({
                viewport: document.getElementById('orgchart_div'),
                scrollMode: 'transform',
            })
        }

        console.log(totalProyecto)
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12}>
                <h1 className="text-3xl mt-24 text-center">Propuesta de sostenibilidad</h1>

                {isSuperAdmin || proyecto.mostrar_recomendaciones ? (
                    <>
                        {proyecto.evaluaciones.map((evaluacion, i) =>
                            isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado) ? (
                                <ToolTipMui
                                    key={i}
                                    title={
                                        <div>
                                            <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                            {evaluacion.idi_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.cadena_valor_comentario ? evaluacion.idi_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                            ) : evaluacion.cultura_innovacion_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.cadena_valor_comentario ? evaluacion.cultura_innovacion_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                            ) : evaluacion.ta_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.cadena_valor_comentario ? evaluacion.ta_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                            ) : evaluacion.tp_evaluacion ? (
                                                <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.cadena_valor_comentario ? evaluacion.tp_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                            ) : (
                                                evaluacion.servicio_tecnologico_evaluacion && (
                                                    <>
                                                        <hr className="mt-10 mb-10 border-black-200" />
                                                        <h1 className="font-black">Propuesta de sostenibilidad</h1>

                                                        <p className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.propuesta_sostenibilidad_comentario ? 'Recomendación: ' + evaluacion.servicio_tecnologico_evaluacion.propuesta_sostenibilidad_comentario : 'Sin recomendación'}</p>

                                                        <hr className="mt-10 mb-10 border-black-200" />
                                                        <h1 className="font-black">Impactos</h1>

                                                        <ul className="list-disc pl-4">
                                                            <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_ambiental_comentario ? 'Recomendación impacto ambiental: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_ambiental_comentario : 'Sin recomendación'}</li>
                                                            <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_social_centro_comentario ? 'Recomendación impacto social en el centro de formación: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_social_centro_comentario : 'Sin recomendación'}</li>
                                                            <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_social_productivo_comentario ? 'Recomendación impacto social en el sector productivo: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_social_productivo_comentario : 'Sin recomendación'}</li>
                                                            <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_tecnologico_comentario ? 'Recomendación impacto tecnológico: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_tecnologico_comentario : 'Sin recomendación'}</li>
                                                        </ul>
                                                    </>
                                                )
                                            )}
                                        </div>
                                    }
                                >
                                    Evaluación {i + 1}
                                </ToolTipMui>
                            ) : null,
                        )}
                        {proyecto.evaluaciones.length === 0 ? <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p> : null}
                    </>
                ) : null}

                {proyecto.codigo_linea_programatica == 70 && (
                    <AlertMui hiddenIcon={true} className="text-center my-24">
                        A continuación, plantee las acciones concretas que contribuirán a la sostenibilidad financiera de la TecnoAcademia y su aporte a la sostenibilidad ambiental y social del territorio.
                    </AlertMui>
                )}

                <form onSubmit={submit}>
                    <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                        {proyecto.codigo_linea_programatica != 70 ? (
                            <div className="mt-8">
                                {proyecto.codigo_linea_programatica == 68 ? (
                                    <AlertMui className="mb-6" hiddenIcon={true}>
                                        Se deben mencionar aquellos factores que pueden comprometer la viabilidad, desarrollo de los objetivos y resultados del proyecto a través del tiempo.
                                        <br />
                                        Para definir la propuesta de sostenibilidad se deben tener en cuenta los impactos definidos en el árbol de objetivos (ambiental, social - en el centro de formación, social - en el sector productivo, tecnológico)
                                    </AlertMui>
                                ) : (
                                    <AlertMui className="mb-2" hiddenIcon={true}>
                                        Identificar los efectos que tiene el desarrollo del proyecto de investigación ya sea positivos o negativos. Se recomienda establecer las acciones pertinentes para mitigar los impactos negativos ambientales identificados y anexar el respectivo permiso ambiental cuando aplique. Tener en cuenta si aplica el decreto 1376 de 2013.
                                    </AlertMui>
                                )}
                                <Textarea label="Propuesta de sostenibilidad" id="propuesta_sostenibilidad" error={form.errors.propuesta_sostenibilidad} value={form.data.propuesta_sostenibilidad} onChange={(e) => form.setData('propuesta_sostenibilidad', e.target.value)} required />
                            </div>
                        ) : (
                            proyecto.codigo_linea_programatica == 70 && (
                                <>
                                    <div className="mt-8">
                                        <Textarea label="Propuesta de sostenibilidad social" id="propuesta_sostenibilidad_social" error={form.errors.propuesta_sostenibilidad_social} value={form.data.propuesta_sostenibilidad_social} onChange={(e) => form.setData('propuesta_sostenibilidad_social', e.target.value)} required />
                                    </div>
                                    <div className="mt-8">
                                        <Textarea label="Propuesta de sostenibilidad ambiental" id="propuesta_sostenibilidad_ambiental" error={form.errors.propuesta_sostenibilidad_ambiental} value={form.data.propuesta_sostenibilidad_ambiental} onChange={(e) => form.setData('propuesta_sostenibilidad_ambiental', e.target.value)} required />
                                    </div>
                                    <div className="mt-8">
                                        <Textarea label="Propuesta de sostenibilidad financiera" id="propuesta_sostenibilidad_financiera" error={form.errors.propuesta_sostenibilidad_financiera} value={form.data.propuesta_sostenibilidad_financiera} onChange={(e) => form.setData('propuesta_sostenibilidad_financiera', e.target.value)} required />
                                    </div>
                                </>
                            )
                        )}
                    </fieldset>
                    <div className="flex items-center justify-between mt-14 py-4">
                        <small className="flex items-center text-app-700">{proyecto.updated_at}</small>
                        {proyecto.allowed.to_update ? (
                            <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                Guardar propuesta de sostenibilidad
                            </PrimaryButton>
                        ) : (
                            <span className="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                        )}
                    </div>
                </form>
            </Grid>

            <Grid item md={12}>
                <hr className="mb-20 mt-20" />

                <h1 className="text-3xl m-24 text-center">Cadena de valor</h1>

                <AlertMui hiddenIcon={true} className="text-center my-10">
                    <SwipeRightOutlinedIcon className="!w-16 !h-16" />
                    <p>Para que pueda moverse fácilmente haga un clic sostenido sobre el gráfico de la cadena de valor y arrastre hacia cualquier dirección</p>
                </AlertMui>

                {productos.length == 0 && (
                    <AlertMui hiddenIcon={true}>
                        No ha generado productos por lo tanto tiene la cadena de valor incompleta.
                        <br />
                        Por favor realice los siguientes pasos:
                        <div>
                            1. Diríjase a <strong>Productos</strong> y genere los productos correspondientes
                        </div>
                        <div>
                            2. Luego diríjase a <strong>Actividades</strong> y asocie los productos y rubros correspondientes. De esta manera completa la cadena de valor.
                        </div>
                    </AlertMui>
                )}
                <div className="mt-10">
                    <div id="orgchart_div" className="overflow-hidden" style={{ margin: '0 -100px' }} />
                </div>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default CadenaValor

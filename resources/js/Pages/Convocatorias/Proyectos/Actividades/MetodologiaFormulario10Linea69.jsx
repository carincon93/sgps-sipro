import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { router, useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

const MetodologiaFormulario10Linea69 = ({ convocatoria, proyecto, municipios, regionales, areas_cualificacion_mnc }) => {
    const form_metodologia_proyecto_formulario_10_linea_69 = useForm({
        metodologia: proyecto.proyecto_formulario10_linea69?.metodologia,
        metodologia_local: proyecto.proyecto_formulario10_linea69?.metodologia_local,
        areas_cualificacion_mnc: proyecto.proyecto_formulario10_linea69?.areas_cualificacion_mnc,
        talentos_otros_departamentos: proyecto.proyecto_formulario10_linea69?.talentos_otros_departamentos,
        estrategia_atencion_talentos: proyecto.proyecto_formulario10_linea69?.estrategia_atencion_talentos,
        acciones_mejoramiento_idic: proyecto.proyecto_formulario10_linea69?.acciones_mejoramiento_idic,
        municipios_beneficiados_vigencia_anterior: proyecto.proyecto_formulario10_linea69?.municipios_beneficiados_vigencia_anterior,
        beneficio_municipios_vigencia_anterior: proyecto.proyecto_formulario10_linea69?.beneficio_municipios_vigencia_anterior,
        municipios_beneficiados_vigencia_actual: proyecto.proyecto_formulario10_linea69?.municipios_beneficiados_vigencia_actual,
        estrategia_articulacion_pbts: proyecto.proyecto_formulario10_linea69?.estrategia_articulacion_pbts,
        numero_empresas_atendidas: proyecto.proyecto_formulario10_linea69?.numero_empresas_atendidas,
        analisis_impacto_sector_empresarial: proyecto.proyecto_formulario10_linea69?.analisis_impacto_sector_empresarial,
        numero_emprendedores_atendidos: proyecto.proyecto_formulario10_linea69?.numero_emprendedores_atendidos,
        analisis_impacto_regional: proyecto.proyecto_formulario10_linea69?.analisis_impacto_regional,
        gestion_alianzas_estrategicas: proyecto.proyecto_formulario10_linea69?.gestion_alianzas_estrategicas,
        estrategias_visibilizacion: proyecto.proyecto_formulario10_linea69?.estrategias_visibilizacion,
        integracion_plan_tecnologico: proyecto.proyecto_formulario10_linea69?.integracion_plan_tecnologico,
        estrategias_productividad_agropecuaria: proyecto.proyecto_formulario10_linea69?.estrategias_productividad_agropecuaria,
        acciones_estrategia_campesena: proyecto.proyecto_formulario10_linea69?.acciones_estrategia_campesena,
        estrategia_campesena_campesinos: proyecto.proyecto_formulario10_linea69?.estrategia_campesena_campesinos,
        acciones_fortalecimiento_economia_popular: proyecto.proyecto_formulario10_linea69?.acciones_fortalecimiento_economia_popular,
        acciones_fortalecimiento_idi: proyecto.proyecto_formulario10_linea69?.acciones_fortalecimiento_idi,
    })

    const submitMetodologiaProyectoFormulario10Linea69 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form_metodologia_proyecto_formulario_10_linea_69.put(route('convocatorias.proyectos.metodologia-proyecto-formulario-10-linea-69', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const syncColumnLong = async (column, form, data) => {
        if (typeof column !== 'undefined' && typeof form !== 'undefined' && proyecto?.allowed?.to_update) {
            try {
                await router.put(
                    route('convocatorias.proyectos.metodologia.updateLongColumn', [convocatoria.id, proyecto?.id, column]),
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
        <form onSubmit={submitMetodologiaProyectoFormulario10Linea69} className="!mt-20">
            <Grid container rowSpacing={20}>
                <Grid item md={12}>
                    <Label required className="mb-4" labelFor="metodologia" value="Metodología General implementada por el Hub de Innovación" />

                    <Textarea
                        id="metodologia"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.metodologia}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.metodologia}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('metodologia', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('metodologia', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="metodologia_local"
                        value={`A continuación, describa la metodología que será implementada en el ${convocatoria.year} en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Hubs de Innovación:`}
                    />

                    <Textarea
                        id="metodologia_local"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.metodologia_local}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.metodologia_local}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('metodologia_local', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('metodologia_local', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="areas_cualificacion_mnc" value="Temáticas según el Marco Nacional de Cualificación de los proyectos a acompañar:" />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="areas_cualificacion_mnc"
                        bdValues={form_metodologia_proyecto_formulario_10_linea_69.data.areas_cualificacion_mnc}
                        options={areas_cualificacion_mnc}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_metodologia_proyecto_formulario_10_linea_69.setData((prevData) => ({
                                ...prevData,
                                areas_cualificacion_mnc: selected_values,
                            }))
                        }}
                        disabled={!proyecto?.allowed?.to_update}
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.areas_cualificacion_mnc}
                        label="Seleccione una o varias opciones"
                        required
                        onBlur={() => syncColumnLong('areas_cualificacion_mnc', form_metodologia_proyecto_formulario_10_linea_69)}
                    />
                </Grid>
                <Grid item md={6}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="talentos_otros_departamentos"
                        value={`¿Planea en el ${convocatoria.year} realizar acciones que beneficien talentos en otros departamentos?`}
                    />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="talentos_otros_departamentos"
                        bdValues={form_metodologia_proyecto_formulario_10_linea_69.data.talentos_otros_departamentos}
                        options={regionales}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_metodologia_proyecto_formulario_10_linea_69.setData((prevData) => ({
                                ...prevData,
                                talentos_otros_departamentos: selected_values,
                            }))
                        }}
                        disabled={!proyecto?.allowed?.to_update}
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.talentos_otros_departamentos}
                        label="Seleccione una o varias opciones"
                        required
                        onBlur={() => syncColumnLong('talentos_otros_departamentos', form_metodologia_proyecto_formulario_10_linea_69)}
                    />
                </Grid>
                <Grid item md={12}>
                    <Label required className="mb-4" labelFor="estrategia_atencion_talentos" value="Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados" />

                    <Textarea
                        id="estrategia_atencion_talentos"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.estrategia_atencion_talentos}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.estrategia_atencion_talentos}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('estrategia_atencion_talentos', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('estrategia_atencion_talentos', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_mejoramiento_idic"
                        value={`Describa las acciones que serán realizadas en el ${convocatoria.year} para cotriuir al mejoramiento del IDIC del Departamento, desde el  Hub de Innovación`}
                    />

                    <Textarea
                        id="acciones_mejoramiento_idic"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.acciones_mejoramiento_idic}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.acciones_mejoramiento_idic}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('acciones_mejoramiento_idic', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_mejoramiento_idic', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
                <Grid item md={6}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="municipios_beneficiados_vigencia_anterior"
                        value={`¿Planea en el ${convocatoria.year} realizar acciones que beneficien talentos en otros departamentos?`}
                    />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="municipios_beneficiados_vigencia_anterior"
                        bdValues={form_metodologia_proyecto_formulario_10_linea_69.data.municipios_beneficiados_vigencia_anterior}
                        options={municipios}
                        isGroupable={true}
                        groupBy={(option) => option.group}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_metodologia_proyecto_formulario_10_linea_69.setData((prevData) => ({
                                ...prevData,
                                municipios_beneficiados_vigencia_anterior: selected_values,
                            }))
                        }}
                        disabled={!proyecto?.allowed?.to_update}
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.municipios_beneficiados_vigencia_anterior}
                        label="Seleccione una o varias opciones"
                        required
                        onBlur={() => syncColumnLong('municipios_beneficiados_vigencia_anterior', form_metodologia_proyecto_formulario_10_linea_69)}
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="beneficio_municipios_vigencia_anterior"
                        value="Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados"
                    />

                    <Textarea
                        id="beneficio_municipios_vigencia_anterior"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.beneficio_municipios_vigencia_anterior}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.beneficio_municipios_vigencia_anterior}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('beneficio_municipios_vigencia_anterior', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('beneficio_municipios_vigencia_anterior', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="municipios_beneficiados_vigencia_actual" value={`Nombre de los municipios que planea serán beneficiados en el ${convocatoria.year}`} />
                </Grid>
                <Grid item md={6}>
                    <SelectMultiple
                        id="municipios_beneficiados_vigencia_actual"
                        bdValues={form_metodologia_proyecto_formulario_10_linea_69.data.municipios_beneficiados_vigencia_actual}
                        options={municipios}
                        isGroupable={true}
                        groupBy={(option) => option.group}
                        onChange={(event, newValue) => {
                            const selected_values = newValue.map((option) => option.value)
                            form_metodologia_proyecto_formulario_10_linea_69.setData((prevData) => ({
                                ...prevData,
                                municipios_beneficiados_vigencia_actual: selected_values,
                            }))
                        }}
                        disabled={!proyecto?.allowed?.to_update}
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.municipios_beneficiados_vigencia_actual}
                        label="Seleccione una o varias opciones"
                        required
                        onBlur={() => syncColumnLong('municipios_beneficiados_vigencia_actual', form_metodologia_proyecto_formulario_10_linea_69)}
                    />
                </Grid>
                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategia_articulacion_pbts"
                        value={`De aceurdo a los resultados obtenidos, comparta la estrategia de Articulación de PBTs y Talentos para el ${convocatoria.year}`}
                    />

                    <Textarea
                        id="estrategia_articulacion_pbts"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.estrategia_articulacion_pbts}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.estrategia_articulacion_pbts}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('estrategia_articulacion_pbts', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('estrategia_articulacion_pbts', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="numero_empresas_atendidas" value={`Número de Empresas atendidas en el ${convocatoria.year - 1}, por el Hub`} />
                </Grid>
                <Grid item md={6}>
                    <TextInput
                        id="numero_empresas_atendidas"
                        type="number"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.numero_empresas_atendidas}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.numero_empresas_atendidas}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('numero_empresas_atendidas', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('numero_empresas_atendidas', form_metodologia_proyecto_formulario_10_linea_69)}
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="analisis_impacto_sector_empresarial"
                        value={`Analice los impactos en el ${convocatoria.year - 1} en el sector empresarial regional y determine acciones y estrategias a realizar en el ${
                            convocatoria.year
                        } para continuar con el fortalecimiento.`}
                    />

                    <Textarea
                        id="analisis_impacto_sector_empresarial"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.analisis_impacto_sector_empresarial}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.analisis_impacto_sector_empresarial}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('analisis_impacto_sector_empresarial', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('analisis_impacto_sector_empresarial', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required className="mb-4" labelFor="numero_emprendedores_atendidos" value={`Número de Emprendedores atendidos en el ${convocatoria.year - 1}`} />
                </Grid>
                <Grid item md={6}>
                    <TextInput
                        id="numero_emprendedores_atendidos"
                        type="number"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.numero_emprendedores_atendidos}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.numero_emprendedores_atendidos}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('numero_emprendedores_atendidos', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('numero_emprendedores_atendidos', form_metodologia_proyecto_formulario_10_linea_69)}
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="analisis_impacto_regional"
                        value={`Analice los impactos en el ${convocatoria.year - 1} en el emprendimiento regional y determine acciones y estrategias a realizar en el ${
                            convocatoria.year
                        } para continuar con el fortalecimiento.`}
                    />

                    <Textarea
                        id="analisis_impacto_regional"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.analisis_impacto_regional}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.analisis_impacto_regional}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('analisis_impacto_regional', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('analisis_impacto_regional', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="gestion_alianzas_estrategicas"
                        value={`Comparta las alianzas estratégicas a gestionar en el ${convocatoria.year} para promover el logro de las metas del  Hub de Innovación`}
                    />

                    <Textarea
                        id="gestion_alianzas_estrategicas"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.gestion_alianzas_estrategicas}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.gestion_alianzas_estrategicas}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('gestion_alianzas_estrategicas', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('gestion_alianzas_estrategicas', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategias_visibilizacion"
                        value={`Comparta la estrategia de divulgación y visibilización de acciones del Hub de Innovación para el ${convocatoria.year}`}
                    />

                    <Textarea
                        id="estrategias_visibilizacion"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.estrategias_visibilizacion}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.estrategias_visibilizacion}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('estrategias_visibilizacion', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('estrategias_visibilizacion', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label required className="mb-4" labelFor="integracion_plan_tecnologico" value="¿Cómo está integrado el Hub de Innovación en el Plan Tecnológico del Centro?" />

                    <Textarea
                        id="integracion_plan_tecnologico"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.integracion_plan_tecnologico}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.integracion_plan_tecnologico}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('integracion_plan_tecnologico', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('integracion_plan_tecnologico', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <h1 className="text-center">
                        PLANEACIÓN METODOLÓGICA PARA LA IMPLEMENTACIÓN DE ESTRATEGIAS Y ACCIONES QUE CONTRIBUYAN A LOS EJES PRIORIZADOS PARA LA VIGENCIA {convocatoria.year}
                    </h1>
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategias_productividad_agropecuaria"
                        value={`Proponga las estrategias para el ${
                            convocatoria.year - 1
                        } con el fin de que el Hub contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial en los territorios que impacta el Hub de Innovación`}
                    />

                    <Textarea
                        id="estrategias_productividad_agropecuaria"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.estrategias_productividad_agropecuaria}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.estrategias_productividad_agropecuaria}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('estrategias_productividad_agropecuaria', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('estrategias_productividad_agropecuaria', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_estrategia_campesena"
                        value={`A partir de las necesidades y retos territoriales, plantee cuales serán las acciones a realizar en el ${convocatoria.year}, integradas dentro de la Estrategia Campesena, en las que participará el Hub de Innovación`}
                    />

                    <Textarea
                        id="acciones_estrategia_campesena"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.acciones_estrategia_campesena}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.acciones_estrategia_campesena}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('acciones_estrategia_campesena', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_estrategia_campesena', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="estrategia_campesena_campesinos"
                        value={`Describa las acciones del Hub de Innovación a  realizar en el ${convocatoria.year}, que estarán integradas dentro de la Estrategia Campesena, para beneficiar Campesinos y agremiaciones campesinas y especialmente al acompañamiento de Proyectos de I + D + i tendientes a generar y articular mecanismos de atención diferencial, integral e incluyente, para los campesinos, de acuerdo con sus particularidades sociales, culturales, económicas y territoriales, que faciliten el acceso a los programas de formación y demás servicios de la Entidad`}
                    />

                    <Textarea
                        id="estrategia_campesena_campesinos"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.estrategia_campesena_campesinos}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.estrategia_campesena_campesinos}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('estrategia_campesena_campesinos', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('estrategia_campesena_campesinos', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_fortalecimiento_economia_popular"
                        value={`Describa las acciones del  Hub de Innovación a  realizar en el ${convocatoria.year}, que estarán direccionadas a fortalecer la Economía Popular`}
                    />

                    <Textarea
                        id="acciones_fortalecimiento_economia_popular"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.acciones_fortalecimiento_economia_popular}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.acciones_fortalecimiento_economia_popular}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('acciones_fortalecimiento_economia_popular', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_fortalecimiento_economia_popular', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="acciones_fortalecimiento_idi"
                        value={`Describa las acciones del  Hub de Innovación a  realizar en el ${convocatoria.year}, que estarán direccionadas a fortalecer Proyectos de I + D + i tendientes generación eléctrica a partir de fuentes no convencionales de energía renovable`}
                    />

                    <Textarea
                        id="acciones_fortalecimiento_idi"
                        error={form_metodologia_proyecto_formulario_10_linea_69.errors.acciones_fortalecimiento_idi}
                        value={form_metodologia_proyecto_formulario_10_linea_69.data.acciones_fortalecimiento_idi}
                        onChange={(e) => form_metodologia_proyecto_formulario_10_linea_69.setData('acciones_fortalecimiento_idi', e.target.value)}
                        disabled={!proyecto?.allowed?.to_update}
                        onBlur={() => syncColumnLong('acciones_fortalecimiento_idi', form_metodologia_proyecto_formulario_10_linea_69)}
                        required
                    />
                </Grid>
            </Grid>

            <div className=" flex items-center justify-between py-4">
                {proyecto.allowed.to_update && (
                    <PrimaryButton disabled={form_metodologia_proyecto_formulario_10_linea_69.processing} className="ml-auto" type="submit">
                        Guardar información de la metodología
                    </PrimaryButton>
                )}
            </div>
        </form>
    )
}

export default MetodologiaFormulario10Linea69

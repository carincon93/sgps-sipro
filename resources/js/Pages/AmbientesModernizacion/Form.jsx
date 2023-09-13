import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import MenuMui from '@/Components/Menu'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { router, useForm } from '@inertiajs/react'
import { Grid, MenuItem, Paper } from '@mui/material'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'

const Form = ({
    method = '',
    setDialogStatus,
    ambiente_modernizacion,
    centros_formacion,
    codigos_sgps,
    mesas_sectoriales,
    tipologias_ambientes,
    semilleros_investigacion,
    disciplinas_subarea_conocimiento,
    programas_formacion_con_registro,
    programas_formacion_sin_registro,
    tematicas_estrategicas,
    redes_conocimiento,
    actividades_economicas,
    lineas_investigacion,
    roles,
    ...props
}) => {
    const [ambiente_modernizacion_to_destroy, setAmbienteModernizacionToDestroy] = useState(false)
    const form = useForm({
        _method: method,

        centro_formacion_id: ambiente_modernizacion?.seguimiento_ambiente_modernizacion.centro_formacion_id,
        codigo_proyecto_sgps_id: ambiente_modernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps_id,

        razon_estado_general: ambiente_modernizacion?.razon_estado_general,
        justificacion_ambiente_inactivo: ambiente_modernizacion?.justificacion_ambiente_inactivo,
        impacto_procesos_formacion: ambiente_modernizacion?.impacto_procesos_formacion,
        pertinencia_sector_productivo: ambiente_modernizacion?.pertinencia_sector_productivo,
        productividad_beneficiarios: ambiente_modernizacion?.productividad_beneficiarios,
        generacion_empleo: ambiente_modernizacion?.generacion_empleo,
        creacion_empresas: ambiente_modernizacion?.creacion_empresas,
        incorporacion_nuevos_conocimientos: ambiente_modernizacion?.incorporacion_nuevos_conocimientos,
        valor_agregado_entidades: ambiente_modernizacion?.valor_agregado_entidades,
        fortalecimiento_programas_formacion: ambiente_modernizacion?.fortalecimiento_programas_formacion,
        transferencia_tecnologias: ambiente_modernizacion?.transferencia_tecnologias,
        cobertura_perntinencia_formacion: ambiente_modernizacion?.cobertura_perntinencia_formacion,
        observaciones_generales_ambiente: ambiente_modernizacion?.observaciones_generales_ambiente,

        nombre_ambiente: ambiente_modernizacion?.nombre_ambiente,
        tipologia_ambiente_id: ambiente_modernizacion?.tipologia_ambiente_id,
        red_conocimiento_id: ambiente_modernizacion?.red_conocimiento_id,
        linea_investigacion_id: ambiente_modernizacion?.linea_investigacion_id,
        actividad_economica_id: ambiente_modernizacion?.actividad_economica_id,
        disciplina_subarea_conocimiento_id: ambiente_modernizacion?.disciplina_subarea_conocimiento_id,
        tematica_estrategica_id: ambiente_modernizacion?.tematica_estrategica_id,
        semilleros_investigacion_id: ambiente_modernizacion?.semilleros_investigacion.map((item) => item.id),
        alineado_mesas_sectoriales: ambiente_modernizacion?.alineado_mesas_sectoriales,
        financiado_anteriormente: ambiente_modernizacion?.financiado_anteriormente,
        numero_tecnicas_tecnologias: ambiente_modernizacion?.numero_tecnicas_tecnologias,
        mesa_sectorial_id: ambiente_modernizacion?.mesas_sectoriales.map((item) => item.id),
        codigos_proyectos_id: ambiente_modernizacion?.codigos_proyectos_sgps.map((item) => item.id),
        estado_general_maquinaria: ambiente_modernizacion?.estado_general_maquinaria,
        ambiente_activo: ambiente_modernizacion?.ambiente_activo,
        programas_formacion_calificados: ambiente_modernizacion?.programas_formacion.filter((item) => item.registro_calificado == true).map((programa_formacion) => programa_formacion.id),
        programas_formacion: ambiente_modernizacion?.programas_formacion.filter((item) => item.registro_calificado == false).map((programa_formacion) => programa_formacion.id),
        ambiente_activo_procesos_idi: ambiente_modernizacion?.ambiente_activo_procesos_idi,
        numero_proyectos_beneficiados: ambiente_modernizacion?.numero_proyectos_beneficiados,
        cod_proyectos_beneficiados: ambiente_modernizacion?.cod_proyectos_beneficiados,
        ambiente_formacion_complementaria: ambiente_modernizacion?.ambiente_formacion_complementaria,
        numero_total_cursos_comp: ambiente_modernizacion?.numero_total_cursos_comp,
        numero_cursos_empresas: ambiente_modernizacion?.numero_cursos_empresas,
        numero_personas_certificadas: ambiente_modernizacion?.numero_personas_certificadas,
        datos_empresa: ambiente_modernizacion?.datos_empresa,
        cursos_complementarios: ambiente_modernizacion?.cursos_complementarios,
        coordenada_latitud_ambiente: ambiente_modernizacion?.coordenada_latitud_ambiente,
        coordenada_longitud_ambiente: ambiente_modernizacion?.coordenada_longitud_ambiente,
        soporte_fotos_ambiente: ambiente_modernizacion?.soporte_fotos_ambiente,
        numero_publicaciones: ambiente_modernizacion?.numero_publicaciones,
        numero_aprendices_beneficiados: ambiente_modernizacion?.numero_aprendices_beneficiados,
        palabras_clave_ambiente: ambiente_modernizacion?.palabras_clave_ambiente,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('ambientes-modernizacion.store'), {
                  preserveScroll: true,
              })
            : form.put(route('ambientes-modernizacion.update', [ambiente_modernizacion.id]), {
                  preserveScroll: true,
              })
    }

    return (
        <Grid container spacing={2}>
            <Grid item md={4}>
                <h1 className="font-black text-right text-2xl mr-10">{method == 'POST' ? 'Agregar' : 'Modificar'} seguimiento</h1>
            </Grid>

            <Grid item md={8}>
                <Paper className="p-8">
                    <form onSubmit={submit}>
                        <Grid container rowSpacing={8}>
                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />

                                <Autocomplete
                                    id="centro_formacion_id"
                                    options={centros_formacion}
                                    selectedValue={form.data.centro_formacion_id}
                                    onChange={(event, newValue) => form.setData('centro_formacion_id', newValue.value)}
                                    error={form.errors.centro_formacion_id}
                                    placeholder="Seleccione un centro de formación"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="centro_formacion_id" value="1. Código proyecto SGPS" />

                                {method == 'POST' ? (
                                    <Autocomplete
                                        id="codigo_proyecto_sgps_id"
                                        options={codigos_sgps}
                                        selectedValue={form.data.codigo_proyecto_sgps_id}
                                        onChange={(event, newValue) => form.setData('codigo_proyecto_sgps_id', newValue.value)}
                                        error={form.errors.codigo_proyecto_sgps_id}
                                        placeholder="Seleccione un proyecto"
                                        required
                                    />
                                ) : (
                                    <p className="uppercase">
                                        SGPS-
                                        {ambiente_modernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.codigo_sgps +
                                            ' | ' +
                                            ambiente_modernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.titulo}
                                    </p>
                                )}
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="nombre_ambiente"
                                    value="2. Nombre del ambiente(s) de formación modernizado por SENNOVA. Ejemplo: Ambiente de soldadura - Ambiente de confecciones"
                                />

                                <TextInput
                                    id="nombre_ambiente"
                                    type="text"
                                    value={form.data.nombre_ambiente}
                                    error={form.errors.nombre_ambiente}
                                    onChange={(e) => form.setData('nombre_ambiente', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required labelFor="tipologia_ambiente_id" value="3. Tipologías de los ambientes (Circular 3-2018- 143)" />
                                <a href={'/storage/documentos-descarga/Circular-3-2018-143.pdf'} target="_blank" className="underline my-6 inline-block text-app-500">
                                    Ver Circular 3-2018-143
                                </a>

                                <Autocomplete
                                    id="tipologia_ambiente_id"
                                    options={tipologias_ambientes}
                                    selectedValue={form.data.tipologia_ambiente_id}
                                    onChange={(event, newValue) => form.setData('tipologia_ambiente_id', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una tipología de ambiente"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="4. Disciplina relacionada con el ambiente modernizado por SENNOVA" />

                                <Autocomplete
                                    id="disciplina_subarea_conocimiento_id"
                                    options={disciplinas_subarea_conocimiento}
                                    selectedValue={form.data.disciplina_subarea_conocimiento_id}
                                    onChange={(event, newValue) => form.setData('disciplina_subarea_conocimiento_id', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una disciplina"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="red_conocimiento_id"
                                    value="5. Red de conocimiento relacionada con el ambiente modernizado por SENNOVA (resolución 335 de 2012)"
                                />
                                <Autocomplete
                                    id="red_conocimiento_id"
                                    options={redes_conocimiento}
                                    selectedValue={form.data.red_conocimiento_id}
                                    onChange={(event, newValue) => form.setData('red_conocimiento_id', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una red de conocimiento"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="actividad_economica_id" value="6. Código CIIU relacionado con el ambiente modernizado por SENNOVA" />

                                <Autocomplete
                                    id="actividad_economica_id"
                                    options={actividades_economicas}
                                    selectedValue={form.data.actividad_economica_id}
                                    onChange={(event, newValue) => form.setData('actividad_economica_id', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una actividad económica"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="tematica_estrategica_id" value="7. Temática estratégica SENA relacionada con el ambiente modernizado por SENNOVA" />

                                <Autocomplete
                                    id="tematica_estrategica_id"
                                    options={tematicas_estrategicas}
                                    selectedValue={form.data.tematica_estrategica_id}
                                    onChange={(event, newValue) => form.setData('tematica_estrategica_id', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una temática estratégica SENA"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="linea_investigacion_id" value="8. Línea investigación relacionada con el ambiente modernizado por SENNOVA" />

                                <Autocomplete
                                    id="linea_investigacion_id"
                                    options={lineas_investigacion}
                                    selectedValue={form.data.linea_investigacion_id}
                                    onChange={(event, newValue) => form.setData('linea_investigacion_id', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una línea de investigación"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="alineado_mesas_sectoriales" value="9. ¿El proyecto se alinea con las Mesas Sectoriales?" />

                                <Autocomplete
                                    id="alineado_mesas_sectoriales"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.alineado_mesas_sectoriales}
                                    error={form.errors.alineado_mesas_sectoriales}
                                    onChange={(event, newValue) => {
                                        form.setData('alineado_mesas_sectoriales', newValue.value)
                                    }}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            {form.data.alineado_mesas_sectoriales == 1 && (
                                <>
                                    <Grid item md={12}>
                                        <p className="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el ambiente</p>
                                        <SelectMultiple
                                            id="mesa_sectorial_id"
                                            bdValues={form.data.mesa_sectorial_id}
                                            options={mesas_sectoriales}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    mesa_sectorial_id: selected_values,
                                                }))
                                            }}
                                            error={form.errors.mesa_sectorial_id}
                                            placeholder="Seleccione las mesas sectoriales"
                                            required
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="financiado_anteriormente" value="10. ¿El ambiente de formación ha sido financiado en más de una vigencia por SENNOVA?" />

                                <Autocomplete
                                    id="financiado_anteriormente"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.financiado_anteriormente}
                                    onChange={(event, newValue) => form.setData('financiado_anteriormente', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="codigos_proyectos_id"
                                    value="11. Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por SENNOVA de convocatoria (SGPS) o de capacidad instalada (CAP)"
                                />

                                <SelectMultiple
                                    id="codigos_proyectos_id"
                                    bdValues={form.data.codigos_proyectos_id}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        form.setData((prevData) => ({
                                            ...prevData,
                                            codigos_proyectos_id: selected_values,
                                        }))
                                    }}
                                    options={codigos_sgps}
                                    error={form.errors.codigos_proyectos_id}
                                    label="Proyectos SGPS"
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="numero_tecnicas_tecnologias"
                                    value="12. Relacione el número de técnicas o tecnologías adquiridas y/o mejoradas con el ambiente de aprendizaje, modernizado por SENNOVA. "
                                />
                                <TextInput
                                    id="numero_tecnicas_tecnologias"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={form.data.numero_tecnicas_tecnologias}
                                    error={form.errors.numero_tecnicas_tecnologias}
                                    onChange={(e) => form.setData('numero_tecnicas_tecnologias', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="estado_general_maquinaria"
                                    value="13. Estado general de maquinaria y equipo instalados en el ambiente de aprendizaje, modernizado por SENNOVA."
                                />
                                <Autocomplete
                                    id="estado_general_maquinaria"
                                    options={[
                                        { value: 1, label: 'Buena' },
                                        { value: 2, label: 'Regular' },
                                        { value: 3, label: 'Malo' },
                                    ]}
                                    selectedValue={form.data.estado_general_maquinaria}
                                    onChange={(event, newValue) => form.setData('estado_general_maquinaria', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            {form.data.estado_general_maquinaria == 2 || form.data.estado_general_maquinaria == 3 ? (
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="razon_estado_general"
                                        value="14. Si la respuesta anterior fue regular o malo, describa la razón. Para mayor especificidad listar máquina por máquina para identificación a partir del tiempo de vida útil."
                                    />

                                    <Textarea
                                        id="razon_estado_general"
                                        value={form.data.razon_estado_general}
                                        error={form.errors.razon_estado_general}
                                        onChange={(e) => form.setData('razon_estado_general', e.target.value)}
                                        required
                                    />
                                </Grid>
                            ) : null}

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="ambiente_activo"
                                    value="15. ¿A la fecha el ambiente modernizado por SENNOVA está activo para realizar procesos de formación?"
                                />

                                <Autocomplete
                                    id="ambiente_activo"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.ambiente_activo}
                                    onChange={(event, newValue) => form.setData('ambiente_activo', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            {form.data.ambiente_activo == 1 ? (
                                <>
                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="programas_formacion_calificados"
                                            value="Si la respuesta anterior fue afirmativa, seleccione los programas de formación con registro calificado beneficiados."
                                        />
                                        <SelectMultiple
                                            id="programas_formacion_calificados"
                                            bdValues={form.data.programas_formacion_calificados}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    programas_formacion_calificados: selected_values,
                                                }))
                                            }}
                                            options={programas_formacion_con_registro}
                                            error={form.errors.programas_formacion_calificados}
                                            label="Programas de formación"
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            required={programas_formacion_sin_registro.length > 0 ? 'required' : undefined}
                                            className="mb-4"
                                            labelFor="programas_formacion"
                                            value="Si la respuesta anterior fue afirmativa, seleccione los programas de formación beneficiados."
                                        />
                                        <SelectMultiple
                                            id="programas_formacion"
                                            bdValues={form.data.programas_formacion}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    programas_formacion: selected_values,
                                                }))
                                            }}
                                            options={programas_formacion_sin_registro}
                                            error={form.errors.programas_formacion}
                                            label="Programas de formación"
                                            required
                                        />
                                    </Grid>
                                </>
                            ) : (
                                form.data.ambiente_activo == 2 && (
                                    <Grid item md={12}>
                                        <Label required className="mb-4" labelFor="justificacion_ambiente_inactivo" value="Si la respuesta anterior fue negativa, justifique la respuesta" />

                                        <Textarea
                                            id="justificacion_ambiente_inactivo"
                                            value={form.data.justificacion_ambiente_inactivo}
                                            error={form.errors.justificacion_ambiente_inactivo}
                                            onChange={(e) => form.setData('justificacion_ambiente_inactivo', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                )
                            )}

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="ambiente_activo_procesos_idi"
                                    value="16. ¿A la fecha el ambiente modernizado por SENNOVA está activo para realizar procesos de investigación, desarrollo tecnológico y/o innovación con semilleros o programas de formación?"
                                />

                                <Autocomplete
                                    id="ambiente_activo_procesos_idi"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.ambiente_activo_procesos_idi}
                                    onChange={(event, newValue) => form.setData('ambiente_activo_procesos_idi', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            {form.data.ambiente_activo_procesos_idi == 1 && (
                                <>
                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="numero_proyectos_beneficiados"
                                            value="Si la respuesta anterior fue afirmativa, relacione el número de proyectos beneficiados y/o ejecutados en el ambiente modernizado por SENNOVA"
                                        />

                                        <TextInput
                                            id="numero_proyectos_beneficiados"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={form.data.numero_proyectos_beneficiados}
                                            error={form.errors.numero_proyectos_beneficiados}
                                            onChange={(e) => form.setData('numero_proyectos_beneficiados', e.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="cod_proyectos_beneficiados"
                                            value="Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por SENNOVA"
                                        />
                                        <AlertMui>Separar códigos por coma o dar Enter una vez finalice de escribir.</AlertMui>

                                        <Tags
                                            id="cod_proyectos_beneficiados"
                                            className="mt-2 tagify__tag__disabledRemoveBtn"
                                            enforceWhitelist={false}
                                            value={form.data.cod_proyectos_beneficiados}
                                            tags={form.data.cod_proyectos_beneficiados}
                                            onChange={(e) => form.setData('cod_proyectos_beneficiados', e.target.value)}
                                            placeholder="Códigos SGPS"
                                            error={form.errors.cod_proyectos_beneficiados}
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="semilleros_investigacion_id"
                                            value="Si la respuesta anterior fue afirmativa, relacione los semilleros de investigación beneficiados con el ambiente modernizado por SENNOVA"
                                        />

                                        <SelectMultiple
                                            id="semilleros_investigacion_id"
                                            bdValues={form.data.semilleros_investigacion_id}
                                            onChange={(event, newValue) => {
                                                const selected_values = newValue.map((option) => option.value)
                                                form.setData((prevData) => ({
                                                    ...prevData,
                                                    semilleros_investigacion_id: selected_values,
                                                }))
                                            }}
                                            options={semilleros_investigacion}
                                            error={form.errors.semilleros_investigacion_id}
                                            label="Semilleros de investigación"
                                            required
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="ambiente_formacion_complementaria"
                                    value="17. ¿El ambiente de formación ha generado formación complementaria después de la modernización con SENNOVA?"
                                />

                                <Autocomplete
                                    id="ambiente_formacion_complementaria"
                                    options={[
                                        { value: 1, label: 'Si' },
                                        { value: 2, label: 'No' },
                                    ]}
                                    selectedValue={form.data.ambiente_formacion_complementaria}
                                    onChange={(event, newValue) => form.setData('ambiente_formacion_complementaria', newValue.value)}
                                    error={form.errors.tipologia_ambiente_id}
                                    placeholder="Seleccione una opción"
                                    required
                                />
                            </Grid>

                            {form.data.ambiente_formacion_complementaria == 1 && (
                                <>
                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="numero_total_cursos_comp"
                                            value="Si la respuesta anterior fue afirmativa, relacione el número total de cursos complementarios que se ha brindado formación complementaria"
                                        />

                                        <TextInput
                                            id="numero_total_cursos_comp"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={form.data.numero_total_cursos_comp}
                                            error={form.errors.numero_total_cursos_comp}
                                            onChange={(e) => form.setData('numero_total_cursos_comp', e.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="numero_cursos_empresas"
                                            value="Si la respuesta anterior fue afirmativa, relacione el número de cursos complementarios a empresas que se ha brindado formación complementaria"
                                        />

                                        <TextInput
                                            id="numero_cursos_empresas"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={form.data.numero_cursos_empresas}
                                            error={form.errors.numero_cursos_empresas}
                                            onChange={(e) => form.setData('numero_cursos_empresas', e.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            className="mb-4"
                                            labelFor="datos_empresa"
                                            value="Si la respuesta anterior fue afirmativa, relacione el NIT y nombre de las empresas (cuando aplique) que se ha brindada formación complementaria"
                                        />
                                        <AlertMui>Separar empresas por coma o dar Enter una vez finalice de escribir</AlertMui>

                                        <Tags
                                            id="datos_empresa"
                                            className="mt-2 tagify__tag__disabledRemoveBtn"
                                            enforceWhitelist={false}
                                            value={form.data.datos_empresa}
                                            tags={form.data.datos_empresa}
                                            onChange={(e) => form.setData('datos_empresa', e.target.value)}
                                            placeholder="Empresas"
                                            error={form.errors.datos_empresa}
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            required
                                            className="mb-4"
                                            labelFor="numero_personas_certificadas"
                                            value="Si la respuesta anterior fue afirmativa, relacione el número total de personas certificadas de las empresas que se ha brindado formación complementaria."
                                        />
                                        <TextInput
                                            id="numero_personas_certificadas"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={form.data.numero_personas_certificadas}
                                            error={form.errors.numero_personas_certificadas}
                                            onChange={(e) => form.setData('numero_personas_certificadas', e.target.value)}
                                            required
                                        />
                                    </Grid>

                                    <Grid item md={12}>
                                        <Label
                                            className="mb-4"
                                            labelFor="cursos_complementarios"
                                            value="Si la respuesta anterior fue afirmativa, relacione los códigos y nombres Sena de cada curso de formación complementario"
                                        />
                                        <AlertMui>Separar cursos por coma o dar Enter una vez finalice de escribir</AlertMui>

                                        <Tags
                                            id="cursos_complementarios"
                                            className="mt-2 tagify__tag__disabledRemoveBtn"
                                            enforceWhitelist={false}
                                            value={form.data.cursos_complementarios}
                                            tags={form.data.cursos_complementarios}
                                            onChange={(e) => form.setData('cursos_complementarios', e.target.value)}
                                            placeholder="Cursos de formación complementarios"
                                            error={form.errors.cursos_complementarios}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="coordenada_latitud_ambiente"
                                    value="18. Diligencie la coordenada latitud (W) del ambiente de formación modernizado por SENNOVA (generado en Google maps). Ejemplo: -74.062916"
                                />
                                <AlertMui>
                                    Más información en el siguiente enlace{' '}
                                    <a href="https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1" className="underline" target="_blank">
                                        https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1
                                    </a>{' '}
                                    (Sección “Cómo obtener las coordenadas de un lugar”)
                                </AlertMui>

                                <TextInput
                                    id="coordenada_latitud_ambiente"
                                    type="text"
                                    value={form.data.coordenada_latitud_ambiente}
                                    error={form.errors.coordenada_latitud_ambiente}
                                    onChange={(e) => form.setData('coordenada_latitud_ambiente', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="coordenada_longitud_ambiente"
                                    value="19. Diligencie la coordenada longitud (N) del ambiente de formación modernizado por SENNOVA (generado en Google maps). Ejemplo: 4.643244"
                                />
                                <AlertMui>
                                    Más información en el siguiente enlace{' '}
                                    <a href="https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1" className="underline" target="_blank">
                                        https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1
                                    </a>{' '}
                                    (sección “Cómo obtener las coordenadas de un lugar”)
                                </AlertMui>

                                <TextInput
                                    id="coordenada_longitud_ambiente"
                                    type="text"
                                    value={form.data.coordenada_longitud_ambiente}
                                    error={form.errors.coordenada_longitud_ambiente}
                                    onChange={(e) => form.setData('coordenada_longitud_ambiente', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="impacto_procesos_formacion" value="20. Describa el impacto generado en los procesos de formación" />

                                <Textarea
                                    id="impacto_procesos_formacion"
                                    value={form.data.impacto_procesos_formacion}
                                    error={form.errors.impacto_procesos_formacion}
                                    onChange={(e) => form.setData('impacto_procesos_formacion', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="pertinencia_sector_productivo" value="21. Describa la pertinencia obtenida con el sector productivo" />

                                <Textarea
                                    id="pertinencia_sector_productivo"
                                    value={form.data.pertinencia_sector_productivo}
                                    error={form.errors.pertinencia_sector_productivo}
                                    onChange={(e) => form.setData('pertinencia_sector_productivo', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="numero_publicaciones"
                                    value="22. Relacione el número de publicaciones derivadas con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA."
                                />
                                <TextInput
                                    id="numero_publicaciones"
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    value={form.data.numero_publicaciones}
                                    error={form.errors.numero_publicaciones}
                                    onChange={(e) => form.setData('numero_publicaciones', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="numero_aprendices_beneficiados"
                                    value="23. Relacione el número de aprendices beneficiados con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA. "
                                />

                                <TextInput
                                    id="numero_aprendices_beneficiados"
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    value={form.data.numero_aprendices_beneficiados}
                                    error={form.errors.numero_aprendices_beneficiados}
                                    onChange={(e) => form.setData('numero_aprendices_beneficiados', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <h1 className="py-24 text-center">
                                    Describa de forma general (en los que aplique) el aporte del proyecto ejecutado de modernización SENNOVA a los indicadores de los proyectos relacionados en el
                                    artículo 5 del acuerdo 003 del 02 de febrero de 2012.
                                </h1>
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="productividad_beneficiarios" value="24. Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto." />

                                <Textarea
                                    id="productividad_beneficiarios"
                                    value={form.data.productividad_beneficiarios}
                                    error={form.errors.productividad_beneficiarios}
                                    onChange={(e) => form.setData('productividad_beneficiarios', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="generacion_empleo" value="25. Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto." />
                                <Textarea
                                    id="generacion_empleo"
                                    value={form.data.generacion_empleo}
                                    error={form.errors.generacion_empleo}
                                    onChange={(e) => form.setData('generacion_empleo', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="creacion_empresas" value="26. Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios" />
                                <Textarea
                                    id="creacion_empresas"
                                    value={form.data.creacion_empresas}
                                    error={form.errors.creacion_empresas}
                                    onChange={(e) => form.setData('creacion_empresas', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    className="mb-4"
                                    labelFor="incorporacion_nuevos_conocimientos"
                                    value="27. Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto"
                                />
                                <Textarea
                                    id="incorporacion_nuevos_conocimientos"
                                    value={form.data.incorporacion_nuevos_conocimientos}
                                    error={form.errors.incorporacion_nuevos_conocimientos}
                                    onChange={(e) => form.setData('incorporacion_nuevos_conocimientos', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="valor_agregado_entidades" value="28. Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto" />

                                <Textarea
                                    id="valor_agregado_entidades"
                                    value={form.data.valor_agregado_entidades}
                                    error={form.errors.valor_agregado_entidades}
                                    onChange={(e) => form.setData('valor_agregado_entidades', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="fortalecimiento_programas_formacion" value="29. Fortalecimiento de programas de formación del Sena" />

                                <Textarea
                                    id="fortalecimiento_programas_formacion"
                                    value={form.data.fortalecimiento_programas_formacion}
                                    error={form.errors.fortalecimiento_programas_formacion}
                                    onChange={(e) => form.setData('fortalecimiento_programas_formacion', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="transferencia_tecnologias" value="30. Transferencia de tecnologías al Sena y a los sectores productivos relacionados" />

                                <Textarea
                                    id="transferencia_tecnologias"
                                    value={form.data.transferencia_tecnologias}
                                    error={form.errors.transferencia_tecnologias}
                                    onChange={(e) => form.setData('transferencia_tecnologias', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="cobertura_perntinencia_formacion" value="31. Cobertura, calidad y pertinencia de la formación" />

                                <Textarea
                                    id="cobertura_perntinencia_formacion"
                                    value={form.data.cobertura_perntinencia_formacion}
                                    error={form.errors.cobertura_perntinencia_formacion}
                                    onChange={(e) => form.setData('cobertura_perntinencia_formacion', e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="palabras_clave_ambiente" value="32. Palabras claves relacionadas con el ambiente de formación modernizado por SENNOVA" />
                                <AlertMui>Separar palabras clave por coma o dar Enter una vez finalice de escribir</AlertMui>

                                <Tags
                                    id="palabras_clave_ambiente"
                                    className="mt-2 tagify__tag__disabledRemoveBtn"
                                    enforceWhitelist={false}
                                    value={form.data.palabras_clave_ambiente}
                                    tags={form.data.palabras_clave_ambiente}
                                    onChange={(e) => form.setData('palabras_clave_ambiente', e.target.value)}
                                    placeholder="Palabras clave"
                                    error={form.errors.palabras_clave_ambiente}
                                />
                            </Grid>

                            <Grid item md={12}>
                                <Label required className="mb-4" labelFor="observaciones_generales_ambiente" value="33. Observaciones generales del ambiente modernizado por SENNOVA" />

                                <Textarea
                                    id="observaciones_generales_ambiente"
                                    value={form.data.observaciones_generales_ambiente}
                                    error={form.errors.observaciones_generales_ambiente}
                                    onChange={(e) => form.setData('observaciones_generales_ambiente', e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <div className="py-4 flex items-center justify-end">
                            <PrimaryButton disabled={form.processing || !form.isDirty} type="submit">
                                Guardar cambios
                            </PrimaryButton>
                            <MenuMui
                                className="!ml-2 !mr-4"
                                text={
                                    <MenuItem
                                        onClick={() => {
                                            setAmbienteModernizacionToDestroy(true)
                                        }}
                                        sx={{ fontSize: '14px' }}
                                        className=" !p-0">
                                        Eliminar
                                    </MenuItem>
                                }>
                                {ambiente_modernizacion_to_destroy && (
                                    <div>
                                        <MenuItem
                                            sx={{ fontSize: '14px', backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.delete(route('ambientes-modernizacion.destroy', [ambiente_modernizacion.id]))
                                            }}>
                                            CONFIRMAR
                                        </MenuItem>
                                    </div>
                                )}
                            </MenuMui>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Form

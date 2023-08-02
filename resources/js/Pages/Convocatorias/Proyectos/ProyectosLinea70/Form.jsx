import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import FileInput from '@/Components/FileInput'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'
import { checkPermissionByUser, monthDiff } from '@/Utils'

import { useForm } from '@inertiajs/react'

import { Grid } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'

const Form = ({
    is_super_admin,
    auth_user,
    method = '',
    convocatoria,
    proyecto_linea_70,
    tecnoacademia,
    tecnoacademias,
    lineas_tecnoacademia,
    lineas_programaticas,
    infraestructura_tecnoacademia,
    roles_sennova,
    evaluacion,
    ...props
}) => {
    const [array_lineas_tecnoacademia, setArrayLineasTecnoacademia] = useState([])

    const form = useForm({
        _method: method,
        centro_formacion_id: proyecto_linea_70?.proyecto.centro_formacion_id ?? '',
        fecha_inicio: proyecto_linea_70?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_linea_70?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_linea_70?.max_meses_ejecucion ?? '',
        tecnoacademia_id: tecnoacademia?.id ?? '',
        tecnoacademia_linea_tecnoacademia_id: proyecto_linea_70?.proyecto.tecnoacademia_lineas_tecnoacademia?.map((item) => item.id),
        logros_vigencia_anterior: proyecto_linea_70?.logros_vigencia_anterior ?? '',
        resumen: proyecto_linea_70?.resumen ?? '',
        resumen_regional: proyecto_linea_70?.resumen_regional ?? '',
        antecedentes: proyecto_linea_70?.antecedentes ?? '',
        antecedentes_tecnoacademia: proyecto_linea_70?.antecedentes_tecnoacademia ?? '',
        justificacion_problema: proyecto_linea_70?.justificacion_problema ?? '',
        marco_conceptual: proyecto_linea_70?.marco_conceptual ?? '',
        bibliografia: proyecto_linea_70?.bibliografia ?? '',
        pertinencia_territorio: proyecto_linea_70?.pertinencia_territorio ?? '',
        retos_oportunidades: proyecto_linea_70?.retos_oportunidades ?? '',
        lineas_tecnologicas_centro: proyecto_linea_70?.lineas_tecnologicas_centro ?? '',
        infraestructura_tecnoacademia: proyecto_linea_70?.infraestructura_tecnoacademia ?? '',
        pdf_proyecto_general: null,

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'POST'
            ? form.post(route('convocatorias.proyectos-linea-70.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_linea_70.proyecto.allowed.to_update
            ? form.post(route('convocatorias.proyectos-linea-70.update', [convocatoria.id, proyecto_linea_70.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        const filtered_lineas_tecnoacademia = lineas_tecnoacademia?.filter((obj) => obj.tecnoacademia_id === form.data.tecnoacademia_id)

        setArrayLineasTecnoacademia(filtered_lineas_tecnoacademia)
    }, [form.data.tecnoacademia_id, tecnoacademia])

    useEffect(() => {
        form.setData('max_meses_ejecucion', monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion))
    }, [form.data.fecha_inicio && form.data.fecha_finalizacion])

    return (
        <form onSubmit={submit}>
            <Grid container className="space-y-20">
                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_inicio"
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_inicio"
                        value={form.data.fecha_inicio}
                        className="p-4 w-full"
                        onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Label required labelFor="fecha_finalizacion" error={form.errors.fecha_finalizacion} value="Fecha de finalización" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_finalizacion"
                        minDate={convocatoria.year + '-01-01'}
                        maxDate={convocatoria.year + '-12-31'}
                        name="fecha_finalizacion"
                        value={form.data.fecha_finalizacion}
                        className="p-4 w-full"
                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                        required
                    />
                </Grid>

                {method == 'POST' && (
                    <>
                        <Grid item md={6}>
                            <Label required labelFor="tecnoacademia_id" className="mb-4" value="TecnoAcademia" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="tecnoacademia_id"
                                selectedValue={form.data.tecnoacademia_id}
                                onChange={(event, newValue) => form.setData('tecnoacademia_id', newValue.value)}
                                options={tecnoacademias}
                                placeholder="Seleccione una TecnoAcademia"
                                required
                            />
                        </Grid>
                    </>
                )}

                {array_lineas_tecnoacademia.length > 0 && (
                    <>
                        <Grid item md={6}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="tecnoacademia_linea_tecnoacademia_id"
                                value="Líneas temáticas a ejecutar en la vigencia del proyecto:"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <SelectMultiple
                                id="tecnoacademia_linea_tecnoacademia_id"
                                bdValues={form.data.tecnoacademia_linea_tecnoacademia_id}
                                options={array_lineas_tecnoacademia}
                                onChange={(event, newValue) => {
                                    const selectedValues = newValue.map((option) => option.value)
                                    form.setData((prevData) => ({
                                        ...prevData,
                                        tecnoacademia_linea_tecnoacademia_id: selectedValues,
                                    }))
                                }}
                                error={form.errors.tecnoacademia_linea_tecnoacademia_id}
                                label="Seleccione una o varias opciones"
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                    </>
                )}

                {method == 'POST' && (
                    <>
                        <Grid item md={12}>
                            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                        </Grid>
                        <Grid item md={6}>
                            <Label required labelFor="rol_sennova" className="mb-4" value="Rol SENNOVA" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="rol_sennova"
                                selectedValue={form.data.rol_sennova}
                                onChange={(event, newValue) => form.setData('rol_sennova', newValue.value)}
                                options={roles_sennova}
                                placeholder="Seleccione un rol SENNOVA"
                                required
                            />
                        </Grid>
                        {form.data.fecha_inicio && form.data.fecha_finalizacion && (
                            <>
                                <Grid item md={6}>
                                    <Label required labelFor="cantidad_meses" className="mb-4" value="Número de meses de vinculación al proyecto" />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        type="number"
                                        id="cantidad_meses"
                                        inputProps={{
                                            step: 0.1,
                                            min: 1,
                                            max: monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion),
                                        }}
                                        value={form.data.cantidad_meses}
                                        onChange={(e) => form.setData('cantidad_meses', e.target.value)}
                                        placeholder="Número de meses de vinculación"
                                        required
                                    />
                                    {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion) && (
                                        <small>
                                            El proyecto se ejecutará entre {form.data.fecha_inicio} y el {form.data.fecha_finalizacion}, por lo tanto el número de meses máximo es:{' '}
                                            {monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion)}
                                        </small>
                                    )}
                                </Grid>
                            </>
                        )}
                        <Grid item md={6}>
                            <Label required labelFor="cantidad_horas" className="mb-4" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                type="number"
                                id="cantidad_horas"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                }}
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}

                {method == 'PUT' && (
                    <>
                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                        </Grid>
                        <Grid item md={6}>
                            {proyecto_linea_70?.proyecto.linea_programatica.nombre + ' - ' + proyecto_linea_70?.proyecto.linea_programatica.codigo}
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
                            <small> Nota: El Centro de Formación relacionado es el ejecutor del proyecto </small>
                        </Grid>
                        <Grid item md={6}>
                            <p className="first-letter:uppercase">{proyecto_linea_70.proyecto.centro_formacion.nombre}</p>
                        </Grid>

                        <Grid item md={6}>
                            <Label required className="mb-4" labelFor="pdf_proyecto_general" value="Archivo en formato (.pdf) del proyecto general" />
                        </Grid>
                        <Grid item md={6}>
                            <FileInput
                                id="pdf_proyecto_general"
                                maxSize="10000"
                                value={form.data.pdf_proyecto_general}
                                valueDb={proyecto_linea_70.pdf_proyecto_general}
                                error={form.errors.pdf_proyecto_general}
                                route={
                                    proyecto_linea_70.pdf_proyecto_general?.includes('http')
                                        ? null
                                        : route('convocatorias.proyectos-linea-70.download-pdf-sharepoint', [convocatoria.id, proyecto_linea_70.id, 'pdf_proyecto_general'])
                                }
                                required
                            />
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="tecnoacademia_id" value="TecnoAcademia" />
                        </Grid>
                        <Grid item md={6}>
                            <div>{proyecto_linea_70.titulo}</div>
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="tecnoacademia_id" value="La infraestructura donde opera la TecnoAcademia es:" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="infraestructura_tecnoacademia"
                                options={infraestructura_tecnoacademia}
                                inputBackground="#fff"
                                selectedValue={form.data.infraestructura_tecnoacademia}
                                onChange={(event, newValue) => form.setData('infraestructura_tecnoacademia', newValue.value)}
                                error={form.errors.infraestructura_tecnoacademia}
                                label="Seleccione una opción"
                                required
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="resumen" value="Resumen del proyecto" />
                            <AlertMui>
                                Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo
                                resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.
                            </AlertMui>

                            <Textarea
                                id="resumen"
                                error={form.errors.resumen}
                                value={form.data.resumen}
                                onChange={(e) => form.setData('resumen', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [23]) && !proyecto_linea_70?.proyecto_base}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="resumen_regional" value="Complemento - Resumen ejecutivo regional" />

                            <Textarea
                                id="resumen_regional"
                                error={form.errors.resumen_regional}
                                value={form.data.resumen_regional}
                                onChange={(e) => form.setData('resumen_regional', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui>
                                Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la
                                temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición. De igual
                                forma, relacionar los proyectos ejecutados en vigencias anteriores (incluir códigos SGPS), si el proyecto corresponde a la continuidad de proyectos SENNOVA."
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [23]) && !proyecto_linea_70?.proyecto_base}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="antecedentes_tecnoacademia"
                                value="Antecedentes de la Tecnoacademia y su impacto en la región"
                            />

                            <Textarea
                                id="antecedentes_tecnoacademia"
                                error={form.errors.antecedentes_tecnoacademia}
                                value={form.data.antecedentes_tecnoacademia}
                                onChange={(e) => form.setData('antecedentes_tecnoacademia', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="justificacion_problema" value="Justificación" />

                            <Textarea
                                id="justificacion_problema"
                                error={form.errors.justificacion_problema}
                                value={form.data.justificacion_problema}
                                onChange={(e) => form.setData('justificacion_problema', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [23]) && !proyecto_linea_70?.proyecto_base}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="logros_vigencia_anterior"
                                value={`Logros de la vigencia ${convocatoria.year - 1} en la implementación del programa de TecnoAcademia`}
                            />

                            <Textarea
                                id="logros_vigencia_anterior"
                                error={form.errors.logros_vigencia_anterior}
                                value={form.data.logros_vigencia_anterior}
                                onChange={(e) => form.setData('logros_vigencia_anterior', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="retos_oportunidades"
                                value="Descripción de retos y prioridades locales y regionales en los cuales la Tecnoacademia tiene impacto"
                            />

                            <Textarea
                                id="retos_oportunidades"
                                error={form.errors.retos_oportunidades}
                                value={form.data.retos_oportunidades}
                                onChange={(e) => form.setData('retos_oportunidades', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="pertinencia_territorio" value="Justificación y pertinencia en el territorio" />

                            <Textarea
                                id="pertinencia_territorio"
                                error={form.errors.pertinencia_territorio}
                                value={form.data.pertinencia_territorio}
                                onChange={(e) => form.setData('pertinencia_territorio', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="marco_conceptual" value="Marco conceptual" />
                            <AlertMui>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>

                            <Textarea
                                id="marco_conceptual"
                                error={form.errors.marco_conceptual}
                                value={form.data.marco_conceptual}
                                onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [23]) && !proyecto_linea_70?.proyecto_base}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="lineas_tecnologicas_centro"
                                value="Líneas tecnológicas del Centro con las que se articula la TecnoAcademia"
                            />

                            <Textarea
                                id="lineas_tecnologicas_centro"
                                error={form.errors.lineas_tecnologicas_centro}
                                value={form.data.lineas_tecnologicas_centro}
                                onChange={(e) => form.setData('lineas_tecnologicas_centro', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} className="mb-4" labelFor="bibliografia" value="Bibliografía" />
                            <AlertMui>
                                Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).
                            </AlertMui>

                            <Textarea
                                id="bibliografia"
                                error={form.errors.bibliografia}
                                value={form.data.bibliografia}
                                onChange={(e) => form.setData('bibliografia', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>
                    </>
                )}
            </Grid>

            {method == 'POST' || proyecto_linea_70.proyecto?.allowed?.to_update ? (
                <div className="pt-8 pb-4 space-y-4">
                    <PrimaryButton type="submit" className="ml-auto" disabled={form.processing || !form.isDirty}>
                        Guardar
                    </PrimaryButton>
                </div>
            ) : null}
        </form>
    )
}

export default Form

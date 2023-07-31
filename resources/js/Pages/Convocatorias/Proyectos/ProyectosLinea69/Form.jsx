import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import DatePicker from '@/Components/DatePicker'
import FileInput from '@/Components/FileInput'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import Textarea from '@/Components/Textarea'

import { checkPermissionByUser, monthDiff } from '@/Utils'

import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useEffect } from 'react'

const Form = ({ is_super_admin, auth_user, method = '', convocatoria, proyecto_linea_69, nodos_tecnoparque, lineas_programaticas, roles_sennova, evaluacion, ...props }) => {
    const form = useForm({
        centro_formacion_id: proyecto_linea_69?.proyecto.centro_formacion_id ?? '',
        linea_programatica_id: proyecto_linea_69?.proyecto.linea_programatica_id ?? '',
        fecha_inicio: proyecto_linea_69?.fecha_inicio ?? '',
        fecha_finalizacion: proyecto_linea_69?.fecha_finalizacion ?? '',
        max_meses_ejecucion: proyecto_linea_69?.max_meses_ejecucion ?? '',
        codigo_linea_programatica: null,
        nodo_tecnoparque_id: proyecto_linea_69?.nodo_tecnoparque_id ?? '',
        articulacion_agenda_competitividad: proyecto_linea_69?.articulacion_agenda_competitividad ?? '',
        aportes_linea_ocho_conpes: proyecto_linea_69?.aportes_linea_ocho_conpes ?? '',
        estado_ecosistema_ctel: proyecto_linea_69?.estado_ecosistema_ctel ?? '',
        logros_vigencia_anterior: proyecto_linea_69?.logros_vigencia_anterior ?? '',

        resumen: proyecto_linea_69?.resumen ?? '',
        resumen_regional: proyecto_linea_69?.resumen_regional ?? '',
        antecedentes: proyecto_linea_69?.antecedentes ?? '',
        antecedentes_regional: proyecto_linea_69?.antecedentes_regional ?? '',
        marco_conceptual: proyecto_linea_69?.marco_conceptual ?? '',
        bibliografia: proyecto_linea_69?.bibliografia ?? '',
        retos_oportunidades: proyecto_linea_69?.retos_oportunidades ?? '',
        pertinencia_territorio: proyecto_linea_69?.pertinencia_territorio ?? '',
        pdf_proyecto_general: null,

        cantidad_meses: 0,
        cantidad_horas: 0,
        rol_sennova: null,
    })

    const submit = (e) => {
        e.preventDefault()
        method == 'crear'
            ? form.post(route('convocatorias.proyectos-linea-69.store', [convocatoria.id]), {
                  preserveScroll: true,
              })
            : proyecto_linea_69.proyecto.allowed.to_update
            ? form.post(route('convocatorias.proyectos-linea-69.update', [convocatoria.id, proyecto_linea_69.id]), {
                  preserveScroll: true,
              })
            : null
    }

    useEffect(() => {
        form.setData('max_meses_ejecucion', monthDiff(form.data.fecha_inicio, form.data.fecha_finalizacion))
    }, [form.data.fecha_inicio && form.data.fecha_finalizacion])

    return (
        <form onSubmit={submit}>
            <Grid container className="space-y-20">
                {nodos_tecnoparque.length > 0 ? (
                    <Grid container>
                        <Grid item md={6}>
                            <Label required labelFor="nodo_tecnoparque_id" value="Nodo Tecnoparque" />
                        </Grid>
                        <Grid item md={6}>
                            <Autocomplete
                                id="nodo_tecnoparque_id"
                                options={nodos_tecnoparque}
                                selectedValue={form.data.nodo_tecnoparque_id}
                                onChange={(event, newValue) => form.setData('nodo_tecnoparque_id', newValue.value)}
                                error={form.errors.nodo_tecnoparque_id}
                                placeholder="Seleccione un nodo Tecnoparque"
                                disabled={is_super_admin ? false : evaluacion || method === 'editar'}
                                required
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <div className="py-24">
                        <AlertMui>Su regional no cuenta con nodos TecnoParque.</AlertMui>
                    </div>
                )}

                {method == 'editar' && (
                    <>
                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} labelFor="linea_programatica_id" value="Código dependencia presupuestal (SIIF)" />
                        </Grid>
                        <Grid item md={6}>
                            {proyecto_linea_69?.proyecto.linea_programatica
                                ? proyecto_linea_69?.proyecto.linea_programatica.nombre + ' - ' + proyecto_linea_69?.proyecto.linea_programatica.codigo
                                : ''}
                        </Grid>

                        <Grid item md={6}>
                            <Label required disabled={evaluacion ? true : false} labelFor="centro_formacion_id" value="Centro de formación" />
                            <small>
                                <strong>Nota:</strong> El Centro de Formación relacionado es el ejecutor del proyecto
                            </small>
                        </Grid>
                        <Grid item md={6}>
                            <p className="first-letter:uppercase">{proyecto_linea_69?.proyecto.centro_formacion.nombre}</p>
                        </Grid>
                    </>
                )}

                <Grid item md={6}>
                    <Label required labelFor="fecha_inicio" error={form.errors.fecha_inicio} value="Fecha de inicio" />
                </Grid>
                <Grid item md={6}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_inicio"
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
                        name="fecha_finalizacion"
                        value={form.data.fecha_finalizacion}
                        className="p-4 w-full"
                        onChange={(e) => form.setData('fecha_finalizacion', e.target.value)}
                        required
                    />
                </Grid>

                {method == 'crear' && (
                    <>
                        <Grid item md={12}>
                            <p className="text-center mt-36 mb-8">Información de mi participación en el proyecto</p>
                        </Grid>

                        <Grid item md={6}>
                            <Label required labelFor="rol_sennova" value="Rol SENNOVA" />
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
                                    <Label required labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
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
                            <Label required labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
                        </Grid>
                        <Grid item md={6}>
                            <TextInput
                                type="number"
                                id="cantidad_horas"
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    max: form.data.rol_sennova?.maxHoras,
                                }}
                                value={form.data.cantidad_horas}
                                onChange={(e) => form.setData('cantidad_horas', e.target.value)}
                                placeholder="Número de horas semanales dedicadas"
                                required
                            />
                        </Grid>
                    </>
                )}
                {method == 'editar' && (
                    <>
                        {convocatoria.descripcion?.includes('proyectos de tecnoacademia y tecnoparque') && (
                            <>
                                <Grid item md={6}>
                                    <Label required labelFor="pdf_proyecto_general" value="Archivo en formato (.pdf) del proyecto general" />
                                </Grid>

                                <Grid item md={6}>
                                    <FileInput
                                        id="pdf_proyecto_general"
                                        maxSize="10000"
                                        value={form.data.pdf_proyecto_general}
                                        valueDb={proyecto_linea_69?.pdf_proyecto_general}
                                        error={form.errors.pdf_proyecto_general}
                                        route={
                                            proyecto_linea_69?.pdf_proyecto_general?.includes('http')
                                                ? null
                                                : route('convocatorias.proyectos-linea-69.download-file-sharepoint', [convocatoria.id, tp, 'pdf_proyecto_general'])
                                        }
                                        required
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="resumen" value="Resumen del proyecto" />
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
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="resumen_regional" value="Complemento - Resumen ejecutivo regional" />

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
                            <Label required disabled={evaluacion ? true : false} labelFor="antecedentes" value="Antecedentes" />
                            <AlertMui>
                                Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la
                                temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición. De igual
                                forma, relacionar los proyectos ejecutados en vigencias anteriores (incluir códigos SGPS), si el proyecto corresponde a la continuidad de proyectos SENNOVA.
                            </AlertMui>

                            <Textarea
                                id="antecedentes"
                                error={form.errors.antecedentes}
                                value={form.data.antecedentes}
                                onChange={(e) => form.setData('antecedentes', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [24]) && !proyecto_linea_69?.proyecto_base}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="antecedentes_regional" value="Complemento - Antecedentes regional" />

                            <Textarea
                                id="antecedentes_regional"
                                error={form.errors.antecedentes_regional}
                                value={form.data.antecedentes_regional}
                                onChange={(e) => form.setData('antecedentes_regional', e.target.value)}
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
                                value="Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto"
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
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="articulacion_agenda_competitividad"
                                value="Articulación y contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad."
                            />

                            <Textarea
                                id="articulacion_agenda_competitividad"
                                error={form.errors.articulacion_agenda_competitividad}
                                value={form.data.articulacion_agenda_competitividad}
                                onChange={(e) => form.setData('articulacion_agenda_competitividad', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="aportes_linea_ocho_conpes"
                                value="Aportes del Tecnoparque en el {convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos  CONPES'"
                            />

                            <Textarea
                                id="aportes_linea_ocho_conpes"
                                error={form.errors.aportes_linea_ocho_conpes}
                                value={form.data.aportes_linea_ocho_conpes}
                                onChange={(e) => form.setData('aportes_linea_ocho_conpes', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="estado_ecosistema_ctel"
                                value="Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades de articulación con el Tecnoparque."
                            />

                            <Textarea
                                id="estado_ecosistema_ctel"
                                error={form.errors.estado_ecosistema_ctel}
                                value={form.data.estado_ecosistema_ctel}
                                onChange={(e) => form.setData('estado_ecosistema_ctel', e.target.value)}
                                required
                                disabled={evaluacion ? true : false}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label
                                required
                                disabled={evaluacion ? true : false}
                                className="mb-4"
                                labelFor="logros_vigencia_anterior"
                                value="Describa los principales logros del Tecnoparque en el {convocatoria.year - 1}"
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
                            <Label required disabled={evaluacion ? true : false} labelFor="marco_conceptual" value="Marco conceptual" />
                            <AlertMui>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</AlertMui>

                            <Textarea
                                id="marco_conceptual"
                                error={form.errors.marco_conceptual}
                                value={form.data.marco_conceptual}
                                onChange={(e) => form.setData('marco_conceptual', e.target.value)}
                                required
                                disabled={!is_super_admin && !checkPermissionByUser(auth_user, [24]) && !proyecto_linea_69?.proyecto_base}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <Label required disabled={evaluacion ? true : false} labelFor="bibliografia" value="Bibliografía" />
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

            {method == 'crear' || proyecto_linea_69?.proyecto?.allowed?.to_update ? (
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

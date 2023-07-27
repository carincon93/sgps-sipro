import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Checkbox from '@/Components/Checkbox'
import DatePicker from '@/Components/DatePicker'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import TextInput from '@/Components/TextInput'

import { useForm } from '@inertiajs/react'

import { Grid } from '@mui/material'

const Form = ({
    usuario,
    tipos_documento,
    tipos_vinculacion,
    municipios,
    redes_conocimiento,
    disciplinas_conocimiento,
    niveles_ingles,
    grupos_etnicos,
    opciones_genero,
    tipos_discapacidad,
    roles_sennova,
    subareas_experiencia,
    centros_formacion,
    estudios_academicos,
    formaciones_academicas_sena,
    participaciones_grupos_investigacion_sena,
    participaciones_proyectos_sennova,
}) => {
    const form = useForm({
        nombre: usuario.nombre,
        email: usuario.email,
        tipo_documento: usuario.tipo_documento,
        numero_documento: usuario.numero_documento,
        numero_celular: usuario.numero_celular,
        tipo_vinculacion: usuario.tipo_vinculacion,
        lugar_expedicion_id: usuario.lugar_expedicion_id,
        genero: usuario.genero,
        fecha_nacimiento: usuario.fecha_nacimiento,
        horas_dedicadas: usuario.horas_dedicadas,
        meses_dedicados: usuario.meses_dedicados,
        nivel_ingles: usuario.nivel_ingles,
        fecha_resolucion_nombramiento: usuario.fecha_resolucion_nombramiento,
        fecha_acta_nombramiento: usuario.fecha_acta_nombramiento,
        nro_acta_nombramiento: usuario.nro_acta_nombramiento,
        grado_sennova: usuario.grado_sennova,
        fecha_inicio_contrato: usuario.fecha_inicio_contrato,
        fecha_finalizacion_contrato: usuario.fecha_finalizacion_contrato,
        asignacion_mensual: usuario.asignacion_mensual,
        rol_sennova_id: usuario.rol_sennova_id,
        otros_roles_sennova: null,
        tiempo_por_rol: usuario.tiempo_por_rol,
        roles_fuera_sennova: usuario.roles_fuera_sennova,
        cvlac: usuario.cvlac,
        link_sigep_ii: usuario.link_sigep_ii,
        grupo_etnico: usuario.grupo_etnico,
        discapacidad: usuario.discapacidad,
        subarea_experiencia_laboral: usuario.subarea_experiencia_laboral,

        red_conocimiento_id: usuario.red_conocimiento_id,
        disciplinas_subarea_conocimiento: null,
        experiencia_laboral_sena: usuario.experiencia_laboral_sena,
        cursos_de_evaluacion_realizados: usuario.cursos_de_evaluacion_realizados,
        numero_proyectos_evaluados: usuario.numero_proyectos_evaluados,

        meses_experiencia_metodos_ensayo: usuario.meses_experiencia_metodos_ensayo,
        meses_experiencia_metodos_calibracion: usuario.meses_experiencia_metodos_calibracion,

        autorizacion_datos: usuario.autorizacion_datos,
        informacion_completa: usuario.informacion_completa ? 1 : 2,
        centro_formacion_id: usuario.centro_formacion_id,

        cursos_evaluacion_proyectos: usuario.cursos_evaluacion_proyectos ? 1 : 2,
        experiencia_como_evaluador: usuario.experiencia_como_evaluador ? 1 : 2,
        participacion_como_evaluador_sennova: usuario.participacion_como_evaluador_sennova ? 1 : 2,
        conocimiento_iso_17025: usuario.conocimiento_iso_17025 ? 1 : 2,
        conocimiento_iso_19011: usuario.conocimiento_iso_19011 ? 1 : 2,
        conocimiento_iso_29119: usuario.conocimiento_iso_29119 ? 1 : 2,
        conocimiento_iso_9001: usuario.conocimiento_iso_9001 ? 1 : 2,
        experiencia_metodos_ensayo: usuario.experiencia_metodos_ensayo ? 1 : 2,
        experiencia_metodos_calibracion: usuario.experiencia_metodos_calibracion ? 1 : 2,
        experiencia_minima_metodos: usuario.experiencia_minima_metodos ? 1 : 2,
    })

    const submit = (e) => {
        e.preventDefault()
        form.put(route('users.change-user-profile'), {
            preserveScroll: true,
        })
    }

    return (
        <form onSubmit={submit} id="informacion-basica">
            <Grid container rowSpacing={8} padding={4}>
                <Grid item md={6}>
                    <TextInput label="Nombre completo" id="nombre" type="text" value={form.data.nombre} error={form.errors.nombre} required />
                </Grid>

                <Grid item md={6}>
                    <TextInput label="Correo electrónico institucional" id="email" type="email" value={form.data.email} error={form.errors.email} required />
                </Grid>

                <Grid item md={5}>
                    <Autocomplete id="tipo_documento" options={tipos_documento} selectedValue={form.data.tipo_documento} error={form.errors.tipo_documento} label="Tipo de documento" required />
                </Grid>
                <Grid item md={3}>
                    <TextInput label="Número de documento" id="numero_documento" type="number" value={form.data.numero_documento} error={form.errors.numero_documento} required />
                </Grid>
                <Grid item md={4}>
                    <Autocomplete
                        id="lugar_expedicion_id"
                        options={municipios}
                        selectedValue={form.data.lugar_expedicion_id}
                        error={form.errors.lugar_expedicion_id}
                        label="Lugar de expedición"
                        required
                    />
                </Grid>

                <Grid item md={4}>
                    <Autocomplete id="genero" options={opciones_genero} selectedValue={form.data.genero} error={form.errors.genero} label="Género" required />
                </Grid>
                <Grid item md={4}>
                    <DatePicker
                        variant="outlined"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        value={form.data.fecha_nacimiento}
                        className="p-4 w-full"
                        onChange={(e) => form.setData('fecha_nacimiento', e.target.value)}
                        error={form.errors.fecha_nacimiento}
                        label="Fecha de nacimiento"
                        required
                    />
                </Grid>
                <Grid item md={4}>
                    <TextInput label="Número de celular" id="numero_celular" type="number" value={form.data.numero_celular} error={form.errors.numero_celular} required />
                </Grid>

                <Grid item md={12}>
                    <h1 className="text-2xl font-medium">EXPERIENCIA PROFESIONAL Y/O ACADÉMICA</h1>
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="subarea_experiencia_laboral"
                        options={subareas_experiencia}
                        selectedValue={form.data.subarea_experiencia_laboral}
                        error={form.errors.subarea_experiencia_laboral}
                        label="Subárea de experiencia profesional"
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <SelectMultiple
                        id="disciplinas_subarea_conocimiento"
                        bdValues={form.data.disciplinas_subarea_conocimiento}
                        options={disciplinas_conocimiento}
                        error={form.errors.disciplinas_subarea_conocimiento}
                        label="Disciplinas de conocimiento en la cuales se desempeña"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="red_conocimiento_id"
                        options={redes_conocimiento}
                        selectedValue={form.data.red_conocimiento_id}
                        error={form.errors.red_conocimiento_id}
                        label="Red de conocimiento sectorial en la cual se desempeña"
                    />
                </Grid>
                <Grid item md={12}>
                    <Autocomplete
                        id="centro_formacion_id"
                        options={centros_formacion}
                        selectedValue={form.data.centro_formacion_id}
                        error={form.errors.centro_formacion_id}
                        label="Centro de formación al cual está vinculado"
                        required
                    />
                </Grid>

                <Grid item md={6}>
                    <Autocomplete id="nivel_ingles" options={niveles_ingles} selectedValue={form.data.nivel_ingles} error={form.errors.nivel_ingles} label="Nivel de inglés" required />
                    <small>Indique el nivel de inglés certificado (marco europeo)</small>
                </Grid>
                <Grid item md={6}>
                    <Autocomplete id="grupo_etnico" options={grupos_etnicos} selectedValue={form.data.grupo_etnico} error={form.errors.grupo_etnico} label="Preferencia étnica" required />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="discapacidad"
                        options={tipos_discapacidad}
                        selectedValue={form.data.discapacidad}
                        error={form.errors.discapacidad}
                        label="Si cuenta con algún tipo de discapacidad. Por favor seleccione cual discapacidad."
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <TextInput label="Enlace CvLac" id="cvlac" type="url" value={form.data.cvlac} error={form.errors.cvlac} />
                    <small>Debe incluir el http:// o https://</small>
                </Grid>

                <Grid item md={12}>
                    <h1 className="text-2xl font-medium">INFORMACIÓN DEL TIPO DE VINCULACIÓN</h1>
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="tipo_vinculacion"
                        options={tipos_vinculacion}
                        selectedValue={form.data.tipo_vinculacion}
                        error={form.errors.tipo_vinculacion}
                        label="Tipo de vinculación"
                        required
                    />
                </Grid>

                {form.data.tipo_vinculacion == 1 || form.data.tipo_vinculacion == 2 ? (
                    <>
                        <Grid item md={6}>
                            <DatePicker
                                variant="outlined"
                                id="fecha_resolucion_nombramiento"
                                name="fecha_resolucion_nombramiento"
                                value={form.data.fecha_resolucion_nombramiento}
                                className="p-4 w-full"
                                onChange={(e) => form.setData('fecha_resolucion_nombramiento', e.target.value)}
                                error={form.errors.fecha_resolucion_nombramiento}
                                label="Fecha de resolución de nombramiento"
                                required
                            />
                        </Grid>
                        <Grid item md={6}>
                            <DatePicker
                                variant="outlined"
                                id="fecha_acta_nombramiento"
                                name="fecha_acta_nombramiento"
                                value={form.data.fecha_acta_nombramiento}
                                className="p-4 w-full"
                                onChange={(e) => form.setData('fecha_acta_nombramiento', e.target.value)}
                                error={form.errors.fecha_acta_nombramiento}
                                label="Fecha del acta de nombramiento"
                                required
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextInput
                                label="Número del acta de nombramiento"
                                id="nro_acta_nombramiento"
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                                value={form.data.nro_acta_nombramiento}
                                error={form.errors.nro_acta_nombramiento}
                                required
                            />
                        </Grid>
                    </>
                ) : form.data.tipo_vinculacion == 3 ? (
                    <>
                        <Grid item md={6}>
                            <DatePicker
                                variant="outlined"
                                id="fecha_inicio_contrato"
                                name="fecha_inicio_contrato"
                                value={form.data.fecha_inicio_contrato}
                                className="p-4 w-full"
                                onChange={(e) => form.setData('fecha_inicio_contrato', e.target.value)}
                                error={form.errors.fecha_inicio_contrato}
                                label="Fecha de inicio del contrato"
                                required
                            />
                        </Grid>
                        <Grid item md={6}>
                            <DatePicker
                                variant="outlined"
                                id="fecha_finalizacion_contrato"
                                name="fecha_finalizacion_contrato"
                                value={form.data.fecha_finalizacion_contrato}
                                className="p-4 w-full"
                                onChange={(e) => form.setData('fecha_finalizacion_contrato', e.target.value)}
                                error={form.errors.fecha_finalizacion_contrato}
                                label="Fecha de finalizacion del contrato"
                                required
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextInput label="Enlace a SIGEP II" id="link_sigep_ii" type="url" value={form.data.link_sigep_ii} error={form.errors.link_sigep_ii} />
                            <small>Debe incluir el http:// o https://</small>
                        </Grid>
                    </>
                ) : null}

                <Grid item md={4}>
                    <TextInput
                        label="Asignación mensual"
                        id="asignacion_mensual"
                        inputProps={{
                            min: 0,
                            prefix: '$',
                        }}
                        isCurrency={true}
                        value={form.data.asignacion_mensual}
                        error={form.errors.asignacion_mensual}
                        required
                    />
                </Grid>
                <Grid item md={8}>
                    <TextInput
                        label="Tiempo de experiencia laboral en el SENA"
                        id="experiencia_laboral_sena"
                        type="number"
                        inputProps={{
                            min: 0,
                        }}
                        value={form.data.experiencia_laboral_sena}
                        error={form.errors.experiencia_laboral_sena}
                        required
                    />
                    <small>Importante: Tiempo en meses</small>
                </Grid>

                <Grid item md={12}>
                    <TextInput
                        label="Número de horas semanales de dedicación en actividades de CTeI"
                        id="horas_dedicadas"
                        type="number"
                        inputProps={{
                            min: 0,
                        }}
                        value={form.data.horas_dedicadas}
                        error={form.errors.horas_dedicadas}
                        required
                    />
                </Grid>
                <Grid item md={12}>
                    <TextInput
                        label="Número de meses de dedicación en actividades de CTeI"
                        id="meses_dedicados"
                        type="number"
                        inputProps={{
                            min: 0,
                        }}
                        value={form.data.meses_dedicados}
                        error={form.errors.meses_dedicados}
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete id="rol_sennova_id" selectedValue={form.data.rol_sennova_id} options={roles_sennova} error={form.errors.rol_sennova_id} label="Rol SENNOVA actual" required />
                </Grid>

                <Grid item md={12}>
                    <SelectMultiple
                        id="otros_roles_sennova"
                        bdValues={form.data.otros_roles_sennova}
                        options={roles_sennova}
                        error={form.errors.otros_roles_sennova}
                        label="Roles SENNOVA en los cuales ha sido contratado/vinculado"
                    />

                    {form.data.otros_roles_sennova && (
                        <>
                            <p className="mt-8 mb-4">A continuación, indique el tiempo que ha estado en cada rol SENNOVA.</p>
                            <strong>Importante:</strong> Para ello copie la siguiente lista de roles en el campo en blanco:
                            <p className="text-xs mt-2"></p>
                            <Tags
                                id="tiempo_por_rol"
                                className="mt-2"
                                enforceWhitelist={false}
                                bind:tags={form.data.tiempo_por_rol}
                                placeholder="Por favor indique el rol y el tiempo"
                                error={form.errors.tiempo_por_rol}
                            />
                        </>
                    )}
                </Grid>

                <Grid item md={12}>
                    <Label labelFor="roles_fuera_sennova" value="Si ha estado en otros roles fuera de SENNOVA por favor indiquelos en el siguiente campo. Separados por coma (,)" />

                    <Tags
                        id="roles_fuera_sennova"
                        className="mt-4"
                        enforceWhitelist={false}
                        bind:tags={form.data.roles_fuera_sennova}
                        placeholder="Indique el rol"
                        error={form.errors.roles_fuera_sennova}
                    />
                </Grid>

                <Grid item md={12}>
                    <h1 className="text-2xl font-medium">EXPERIENCIA COMO FORMULADOR Y EVALUADOR DE PROYECTOS</h1>
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="experiencia_como_evaluador"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.experiencia_como_evaluador}
                        error={form.errors.experiencia_como_evaluador}
                        label="¿Tiene experiencia como evaluador?"
                        required
                    />
                </Grid>

                {form.data.experiencia_como_evaluador == 1 && (
                    <Grid item md={12}>
                        <TextInput
                            id="numero_proyectos_evaluados"
                            type="number"
                            inputProps={{
                                min: 0,
                            }}
                            value={form.data.numero_proyectos_evaluados}
                            error={form.errors.numero_proyectos_evaluados}
                            label="Si su respuesta en la pregunta anterior es 'SI' indique el número de proyectos que ha evaluado"
                            required
                        />
                    </Grid>
                )}

                <Grid item md={12}>
                    <Autocomplete
                        id="cursos_evaluacion_proyectos"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.cursos_evaluacion_proyectos}
                        error={form.errors.cursos_evaluacion_proyectos}
                        label="¿Ha realizado cursos complementarios relacionados con evaluación de proyectos?"
                        required
                    />
                </Grid>

                {form.data.cursos_evaluacion_proyectos == 1 && (
                    <Grid item md={12}>
                        <Label
                            required
                            className="mb-4"
                            labelFor="cursos_de_evaluacion_realizados"
                            label="Si su respuesta en la pregunta anterior es 'SI' indique los cursos que ha realizado separados por (,)"
                        />
                        <Tags
                            id="cursos_de_evaluacion_realizados"
                            className="mt-4"
                            enforceWhitelist={false}
                            bind:tags={form.data.cursos_de_evaluacion_realizados}
                            placeholder="Nombres de los cursos"
                            error={form.errors.cursos_de_evaluacion_realizados}
                        />
                    </Grid>
                )}

                <Grid item md={12}>
                    <Autocomplete
                        id="participacion_como_evaluador_sennova"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.participacion_como_evaluador_sennova}
                        error={form.errors.participacion_como_evaluador_sennova}
                        label="¿Ha participado como evaluador Sennova en vigencias anteriores?"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <h1 className="text-2xl font-medium">CURSOS REALIZADOS</h1>
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="conocimiento_iso_17025"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.conocimiento_iso_17025}
                        error={form.errors.conocimiento_iso_17025}
                        label="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO/IEC 17025:2017?"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="conocimiento_iso_19011"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.conocimiento_iso_19011}
                        error={form.errors.conocimiento_iso_19011}
                        label="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 19011:2018?"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="conocimiento_iso_29119"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.conocimiento_iso_29119}
                        error={form.errors.conocimiento_iso_29119}
                        label="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 29119 Vigente?"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="conocimiento_iso_9001"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.conocimiento_iso_9001}
                        error={form.errors.conocimiento_iso_9001}
                        label="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 9001:2015?"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <Autocomplete
                        id="experiencia_metodos_ensayo"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.experiencia_metodos_ensayo}
                        error={form.errors.experiencia_metodos_ensayo}
                        label="¿Tiene experiencia técnica en métodos de ensayo?"
                        required
                    />
                </Grid>

                {form.data.experiencia_metodos_ensayo == 1 && (
                    <Grid item md={12}>
                        <TextInput
                            id="meses_experiencia_metodos_ensayo"
                            type="number"
                            inputProps={{
                                min: 0,
                            }}
                            value={form.data.meses_experiencia_metodos_ensayo}
                            error={form.errors.meses_experiencia_metodos_ensayo}
                            label="Si su respuesta en la pregunta anterior es 'SI' indique el número de meses de experiencia"
                            required
                        />
                    </Grid>
                )}

                <Grid item md={12}>
                    <Autocomplete
                        id="experiencia_metodos_calibracion"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        selectedValue={form.data.experiencia_metodos_calibracion}
                        error={form.errors.experiencia_metodos_calibracion}
                        label="¿Tiene experiencia técnica con métodos de calibración?"
                        required
                    />
                </Grid>

                {form.data.experiencia_metodos_calibracion == 1 && (
                    <Grid item md={12}>
                        <TextInput
                            id="meses_experiencia_metodos_calibracion"
                            type="number"
                            inputProps={{
                                min: 0,
                            }}
                            value={form.data.meses_experiencia_metodos_calibracion}
                            error={form.errors.meses_experiencia_metodos_calibracion}
                            label="Si su respuesta en la pregunta anterior es 'SI' indique el número de meses de experiencia"
                            required
                        />
                    </Grid>
                )}

                <Grid item md={12}>
                    <Label
                        required
                        className="mb-4"
                        labelFor="experiencia_minima_metodos"
                        value="¿Cuenta con experiencia técnica mínimo de doce (12) meses relacionada por lo menos con dos (2) métodos de ensayo o dos (2) métodos de calibración o dos (2) productos de base tecnológica (TICs)?"
                    />
                    <Autocomplete
                        id="experiencia_minima_metodos"
                        options={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        className="mt-4"
                        selectedValue={form.data.experiencia_minima_metodos}
                        error={form.errors.experiencia_minima_metodos}
                        label="Seleccione una opción"
                        required
                    />
                </Grid>

                <Grid item md={12}>
                    <AlertMui>
                        Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (Acuerdo No. 0009 del 2016)
                    </AlertMui>

                    <Checkbox
                        className="mt-8"
                        name="autorizacion_datos"
                        checked={form.data.autorizacion_datos}
                        error={form.errors.autorizacion_datos}
                        onChange={(e) => form.setData('autorizacion_datos', e.target.checked)}
                        label="Autorizo el tratamiento de mis datos personales."
                    />
                </Grid>
            </Grid>

            <div className="py-4 flex items-center">
                <PrimaryButton disabled={form.data.processing} type="submit">
                    Guardar cambios
                </PrimaryButton>
            </div>
        </form>
    )
}

export default Form

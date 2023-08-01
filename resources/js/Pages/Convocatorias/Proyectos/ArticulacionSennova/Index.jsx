import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

import Participantes from '../Participantes/Participantes'
import Evaluacion from './Evaluacion'

const ArticulacionSennova = ({
    auth,
    convocatoria,
    proyecto,
    evaluacion,
    disciplinas_subarea_conocimiento,
    lineas_investigacion,
    grupos_investigacion,
    semilleros_investigacion,
    redes_conocimiento,
    tematicas_estrategicas,
    actividades_economicas,
    proyectos_idi_tecnoacademia,
    centros_formacion,
    autor_principal,
    tipos_documento,
    tipos_vinculacion,
    roles_sennova,
    nuevo_participante,
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])
    const [evaluacion_dialog_status, setEvaluacionDialogStatus] = useState(false)

    const form = useForm({
        lineas_investigacion: proyecto.lineasInvestigacion?.map((item) => item.id),
        grupos_investigacion: proyecto.gruposInvestigacion?.map((item) => item.id),
        semilleros_investigacion: proyecto.semillerosInvestigacion?.map((item) => item.id),

        // Línea 70
        disciplinas_subarea_conocimiento: proyecto?.proyectoLinea70?.disciplinas_subarea_conocimiento?.map((item) => item.id),
        redes_conocimiento: proyecto?.proyectoLinea70?.redes_conocimiento?.map((item) => item.id),
        actividades_economicas: proyecto?.proyectoLinea70?.actividades_economicas?.map((item) => item.id),
        tematicas_estrategicas: proyecto?.proyectoLinea70?.tematicas_estrategicas?.map((item) => item.id),
        proyecto_idi_tecnoacademia_id: proyecto?.proyectoLinea70?.proyectos_idi_tecnoacademia?.map((item) => item.id),

        proyectos_ejecucion: proyecto.proyectos_ejecucion ? proyecto.proyectos_ejecucion : '',
        semilleros_en_formalizacion: proyecto.semilleros_en_formalizacion,
        articulacion_semillero: proyecto.articulacion_semillero,
        articulacion_centro_formacion: proyecto.articulacion_centro_formacion,
        lineas_medulares_centro: proyecto.lineas_medulares_centro,
        articulacion_programas_centro: proyecto.articulacion_programas_centro,
        articulacion_bienestar_aprendiz: proyecto.articulacion_bienestar_aprendiz,
        favorecimiento_ruta_formacion: proyecto.favorecimiento_ruta_formacion,

        // Línea 69
        impacto_centro_formacion: proyecto.impacto_centro_formacion,
        aportacion_semilleros_grupos: proyecto.aportacion_semilleros_grupos,
        proyeccion_con_st: proyecto.proyeccion_con_st,
        proyeccion_extensionismo_tecnologico: proyecto.proyeccion_extensionismo_tecnologico,
        proyeccion_centros_desarrollo: proyecto.proyeccion_centros_desarrollo,
        proyeccion_formacion_regional: proyecto.proyeccion_formacion_regional,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.articulacion-sennova.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const formArticulacionSennovaProyectosHub = useForm({
        contribucion_formacion_centro_regional: proyecto.proyectoHubLinea69?.contribucion_formacion_centro_regional,
        acciones_fortalecimiento_centro_regional: proyecto.proyectoHubLinea69?.acciones_fortalecimiento_centro_regional,
        acciones_participacion_aprendices: proyecto.proyectoHubLinea69?.acciones_participacion_aprendices,
        acciones_aportes_por_edt: proyecto.proyectoHubLinea69?.acciones_aportes_por_edt,
        acciones_fortalecimiento_programas_calificados: proyecto.proyectoHubLinea69?.acciones_fortalecimiento_programas_calificados,
        acciones_categorizacion_grupos_investigacion: proyecto.proyectoHubLinea69?.acciones_categorizacion_grupos_investigacion,
        oportunidades_fortalecimiento_proyectos_sennova: proyecto.proyectoHubLinea69?.oportunidades_fortalecimiento_proyectos_sennova,
        proyeccion_articulacion_linea_68: proyecto.proyectoHubLinea69?.proyeccion_articulacion_linea_68,
        proyeccion_articulacion_linea_83: proyecto.proyectoHubLinea69?.proyeccion_articulacion_linea_83,
        oportunidades_fortalecimiento_convocatorias_innovacion: proyecto.proyectoHubLinea69?.oportunidades_fortalecimiento_convocatorias_innovacion,
        proyeccion_articulacion_centros_empresariales: proyecto.proyectoHubLinea69?.proyeccion_articulacion_centros_empresariales,
        grupos_investigacion: proyecto.gruposInvestigacion?.map((item) => item.id),
        semilleros_investigacion: proyecto.semillerosInvestigacion?.map((item) => item.id),
    })
    const submitArticulacionSennovaProyectoHub = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formArticulacionSennovaProyectosHub.post(route('convocatorias.proyectos.articulacion-sennova-proyectos-hub.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const formArticulacionSennovaProyectosLinea83 = useForm({
        impacto_centros_formacion: proyecto.proyectoLinea83?.impacto_centros_formacion,
        articulacion_semilleros_grupos_investigacion: proyecto.proyectoLinea83?.articulacion_semilleros_grupos_investigacion,
        articulacion_linea_68: proyecto.proyectoLinea83?.articulacion_linea_68,
        articulacion_linea_69_y_hubs: proyecto.proyectoLinea83?.articulacion_linea_69_y_hubs,
        articulacion_centros_desarrollo_empresarial: proyecto.proyectoLinea83?.articulacion_centros_desarrollo_empresarial,
        contribucion_formacion_regional_nacional: proyecto.proyectoLinea83?.contribucion_formacion_regional_nacional,
        proyeccion_capacidades_tecnologicas_empresas: proyecto.proyectoLinea83?.proyeccion_capacidades_tecnologicas_empresas,
    })
    const submitArticulacionSennovaProyectosLinea83 = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            formArticulacionSennovaProyectosLinea83.post(route('convocatorias.proyectos.articulacion-sennova-proyectos-linea-83.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
            </Grid>

            <Grid item md={4}>
                Evaluación
            </Grid>
            <Grid item md={8}>
                {evaluacion && (
                    <>
                        <ButtonMui onClick={() => setEvaluacionDialogStatus(true)} primary={true}>
                            Evaluar
                        </ButtonMui>
                        <DialogMui
                            fullWidth={true}
                            maxWidth="lg"
                            open={evaluacion_dialog_status}
                            dialogContent={
                                <>
                                    <Evaluacion auth_user={auth.user} proyecto={proyecto} evaluacion={evaluacion} />
                                </>
                            }
                            dialogActions={
                                <ButtonMui onClick={() => setEvaluacionDialogStatus(false)} primary={true} className="!mr-6">
                                    Cerrar
                                </ButtonMui>
                            }
                        />
                    </>
                )}
            </Grid>

            <Grid item md={12}>
                <div className="mt-16">
                    <Participantes
                        centros_formacion={centros_formacion}
                        autor_principal={autor_principal}
                        convocatoria={convocatoria}
                        proyecto={proyecto}
                        tipos_documento={tipos_documento}
                        tipos_vinculacion={tipos_vinculacion}
                        roles_sennova={roles_sennova}
                        nuevo_participante={nuevo_participante}
                    />
                </div>
            </Grid>
            <Grid item md={12}>
                <h1 className="text-3xl mt-24 mb-8 text-center">Articulación SENNOVA</h1>
                <p className="text-center mb-8">
                    A continuación, registre la información relacionada con la articulación de la línea de{' '}
                    {proyecto.codigo_linea_programatica == 70 ? 'TecnoAcademia' : proyecto.codigo_linea_programatica == 69 ? 'TecnoParque' : ''} con las otras líneas de SENNOVA en el centro y la
                    regional:
                </p>
                {(proyecto.codigo_linea_programatica == 69 && Object.keys(proyecto.proyectoHubLinea69) == 0) || proyecto.codigo_linea_programatica == 70 ? (
                    <form onSubmit={submit}>
                        <fieldset disabled={proyecto.allowed.to_update ? false : true}>
                            <Grid container className="space-y-20">
                                {proyecto.codigo_linea_programatica == 70 ? (
                                    <>
                                        <Grid item md={6}>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="lineas_investigacion"
                                                value="Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia"
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="lineas_investigacion"
                                                bdValues={form.data.lineas_investigacion}
                                                options={lineas_investigacion}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        lineas_investigacion: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.lineas_investigacion}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación en los cuales está vinculada la TecnoAcademia" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="grupos_investigacion"
                                                bdValues={form.data.grupos_investigacion}
                                                options={grupos_investigacion}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        grupos_investigacion: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.grupos_investigacion}
                                                placeholder="Seleccione el grupo de investigación"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="articulacion_semillero" value="¿Está la TecnoAcademia articulada con un semillero?" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <Autocomplete
                                                options={[
                                                    { value: 1, label: 'Si' },
                                                    { value: 2, label: 'No' },
                                                ]}
                                                id="articulacion_semillero"
                                                selectedValue={form.data.articulacion_semillero}
                                                error={form.errors.articulacion_semillero}
                                                onChange={(event, newValue) => form.setData('articulacion_semillero', newValue.value)}
                                                placeholder="Seleccione una opción"
                                                required
                                            />
                                        </Grid>

                                        {form.articulacion_semillero == 1 && (
                                            <>
                                                <Grid item md={6}>
                                                    <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación de la TecnoAcademia" />
                                                </Grid>

                                                <Grid item md={6}>
                                                    <SelectMultiple
                                                        id="semilleros_investigacion"
                                                        bdValues={form.data.semilleros_investigacion}
                                                        options={semilleros_investigacion}
                                                        onChange={(event, newValue) => {
                                                            const selected_values = newValue.map((option) => option.value)
                                                            form.setData((prevData) => ({
                                                                ...prevData,
                                                                semilleros_investigacion: selected_values,
                                                            }))
                                                        }}
                                                        error={form.errors.semilleros_investigacion}
                                                        placeholder="Seleccione el semillero de investigación"
                                                        required
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="proyectos_ejecucion" value={`Proyectos o iniciativas en ejecución en el año ${convocatoria.year - 1}`} />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="proyecto_idi_tecnoacademia_id"
                                                bdValues={form.data.proyecto_idi_tecnoacademia_id}
                                                options={proyectos_idi_tecnoacademia}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        proyecto_idi_tecnoacademia_id: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.proyecto_idi_tecnoacademia_id}
                                                placeholder="Seleccione uno o varias iniciativas"
                                                required
                                            />

                                            <AlertMui className="mt-10 mb-4">
                                                Si aún no ha registrado el proyecto en el módulo de <strong>Proyectos e iniciativas I+D+i TecnoAcademias</strong>, relacione en el siguiente campo el
                                                título del proyecto. Se recomienda hacer el registro en el módulo.
                                            </AlertMui>
                                            <Textarea
                                                label="Proyectos / Iniciativas"
                                                id="proyectos_ejecucion"
                                                error={form.errors.proyectos_ejecucion}
                                                value={form.data.proyectos_ejecucion}
                                                onChange={(e) => form.setData('proyectos_ejecucion', e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label className="mb-4" labelFor="semilleros_en_formalizacion" value="Semilleros en proceso de formalización (Separados por coma)" />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Tags
                                                id="semilleros_en_formalizacion"
                                                className="mt-4"
                                                enforceWhitelist={false}
                                                tags={form.data.semilleros_en_formalizacion}
                                                value={form.data.semilleros_en_formalizacion}
                                                onChange={(e) => form.setData('semilleros_en_formalizacion', e.target.value)}
                                                placeholder="Nombres de los semilleros"
                                                error={form.errors.semilleros_en_formalizacion}
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de conocimiento" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="disciplinas_subarea_conocimiento_id"
                                                bdValues={form.data.disciplinas_subarea_conocimiento}
                                                options={disciplinas_subarea_conocimiento}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        disciplinas_subarea_conocimiento: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.disciplinas_subarea_conocimiento}
                                                placeholder="Disciplinas subárea de concimiento"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="redes_conocimiento" value="Red de conocimiento sectorial" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="redes_conocimiento"
                                                bdValues={form.data.redes_conocimiento}
                                                options={redes_conocimiento}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        redes_conocimiento: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.redes_conocimiento}
                                                placeholder="Seleccione la red de conocimiento"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="actividades_economicas" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="actividades_economicas"
                                                bdValues={form.data.actividades_economicas}
                                                options={actividades_economicas}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        actividades_economicas: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.actividades_economicas}
                                                placeholder="Seleccione la actividad económica"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={6}>
                                            <Label required className="mb-4" labelFor="tematicas_estrategicas" value="Temática estratégica SENA" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <SelectMultiple
                                                id="tematicas_estrategicas"
                                                bdValues={form.data.tematicas_estrategicas}
                                                options={tematicas_estrategicas}
                                                onChange={(event, newValue) => {
                                                    const selected_values = newValue.map((option) => option.value)
                                                    form.setData((prevData) => ({
                                                        ...prevData,
                                                        tematicas_estrategicas: selected_values,
                                                    }))
                                                }}
                                                error={form.errors.tematicas_estrategicas}
                                                placeholder="Seleccione la temática estratégica SENA"
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <h6 className="mt-20 mb-12 text-2xl text-center">Articulación con el Centro</h6>
                                        </Grid>

                                        <Grid item md={12}>
                                            <Label required className="mb-4" labelFor="articulacion_centro_formacion" value="Articulación con el centro de formación" />

                                            <Textarea
                                                id="articulacion_centro_formacion"
                                                error={form.errors.articulacion_centro_formacion}
                                                value={form.data.articulacion_centro_formacion}
                                                onChange={(e) => form.setData('articulacion_centro_formacion', e.target.value)}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="articulacion_programas_centro"
                                                value="¿Articulación de la TecnoAcademia en los programas de formación del Centro? "
                                            />

                                            <Textarea
                                                id="articulacion_programas_centro"
                                                error={form.errors.articulacion_programas_centro}
                                                value={form.data.articulacion_programas_centro}
                                                onChange={(e) => form.setData('articulacion_programas_centro', e.target.value)}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="articulacion_bienestar_aprendiz"
                                                value="¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?  "
                                            />

                                            <Textarea
                                                id="articulacion_bienestar_aprendiz"
                                                error={form.errors.articulacion_bienestar_aprendiz}
                                                value={form.data.articulacion_bienestar_aprendiz}
                                                onChange={(e) => form.setData('articulacion_bienestar_aprendiz', e.target.value)}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Label
                                                required
                                                className="mb-4"
                                                labelFor="favorecimiento_ruta_formacion"
                                                value="¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?"
                                            />

                                            <Textarea
                                                id="fav"
                                                error={form.errors.favorecimiento_ruta_formacion}
                                                value={form.data.favorecimiento_ruta_formacion}
                                                onChange={(e) => form.setData('favorecimiento_ruta_formacion', e.target.value)}
                                                required
                                            />
                                        </Grid>

                                        <Grid item md={12}>
                                            <Label required className="mb-4" labelFor="lineas_medulares_centro" value="Líneas medulares del Centro con las que se articula la TecnoAcademia" />

                                            <Textarea
                                                id="lineas_medulares_centro"
                                                error={form.errors.lineas_medulares_centro}
                                                value={form.data.lineas_medulares_centro}
                                                onChange={(e) => form.setData('lineas_medulares_centro', e.target.value)}
                                                required
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    proyecto.codigo_linea_programatica == 69 &&
                                    proyecto.proyectoLinea69 && (
                                        <>
                                            <Grid item md={12}>
                                                <Label required className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />

                                                <Textarea
                                                    id="impacto_centro_formacion"
                                                    error={form.errors.impacto_centro_formacion}
                                                    value={form.data.impacto_centro_formacion}
                                                    onChange={(e) => form.setData('impacto_centro_formacion', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={12}>
                                                <Label
                                                    required
                                                    className="mb-4"
                                                    labelFor="aportacion_semilleros_grupos"
                                                    value={`Comente la articulación y aporte del TecnoParque proyectada para el ${convocatoria.year} a los semilleros y grupos de investigación.`}
                                                />

                                                <Textarea
                                                    id="aportacion_semilleros_grupos"
                                                    error={form.errors.aportacion_semilleros_grupos}
                                                    value={form.data.aportacion_semilleros_grupos}
                                                    onChange={(e) => form.setData('aportacion_semilleros_grupos', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={12}>
                                                <Label
                                                    required
                                                    className="mb-4"
                                                    labelFor="proyeccion_con_st"
                                                    value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, el Tecnoparque con la línea de Servicios Tecnológicos?`}
                                                />

                                                <Textarea
                                                    id="proyeccion_con_st"
                                                    error={form.errors.proyeccion_con_st}
                                                    value={form.data.proyeccion_con_st}
                                                    onChange={(e) => form.setData('proyeccion_con_st', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={12}>
                                                <Label
                                                    required
                                                    className="mb-4"
                                                    labelFor="proyeccion_extensionismo_tecnologico"
                                                    value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, el Tecnoparque con la línea de Extensionismo Tecnológico?`}
                                                />

                                                <Textarea
                                                    id="proyeccion_extensionismo_tecnologico"
                                                    error={form.errors.proyeccion_extensionismo_tecnologico}
                                                    value={form.data.proyeccion_extensionismo_tecnologico}
                                                    onChange={(e) => form.setData('proyeccion_extensionismo_tecnologico', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={12}>
                                                <Label
                                                    required
                                                    className="mb-4"
                                                    labelFor="proyeccion_centros_desarrollo"
                                                    value={`¿Cómo proyecta la articulación en el ${convocatoria.year}, el Tecnoparque con los centros de desarrollo empresarial de la Regional?`}
                                                />

                                                <Textarea
                                                    id="proyeccion_centros_desarrollo"
                                                    error={form.errors.proyeccion_centros_desarrollo}
                                                    value={form.data.proyeccion_centros_desarrollo}
                                                    onChange={(e) => form.setData('proyeccion_centros_desarrollo', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={12}>
                                                <Label
                                                    required
                                                    className="mb-4"
                                                    labelFor="proyeccion_formacion_regional"
                                                    value={`¿Cómo proyecta en el ${convocatoria.year}, el Tecnoparque contribuir a la formación en la Regional o en el SENA?`}
                                                />

                                                <Textarea
                                                    id="proyeccion_formacion_regional"
                                                    error={form.errors.proyeccion_formacion_regional}
                                                    value={form.data.proyeccion_formacion_regional}
                                                    onChange={(e) => form.setData('proyeccion_formacion_regional', e.target.value)}
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={12}>
                                                <h1 className="text-4xl text-center">Semilleros y Grupos de investigación</h1>
                                            </Grid>

                                            <Grid item md={6}>
                                                <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
                                            </Grid>
                                            <Grid item md={6}>
                                                <SelectMultiple
                                                    id="semilleros_investigacion"
                                                    bdValues={form.data.semilleros_investigacion}
                                                    options={semilleros_investigacion}
                                                    onChange={(event, newValue) => {
                                                        const selected_values = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            semilleros_investigacion: selected_values,
                                                        }))
                                                    }}
                                                    error={form.errors.semilleros_investigacion}
                                                    placeholder="Seleccione el semillero de investigación"
                                                    required
                                                />
                                            </Grid>

                                            <Grid item md={6}>
                                                <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
                                            </Grid>
                                            <Grid item md={6}>
                                                <SelectMultiple
                                                    id="grupos_investigacion"
                                                    bdValues={form.data.grupos_investigacion}
                                                    options={grupos_investigacion}
                                                    onChange={(event, newValue) => {
                                                        const selected_values = newValue.map((option) => option.value)
                                                        form.setData((prevData) => ({
                                                            ...prevData,
                                                            grupos_investigacion: selected_values,
                                                        }))
                                                    }}
                                                    error={form.errors.grupos_investigacion}
                                                    placeholder="Seleccione el grupo de investigación"
                                                    required
                                                />
                                            </Grid>
                                        </>
                                    )
                                )}
                            </Grid>
                        </fieldset>
                        <div className=" flex items-center justify-between mt-14  py-4">
                            {proyecto.allowed.to_update && (
                                <PrimaryButton disabled={form.processing} className="ml-auto" type="submit">
                                    Guardar
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                ) : null}

                {proyecto.proyectoHubLinea69 && Object.keys(proyecto.proyectoHubLinea69).length > 0 && (
                    <form onSubmit={submitArticulacionSennovaProyectoHub}>
                        <Grid container className="space-y-20">
                            <Grid item md={12}>
                                <h1 className="text-center">CONTRIBUCIÓN A LA FORMACIÓN</h1>
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="contribucion_formacion_centro_regional"
                                    value="Cuales fueron las principales acciones ejecutadas por el Tecnoparque /hub de innovación en la vigencia 2023 para contribuir a la formación en el Centro y en la Regional"
                                />

                                <Textarea
                                    id="contribucion_formacion_centro_regional"
                                    error={formArticulacionSennovaProyectosHub.errors.contribucion_formacion_centro_regional}
                                    value={formArticulacionSennovaProyectosHub.data.contribucion_formacion_centro_regional}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('contribucion_formacion_centro_regional', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="acciones_fortalecimiento_centro_regional"
                                    value="Para la vigencia 2024, defina acciones a realizar desde el Tecnoparque/Hub de Innovación,  que sean verificables,  y que contribuyan al fortalecimiento de la formación en el Centro y en la regional"
                                />

                                <Textarea
                                    id="acciones_fortalecimiento_centro_regional"
                                    error={formArticulacionSennovaProyectosHub.errors.acciones_fortalecimiento_centro_regional}
                                    value={formArticulacionSennovaProyectosHub.data.acciones_fortalecimiento_centro_regional}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('acciones_fortalecimiento_centro_regional', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="acciones_participacion_aprendices"
                                    value="Defina acciones a realizar en el 2024, que promuevan la participación de aprendices en el Tecnoparque/Hub de Innovación"
                                />

                                <Textarea
                                    id="acciones_participacion_aprendices"
                                    error={formArticulacionSennovaProyectosHub.errors.acciones_participacion_aprendices}
                                    value={formArticulacionSennovaProyectosHub.data.acciones_participacion_aprendices}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('acciones_participacion_aprendices', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="acciones_aportes_por_edt"
                                    value="A partir de las acciones realizadas en el 2023, desde la oferta de Formación Complementaria (EDTs y otros Eventos), proyecte las acciones a realizar en la vigencia 2024 en las que participe el Tecnoparque/Hub de Innovación."
                                />

                                <Textarea
                                    id="acciones_aportes_por_edt"
                                    error={formArticulacionSennovaProyectosHub.errors.acciones_aportes_por_edt}
                                    value={formArticulacionSennovaProyectosHub.data.acciones_aportes_por_edt}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('acciones_aportes_por_edt', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <h1 className="text-center">CONTRIBUCIÓN A LA INVESTIGACIÓN</h1>
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="acciones_fortalecimiento_programas_calificados"
                                    value="Describa las acciones realizadas o productos generados que contribuyeron en el 2023 al Registro Calificado de Programas del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia 2024 que fortalezcan esta articulación."
                                />

                                <Textarea
                                    id="acciones_fortalecimiento_programas_calificados"
                                    error={formArticulacionSennovaProyectosHub.errors.acciones_fortalecimiento_programas_calificados}
                                    value={formArticulacionSennovaProyectosHub.data.acciones_fortalecimiento_programas_calificados}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('acciones_fortalecimiento_programas_calificados', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="acciones_categorizacion_grupos_investigacion"
                                    value="Describa las acciones realizadas o productos generados que contribuyeron en el 2023 a la categorización de Grupos de Investigación del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia 2024 que fortalezcan esta articulación."
                                />

                                <Textarea
                                    id="acciones_categorizacion_grupos_investigacion"
                                    error={formArticulacionSennovaProyectosHub.errors.acciones_categorizacion_grupos_investigacion}
                                    value={formArticulacionSennovaProyectosHub.data.acciones_categorizacion_grupos_investigacion}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('acciones_categorizacion_grupos_investigacion', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="oportunidades_fortalecimiento_proyectos_sennova"
                                    value="Describa los Proyectos de Investigación del Centro en la vigencia 2023, en los cuales participó el Tecnoparque /Hub. Plantee oportunidades para el fortalecimiento de esta articulación"
                                />

                                <Textarea
                                    id="oportunidades_fortalecimiento_proyectos_sennova"
                                    error={formArticulacionSennovaProyectosHub.errors.oportunidades_fortalecimiento_proyectos_sennova}
                                    value={formArticulacionSennovaProyectosHub.data.oportunidades_fortalecimiento_proyectos_sennova}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('oportunidades_fortalecimiento_proyectos_sennova', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
                            </Grid>
                            <Grid item md={6}>
                                <SelectMultiple
                                    id="semilleros_investigacion"
                                    bdValues={formArticulacionSennovaProyectosHub.data.semilleros_investigacion}
                                    options={semilleros_investigacion}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        formArticulacionSennovaProyectosHub.setData((prevData) => ({
                                            ...prevData,
                                            semilleros_investigacion: selected_values,
                                        }))
                                    }}
                                    error={formArticulacionSennovaProyectosHub.errors.semilleros_investigacion}
                                    placeholder="Seleccione el semillero de investigación"
                                    required
                                />
                            </Grid>

                            <Grid item md={6}>
                                <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
                            </Grid>
                            <Grid item md={6}>
                                <SelectMultiple
                                    id="grupos_investigacion"
                                    bdValues={formArticulacionSennovaProyectosHub.data.grupos_investigacion}
                                    options={grupos_investigacion}
                                    onChange={(event, newValue) => {
                                        const selected_values = newValue.map((option) => option.value)
                                        formArticulacionSennovaProyectosHub.setData((prevData) => ({
                                            ...prevData,
                                            grupos_investigacion: selected_values,
                                        }))
                                    }}
                                    error={formArticulacionSennovaProyectosHub.errors.grupos_investigacion}
                                    placeholder="Seleccione el grupo de investigación"
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <h1 className="text-center">El Tecnoparque/ Hub de Innovación en el Eje de Servicios de I+D+i</h1>
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="proyeccion_articulacion_linea_68"
                                    value="A partir de los resultados y las acciones realizadas por el Tecnoparque/Hub de Innovación, cómo proyecta la articulación en el 2023, el Tecnoparque con la línea de Servicios Tecnológicos?"
                                />

                                <Textarea
                                    id="proyeccion_articulacion_linea_68"
                                    error={formArticulacionSennovaProyectosHub.errors.proyeccion_articulacion_linea_68}
                                    value={formArticulacionSennovaProyectosHub.data.proyeccion_articulacion_linea_68}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('proyeccion_articulacion_linea_68', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="proyeccion_articulacion_linea_83"
                                    value="A partir de los resultados y las acciones realizadas por el Tecnoparque/Hub de Innovación, cómo proyecta la articulación en el 2023, el Tecnoparque con la línea de Extensionismo Tecnológico?"
                                />

                                <Textarea
                                    id="proyeccion_articulacion_linea_83"
                                    error={formArticulacionSennovaProyectosHub.errors.proyeccion_articulacion_linea_83}
                                    value={formArticulacionSennovaProyectosHub.data.proyeccion_articulacion_linea_83}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('proyeccion_articulacion_linea_83', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="oportunidades_fortalecimiento_convocatorias_innovacion"
                                    value="A partir de los resultados y las acciones realizadas por el Tecnoparque/Hub de Innovación en las convocatorias de Fomento a la Innovación, plantee oportunidades para el fortalecimietno de esta estrategia 2024 para ser implementadas en la siguiente vigencia."
                                />

                                <Textarea
                                    id="oportunidades_fortalecimiento_convocatorias_innovacion"
                                    error={formArticulacionSennovaProyectosHub.errors.oportunidades_fortalecimiento_convocatorias_innovacion}
                                    value={formArticulacionSennovaProyectosHub.data.oportunidades_fortalecimiento_convocatorias_innovacion}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('oportunidades_fortalecimiento_convocatorias_innovacion', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Label
                                    required
                                    className="mb-4"
                                    labelFor="proyeccion_articulacion_centros_empresariales"
                                    value="¿Cómo proyecta la articulación en el 2023, el Tecnoparque con los centros de desarrollo empresarial de la Regional?"
                                />

                                <Textarea
                                    id="proyeccion_articulacion_centros_empresariales"
                                    error={formArticulacionSennovaProyectosHub.errors.proyeccion_articulacion_centros_empresariales}
                                    value={formArticulacionSennovaProyectosHub.data.proyeccion_articulacion_centros_empresariales}
                                    onChange={(e) => formArticulacionSennovaProyectosHub.setData('proyeccion_articulacion_centros_empresariales', e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <div className=" flex items-center justify-between mt-14  py-4">
                            {proyecto.allowed.to_update && (
                                <PrimaryButton disabled={formArticulacionSennovaProyectosHub.processing} className="ml-auto" type="submit">
                                    Guardar
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                )}

                {proyecto.proyectoLinea83 && Object.keys(proyecto.proyectoLinea83).length > 0 && (
                    <>
                        <form onSubmit={submitArticulacionSennovaProyectosLinea83}>
                            <Grid container className="space-y-20">
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="impacto_centros_formacion"
                                        value="Impacto de la impelmentación de acciones de la línea de Extensionismo Tecnológico  en el (los) centro(s) de formación y en la Formación Profesional"
                                    />

                                    <Textarea
                                        id="impacto_centros_formacion"
                                        error={formArticulacionSennovaProyectosLinea83.errors.impacto_centros_formacion}
                                        value={formArticulacionSennovaProyectosLinea83.data.impacto_centros_formacion}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('impacto_centros_formacion', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="articulacion_semilleros_grupos_investigacion"
                                        value="Comente la articulación y aporte dela Línea de ET,  proyectada para el 2024 a los semilleros y grupos de investigación."
                                    />

                                    <Textarea
                                        id="articulacion_semilleros_grupos_investigacion"
                                        error={formArticulacionSennovaProyectosLinea83.errors.articulacion_semilleros_grupos_investigacion}
                                        value={formArticulacionSennovaProyectosLinea83.data.articulacion_semilleros_grupos_investigacion}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('articulacion_semilleros_grupos_investigacion', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="articulacion_linea_68"
                                        value="¿Cómo proyecta la articulación en el 2024, de las acciones de ET con la línea de Servicios Tecnológicos?"
                                    />

                                    <Textarea
                                        id="articulacion_linea_68"
                                        error={formArticulacionSennovaProyectosLinea83.errors.articulacion_linea_68}
                                        value={formArticulacionSennovaProyectosLinea83.data.articulacion_linea_68}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('articulacion_linea_68', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="articulacion_linea_69_y_hubs"
                                        value="¿Cómo proyecta la articulación en el 2024, de la  línea de Extensionismo Tecnológico con la Red de Tecnoparques y Hubs de Innovación?"
                                    />

                                    <Textarea
                                        id="articulacion_linea_69_y_hubs"
                                        error={formArticulacionSennovaProyectosLinea83.errors.articulacion_linea_69_y_hubs}
                                        value={formArticulacionSennovaProyectosLinea83.data.articulacion_linea_69_y_hubs}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('articulacion_linea_69_y_hubs', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="articulacion_centros_desarrollo_empresarial"
                                        value="¿Cómo se  proyectan las estrategias de Extensionismo Tecnológico para articularse  con los centros de desarrollo empresarial de(l) Los Centros en las Regionales impactadas?"
                                    />

                                    <Textarea
                                        id="articulacion_centros_desarrollo_empresarial"
                                        error={formArticulacionSennovaProyectosLinea83.errors.articulacion_centros_desarrollo_empresarial}
                                        value={formArticulacionSennovaProyectosLinea83.data.articulacion_centros_desarrollo_empresarial}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('articulacion_centros_desarrollo_empresarial', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="contribucion_formacion_regional_nacional"
                                        value="¿Cómo proyecta en el 2024, Extensionismo Tecnológico contribuir a la formación en la Regional o en el SENA?"
                                    />

                                    <Textarea
                                        id="contribucion_formacion_regional_nacional"
                                        error={formArticulacionSennovaProyectosLinea83.errors.contribucion_formacion_regional_nacional}
                                        value={formArticulacionSennovaProyectosLinea83.data.contribucion_formacion_regional_nacional}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('contribucion_formacion_regional_nacional', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Label
                                        required
                                        className="mb-4"
                                        labelFor="proyeccion_capacidades_tecnologicas_empresas"
                                        value="¿Cómo proyecta en el 2024, Extensionismo Tecnológico promover el desarrollo y fortalecimiento de las capacidades tecnológicas de las empresas, cadenas productivas y clústeres en las regiones?"
                                    />

                                    <Textarea
                                        id="proyeccion_capacidades_tecnologicas_empresas"
                                        error={formArticulacionSennovaProyectosLinea83.errors.proyeccion_capacidades_tecnologicas_empresas}
                                        value={formArticulacionSennovaProyectosLinea83.data.proyeccion_capacidades_tecnologicas_empresas}
                                        onChange={(e) => formArticulacionSennovaProyectosLinea83.setData('proyeccion_capacidades_tecnologicas_empresas', e.target.value)}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <div className=" flex items-center justify-between mt-14  py-4">
                                {proyecto.allowed.to_update && (
                                    <PrimaryButton disabled={formArticulacionSennovaProyectosLinea83.processing} className="ml-auto" type="submit">
                                        Guardar
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArticulacionSennova

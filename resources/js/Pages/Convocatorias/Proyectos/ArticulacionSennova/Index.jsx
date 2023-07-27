import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'
import SelectMultiple from '@/Components/SelectMultiple'
import Tags from '@/Components/Tags'
import Textarea from '@/Components/Textarea'
import StepperMui from '@/Components/Stepper'

import { checkRole } from '@/Utils'

import { useForm } from '@inertiajs/react'
import { Grid } from '@mui/material'

import Participantes from '../Participantes/Participantes'

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
    ...props
}) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const form = useForm({
        lineas_investigacion: lineas_investigacion.filter((item) => proyecto.lineasInvestigacion?.some((obj) => obj.id == item.value)).map((item) => item.value),
        grupos_investigacion: grupos_investigacion.filter((item) => proyecto.gruposInvestigacion?.some((obj) => obj.id == item.value)).map((item) => item.value),
        semilleros_investigacion: semilleros_investigacion.filter((item) => proyecto.semillerosInvestigacion?.some((obj) => obj.id == item.value)).map((item) => item.value),
        disciplinas_subarea_conocimiento: disciplinas_subarea_conocimiento
            .filter((item) => proyecto?.proyectoLinea70.disciplinas_subarea_conocimiento?.some((obj) => obj.id == item.value))
            .map((item) => item.value),
        redes_conocimiento: redes_conocimiento.filter((item) => proyecto?.proyectoLinea70.redes_conocimiento?.some((obj) => obj.id == item.value)).map((item) => item.value),
        actividades_economicas: actividades_economicas.filter((item) => proyecto?.proyectoLinea70.actividades_economicas?.some((obj) => obj.id == item.value)).map((item) => item.value),
        tematicas_estrategicas: tematicas_estrategicas.filter((item) => proyecto?.proyectoLinea70.tematicas_estrategicas?.some((obj) => obj.id == item.value)).map((item) => item.value),
        proyecto_idi_tecnoacademia_id: proyectos_idi_tecnoacademia
            .filter((item) => proyecto?.proyectoLinea70.proyectos_idi_tecnoacademia?.some((obj) => obj.id == item.value))
            .map((item) => item.value),
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

    return (
        <AuthenticatedLayout>
            <Grid item md={12} className="!mb-20">
                <StepperMui convocatoria={convocatoria} proyecto={proyecto} evaluacion={evaluacion} />
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
                                            placeholder="Buscar por el nombre de la línea de investigación"
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
                                            Si aún no ha registrado el proyecto en el módulo de <strong>Proyectos e iniciativas I+D+i TecnoAcademias</strong>, relacione en el siguiente campo el título
                                            del proyecto. Se recomienda hacer el registro en el módulo.
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
                                            placeholder="Nombre(s) de la(s) IE"
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
                                proyecto.codigo_linea_programatica == 69 && (
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
            </Grid>
        </AuthenticatedLayout>
    )
}

export default ArticulacionSennova

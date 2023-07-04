<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Components/Button'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Gantt from '@/Components/Gantt'
    import InfoMessage from '@/Components/InfoMessage'
    import Label from '@/Components/Label'
    import Textarea from '@/Components/Textarea'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Input from '@/Components/Input'
    import Switch from '@/Components/Switch'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import Tags from '@/Components/Tags'
    import Select from '@/Components/Select'
    import MultipleSelect from '@/Components/MultipleSelect'
    import { Item, Text } from '@smui/list'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let actividades
    export let actividadesGantt
    export let year
    export let otrasEvaluaciones
    export let proyectoMunicipios
    export let municipios
    export let departamentos
    export let programasFormacion
    export let modalidades
    export let nivelesFormacion
    export let disenosCurriculares
    export let proyectoProgramasFormacionArticulados
    export let proyectoDisenosCurriculares
    export let tecnoacademiaRelacionada
    export let aulasMoviles
    export let talentosOtrosDepartamentos
    export let proyectoMunicipiosImpactar

    $title = 'Actividades'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let actividadInfo = {
        metodologia: proyecto.metodologia,
        metodologia_local: proyecto.metodologia_local,

        municipios: proyectoMunicipios?.length > 0 ? proyectoMunicipios : null,
        municipios_impactar: proyectoMunicipiosImpactar?.length > 0 ? proyectoMunicipiosImpactar : null,
        otras_nuevas_instituciones: proyecto.otras_nuevas_instituciones,
        otras_nombre_instituciones_programas: proyecto.otras_nombre_instituciones_programas,
        otras_nombre_instituciones: proyecto.otras_nombre_instituciones,
        impacto_municipios: proyecto.impacto_municipios,
        nombre_instituciones: proyecto.nombre_instituciones,
        nombre_instituciones_programas: proyecto.nombre_instituciones_programas,
        nuevas_instituciones: proyecto.nuevas_instituciones,
        proyeccion_nuevas_instituciones: proyecto.proyeccion_nuevas_instituciones,
        proyeccion_articulacion_media: proyecto.proyeccion_articulacion_media,
        proyectos_macro: proyecto.proyectos_macro,
        implementacion_modelo_pedagogico: proyecto.implementacion_modelo_pedagogico,
        articulacion_plan_educacion: proyecto.articulacion_plan_educacion,
        articulacion_territorios_stem: proyecto.articulacion_territorios_stem,
        programas_formacion_articulados: proyectoProgramasFormacionArticulados?.length > 0 ? proyectoProgramasFormacionArticulados : null,
        diseno_curricular_id: proyectoDisenosCurriculares?.length > 0 ? proyectoDisenosCurriculares : null,
        estrategia_articulacion_prox_vigencia: proyecto.estrategia_articulacion_prox_vigencia,
        alianzas_estrategicas: proyecto.alianzas_estrategicas,
        estrategia_divulgacion: proyecto.estrategia_divulgacion,
        promover_productividad: proyecto.promover_productividad,
        departamentos_atencion_talentos: proyecto.departamentos_atencion_talentos,
        estrategia_atencion_talentos: proyecto.estrategia_atencion_talentos,
        talento_otros_departamentos: talentosOtrosDepartamentos?.length > 0 ? talentosOtrosDepartamentos : null,
    }

    let showGantt = false
    let formEstrategiaRegionalEvaluacion = useForm({
        metodologia_puntaje: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.metodologia_puntaje : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.metodologia_puntaje : null,
        metodologia_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.metodologia_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.metodologia_comentario : null,
        metodologia_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion?.metodologia_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.metodologia_comentario == null ? true : false) : null,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTaEvaluacion = useForm({
        metodologia_comentario: evaluacion.ta_evaluacion ? evaluacion.ta_evaluacion?.metodologia_comentario : '',
        metodologia_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion?.metodologia_comentario == null ? true : false) : null,

        municipios_requiere_comentario: evaluacion.ta_evaluacion?.municipios_comentario == null ? true : false,
        municipios_comentario: evaluacion.ta_evaluacion?.municipios_comentario,

        instituciones_comentario: evaluacion.ta_evaluacion ? evaluacion.ta_evaluacion?.instituciones_comentario : '',
        instituciones_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion?.instituciones_comentario == null ? true : false) : null,

        proyectos_macro_comentario: evaluacion.ta_evaluacion ? evaluacion.ta_evaluacion?.proyectos_macro_comentario : '',
        proyectos_macro_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion?.proyectos_macro_comentario == null ? true : false) : null,
    })
    function submitTaEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTpEvaluacion = useForm({
        metodologia_comentario: evaluacion.tp_evaluacion?.metodologia_comentario,
        metodologia_requiere_comentario: evaluacion.tp_evaluacion?.metodologia_comentario == null ? true : false,
        municipios_requiere_comentario: evaluacion.tp_evaluacion?.municipios_comentario == null ? true : false,
        municipios_comentario: evaluacion.tp_evaluacion?.municipios_comentario,
    })
    function submitTpEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTpEvaluacion.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formServicioTecnologicoEvaluacion = useForm({
        metodologia_puntaje: evaluacion.servicio_tecnologico_evaluacion?.metodologia_puntaje,
        metodologia_comentario: evaluacion.servicio_tecnologico_evaluacion?.metodologia_comentario,
        metodologia_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.metodologia_comentario == null ? true : false,

        actividades_primer_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.actividades_primer_obj_puntaje,
        actividades_primer_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_primer_obj_comentario,
        actividades_primer_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_primer_obj_comentario == null ? true : false,

        actividades_segundo_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.actividades_segundo_obj_puntaje,
        actividades_segundo_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_segundo_obj_comentario,
        actividades_segundo_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_segundo_obj_comentario == null ? true : false,

        actividades_tercer_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.actividades_tercer_obj_puntaje,
        actividades_tercer_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_tercer_obj_comentario,
        actividades_tercer_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_tercer_obj_comentario == null ? true : false,

        actividades_cuarto_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.actividades_cuarto_obj_puntaje,
        actividades_cuarto_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_cuarto_obj_comentario,
        actividades_cuarto_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.actividades_cuarto_obj_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.actividades.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let regionalIEEjecucion
    $: whitelistInstitucionesEducativasEjecutar = []
    $: if (regionalIEEjecucion) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regionalIEEjecucion?.codigo)
            .then(function (response) {
                // handle success
                response.data.map((item) => {
                    whitelistInstitucionesEducativasEjecutar.push(item.nombre_establecimiento)
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error)
            })
            .then(function () {
                // always executed
            })
    }

    let regionalIEArticulacion
    $: whitelistInstitucionesEducativasArticular = []
    $: if (regionalIEArticulacion) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regionalIEArticulacion?.codigo)
            .then(function (response) {
                // handle success
                response.data.map((item) => {
                    whitelistInstitucionesEducativasArticular.push(item.nombre_establecimiento)
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error)
            })
            .then(function () {
                // always executed
            })
    }

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Ir a la evaluación
    </a>

    <h1 className="text-3xl m-24 text-center">Metodología</h1>

    <form>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            <div className="py-24">
                <div>
                    <Label disabled required className="mb-4" labelFor="metodologia" value="Metodología" />
                    <Textarea sinContador={true} id="metodologia" error={errors.metodologia} bind:value={actividadInfo.metodologia} disabled required />
                </div>
            </div>
            {#if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
                <div className="py-24">
                    <div>
                        <Label
                            disabled
                            required
                            className="mb-4"
                            labelFor="metodologia_local"
                            value={proyecto.codigo_linea_programatica == 69 ? 'A continuación, describa la metodología que será implementada en el ' + convocatoria.year + ' en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques:' : 'Descripcion de la metodología aplicada a nivel local'}
                        />
                        <Textarea maxlength="20000" id="metodologia_local" error={errors.metodologia_local} bind:value={actividadInfo.metodologia_local} disabled required />
                    </div>
                </div>
            {/if}

            {#if proyecto.codigo_linea_programatica == 70}
                <div>
                    <div className="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label disabled required className="mb-4" labelFor="implementacion_modelo_pedagogico" value="Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="implementacion_modelo_pedagogico" error={errors.implementacion_modelo_pedagogico} bind:value={actividadInfo.implementacion_modelo_pedagogico} disabled required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div>
                        <Label disabled required className="mb-4" labelFor="municipios" value="Nombre los municipios impactados en la vigencia anterior por la TecnoAcademia" />
                    </div>
                    <div>
                        <MultipleSelect id="municipios" bind:selectedValue={actividadInfo.municipios} items={municipios}  error={errors.municipios} placeholder="Buscar municipios" disabled required />
                    </div>
                </div>

                <div className="py-24">
                    <div>
                        <Label disabled required className="mb-4" labelFor="municipios_impactar" value="Defina los municipios a impactar en la vigencia el proyecto:" />
                    </div>
                    <div>
                        <MultipleSelect id="municipios_impactar" bind:selectedValue={actividadInfo.municipios_impactar} items={municipios}  error={errors.municipios_impactar} placeholder="Buscar municipios" disabled required />
                    </div>
                </div>

                <div className="py-24">
                    <div>
                        <Label disabled required className="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="impacto_municipios" error={errors.impacto_municipios} bind:value={actividadInfo.impacto_municipios} disabled required />
                    </div>
                </div>

                <div className="py-24 grid grid-cols-2 gap-4">
                    <div>
                        <Label disabled required={actividadInfo.otras_nombre_instituciones_programas ? undefined : true} className="mb-4" labelFor="nombre_instituciones_programas" value="Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias" />
                    </div>
                    <div>
                        <Tags id="nombre_instituciones_programas" className="mt-4" whitelist={whitelistInstitucionesEducativasEjecutar} bind:tags={actividadInfo.nombre_instituciones_programas} placeholder="Nombre(s) de la(s) IE" error={errors.nombre_instituciones_programas} disabled required={actividadInfo.otras_nombre_instituciones_programas ? undefined : true} />
                        <div className="mt-10">
                            <InfoMessage>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</InfoMessage>
                            <Textarea label="Instituciones" maxlength="40000" id="otras_nombre_instituciones_programas" error={errors.otras_nombre_instituciones_programas} bind:value={actividadInfo.otras_nombre_instituciones_programas} />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div>
                        <Label disabled required className="mb-4" labelFor="proyeccion_nuevas_instituciones" value="¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?" />
                    </div>
                    <div>
                        <Select items={opcionesSiNo} id="proyeccion_nuevas_instituciones" bind:selectedValue={actividadInfo.proyeccion_nuevas_instituciones} error={errors.proyeccion_nuevas_instituciones} autocomplete="off" placeholder="Seleccione una opción" disabled required />
                    </div>
                </div>

                {#if actividadInfo?.value == 1}
                    <div className="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label disabled required={actividadInfo.otras_nuevas_instituciones ? undefined : true} className="mb-4" labelFor="nuevas_instituciones" value="Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia" />
                        </div>
                        <div>
                            <Tags id="nuevas_instituciones" className="mt-4" whitelist={whitelistInstitucionesEducativasEjecutar} bind:tags={actividadInfo.nuevas_instituciones} placeholder="Nombre(s) de la(s) IE" error={errors.nuevas_instituciones} disabled required={actividadInfo.otras_nuevas_instituciones ? undefined : true} />
                            <div className="mt-10">
                                <Textarea label="Instituciones" maxlength="40000" id="otras_nuevas_instituciones" error={errors.otras_nuevas_instituciones} bind:value={actividadInfo.otras_nuevas_instituciones} />
                            </div>
                        </div>
                    </div>
                {/if}

                <div className="py-24">
                    <div>
                        <Label disabled required className="mb-4" labelFor="proyeccion_articulacion_media" value="¿Se proyecta incluir Instituciones Educativas en articulación con la media?" />
                    </div>
                    <div>
                        <Select items={opcionesSiNo} id="proyeccion_articulacion_media" bind:selectedValue={actividadInfo.proyeccion_articulacion_media} error={errors.proyeccion_articulacion_media} autocomplete="off" placeholder="Seleccione una opción" disabled required />
                    </div>
                </div>

                {#if actividadInfo?.value == 1}
                    <div className="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label disabled required={actividadInfo.otras_nombre_instituciones ? undefined : true} className="mb-4" labelFor="nombre_instituciones" value="Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong>" />
                        </div>
                        <div>
                            <Tags id="nombre_instituciones" className="mt-4" whitelist={whitelistInstitucionesEducativasArticular} bind:tags={actividadInfo.nombre_instituciones} placeholder="Nombre(s) de la(s) IE" error={errors.nombre_instituciones} disabled required={actividadInfo.otras_nombre_instituciones ? undefined : true} />
                            <div className="mt-10">
                                <Textarea label="Instituciones" maxlength="40000" id="otras_nombre_instituciones" error={errors.otras_nombre_instituciones} bind:value={actividadInfo.otras_nombre_instituciones} />
                            </div>
                        </div>
                    </div>
                {/if}

                <div className="py-24 grid grid-cols-2 gap-4">
                    <div>
                        <Label disabled required className="mb-4" labelFor="programas_formacion_articulados" value="Programas de articulación con la Media con los cuales se espera dar continuidad a la ruta de formación de los aprendices de la TecnoAcademia" />
                    </div>
                    <div>
                        <MultipleSelect id="programas_formacion_articulados" bind:selectedValue={actividadInfo.programas_formacion_articulados} items={programasFormacion}  error={errors.programas_formacion_articulados} placeholder="Buscar por el nombre del programa de formación" disabled required />
                    </div>
                </div>

                <div className="py-24 grid grid-cols-2 gap-4">
                    <div>
                        <Label disabled required className="mb-4" labelFor="diseno_curricular_id" value="Programas a ejecutar en la vigencia del proyecto:" />
                    </div>

                    <div>
                        <MultipleSelect id="diseno_curricular_id" bind:selectedValue={actividadInfo.diseno_curricular_id} items={disenosCurriculares}  error={errors.diseno_curricular_id} placeholder="Buscar por el nombre del programa de formación" disabled required />
                    </div>
                </div>

                <div>
                    <div className="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label disabled required className="mb-4" labelFor="proyectos_macro" value="Proyectos Macro o líneas de proyecto de investigación formativa y aplicada de la TecnoAcademia para la vigencia {convocatoria.year}" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="proyectos_macro" error={errors.proyectos_macro} bind:value={actividadInfo.proyectos_macro} disabled required />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label disabled required className="mb-4" labelFor="articulacion_plan_educacion" value="Articulación de la TecnoAcademia con el Plan Decenal de Educación y su regionalización en el territorio: mencionar logros de la vigenca {convocatoria.year - 1} y {convocatoria.year}" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="articulacion_plan_educacion" error={errors.articulacion_plan_educacion} bind:value={actividadInfo.articulacion_plan_educacion} disabled required />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label disabled required className="mb-4" labelFor="articulacion_territorios_stem" value="Artifculación de la TecnoAcademia con la Iniciativa de Territorios STEM+ del Ministerio de Educación en el Territorio" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="articulacion_territorios_stem" error={errors.articulacion_territorios_stem} bind:value={actividadInfo.articulacion_territorios_stem} disabled required />
                        </div>
                    </div>
                </div>
            {:else if proyecto.codigo_linea_programatica == 69}
                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label className="mb-4" labelFor="talento_otros_departamentos" value="¿Planea en el {convocatoria.year} realizar acciones que beneficien talentos en otros departamentos? Si es así seleccione los departamentos" />
                        </div>
                        <div>
                            <MultipleSelect id="talento_otros_departamentos" bind:selectedValue={actividadInfo.talento_otros_departamentos} items={departamentos}  error={errors.talento_otros_departamentos} placeholder="Buscar departamentos" />
                        </div>
                    </div>

                    <div className="py-24">
                        <div className="grid grid-cols-2">
                            <div>
                                <Label disabled required className="mb-4" labelFor="estrategia_atencion_talentos" value="Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados" />
                            </div>
                            <div>
                                <Textarea maxlength="40000" id="estrategia_atencion_talentos" error={errors.estrategia_atencion_talentos} bind:value={actividadInfo.estrategia_atencion_talentos} disabled required />
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 grid grid-cols-2">
                        <div>
                            <Label disabled required className="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                        </div>
                        <div>
                            <MultipleSelect id="municipios" bind:selectedValue={actividadInfo.municipios} items={municipios}  error={errors.municipios} placeholder="Buscar municipios" disabled required />
                        </div>
                    </div>

                    <div className="mt-24 grid grid-cols-2">
                        <div>
                            <Label disabled required className="mb-4" labelFor="impacto_municipios_tp" value="Descripción del beneficio en los municipios" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="impacto_municipios_tp" error={errors.impacto_municipios} bind:value={actividadInfo.impacto_municipios} disabled required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label disabled required className="mb-4" labelFor="estrategia_articulacion_prox_vigencia" value="Comparta la estrategia de Articulación para el {convocatoria.year} para los proyectos de los Tecnoparques" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="estrategia_articulacion_prox_vigencia" error={errors.estrategia_articulacion_prox_vigencia} bind:value={actividadInfo.estrategia_articulacion_prox_vigencia} disabled required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label disabled required className="mb-4" labelFor="alianzas_estrategicas" value="Comparta las alianzas estratégicas a gestionar en el {convocatoria.year} para promover el logro de las metas del Tecnoparque" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="alianzas_estrategicas" error={errors.alianzas_estrategicas} bind:value={actividadInfo.alianzas_estrategicas} disabled required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label disabled required className="mb-4" labelFor="estrategia_divulgacion" value="Comparta la estrategia de divulgación y visibilización de acciones del Tecnoparque para el {convocatoria.year}" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="estrategia_divulgacion" error={errors.estrategia_divulgacion} bind:value={actividadInfo.estrategia_divulgacion} disabled required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-2">
                        <div>
                            <Label disabled required className="mb-4" labelFor="promover_productividad" value="Proponga las estrategias para el {convocatoria.year} con el fin de que el Tecnoparque contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="promover_productividad" error={errors.promover_productividad} bind:value={actividadInfo.promover_productividad} disabled required />
                        </div>
                    </div>
                </div>
            {/if}
        </fieldset>
        <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            {#if proyecto.allowed.to_update}
                <PrimaryButton loading={actividadInfo.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
            {/if}
        </div>
    </form>

    <hr className="mb-20 mt-20" />

    <h1 className="text-3xl m-24 text-center">Actividades</h1>

    {#if showGantt}
        <Button on:click={() => (showGantt = false)}>Ocultar diagrama de Gantt</Button>
    {:else}
        <Button on:click={() => (showGantt = true)}>Visualizar diagrama de Gantt</Button>
    {/if}

    {#if showGantt}
        <Gantt
            items={actividadesGantt}
            request={isSuperAdmin || checkRole(authUser, [11, 5])
                ? {
                      uri: 'convocatorias.evaluaciones.actividades.edit',
                      params: [convocatoria.id, evaluacion.id],
                  }
                : null}
        />
    {:else}
        <DataTable className="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
            <thead slot="thead">
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Fechas</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Objetivo específico</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>

            <tbody slot="tbody">
                {#each actividades.data as actividad (actividad.id)}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {actividad.descripcion}
                            </p>
                        </td>

                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {#if actividad.fecha_inicio}
                                    Del {actividad.fecha_inicio} al {actividad.fecha_finalizacion}
                                {:else}
                                    <span className="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center inline-block mt-2 mb-2">Sin fechas definidas</span>
                                {/if}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {actividad.objetivo_especifico.descripcion}
                            </p>
                        </td>

                        <td className="border-t td-actions">
                            <DataTableMenu className={actividades.data.length < 3 ? 'z-50' : ''}>
                                {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                                    <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.actividades.edit', [convocatoria.id, evaluacion.id, actividad.id]))}>
                                        <Text>Ver detalles</Text>
                                    </Item>
                                {:else}
                                    <Item>
                                        <Text>No tiene permisos</Text>
                                    </Item>
                                {/if}
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if actividades.data.length === 0}
                    <tr>
                        <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                    </tr>
                {/if}
            </tbody>
        </DataTable>
        <Pagination links={actividades.links} />
    {/if}

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 7</strong> La selección y descripción de la metodología o metodologías no son claras para el contexto y desarrollo del proyecto. Las actividades no estan descritas de forma secuencial, tampoco muestran como se lograrán los objetivos específicos, generarán los resultados y/o productos y no estan formuladas en el marco de la vigencia del proyecto.
                            Algunas de las actividades no se desarrollarán durante la vigencia {year}.
                        </li>
                        <li>
                            <strong>Puntaje: 8 a 13</strong> La selección y descripción de la metodología o metodologías son claras para el contexto y desarrollo del proyecto. Las actividades están descritas de forma secuencial; sin embargo, son susceptibles de mejora en cuanto a como se lograrán los objetivos específicos, generarán los resultados y/o productos y estan formuladas en el marco de la
                            vigencia del proyecto. Todas las actividades se desarrollarán durante la vigencia {year} y el tiempo dispuesto para ello es suficiente para garantizar su ejecución.
                        </li>
                        <li>
                            <strong>Puntaje: 14 a 15</strong> La selección y descripción de la metodología o metodologías son precisas para el contexto y desarrollo del proyecto. Las actividades están descritas de forma secuencial, evidencian de forma clara como se lograrán los objetivos específicos, generarán los resultados, productos y están formuladas en el marco de la vigencia del proyecto.
                            Todas las actividades se desarrollarán durante la vigencia {year} y el tiempo dispuesto para ello es suficiente para garantizar su ejecución.
                        </li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="metodologia_puntaje" value="Puntaje (Máximo 15)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="metodologia_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="15"
                        className="mt-1"
                        bind:value={$formEstrategiaRegionalEvaluacion.metodologia_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.metodologia_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿La metodología o las actividades son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.metodologia_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.metodologia_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="metodologia_comentario" bind:value={$formEstrategiaRegionalEvaluacion.metodologia_comentario} error={errors.metodologia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formEstrategiaRegionalEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 68}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitServicioTecnologicoEvaluacion}>
                <InfoMessage>
                    <h1 className="text-2xl text-center mb-10">Metodología</h1>

                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 4</strong> Se debe evidenciar que la metodología se presente de forma organizada y de manera secuencial, de acuerdo con el ciclo P-H-V-A “Planificar – Hacer – Verificar - Actuar” para alcanzar el objetivo general y cada uno de los objetivos específicos.
                        </li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="metodologia_puntaje" value="Puntaje (Máximo 4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="metodologia_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="4"
                        className="mt-1"
                        bind:value={$formServicioTecnologicoEvaluacion.metodologia_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.metodologia_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿La metodología es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.metodologia_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.metodologia_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="metodologia_comentario" bind:value={$formServicioTecnologicoEvaluacion.metodologia_comentario} error={errors.metodologia_comentario} required />
                        {/if}
                    </div>

                    <hr className="mt-10 mb-10 border-app-300" />
                    <h1 className="text-2xl text-center mb-10">Actividades</h1>

                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a {(16 / proyecto.cantidad_objetivos).toFixed(2)}</strong> Se debe evidenciar la descripción de las actividades de manera secuencial para alcanzar el logro de cada uno de los objetivos específicos y deben ser coherentes con los productos a las cuales están asociadas; una misma actividad podrá ser necesaria para generar diferentes productos de un mismo
                            proyecto.
                        </li>
                    </ul>

                    {#each { length: proyecto.cantidad_objetivos } as _empty, j}
                        {#if j == 0}
                            <h1 className="text-black">Actividades del primer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="actividades_primer_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="actividades_primer_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(16 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.actividades_primer_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.actividades_primer_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Las actividades del primer objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.actividades_primer_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.actividades_primer_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="actividades_primer_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.actividades_primer_obj_comentario}
                                        error={errors.actividades_primer_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 1}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Actividades del segundo objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="actividades_segundo_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="actividades_segundo_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(16 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.actividades_segundo_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.actividades_segundo_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Las actividades del segundo objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.actividades_segundo_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.actividades_segundo_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="actividades_segundo_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.actividades_segundo_obj_comentario}
                                        error={errors.actividades_segundo_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 2}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Actividades del tercer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="actividades_tercer_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="actividades_tercer_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(16 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.actividades_tercer_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.actividades_tercer_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Las actividades del tercer objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.actividades_tercer_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.actividades_tercer_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="actividades_tercer_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.actividades_tercer_obj_comentario}
                                        error={errors.actividades_tercer_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 3}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Actividades del cuarto objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="actividades_cuarto_obj_puntaje" value="Puntaje (Máximo {(16 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="actividades_cuarto_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(16 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.actividades_cuarto_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.actividades_cuarto_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Las actividades del cuarto objetivo específico son correctas? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.actividades_cuarto_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.actividades_cuarto_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="actividades_cuarto_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.actividades_cuarto_obj_comentario}
                                        error={errors.actividades_cuarto_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formServicioTecnologicoEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 70}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTaEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div className="mb-8">
                                    <h4>Evaluador(a): <span className="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.metodologia_comentario ? evaluacion.metodologia_comentario : 'Estado: El evaluador(a) da cumplimiento a la metodología y actividades'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿La metodología y las actividades están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.metodologia_requiere_comentario} />
                        {#if $formTaEvaluacion.metodologia_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="metodologia_comentario" bind:value={$formTaEvaluacion.metodologia_comentario} error={errors.metodologia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <InfoMessage>
                    <div className="mt-10">
                        <p>¿Los municipios y la descripción del beneficio son correctos? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.municipios_requiere_comentario} />
                        {#if $formTaEvaluacion.municipios_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="municipios_comentario" bind:value={$formTaEvaluacion.municipios_comentario} error={errors.municipios_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <InfoMessage>
                    <div className="mt-4">
                        <!-- {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div className="mb-8">
                                    <h4>Evaluador(a): <span className="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.instituciones_comentario ? evaluacion.instituciones_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if} -->
                        <p>¿La información relacionada con las instituciones es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.instituciones_requiere_comentario} />
                        {#if $formTaEvaluacion.instituciones_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="instituciones_comentario" bind:value={$formTaEvaluacion.instituciones_comentario} error={errors.instituciones_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <InfoMessage>
                    <div className="mt-4">
                        <!-- {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div className="mb-8">
                                    <h4>Evaluador(a): <span className="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.proyectos_macro_comentario ? evaluacion.proyectos_macro_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if} -->
                        <p>¿La información es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.proyectos_macro_requiere_comentario} />
                        {#if $formTaEvaluacion.proyectos_macro_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="proyectos_macro_comentario" bind:value={$formTaEvaluacion.proyectos_macro_comentario} error={errors.proyectos_macro_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTaEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 69}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTpEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La metodología y las actividades están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.metodologia_requiere_comentario} />
                        {#if $formTpEvaluacion.metodologia_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="metodologia_comentario" bind:value={$formTpEvaluacion.metodologia_comentario} error={errors.metodologia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <InfoMessage>
                    <div className="mt-10">
                        <p>¿Los municipios y la descripción del beneficio son correctos? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.municipios_requiere_comentario} />
                        {#if $formTpEvaluacion.municipios_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="municipios_comentario" bind:value={$formTpEvaluacion.municipios_comentario} error={errors.municipios_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTpEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>

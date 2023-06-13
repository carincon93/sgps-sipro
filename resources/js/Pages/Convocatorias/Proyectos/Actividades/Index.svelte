<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'
    import axios from 'axios'

    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import Stepper from '@/Shared/Stepper'
    import Gantt from '@/Shared/Gantt'
    import InfoMessage from '@/Shared/InfoMessage'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import LoadingButton from '@/Shared/LoadingButton'
    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'
    import { Item, Separator, Text } from '@smui/list'
    import Tags from '@/Shared/Tags'
    import Select from '@/Shared/Select'
    import SelectMulti from '@/Shared/SelectMulti'
    import Input from '@/Shared/Input'
    import File from '@/Shared/File'

    export let convocatoria
    export let proyecto
    export let actividades
    export let actividadesGantt
    export let errors
    export let proyectoMunicipios
    export let proyectoMunicipiosImpactar
    export let departamentos
    export let municipios
    export let regionales
    export let programasFormacion
    export let modalidades
    export let nivelesFormacion
    export let disenosCurriculares
    export let proyectoProgramasFormacionArticulados
    export let proyectoDisenosCurriculares
    export let tecnoacademiaRelacionada
    export let aulasMoviles
    export let talentosOtrosDepartamentos

    export let to_pdf = false

    $title = 'Actividades'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let showGantt = false

    let form = useForm({
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
        // departamentos_atencion_talentos: proyecto.departamentos_atencion_talentos,
        estrategia_atencion_talentos: proyecto.estrategia_atencion_talentos,
        talento_otros_departamentos: talentosOtrosDepartamentos?.length > 0 ? talentosOtrosDepartamentos : null,
    })

    async function syncTpColumnLong(column, form) {
        return new Promise((resolve) => {
            if (proyecto.allowed.to_update && proyecto.codigo_linea_programatica == 69) {
                Inertia.put(
                    route('convocatorias.tp.updateLongColumn', [convocatoria.id, proyecto.id, column]),
                    { [column]: form[column] },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }

    async function syncTaColumnLong(column, form) {
        return new Promise((resolve) => {
            if (proyecto.allowed.to_update && proyecto.codigo_linea_programatica == 70) {
                Inertia.put(
                    route('convocatorias.ta.updateLongColumn', [convocatoria.id, proyecto.id, column]),
                    { [column]: form[column] },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.metodologia', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }
    let actividadId
    let dialogEliminar
    let allowedToDestroy
    function destroy() {
        if (allowedToDestroy && actividadId) {
            Inertia.delete(route('convocatorias.proyectos.actividades.destroy', [convocatoria.id, proyecto.id, actividadId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
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

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let programasFormacionDialogOpen = false
    let formProgramasFormacion = useForm({
        nombre: '',
        codigo: '',
        modalidad: '',
        nivel_formacion: '',
        registro_calificado: true,
        centro_formacion_id: proyecto.centro_formacion_id,
    })
    function submitProgramasFormacion() {
        if (proyecto.allowed.to_update) {
            $formProgramasFormacion.post(route('convocatorias.proyectos.programas-formacion.store', [convocatoria.id, proyecto.id]), {
                onFinish: () => ((programasFormacionDialogOpen = false), $formProgramasFormacion.reset()),
                preserveScroll: true,
            })
        }
    }

    let aulaMovilFormDialog = false
    let formAulaMovil = useForm({
        id: 0,
        placa: '',
        modelo: '',
        logros_vigencia: '',
        numero_municipios_visitados: '',
        numero_aprendices_beneficiados: '',
        estado: '',
        modulos_interactivos: '',
        acciones_a_desarrollar: '',
        numero_aprendices_a_beneficiar: '',
        recursos_mantenimiento: '',
        soat: null,
        tecnicomecanica: null,
    })

    let soat
    let tecnicomecanica
    function configurarDialogoAula(aulaMovil) {
        $formAulaMovil.reset()
        $formAulaMovil.id = aulaMovil.id
        $formAulaMovil.placa = aulaMovil.placa
        $formAulaMovil.modelo = aulaMovil.modelo
        $formAulaMovil.logros_vigencia = aulaMovil.logros_vigencia
        $formAulaMovil.numero_municipios_visitados = aulaMovil.numero_municipios_visitados
        $formAulaMovil.numero_aprendices_beneficiados = aulaMovil.numero_aprendices_beneficiados
        $formAulaMovil.estado = aulaMovil.estado
        $formAulaMovil.modulos_interactivos = aulaMovil.modulos_interactivos
        $formAulaMovil.acciones_a_desarrollar = aulaMovil.acciones_a_desarrollar
        $formAulaMovil.numero_aprendices_a_beneficiar = aulaMovil.numero_aprendices_a_beneficiar
        $formAulaMovil.recursos_mantenimiento = aulaMovil.recursos_mantenimiento
        soat = aulaMovil.soat
        tecnicomecanica = aulaMovil.tecnicomecanica
        aulaMovilFormDialog = true
    }

    let formContainer
    function closeDialog() {
        $formAulaMovil.reset()
        let inputsFile = formContainer.querySelectorAll('input[type=file]')
        inputsFile.forEach((input) => {
            input.value = ''
        })
        soat = null
        tecnicomecanica = null
        aulaMovilFormDialog = false
    }

    function submitAulaMovil() {
        if (proyecto.allowed.to_update) {
            $formAulaMovil.post(route('convocatorias.ta.aulas-moviles.store', [convocatoria.id, proyecto.id]), {
                onFinish: () => closeDialog(),
                preserveScroll: true,
            })
        }
    }

    let aulaMovilId
    let destroyAulaMovilDialog = false
    function configurarDialogoAulaDestroy(aulaMovil) {
        aulaMovilId = aulaMovil.id
        destroyAulaMovilDialog = true
    }

    function destroyAulaMovil() {
        if (proyecto.allowed.to_update) {
            $formAulaMovil.delete(route('convocatorias.ta.aulas-moviles.destroy', [convocatoria.id, proyecto.id, aulaMovilId]), {
                onFinish: () => ((aulaMovilId = null), (destroyAulaMovilDialog = false)),
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    <InfoMessage class="mb-8">
        <span class="text-5xl font-black">1.</span>
        <h1 class="text-3xl text-center">Metodología</h1>
        <p class="my-8">Se debe evidenciar que la metodología se presente de forma organizada y de manera secuencial, de acuerdo con el ciclo P-H-V-A “Planificar – Hacer – Verificar - Actuar” para alcanzar el objetivo general y cada uno de los objetivos específicos.</p>
    </InfoMessage>

    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
        <div class="my-14">
            <RecomendacionEvaluador>
                {#each proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            {#if evaluacion.idi_evaluacion}
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.metodologia_comentario ? evaluacion.idi_evaluacion.metodologia_comentario : 'Sin recomendación'}</p>
                            {:else if evaluacion.cultura_innovacion_evaluacion}
                                <p class="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.metodologia_comentario ? evaluacion.cultura_innovacion_evaluacion.metodologia_comentario : 'Sin recomendación'}</p>
                            {:else if evaluacion.ta_evaluacion}
                                <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.metodologia_comentario ? evaluacion.ta_evaluacion.metodologia_comentario : 'Sin recomendación'}</p>
                            {:else if evaluacion.tp_evaluacion}
                                <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.metodologia_comentario ? evaluacion.tp_evaluacion.metodologia_comentario : 'Sin recomendación'}</p>
                            {:else if evaluacion.servicio_tecnologico_evaluacion}
                                <h1 class="font-black mt-10">Metodología</h1>

                                <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion?.metodologia_comentario ? evaluacion.servicio_tecnologico_evaluacion.metodologia_comentario : 'Sin recomendación'}</p>

                                <hr class="mt-10 mb-10 border-black-200" />
                                <h1 class="font-black">Actividades</h1>

                                <ul class="list-disc pl-4">
                                    <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.actividades_primer_obj_comentario ? 'Recomendación actividades del primer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.actividades_primer_obj_comentario : 'Sin recomendación'}</li>
                                    <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.actividades_segundo_obj_comentario ? 'Recomendación actividades del segundo objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.actividades_segundo_obj_comentario : 'Sin recomendación'}</li>
                                    <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.actividades_tercer_obj_comentario ? 'Recomendación actividades del tercer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.actividades_tercer_obj_comentario : 'Sin recomendación'}</li>
                                    <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.actividades_cuarto_obj_comentario ? 'Recomendación actividades del cuarto objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.actividades_cuarto_obj_comentario : 'Sin recomendación'}</li>
                                </ul>
                            {/if}
                        </div>
                    {/if}
                {/each}
                {#if proyecto.evaluaciones.length == 0}
                    <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        </div>
    {/if}

    <form on:submit|preventDefault={submit}>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            <div class="py-24">
                <div>
                    <Label required class="mb-4" labelFor="metodologia" value="Metodología" />
                    <Textarea
                        sinContador={true}
                        id="metodologia"
                        error={errors.metodologia}
                        bind:value={$form.metodologia}
                        on:blur={() => {
                            syncTpColumnLong('metodologia', $form), syncTaColumnLong('metodologia', $form)
                        }}
                        required
                    />
                </div>
            </div>
            {#if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
                <div class="py-24">
                    <div>
                        <Label required class="mb-4" labelFor="metodologia_local" value={proyecto.codigo_linea_programatica == 69 ? 'A continuación, describa la metodología que será implementada en el ' + convocatoria.year + ' en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques:' : 'Descripcion de la metodología aplicada a nivel local'} />
                        <Textarea
                            maxlength="20000"
                            id="metodologia_local"
                            error={errors.metodologia_local}
                            bind:value={$form.metodologia_local}
                            on:blur={() => {
                                syncTpColumnLong('metodologia_local', $form), syncTaColumnLong('metodologia_local', $form)
                            }}
                            required
                        />
                    </div>
                </div>
            {/if}

            {#if proyecto.codigo_linea_programatica == 70}
                <div>
                    <div class="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label required class="mb-4" labelFor="implementacion_modelo_pedagogico" value="Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="implementacion_modelo_pedagogico" error={errors.implementacion_modelo_pedagogico} bind:value={$form.implementacion_modelo_pedagogico} on:blur={() => syncTaColumnLong('implementacion_modelo_pedagogico', $form)} required />
                        </div>
                    </div>
                </div>

                <div class="py-24">
                    <div>
                        <Label required class="mb-4" labelFor="municipios" value="Nombre los municipios impactados en la vigencia anterior por la TecnoAcademia" />
                    </div>
                    <div>
                        <SelectMulti id="municipios" bind:selectedValue={$form.municipios} items={municipios} isMulti={true} error={errors.municipios} placeholder="Buscar municipios" required />
                    </div>
                </div>

                <div class="py-24">
                    <div>
                        <Label required class="mb-4" labelFor="municipios_impactar" value="Defina los municipios a impactar en la vigencia el proyecto:" />
                    </div>
                    <div>
                        <SelectMulti id="municipios_impactar" bind:selectedValue={$form.municipios_impactar} items={municipios} isMulti={true} error={errors.municipios_impactar} placeholder="Buscar municipios" required />
                    </div>
                </div>

                <div class="py-24">
                    <div>
                        <Label required class="mb-4" labelFor="impacto_municipios" value="Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="impacto_municipios" error={errors.impacto_municipios} bind:value={$form.impacto_municipios} on:blur={() => syncTaColumnLong('impacto_municipios', $form)} required />
                    </div>
                    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <RecomendacionEvaluador class="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.municipios_comentario ? evaluacion.ta_evaluacion.municipios_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if}
                </div>

                <div class="py-24 grid grid-cols-2 gap-4">
                    <div>
                        <Label required={$form.otras_nombre_instituciones_programas ? undefined : true} class="mb-4" labelFor="nombre_instituciones_programas" value="Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias" />
                    </div>
                    <div>
                        <Select id="departamento_instituciones_programas" bind:selectedValue={regionalIEEjecucion} items={regionales} placeholder="Seleccione un departamento" />

                        <Tags id="nombre_instituciones_programas" class="mt-4" whitelist={whitelistInstitucionesEducativasEjecutar} bind:tags={$form.nombre_instituciones_programas} placeholder="Nombre(s) de la(s) IE" error={errors.nombre_instituciones_programas} required={$form.otras_nombre_instituciones_programas ? undefined : true} />
                        <div class="mt-10">
                            <InfoMessage>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</InfoMessage>
                            <Textarea label="Instituciones" maxlength="40000" id="otras_nombre_instituciones_programas" error={errors.otras_nombre_instituciones_programas} bind:value={$form.otras_nombre_instituciones_programas} />
                        </div>
                    </div>
                </div>

                <div class="py-24">
                    <div>
                        <Label required class="mb-4" labelFor="proyeccion_nuevas_instituciones" value="¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?" />
                    </div>
                    <div>
                        <Select items={opcionesSiNo} id="proyeccion_nuevas_instituciones" bind:selectedValue={$form.proyeccion_nuevas_instituciones} error={errors.proyeccion_nuevas_instituciones} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>
                </div>

                {#if $form.proyeccion_nuevas_instituciones?.value == 1}
                    <div class="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label required={$form.otras_nuevas_instituciones ? undefined : true} class="mb-4" labelFor="nuevas_instituciones" value="Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia" />
                        </div>
                        <div>
                            <Select id="departamento_nuevas_instituciones" bind:selectedValue={regionalIEEjecucion} items={regionales} placeholder="Seleccione un departamento" />

                            <Tags id="nuevas_instituciones" class="mt-4" whitelist={whitelistInstitucionesEducativasEjecutar} bind:tags={$form.nuevas_instituciones} placeholder="Nombre(s) de la(s) IE" error={errors.nuevas_instituciones} required={$form.otras_nuevas_instituciones ? undefined : true} />
                            <div class="mt-10">
                                <InfoMessage>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</InfoMessage>
                                <Textarea label="Instituciones" maxlength="40000" id="otras_nuevas_instituciones" error={errors.otras_nuevas_instituciones} bind:value={$form.otras_nuevas_instituciones} />
                            </div>
                        </div>
                    </div>
                {/if}

                <div class="py-24">
                    <div>
                        <Label required class="mb-4" labelFor="proyeccion_articulacion_media" value="¿Se proyecta incluir Instituciones Educativas en articulación con la media?" />
                    </div>
                    <div>
                        <Select items={opcionesSiNo} id="proyeccion_articulacion_media" bind:selectedValue={$form.proyeccion_articulacion_media} error={errors.proyeccion_articulacion_media} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>
                </div>

                {#if $form.proyeccion_articulacion_media?.value == 1}
                    <div class="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label required={$form.otras_nombre_instituciones ? undefined : true} class="mb-4" labelFor="nombre_instituciones" value="Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong>" />
                        </div>
                        <div>
                            <Select id="departamento_instituciones_media" bind:selectedValue={regionalIEArticulacion} items={regionales} placeholder="Seleccione un departamento" />

                            <Tags id="nombre_instituciones" class="mt-4" whitelist={whitelistInstitucionesEducativasArticular} bind:tags={$form.nombre_instituciones} placeholder="Nombre(s) de la(s) IE" error={errors.nombre_instituciones} required={$form.otras_nombre_instituciones ? undefined : true} />
                            <div class="mt-10">
                                <InfoMessage>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto</InfoMessage>
                                <Textarea label="Instituciones" maxlength="40000" id="otras_nombre_instituciones" error={errors.otras_nombre_instituciones} bind:value={$form.otras_nombre_instituciones} />
                            </div>
                        </div>
                    </div>
                {/if}

                {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                    <RecomendacionEvaluador class="mt-8">
                        {#each proyecto.evaluaciones as evaluacion, i}
                            {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                    <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                    <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.instituciones_comentario ? evaluacion.ta_evaluacion.instituciones_comentario : 'Sin recomendación'}</p>
                                </div>
                            {/if}
                        {/each}
                        {#if proyecto.evaluaciones.length == 0}
                            <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                        {/if}
                    </RecomendacionEvaluador>
                {/if}

                <div class="py-24 grid grid-cols-2 gap-4">
                    <div>
                        <Label required class="mb-4" labelFor="programas_formacion_articulados" value="Programas de articulación con la Media con los cuales se espera dar continuidad a la ruta de formación de los aprendices de la TecnoAcademia" />
                    </div>
                    <div>
                        <SelectMulti id="programas_formacion_articulados" bind:selectedValue={$form.programas_formacion_articulados} items={programasFormacion} isMulti={true} error={errors.programas_formacion_articulados} placeholder="Buscar por el nombre del programa de formación" required />
                        <InfoMessage>
                            Si no encuentra un programa por favor de clic en <strong>Añadir programa de formación</strong>. A continuación, se mostrará un campo de texto para que diligencie el nombre del programa y posterior de clic en <strong>Crear programa de formación</strong>.
                            <br />
                            Por último busque nuevamente en la lista y seleccione el programa recién creado.
                            <br />
                            <Button on:click={() => (programasFormacionDialogOpen = true)} variant="raised" type="button">Añadir programa de formación</Button>
                        </InfoMessage>
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 gap-4">
                    <div>
                        <Label required class="mb-4" labelFor="diseno_curricular_id" value="Programas a ejecutar en la vigencia del proyecto:" />
                    </div>

                    <div>
                        <SelectMulti id="diseno_curricular_id" bind:selectedValue={$form.diseno_curricular_id} items={disenosCurriculares} isMulti={true} error={errors.diseno_curricular_id} placeholder="Buscar por el nombre del programa de formación" required />
                    </div>
                </div>

                <div>
                    <div class="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label required class="mb-4" labelFor="proyectos_macro" value="Proyectos Macro o líneas de proyecto de investigación formativa y aplicada de la TecnoAcademia para la vigencia {convocatoria.year}" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="proyectos_macro" error={errors.proyectos_macro} bind:value={$form.proyectos_macro} on:blur={() => syncTaColumnLong('proyectos_macro', $form)} required />
                        </div>
                    </div>
                    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <RecomendacionEvaluador class="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.proyectos_macro_comentario ? evaluacion.ta_evaluacion.proyectos_macro_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if}
                </div>

                <div>
                    <div class="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label required class="mb-4" labelFor="articulacion_plan_educacion" value="Articulación de la TecnoAcademia con el Plan Decenal de Educación y su regionalización en el territorio: mencionar logros de la vigencia {convocatoria.year - 1} y {convocatoria.year}" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="articulacion_plan_educacion" error={errors.articulacion_plan_educacion} bind:value={$form.articulacion_plan_educacion} on:blur={() => syncTaColumnLong('articulacion_plan_educacion', $form)} required />
                        </div>
                    </div>
                </div>

                <div>
                    <div class="py-24 grid grid-cols-2 gap-4">
                        <div>
                            <Label required class="mb-4" labelFor="articulacion_territorios_stem" value="Artifculación de la TecnoAcademia con la Iniciativa de Territorios STEM+ del Ministerio de Educación en el Territorio" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="articulacion_territorios_stem" error={errors.articulacion_territorios_stem} bind:value={$form.articulacion_territorios_stem} on:blur={() => syncTaColumnLong('articulacion_territorios_stem', $form)} required />
                        </div>
                    </div>
                </div>
            {:else if proyecto.codigo_linea_programatica == 69}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label class="mb-4" labelFor="talento_otros_departamentos" value="¿Planea en el {convocatoria.year} realizar acciones que beneficien talentos en otros departamentos? Si es así seleccione los departamentos" />
                        </div>
                        <div>
                            <SelectMulti id="talento_otros_departamentos" bind:selectedValue={$form.talento_otros_departamentos} items={departamentos} isMulti={true} error={errors.talento_otros_departamentos} placeholder="Buscar departamentos" />
                        </div>
                    </div>

                    <div class="py-24">
                        <div class="grid grid-cols-2">
                            <div>
                                <Label required class="mb-4" labelFor="estrategia_atencion_talentos" value="Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados" />
                            </div>
                            <div>
                                <Textarea maxlength="40000" id="estrategia_atencion_talentos" error={errors.estrategia_atencion_talentos} bind:value={$form.estrategia_atencion_talentos} on:blur={() => syncTpColumnLong('estrategia_atencion_talentos', $form)} required />
                            </div>
                        </div>
                    </div>

                    <div class="mt-24 grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="municipios" value="Nombre de los municipios beneficiados" />
                        </div>
                        <div>
                            <SelectMulti id="municipios" bind:selectedValue={$form.municipios} items={municipios} isMulti={true} error={errors.municipios} placeholder="Buscar municipios" required />
                        </div>
                    </div>

                    <div class="mt-24 grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="impacto_municipios_tp" value="Descripción del beneficio en los municipios" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="impacto_municipios_tp" error={errors.impacto_municipios} bind:value={$form.impacto_municipios} on:blur={() => syncTpColumnLong('impacto_municipios', $form)} required />
                        </div>
                    </div>

                    {#if (isSuperAdmin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0)}
                        <RecomendacionEvaluador class="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.municipios_comentario ? evaluacion.tp_evaluacion.municipios_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if}
                </div>

                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="estrategia_articulacion_prox_vigencia" value="Comparta la estrategia de Articulación para el {convocatoria.year} para los proyectos de los Tecnoparques" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="estrategia_articulacion_prox_vigencia" error={errors.estrategia_articulacion_prox_vigencia} bind:value={$form.estrategia_articulacion_prox_vigencia} on:blur={() => syncTpColumnLong('estrategia_articulacion_prox_vigencia', $form)} required />
                        </div>
                    </div>
                </div>

                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="alianzas_estrategicas" value="Comparta las alianzas estratégicas a gestionar en el {convocatoria.year} para promover el logro de las metas del Tecnoparque" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="alianzas_estrategicas" error={errors.alianzas_estrategicas} bind:value={$form.alianzas_estrategicas} on:blur={() => syncTpColumnLong('alianzas_estrategicas', $form)} required />
                        </div>
                    </div>
                </div>

                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="estrategia_divulgacion" value="Comparta la estrategia de divulgación y visibilización de acciones del Tecnoparque para el {convocatoria.year}" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="estrategia_divulgacion" error={errors.estrategia_divulgacion} bind:value={$form.estrategia_divulgacion} on:blur={() => syncTpColumnLong('estrategia_divulgacion', $form)} required />
                        </div>
                    </div>
                </div>

                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="promover_productividad" value="Proponga las estrategias para el {convocatoria.year} con el fin de que el Tecnoparque contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="promover_productividad" error={errors.promover_productividad} bind:value={$form.promover_productividad} on:blur={() => syncTpColumnLong('promover_productividad', $form)} required />
                        </div>
                    </div>
                </div>
            {/if}
        </fieldset>
        <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            {#if proyecto.allowed.to_update}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
            {/if}
        </div>
    </form>

    <hr class="mb-20 mt-20" />

    {#if tecnoacademiaRelacionada?.modalidad == 2}
        <hr class="w-full block my-20" />

        <div class="mb-20">
            <h1 class="text-center text-2xl">Relacione las aulas móviles:</h1>
            {#if proyecto.allowed.to_update}
                <div class="flex justify-end mt-10">
                    <Button on:click={() => ((aulaMovilFormDialog = true), $formAulaMovil.reset())} variant="raised" type="button">Añadir aula móvil</Button>
                </div>
            {/if}

            <table class="w-full bg-white whitespace-no-wrap table-fixed data-table mt-10">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Placa / Modelo</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Estado</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each aulasMoviles as aulaMovil}
                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td class="border-t px-6 pt-6 pb-4 text-xs">
                                <div class="my-4">
                                    {aulaMovil.placa} / {aulaMovil.modelo}
                                </div>
                            </td>
                            <td class="border-t px-6 pt-6 pb-4 text-xs">
                                <div class="my-4">
                                    {aulaMovil.estado}
                                </div>
                            </td>
                            <td class="border-t px-6 pt-6 pb-4">
                                <DataTableMenu>
                                    {#if proyecto.allowed.to_update}
                                        <Item on:SMUI:action={() => configurarDialogoAula(aulaMovil)}>
                                            <Text>Editar</Text>
                                        </Item>
                                        <Separator />
                                        <Item on:SMUI:action={() => configurarDialogoAulaDestroy(aulaMovil)}>
                                            <Text>Eliminar</Text>
                                        </Item>
                                    {/if}
                                </DataTableMenu>
                            </td>
                        </tr>
                    {/each}
                    {#if aulasMoviles.length === 0}
                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td class="border-t px-6 pt-6 pb-4" colspan="9"> Sin información registrada </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}

    <hr class="mb-20 mt-20" />

    <InfoMessage>
        <span class="text-5xl font-black">2.</span>

        <h1 class="text-3xl text-center">Actividades</h1>
        <div class="my-10">
            {#if actividadesGantt.length == 0}
                Debe generar las actividades en el 'Árbol de objetivos'. <br /><strong>Importante</strong> Una vez creadas las actividades, edite cada una haciendo clic en los tres puntos, a continuación, valide las fechas (<strong>Se deben registrar todas las fechas para visualizar el diagrama de Gantt</strong>), enlace los productos y rubros correspondientes, de esta manera se completa la cadena
                de valor.
            {:else}
                <strong>Importante</strong> Una vez creadas las actividades, edite cada una haciendo clic en los tres puntos, a continuación, valide las fechas (<strong>Se deben registrar todas las fechas para visualizar el diagrama de Gantt</strong>), luego enlace los roles y rubros correspondientes, de esta manera se completa la cadena de valor.
            {/if}
        </div>
    </InfoMessage>

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
            <RecomendacionEvaluador class="mt-8">
                {#each proyecto.evaluaciones as evaluacion, i}
                    {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                        <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                            {#if evaluacion.idi_evaluacion}
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.actividades_comentario ? evaluacion.idi_evaluacion.actividades_comentario : 'Sin recomendación'}</p>
                            {:else if evaluacion.cultura_innovacion_evaluacion}
                                <p class="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.actividades_comentario ? evaluacion.cultura_innovacion_evaluacion.actividades_comentario : 'Sin recomendación'}</p>
                            {/if}
                        </div>
                    {/if}
                {/each}
                {#if proyecto.evaluaciones.length == 0}
                    <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                {/if}
            </RecomendacionEvaluador>
        {/if}
    {/if}

    {#if showGantt}
        <Button on:click={() => (showGantt = false)} class="mt-6">Ocultar diagrama de Gantt</Button>
    {/if}

    {#if showGantt || to_pdf}
        <Gantt
            items={actividadesGantt}
            request={{
                uri: 'convocatorias.proyectos.actividades.edit',
                params: [convocatoria.id, proyecto.id],
            }}
        />
    {:else}
        <DataTable class="mt-10" routeParams={[convocatoria.id, proyecto.id]}>
            <div slot="actions">
                <Button on:click={() => (showGantt = true)} class="mt-6">Visualizar diagrama de Gantt</Button>
            </div>
            <thead slot="thead">
                <tr class="text-left font-bold">
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Fechas</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Objetivo específico</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>

            <tbody slot="tbody">
                {#each actividades.data as actividad (actividad.id)}
                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t">
                            <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {actividad.descripcion}
                            </p>
                        </td>

                        <td class="border-t">
                            <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {#if actividad.fecha_inicio}
                                    Del {actividad.fecha_inicio} al {actividad.fecha_finalizacion}
                                {:else}
                                    <span class="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center inline-block mt-2 mb-2">Sin fechas definidas</span>
                                {/if}
                            </p>
                        </td>
                        <td class="border-t">
                            <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {actividad.objetivo_especifico.descripcion}
                            </p>
                        </td>

                        <td class="border-t td-actions">
                            <DataTableMenu class={actividades.data.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.actividades.edit', [convocatoria.id, proyecto.id, actividad.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>

                                <Separator disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''} />
                                <Item on:SMUI:action={() => ((actividadId = actividad.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                    <Text>Eliminar</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if actividades.data.length === 0}
                    <tr>
                        <td class="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                    </tr>
                {/if}
            </tbody>
        </DataTable>
        <Pagination links={actividades.links} />
    {/if}

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div class="text-center">Eliminar recurso</div>
            <div class="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" class="h-44 m-auto" />
                </figure>
            </div>
            <div class="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => destroy()}>Confirmar</Button>
            </div>
        </div>
    </Dialog>

    {#if proyecto.codigo_linea_programatica == 70}
        <Dialog bind:open={programasFormacionDialogOpen} id="programas-formacion">
            <div slot="content">
                <form on:submit|preventDefault={submitProgramasFormacion} id="programas-formacion-form">
                    <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
                        <div class="mt-8">
                            <Input label="Nombre" id="nombre" type="text" class="mt-1" bind:value={$formProgramasFormacion.nombre} error={errors.nombre} required />
                        </div>

                        <div class="mt-8">
                            <Input label="Código" id="codigo" type="number" input$min="0" input$max="2147483647" class="mt-1" bind:value={$formProgramasFormacion.codigo} error={errors.codigo} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="modalidad" value="Modalidad de estudio" />
                            <Select id="modalidad" items={modalidades} bind:selectedValue={$formProgramasFormacion.modalidad} error={errors.modalidad} autocomplete="off" placeholder="Seleccione una modalidad de estudio" required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="nivel_formacion" value="Nivel de formación" />
                            <Select id="nivel_formacion" items={nivelesFormacion} bind:selectedValue={$formProgramasFormacion.nivel_formacion} error={errors.nivel_formacion} autocomplete="off" placeholder="Seleccione un nivel de formación" required />
                        </div>
                    </fieldset>
                </form>
            </div>

            <div slot="actions">
                <div class="p-4">
                    <Button on:click={() => (programasFormacionDialogOpen = false)} variant={null}>Cancelar</Button>
                    <Button variant="raised" form="programas-formacion-form">Crear de formación</Button>
                </div>
            </div>
        </Dialog>

        <Dialog bind:open={aulaMovilFormDialog} size="950px">
            <div slot="title" class="flex items-center flex-col mt-4">Añadir aula móvil</div>
            <div slot="content">
                <form on:submit|preventDefault={submitAulaMovil} id="aula-movil" bind:this={formContainer}>
                    <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="placa" value="Placa del vehículo" />
                            <Input id="placa" type="text" class="mt-1" error={errors.placa} bind:value={$formAulaMovil.placa} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="modelo" value="Modelo del vehículo" />
                            <Input id="modelo" type="number" class="mt-1" error={errors.modelo} input$min="0" bind:value={$formAulaMovil.modelo} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="logros_vigencia" value="Acciones desarrolladas y logros en la vigencia actual con el Aula Móvil" />
                            <Textarea maxlength="40000" id="logros_vigencia" error={errors.logros_vigencia} bind:value={$formAulaMovil.logros_vigencia} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="numero_municipios_visitados" value="Número de municipios visitados en la vigencia actual" />
                            <Input id="numero_municipios_visitados" type="number" class="mt-1" error={errors.numero_municipios_visitados} input$min="0" bind:value={$formAulaMovil.numero_municipios_visitados} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="numero_aprendices_beneficiados" value="Número de aprendices beneficiados por el Aula Móvil en la vigencia {convocatoria.year - 1}" />
                            <Input id="numero_aprendices_beneficiados" type="number" class="mt-1" error={errors.numero_aprendices_beneficiados} input$min="0" bind:value={$formAulaMovil.numero_aprendices_beneficiados} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="estado" value="Estado actual (mecánico) del Aula Móvil " />
                            <Input id="estado" type="text" class="mt-1" error={errors.estado} bind:value={$formAulaMovil.estado} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="modulos_interactivos" value="Módulos interactivos en el Aula Móvil " />
                            <Textarea maxlength="40000" id="modulos_interactivos" error={errors.modulos_interactivos} bind:value={$formAulaMovil.modulos_interactivos} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="acciones_a_desarrollar" value="Acciones que espera desarrollar con el Aula Móvole en la vigencia {convocatoria.year}" />
                            <Textarea maxlength="40000" id="acciones_a_desarrollar" error={errors.acciones_a_desarrollar} bind:value={$formAulaMovil.acciones_a_desarrollar} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="numero_aprendices_a_beneficiar" value="Número de aprendices a beneficiar en la viencia {convocatoria.year}" />
                            <Input id="numero_aprendices_a_beneficiar" type="number" class="mt-1" error={errors.numero_aprendices_a_beneficiar} input$min="0" bind:value={$formAulaMovil.numero_aprendices_a_beneficiar} required />
                        </div>

                        <div class="mt-8">
                            <Label required class="mb-4" labelFor="recursos_mantenimiento" value="Requerimientos de recursos de Mantenimiento para la vigencia {convocatoria.year}" />
                            <Textarea maxlength="40000" id="recursos_mantenimiento" error={errors.recursos_mantenimiento} bind:value={$formAulaMovil.recursos_mantenimiento} required />
                        </div>

                        <div class="mt-8">
                            <Label class="mb-4" labelFor="soat" value="SOAT" />
                            <File id="soat" maxSize="10000" accept="application/pdf" bind:value={$formAulaMovil.soat} valueDb={soat} error={errors.soat} route={route('convocatorias.ta.aulas-moviles.download-file-sharepoint', [convocatoria.id, proyecto.id, $formAulaMovil?.id, 'soat'])} />
                        </div>

                        <div class="mt-8">
                            <Label class="mb-4" labelFor="soat" value="Técnico mecánica" />
                            <File id="tecnicomecanica" maxSize="10000" accept="application/pdf" bind:value={$formAulaMovil.tecnicomecanica} valueDb={tecnicomecanica} error={errors.tecnicomecanica} route={route('convocatorias.ta.aulas-moviles.download-file-sharepoint', [convocatoria.id, proyecto.id, $formAulaMovil?.id, 'tecnicomecanica'])} />
                        </div>
                    </fieldset>
                </form>
            </div>
            <div slot="actions">
                <div class="p-4">
                    <Button on:click={() => closeDialog()} variant={null}>Cancelar</Button>
                    {#if proyecto.allowed.to_update}
                        <LoadingButton type="submit" loading={$formAulaMovil.processing} form="aula-movil">Guardar</LoadingButton>
                    {/if}
                </div>
            </div>
        </Dialog>

        <Dialog bind:open={destroyAulaMovilDialog}>
            <div slot="title" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Eliminar recurso
            </div>
            <div slot="content">
                <p>
                    ¿Está seguro(a) que desea eliminar este recurso?
                    <br />
                    Todos los datos se eliminarán de forma permanente.
                    <br />
                    Está acción no se puede deshacer.
                </p>
            </div>
            <div slot="actions">
                <div class="p-4">
                    <Button on:click={() => ((destroyAulaMovilDialog = false), (aulaMovilId = null))} variant={null}>Cancelar</Button>
                    <LoadingButton loading={$formAulaMovil.processing} variant="raised" on:click={destroyAulaMovil}>Confirmar</LoadingButton>
                </div>
            </div>
        </Dialog>
    {/if}
</AuthenticatedLayout>

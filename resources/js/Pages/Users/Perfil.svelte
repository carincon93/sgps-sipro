<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Input from '@/Shared/Input'
    import LoadingButton from '@/Shared/LoadingButton'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import SelectMulti from '@/Shared/SelectMulti'
    import Tags from '@/Shared/Tags'
    import InfoMessage from '@/Shared/InfoMessage'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import EstudioAcademico from './Perfil/EstudiosAcademicos/Index'
    import FormacionAcademicaSena from './Perfil/FormacionesAcademicasSena/Index'
    import ParticipacionGruposInvestigacion from './Perfil/ParticipacionesGruposInvestigacionSena/Index'
    import ParticipacionProyectosSennova from './Perfil/ParticipacionesProyectosSennova/Index'

    export let errors
    export let user
    export let tiposDocumento
    export let tiposVinculacion
    export let municipios
    export let redesConocimiento
    export let disciplinasConocimiento
    export let nivelesIngles
    export let gruposEtnicos
    export let opcionesGenero
    export let tiposDiscapacidad
    export let rolesSennova
    export let subareasExperiencia
    export let centrosFormacion
    export let estudiosAcademicos
    export let formacionesAcademicasSena
    export let participacionesGruposInvestigacionSena
    export let participacionesProyectosSennova
    export let rolesSennovaRelacionados
    export let disciplinasConocimientoRelacionadas

    $: $title = 'Perfil'

    let authUser = $page.props.auth.user

    let formChangePassword = useForm({
        old_password: '',
        password: '',
        password_confirmation: '',
    })

    function submitChangePassword() {
        $formChangePassword.put(route('users.change-password'))
    }

    let form = useForm({
        nombre: user.nombre,
        email: user.email,
        tipo_documento: user.tipo_documento,
        numero_documento: user.numero_documento,
        numero_celular: user.numero_celular,
        tipo_vinculacion: user.tipo_vinculacion,
        lugar_expedicion_id: user.lugar_expedicion_id,
        genero: user.genero,
        fecha_nacimiento: user.fecha_nacimiento,
        horas_dedicadas: user.horas_dedicadas,
        meses_dedicados: user.meses_dedicados,
        nivel_ingles: user.nivel_ingles,
        fecha_resolucion_nombramiento: user.fecha_resolucion_nombramiento,
        fecha_acta_nombramiento: user.fecha_acta_nombramiento,
        nro_acta_nombramiento: user.nro_acta_nombramiento,
        grado_sennova: user.grado_sennova,
        fecha_inicio_contrato: user.fecha_inicio_contrato,
        fecha_finalizacion_contrato: user.fecha_finalizacion_contrato,
        asignacion_mensual: user.asignacion_mensual,
        rol_sennova_id: user.rol_sennova_id,
        otros_roles_sennova: rolesSennovaRelacionados.length > 0 ? rolesSennovaRelacionados : null,
        tiempo_por_rol: user.tiempo_por_rol,
        roles_fuera_sennova: user.roles_fuera_sennova,
        cvlac: user.cvlac,
        link_sigep_ii: user.link_sigep_ii,
        grupo_etnico: user.grupo_etnico,
        discapacidad: user.discapacidad,
        subarea_experiencia_laboral: user.subarea_experiencia_laboral,

        red_conocimiento_id: user.red_conocimiento_id,
        disciplinas_subarea_conocimiento: disciplinasConocimientoRelacionadas.length > 0 ? disciplinasConocimientoRelacionadas : null,
        experiencia_laboral_sena: user.experiencia_laboral_sena,
        cursos_de_evaluacion_realizados: user.cursos_de_evaluacion_realizados,
        numero_proyectos_evaluados: user.numero_proyectos_evaluados,

        meses_experiencia_metodos_ensayo: user.meses_experiencia_metodos_ensayo,
        meses_experiencia_metodos_calibracion: user.meses_experiencia_metodos_calibracion,

        autorizacion_datos: user.autorizacion_datos,
        informacion_completa: user.informacion_completa ? 1 : 2,
        centro_formacion_id: user.centro_formacion_id,

        cursos_evaluacion_proyectos: user.cursos_evaluacion_proyectos ? 1 : 2,
        experiencia_como_evaluador: user.experiencia_como_evaluador ? 1 : 2,
        participacion_como_evaluador_sennova: user.participacion_como_evaluador_sennova ? 1 : 2,
        conocimiento_iso_17025: user.conocimiento_iso_17025 ? 1 : 2,
        conocimiento_iso_19011: user.conocimiento_iso_19011 ? 1 : 2,
        conocimiento_iso_29119: user.conocimiento_iso_29119 ? 1 : 2,
        conocimiento_iso_9001: user.conocimiento_iso_9001 ? 1 : 2,
        experiencia_metodos_ensayo: user.experiencia_metodos_ensayo ? 1 : 2,
        experiencia_metodos_calibracion: user.experiencia_metodos_calibracion ? 1 : 2,
        experiencia_minima_metodos: user.experiencia_minima_metodos ? 1 : 2,
    })

    function submitChangeUserProfile() {
        $form.put(route('users.change-user-profile'), {
            preserveScroll: true,
        })
    }
</script>

<AuthenticatedLayout>
    <div class="grid grid-cols-3">
        <div>
            <h1 class="font-black text-4xl uppercase">Perfil</h1>
        </div>
        <form on:submit|preventDefault={submitChangeUserProfile} id="informacion-basica" class="bg-white rounded shadow col-span-2">
            <fieldset class="p-8 space-y-14">
                <h1 class="text-2xl font-medium">INFORMACIÓN PRINCIPAL</h1>

                <div class="mt-8">
                    <Input label="Nombre completo" id="nombre" type="text" class="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
                </div>

                <div class="mt-8">
                    <Input label="Correo electrónico institucional" id="email" type="email" class="mt-1" bind:value={$form.email} error={errors.email} required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="tipo_documento" value="Tipo de documento" />
                    <Select id="tipo_documento" items={tiposDocumento} bind:selectedValue={$form.tipo_documento} error={errors.tipo_documento} autocomplete="off" placeholder="Seleccione un tipo de documento" required />
                </div>

                <div class="mt-8">
                    <Input label="Número de documento" id="numero_documento" type="number" input$min="55555" input$max="9999999999999" class="mt-1" bind:value={$form.numero_documento} error={errors.numero_documento} required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="lugar_expedicion_id" value="Lugar de expedición" />
                    <Select id="lugar_expedicion_id" items={municipios} bind:selectedValue={$form.lugar_expedicion_id} error={errors.lugar_expedicion_id} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="genero" value="Género" />
                    <Select id="genero" items={opcionesGenero} bind:selectedValue={$form.genero} error={errors.genero} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>

                <div class="mt-8">
                    <Label required labelFor="fecha_nacimiento" value="Fecha de nacimiento" />
                    <input id="fecha_nacimiento" type="date" class="mt-1 block w-full p-4" error={errors.fecha_nacimiento} bind:value={$form.fecha_nacimiento} required />
                </div>

                <div class="mt-8">
                    <Input label="Número de celular" id="numero_celular" type="number" input$min="3000000000" input$max="9999999999" class="mt-1" bind:value={$form.numero_celular} error={errors.numero_celular} required />
                </div>

                <h1 class="text-2xl font-medium">EXPERIENCIA PROFESIONAL Y/O ACADÉMICA</h1>
                <div />
                <div class="mt-8">
                    <Label required class="mb-4" labelFor="subarea_experiencia_laboral" value="Subárea de experiencia profesional" />
                    <Select id="subarea_experiencia_laboral" items={subareasExperiencia} bind:selectedValue={$form.subarea_experiencia_laboral} error={errors.subarea_experiencia_laboral} autocomplete="off" placeholder="Seleccione una subárea" required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="disciplinas_subarea_conocimiento" value="Disciplinas de conocimiento en la cuales se desempeña" />
                    <SelectMulti id="disciplinas_subarea_conocimiento" bind:selectedValue={$form.disciplinas_subarea_conocimiento} items={disciplinasConocimiento} isMulti={true} error={errors.disciplinas_subarea_conocimiento} placeholder="Seleccione las disciplinas de conocimiento" required />
                </div>

                <div class="mt-8">
                    <Label class="mb-4" labelFor="red_conocimiento_id" value="Red de conocimiento sectorial en la cual se desempeña" />
                    <Select id="red_conocimiento_id" items={redesConocimiento} bind:selectedValue={$form.red_conocimiento_id} error={errors.red_conocimiento_id} autocomplete="off" placeholder="Seleccione una red de conocimiento" />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="centro_formacion_id" value="Centro de formación al cual está vinculado" />
                    <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="nivel_ingles" value="Nivel de inglés" />
                    <Select id="nivel_ingles" items={nivelesIngles} bind:selectedValue={$form.nivel_ingles} error={errors.nivel_ingles} autocomplete="off" placeholder="Seleccione una opción" required />
                    <small>Indique el nivel de inglés certificado (marco europeo)</small>
                </div>

                <div class="mt-8">
                    <Input label="Enlace CvLac" id="cvlac" type="url" class="mt-1" bind:value={$form.cvlac} error={errors.cvlac} />
                    <small>Debe incluir el http:// o https://</small>
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="grupo_etnico" value="Preferencia étnica" />
                    <Select id="grupo_etnico" items={gruposEtnicos} bind:selectedValue={$form.grupo_etnico} error={errors.grupo_etnico} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="discapacidad" value="Si cuenta con algún tipo de discapacidad. Por favor seleccione cual discapacidad." />
                    <Select id="discapacidad" items={tiposDiscapacidad} bind:selectedValue={$form.discapacidad} error={errors.discapacidad} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>

                <h1 class="text-2xl font-medium">INFORMACIÓN DEL TIPO DE VINCULACIÓN</h1>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="tipo_vinculacion" value="Tipo de vinculación" />
                    <Select id="tipo_vinculacion" items={tiposVinculacion} bind:selectedValue={$form.tipo_vinculacion} error={errors.tipo_vinculacion} autocomplete="off" placeholder="Seleccione el tipo de vinculación" required />
                </div>

                {#if $form.tipo_vinculacion?.value == 1 || $form.tipo_vinculacion?.value == 2}
                    <div class="mt-8">
                        <Label required labelFor="fecha_resolucion_nombramiento" value="Fecha de resolución de nombramiento" />
                        <input id="fecha_resolucion_nombramiento" type="date" class="mt-1 block w-full p-4" error={errors.fecha_resolucion_nombramiento} bind:value={$form.fecha_resolucion_nombramiento} required />
                    </div>

                    <div class="mt-8">
                        <Label required labelFor="fecha_acta_nombramiento" value="Fecha del acta de nombramiento" />
                        <input id="fecha_acta_nombramiento" type="date" class="mt-1 block w-full p-4" error={errors.fecha_acta_nombramiento} bind:value={$form.fecha_acta_nombramiento} required />
                    </div>

                    <div class="mt-8">
                        <Input label="Número del acta de nombramiento" id="nro_acta_nombramiento" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.nro_acta_nombramiento} error={errors.nro_acta_nombramiento} required />
                    </div>

                    <!--
                    <div class="mt-8">
                        <Input label="Grado SENNOVA" id="grado_sennova" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.grado_sennova} error={errors.grado_sennova} required />
                    </div> -->
                {:else if $form.tipo_vinculacion?.value == 3}
                    <div class="mt-8">
                        <Label labelFor="fecha_inicio_contrato" value="Fecha de inicio del contrato" />
                        <input id="fecha_inicio_contrato" type="date" class="mt-1 block w-full p-4" error={errors.fecha_inicio_contrato} bind:value={$form.fecha_inicio_contrato} required />
                    </div>

                    <div class="mt-8">
                        <Label labelFor="fecha_finalizacion_contrato" value="Fecha de finalizacion del contrato" />
                        <input id="fecha_finalizacion_contrato" type="date" class="mt-1 block w-full p-4" error={errors.fecha_finalizacion_contrato} bind:value={$form.fecha_finalizacion_contrato} required />
                    </div>

                    <div class="mt-8">
                        <Input label="Enlace a SIGEP II" id="link_sigep_ii" type="url" class="mt-1" bind:value={$form.link_sigep_ii} error={errors.link_sigep_ii} />
                        <small>Debe incluir el http:// o https://</small>
                    </div>
                {/if}

                <div class="mt-8">
                    <Input label="Asignación mensual" id="asignacion_mensual" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.asignacion_mensual} error={errors.asignacion_mensual} required />
                </div>

                <div class="mt-8">
                    <Input label="Tiempo de experiencia laboral en el SENA" id="experiencia_laboral_sena" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.experiencia_laboral_sena} error={errors.experiencia_laboral_sena} required />
                    <small>Importante: Tiempo en meses</small>
                </div>

                <div class="mt-8">
                    <Input label="Número de horas semanales de dedicación en actividades de CTeI" id="horas_dedicadas" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.horas_dedicadas} error={errors.horas_dedicadas} required />
                </div>

                <div class="mt-8">
                    <Input label="Número de meses de dedicación en actividades de CTeI" id="meses_dedicados" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.meses_dedicados} error={errors.meses_dedicados} required />
                </div>

                <div class="mt-8">
                    <Label required labelFor="rol_sennova_id" value="Seleccione su rol SENNOVA actual" />
                    <Select id="rol_sennova_id" bind:selectedValue={$form.rol_sennova_id} items={rolesSennova} error={errors.rol_sennova_id} placeholder="Seleccione el rol SENNOVA correspondiente" required />
                </div>

                <div class="mt-8">
                    <Label labelFor="otros_roles_sennova" value="Roles SENNOVA en los cuales ha sido contratado/vinculado" />
                    <SelectMulti id="otros_roles_sennova" bind:selectedValue={$form.otros_roles_sennova} items={rolesSennova} isMulti={true} error={errors.otros_roles_sennova} placeholder="Seleccione los roles SENNOVA correspondientes" />

                    {#if $form.otros_roles_sennova}
                        <p class="mt-8 mb-4">A continuación, indique el tiempo que ha estado en cada rol SENNOVA.</p>
                        <strong>Importante:</strong> Para ello copie la siguiente lista de roles en el campo en blanco:
                        <p class="text-xs mt-2">
                            {#each $form.otros_roles_sennova as otroRolSennova, index}
                                {index + 1 + '. ' + otroRolSennova.label} - (Tiempo en meses),
                                <br />
                            {/each}
                        </p>
                        <Tags id="tiempo_por_rol" class="mt-2" enforceWhitelist={false} bind:tags={$form.tiempo_por_rol} placeholder="Por favor indique el rol y el tiempo" error={errors.tiempo_por_rol} />
                    {/if}
                </div>

                <div class="mt-8">
                    <Label labelFor="roles_fuera_sennova" value="Si ha estado en otros roles fuera de SENNOVA por favor indiquelos en el siguiente campo. Separados por coma (,)" />

                    <Tags id="roles_fuera_sennova" class="mt-4" enforceWhitelist={false} bind:tags={$form.roles_fuera_sennova} placeholder="Indique el rol" error={errors.roles_fuera_sennova} />
                </div>

                <h1 class="text-2xl font-medium">EXPERIENCIA COMO FORMULADOR Y EVALUADOR DE PROYECTOS</h1>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="experiencia_como_evaluador" value="¿Tiene experiencia como evaluador?" />
                    <Select
                        id="experiencia_como_evaluador"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.experiencia_como_evaluador}
                        error={errors.experiencia_como_evaluador}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                {#if $form.experiencia_como_evaluador?.value == 1}
                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="numero_proyectos_evaluados" value="Si su respuesta en la pregunta anterior es 'SI' indique el número de proyectos que ha evaluado" />
                        <Input label="Número de proyectos" id="numero_proyectos_evaluados" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.numero_proyectos_evaluados} error={errors.numero_proyectos_evaluados} required />
                    </div>
                {/if}

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="cursos_evaluacion_proyectos" value="¿Ha realizado cursos complementarios relacionados con evaluación de proyectos?" />
                    <Select
                        id="cursos_evaluacion_proyectos"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.cursos_evaluacion_proyectos}
                        error={errors.cursos_evaluacion_proyectos}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                {#if $form.cursos_evaluacion_proyectos?.value == 1}
                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="cursos_de_evaluacion_realizados" value="Si su respuesta en la pregunta anterior es 'SI' indique los cursos que ha realizado separados por (,)" />
                        <Tags id="cursos_de_evaluacion_realizados" class="mt-4" enforceWhitelist={false} bind:tags={$form.cursos_de_evaluacion_realizados} placeholder="Nombres de los cursos" error={errors.cursos_de_evaluacion_realizados} />
                    </div>
                {/if}

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="participacion_como_evaluador_sennova" value="¿Ha participado como evaluador Sennova en vigencias anteriores?" />
                    <Select
                        id="participacion_como_evaluador_sennova"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.participacion_como_evaluador_sennova}
                        error={errors.participacion_como_evaluador_sennova}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                <h1 class="text-2xl font-medium">CURSOS REALIZADOS</h1>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="conocimiento_iso_17025" value="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO/IEC 17025:2017?" />
                    <Select
                        id="conocimiento_iso_17025"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.conocimiento_iso_17025}
                        error={errors.conocimiento_iso_17025}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="conocimiento_iso_19011" value="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 19011:2018? " />
                    <Select
                        id="conocimiento_iso_19011"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.conocimiento_iso_19011}
                        error={errors.conocimiento_iso_19011}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="conocimiento_iso_29119" value="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 29119 Vigente?" />
                    <Select
                        id="conocimiento_iso_29119"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.conocimiento_iso_29119}
                        error={errors.conocimiento_iso_29119}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="conocimiento_iso_9001" value="¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 9001:2015?" />
                    <Select
                        id="conocimiento_iso_9001"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.conocimiento_iso_9001}
                        error={errors.conocimiento_iso_9001}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="experiencia_metodos_ensayo" value="¿Tiene experiencia técnica en métodos de ensayo?" />
                    <Select
                        id="experiencia_metodos_ensayo"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.experiencia_metodos_ensayo}
                        error={errors.experiencia_metodos_ensayo}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                {#if $form.experiencia_metodos_ensayo?.value == 1}
                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="meses_experiencia_metodos_ensayo" value="Si su respuesta en la pregunta anterior es 'SI' indique el número de meses de experiencia" />
                        <Input label="Número de meses" id="meses_experiencia_metodos_ensayo" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.meses_experiencia_metodos_ensayo} error={errors.meses_experiencia_metodos_ensayo} required />
                    </div>
                {/if}

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="experiencia_metodos_calibracion" value="¿Tiene experiencia técnica con métodos de calibración?" />
                    <Select
                        id="experiencia_metodos_calibracion"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.experiencia_metodos_calibracion}
                        error={errors.experiencia_metodos_calibracion}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                {#if $form.experiencia_metodos_calibracion?.value == 1}
                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="meses_experiencia_metodos_calibracion" value="Si su respuesta en la pregunta anterior es 'SI' indique el número de meses de experiencia" />
                        <Input label="Número de meses" id="meses_experiencia_metodos_calibracion" type="number" input$min="0" input$max="9999999999999" class="mt-1" bind:value={$form.meses_experiencia_metodos_calibracion} error={errors.meses_experiencia_metodos_calibracion} required />
                    </div>
                {/if}

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="experiencia_minima_metodos" value="¿Cuenta con experiencia técnica mínimo de doce (12) meses relacionada por lo menos con dos (2) métodos de ensayo o dos (2) métodos de calibración o dos (2) productos de base tecnológica (TICs)?" />
                    <Select
                        id="experiencia_minima_metodos"
                        items={[
                            { value: 1, label: 'Si' },
                            { value: 2, label: 'No' },
                        ]}
                        bind:selectedValue={$form.experiencia_minima_metodos}
                        error={errors.experiencia_minima_metodos}
                        autocomplete="off"
                        placeholder="Seleccione una opción"
                        required
                    />
                </div>

                <div class="mt-8">
                    <InfoMessage class="shadow ml-4 mb-4" message="Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (Acuerdo No. 0009 del 2016)" />
                    <FormField>
                        <Checkbox bind:checked={$form.autorizacion_datos} />
                        <span slot="label">Autorizo el tratamiento de mis datos personales. <a href="https://www.sena.edu.co/es-co/transparencia/Documents/proteccion_datos_personales_sena_2016.pdf" target="_blank" class="text-app-500">Leer acuerdo No. 0009 del 2016</a></span>
                    </FormField>
                </div>
            </fieldset>
            <div class="px-8 py-4 bg-gray-100 border-t border-gray-200 flex items-center">
                <LoadingButton loading={$form.processing} type="submit">Guardar cambios</LoadingButton>
            </div>
        </form>
    </div>

    <hr class="w-full my-20" />

    <div class="grid gap-4 grid-cols-3">
        <div>
            <h1 class="font-black text-4xl uppercase">Estudios académicos</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <EstudioAcademico {estudiosAcademicos} />
        </div>
    </div>

    <hr class="w-full my-20" />

    <div class="grid gap-4 grid-cols-3">
        <div>
            <h1 class="font-black text-4xl uppercase">Formación académica SENA</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <FormacionAcademicaSena {formacionesAcademicasSena} />
        </div>
    </div>

    <hr class="w-full my-20" />

    <div class="grid gap-4 grid-cols-3">
        <div>
            <h1 class="font-black text-4xl uppercase">Participación en grupos de investigación SENA</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <ParticipacionGruposInvestigacion {participacionesGruposInvestigacionSena} />
        </div>
    </div>

    <hr class="w-full my-20" />

    <div class="grid gap-4 grid-cols-3">
        <div>
            <h1 class="font-black text-4xl uppercase">Participación en proyectos SENNOVA</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <ParticipacionProyectosSennova {participacionesProyectosSennova} />
        </div>
    </div>

    <hr class="w-full my-20" />

    <h1 class="font-black text-4xl uppercase">Confirmación de información completa</h1>

    <div class="mt-8 pb-20">
        <Label required class="mb-4" labelFor="informacion_completa" value="Confirmo que he completado la información solicitada" />
        <Select
            id="informacion_completa"
            items={[
                { value: 1, label: 'Si' },
                { value: 2, label: 'No' },
            ]}
            bind:selectedValue={$form.informacion_completa}
            error={errors.informacion_completa}
            autocomplete="off"
            placeholder="Seleccione una opción"
            required
        />
        <LoadingButton loading={$form.processing} type="submit" class="mt-8" form="informacion-basica">Guardar</LoadingButton>
    </div>

    <!-- <hr class="w-full my-20" />

    <div class="grid gap-4 grid-cols-3">
        <div>
            <h1 class="font-black text-4xl uppercase">Cambiar la contraseña</h1>
        </div>
        <form on:submit|preventDefault={submitChangePassword} class="bg-white rounded shadow col-span-2">
            <fieldset class="p-8">
                <div class="mt-8">
                    <Input label="Contraseña actual" id="old_password" type="password" class="mt-1" bind:value={$formChangePassword.old_password} error={errors.old_password} required />
                </div>
                <div class="mt-8">
                    <Input label={'Nueva ' + $_('Password').toLowerCase()} id="password" type="password" class="mt-1" bind:value={$formChangePassword.password} error={errors.password} required autocomplete="new-password" />
                </div>

                <div class="mt-8">
                    <Input label={$_('Confirm Password')} id="password_confirmation" type="password" class="mt-1" bind:value={$formChangePassword.password_confirmation} error={errors.password_confirmation} required autocomplete="new-password" />
                </div>
            </fieldset>
            <div class="px-8 py-4 bg-gray-100 border-t border-gray-200 flex items-center">
                <LoadingButton loading={$formChangePassword.processing} type="submit" bind:disabled={$formChangePassword.autorizacion_datos}>Cambiar contraseña</LoadingButton>
            </div>
        </form>
    </div> -->
</AuthenticatedLayout>

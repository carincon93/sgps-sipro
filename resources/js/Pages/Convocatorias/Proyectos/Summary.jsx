<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Stepper from '@/Components/Stepper'
    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import InfoMessage from '@/Components/InfoMessage'
    import Label from '@/Components/Label'
    import Password from '@/Components/Password'
    import Textarea from '@/Components/Textarea'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Switch from '@/Components/Switch'

    export let errors
    export let convocatoria
    export let proyecto
    export let versiones
    export let problemaCentral
    export let efectosDirectos
    export let causasIndirectas
    export let causasDirectas
    export let efectosIndirectos
    export let objetivoGeneral
    export let resultados
    export let objetivosEspecificos
    export let actividades
    export let impactos
    // export let actividadesPresupuesto
    export let resultadoProducto
    export let analisisRiesgo
    export let anexos
    export let generalidades
    export let metodologia
    export let propuestaSostenibilidad
    export let productosActividades
    export let articulacionSennova
    export let soportesEstudioMercado
    export let estudiosMercadoArchivo
    export let edt

    export let minInstructoresInvestigadores
    export let minAprendicesEnSemilleros

    $: $title = 'Finalizar proyecto'

    let dialogFinalizarProyecto = errors.password != undefined ? true : false
    let enviarProyectoDialogOpen = errors.password != undefined ? true : false

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let proyectoCompleto = false

    let form = useForm({
        password: '',
    })

    function finalizarProyecto() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.finish', [convocatoria.id, proyecto.id]), {
                onFinish: () => {
                    $form.password = ''

                    if (!errors.password) {
                        dialogFinalizarProyecto = false
                    }
                },
                preserveScroll: true,
            })
            $form.password = ''
        }
    }

    function enviarProyecto() {
        if (is_super_admin || (checkRole(auth_user, [4, 21]) && proyecto.finalizado == true)) {
            $form.put(route('convocatorias.proyectos.send', [convocatoria.id, proyecto.id]), {
                onFinish: () => {
                    $form.password = ''

                    if (!errors.password) {
                        enviarProyectoDialogOpen = false
                    }
                },
                preserveScroll: true,
            })
            $form.password = ''
        }
    }

    let comentarioForm = useForm({
        comentario: '',
    })
    function submitComentario() {
        if (is_super_admin || (checkRole(auth_user, [4, 21]) && proyecto.finalizado == true)) {
            $comentarioForm.put(route('convocatorias.proyectos.return-project', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    let minimoEmpresas = 0
    if (proyecto.codigo_linea_programatica == 68) {
        if (proyecto.precio_proyecto >= 199999999) {
            minimoEmpresas = 16
        } else if (proyecto.precio_proyecto >= 200000000 && proyecto.precio_proyecto <= 499999999) {
            minimoEmpresas = 35
        } else if (proyecto.precio_proyecto >= 500000000) {
            minimoEmpresas = 50
        }
    }

    let dt = new Date()
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    <div className="mt-20">
        {#if proyecto.codigo_linea_programatica == 68}
            <InfoMessage className="mb-2">
                <h1><strong>Información importante</strong></h1>
                <p>De acuerdo con el presupuesto solicitado el proyecto se compromete a cumplir adicionalmente las siguientes metas, las cuales están alineadas al cumplimento del Plan Nacional de Desarrollo y de los CONPES:</p>
                <ul>
                    {#if minimoEmpresas > 0}
                        <li>- Empresas atendidas por producción de centro: mínimo {minimoEmpresas}</li>
                    {/if}
                    <li>- Aprendices atendidos (visitas presenciales/virtuales, transferencia de conocimiento): 50 mínimo</li>
                    <li>- Emprendedores y empresarios atendidos (visitas presenciales/virtuales, transferencia de conocimiento): 50 mínimo</li>
                </ul>
                <p>Al momento de <strong>finalizar el proyecto</strong> está aceptando los compromisos establecidos para el cumplimiento de las metas la vigencia {convocatoria.year ? convocatoria.year : dt.getYear()}</p>
            </InfoMessage>
        {/if}

        {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
            <InfoMessage className="mb-2">
                <h1 className="text-3xl"><strong>¡Tenga en cuenta!</strong></h1>
                <p>
                    Esta es una opción para notificar al Dinamizador que ha finalizado de diligenciar/subsanar el proyecto y de esta manera haga una revisión con el objetivo de confirmar o hacer un comentario de ajuste. Si el Dinamizador por alguna razón NO confirma el proyecto
                    <strong>la plataforma lo hará automáticamente al finalizar cada fase ya sea de formulación o de subsanación.</strong>
                </p>
            </InfoMessage>
        {/if}
        <hr className="mt-10 mb-10" />
        {#if (is_super_admin && proyecto.finalizado == true && proyecto.habilitado_para_evaluar == false) || (checkRole(auth_user, [4, 21]) && proyecto.finalizado == true && proyecto.habilitado_para_evaluar == false)}
            <InfoMessage>
                <p>¿El proyecto está completo?</p>
                <Switch bind:checked={proyectoCompleto} />
                {#if proyectoCompleto}
                    <br />
                    <Button on:click={() => (enviarProyectoDialogOpen = true)} variant="raised" className="mt-10">Confirmar proyecto</Button>
                    <br />
                    <small className="mb-2 mt-8">Si desea confirmar el proyecto de clic en <strong>Confirmar proyecto</strong> y a continuación, escriba la contraseña de su usuario.</small>
                {:else if proyectoCompleto == false}
                    <form on:submit|preventDefault={submitComentario}>
                        <fieldset disabled={is_super_admin || (checkRole(auth_user, [4, 21]) && proyecto.finalizado == true) ? undefined : true}>
                            <div className="mt-8">
                                <p className="mb-2">Si considera que el proyecto está incompleto por favor haga un comentario al proponente detallando que información o ítems debe completar.</p>
                                <Textarea label="Comentario" maxlength="40000" id="comentario" error={errors.comentario} bind:value={$comentarioForm.comentario} required />
                            </div>
                        </fieldset>
                        <div className="mt-10 flex items-center">
                            {#if is_super_admin || (checkRole(auth_user, [4, 21]) && proyecto.finalizado == true)}
                                <PrimaryButton loading={$comentarioForm.processing} className="ml-auto" type="submit">Enviar comentario</PrimaryButton>
                            {/if}
                        </div>
                    </form>
                {/if}
            </InfoMessage>
        {:else if proyecto.allowed.to_update}
            {#if proyecto.finalizado == false && proyecto.modificable == true && generalidades && problemaCentral && efectosDirectos && efectosIndirectos && causasDirectas && causasIndirectas && objetivoGeneral && resultados && objetivosEspecificos && actividades && impactos && metodologia && propuestaSostenibilidad && productosActividades && resultadoProducto && analisisRiesgo && anexos && soportesEstudioMercado && estudiosMercadoArchivo}
                {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
                    <InfoMessage className="mb-2" message="Si desea finalizar el proyecto de clic en <strong>Finalizar proyecto</strong> y a continuación, escriba la contraseña de su usuario. Se le notificará al dinamizador SENNOVA de su centro de formación para que haga la respectiva revisión y radicación del proyecto." />
                    <Button on:click={() => (dialogFinalizarProyecto = true)} variant="raised">Finalizar proyecto</Button>
                {:else}
                    <InfoMessage className="mb-2" message="El proyecto está completo." />
                {/if}
            {:else if proyecto.finalizado == false}
                <InfoMessage className="mb-2" alertMsg={true}>
                    <p><strong>La información del proyecto está incompleta. Para poder finalizar el proyecto debe completar los siguientes ítems:</strong></p>
                    <ul className="list-disc p-4">
                        {#if !generalidades}
                            <li>Generalidades</li>
                        {/if}
                        {#if !articulacionSennova && proyecto.codigo_linea_programatica == 70}
                            <li>Articulación SENNOVA</li>
                        {/if}
                        {#if !problemaCentral}
                            <li>Problema central</li>
                        {/if}
                        {#if !efectosDirectos}
                            <li>Efectos directos (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !efectosIndirectos}
                            <li>Efectos indirectos (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !causasDirectas}
                            <li>Causas directas (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !causasIndirectas}
                            <li>Causas indirectas (Asegúrese que no hayan casillas en el árbol de problemas con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !objetivoGeneral}
                            <li>Objetivo general (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !resultados}
                            <li>Resultados (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !objetivosEspecificos}
                            <li>Objetivos específicos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !actividades}
                            <li>Actividades (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !impactos}
                            <li>Impactos (Asegúrese que no hayan casillas en el árbol de objetivos con el mensaje <strong>Sin información registrada aún.</strong>)</li>
                        {/if}
                        {#if !metodologia}
                            <li>Metodología (Metodología y actividades)</li>
                        {/if}
                        {#if !propuestaSostenibilidad}
                            <li>Propuesta de sostenibilidad (Cadena de valor)</li>
                        {/if}
                        {#if proyecto.codigo_linea_programatica == 70}
                            {#if !edt}
                                <li>Tiene un rubro presupuestal 'Servicios de organización y asistencia de convenciones y ferias' y le debe asociar al menos un EDT</li>
                            {/if}
                        {/if}
                        {#if !productosActividades}
                            <li>Hay productos sin actividades relacionadas (Debe revisar cada producto en el numeral <strong>Productos</strong> y asegúrese que tengan actividades relacionadas)</li>
                        {/if}
                        {#if !resultadoProducto}
                            <li>Hay resultados sin productos relacionados (Debe revisar cada producto en el numeral <strong>Productos</strong> y asegúrese que tenga algún resultado asociado)</li>
                        {/if}
                        {#if !analisisRiesgo}
                            <li>Faltan análisis de riesgos (Asegúrese que ha generado análisis de riesgo en los siguientes niveles: A nivel del objetivo general - A nivel de actividades - A nivel de productos)</li>
                        {/if}
                        {#if !anexos}
                            <li>No se han cargado todos los anexos</li>
                        {/if}
                        {#if !soportesEstudioMercado}
                            <li>Hay estudios de mercado con menos de dos soportes</li>
                        {/if}
                        {#if !estudiosMercadoArchivo}
                            <li>Hay rubros presupuestales que no tienen el estudio de mercado cargado</li>
                        {/if}

                        {#if !minInstructoresInvestigadores}
                            <li>Debe relacionar mínimo 1 instructor con el rol de “Instructor investigador”. Numeral Participantes</li>
                        {/if}

                        {#if !minAprendicesEnSemilleros}
                            <li>Debe relacionar mínimo 2 aprendices con el rol de "Aprendiz en semillero de investigación". Numeral Participantes</li>
                        {/if}
                    </ul>
                </InfoMessage>
            {/if}
        {/if}
    </div>
    <hr className="mt-10 mb-10" />
    {#if proyecto.finalizado == true && proyecto.habilitado_para_evaluar == false && !checkRole(auth_user, [1, 4])}
        <InfoMessage className="mb-2" message="El proyecto se ha finalizado con éxito. Espere la respuesta del dinamizador SENNOVA." />
    {:else if proyecto.habilitado_para_evaluar == true}
        <InfoMessage className="mb-2" message="El dinamizador SENNOVA ha confirmado el proyecto." />
    {/if}
    <hr className="mt-10 mb-10" />
    <div>
        <InfoMessage>
            <h1><strong>Historial de acciones</strong></h1>
            {#if proyecto.logs}
                <ul>
                    {#each proyecto.logs as log}
                        <li>{log.created_at} - {JSON.parse(log.data).subject}</li>
                    {/each}
                </ul>
            {:else}
                <p>No se ha generado un historial aún</p>
            {/if}
        </InfoMessage>
    </div>
    <hr className="mt-10 mb-10" />
    <div>
        <InfoMessage>
            <h1><strong>Versiones del proyecto</strong></h1>
            El PDF se generará una vez finalice la fase de formulación.
            {#if versiones}
                <ul>
                    {#each versiones as version}
                        <li>
                            {version.version}.pdf -
                            {#if version.estado == 1}
                                <a href={route('convocatorias.proyectos.version', [convocatoria.id, proyecto.id, version.version])}>Descargar</a>
                            {:else}
                                Generando una nueva versión, regrese pronto.
                            {/if}
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No se ha generado un historial aún</p>
            {/if}
        </InfoMessage>
    </div>

    <Dialog bind:open={dialogFinalizarProyecto}>
        <div slot="title" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Finalizar proyecto
        </div>
        <div slot="content">
            <InfoMessage className="mb-2" message="¿Está seguro (a) que desea finalizar el proyecto?<br />Una vez finalizado el proyecto no se podrá modificar." />

            <form on:submit|preventDefault={finalizarProyecto} id="finalizar-proyecto" className="mt-10 mb-28" on:load={($form.password = '')}>
                <Label labelFor="password" value="Ingrese su contraseña para confirmar que desea finalizar este proyecto" className="mb-4" />
                <Password id="password" className="w-full" bind:value={$form.password} error={errors.password} required autocomplete="current-password" />
            </form>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogFinalizarProyecto = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" form="finalizar-proyecto">Finalizar proyecto</Button>
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={enviarProyectoDialogOpen}>
        <div slot="title" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Confirmar proyecto
        </div>
        <div slot="content">
            <InfoMessage className="mb-2" message="¿Está seguro (a) que desea confirmar el proyecto del proyecto?<br />Una vez confirmado el proyecto no se podrá modificar." />

            <form on:submit|preventDefault={enviarProyecto} id="confirmar-proyecto" className="mt-10 mb-28" on:load={($form.password = '')}>
                <Label labelFor="password" value="Ingrese su contraseña para confirmar el proyecto" className="mb-4" />
                <Password id="password" className="w-full" bind:value={$form.password} error={errors.password} required autocomplete="current-password" />
            </form>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (enviarProyectoDialogOpen = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" form="confirmar-proyecto">Confirmar proyecto</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>

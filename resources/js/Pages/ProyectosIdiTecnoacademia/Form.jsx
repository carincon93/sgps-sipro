<script>
    import { route, monthDiff } from '@/Utils'
    import axios from 'axios'

    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import SelectMulti from '@/Shared/SelectMulti'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import Tags from '@/Shared/Tags'
    import Input from '@/Shared/Input'
    import Switch from '@/Shared/Switch'
    import InfoMessage from '@/Shared/InfoMessage'
    import File from '@/Shared/File'
    import Export2Word from '@/Shared/Export2Word'
    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'

    export let errors
    export let proyectoIdiTecnoacademia
    export let tecnoacademias
    export let programasSennova
    export let semillerosInvestigacion
    export let estadosProyectoIdiTecnoacademia
    export let proyectos
    export let regionales
    export let municipios
    export let roles
    export let beneficiados
    export let form
    export let submit
    export let lineasTecnoacademia
    export let allowedToCreate
    export let method
    export let dialogGuardar = false

    let exportComponent

    let hayEntidadesVinculadas = proyectoIdiTecnoacademia?.entidades_vinculadas ? true : false
    let existenDocumentos = proyectoIdiTecnoacademia?.documentos_resultados ? true : false

    let arrayLineasTecnoacademia = lineasTecnoacademia
    function selectLineasTecnoacademia(event) {
        arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
            return obj.tecnoacademia_id == event.detail?.value
        })
    }

    let departamentoIE
    $: whitelistInstitucionesEducativas = []
    $: if (departamentoIE) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + departamentoIE?.codigo)
            .then(function (response) {
                // handle success
                response.data.map((item) => {
                    whitelistInstitucionesEducativas.push(item.nombre_establecimiento)
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
</script>

<form on:submit|preventDefault={submit} id="proyecto-idi-tecnoacademia-form">
    <fieldset class="p-8" disabled={proyectoIdiTecnoacademia?.allowed.to_update || allowedToCreate ? undefined : true}>
        <div class="mt-28">
            <Label required labelFor="titulo" class="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué." />
            <Textarea label="Título" id="titulo" sinContador={true} error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required />
        </div>

        <div class="mt-44">
            <p class="text-center">Fecha de ejecución</p>
            <small class="text-red-400 block text-center"> * Campo obligatorio </small>
            <div class="mt-4 flex items-start justify-around">
                <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                    <Label labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                    <div class="ml-4">
                        <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required />
                    </div>
                </div>
                <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                    <Label labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                    <div class="ml-4">
                        <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                    </div>
                </div>
            </div>
            {#if errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion}
                <div class="mb-20 flex justify-center mt-4">
                    <InputError classes="text-center" message={errors.fecha_inicio} />
                    <InputError classes="text-center" message={errors.fecha_finalizacion} />
                </div>
            {/if}
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="tecnoacademia_id" value="Tecnoacademia" />
            </div>
            <div>
                <Select id="tecnoacademia_id" items={tecnoacademias} bind:selectedValue={$form.tecnoacademia_id} selectFunctions={[(event) => selectLineasTecnoacademia(event)]} error={errors.tecnoacademia_id} autocomplete="off" placeholder="Busque por el nombre de la TecnoAcademia" required />
            </div>
        </div>

        {#if $form.tecnoacademia_id && arrayLineasTecnoacademia}
            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="tecnoacademia_linea_tecnoacademia_id" value="Líneas temáticas a ejecutar en la vigencia del proyecto:" />
                </div>
                <div>
                    <SelectMulti id="tecnoacademia_linea_tecnoacademia_id" bind:selectedValue={$form.tecnoacademia_linea_tecnoacademia_id} items={arrayLineasTecnoacademia} isMulti={true} error={errors.tecnoacademia_linea_tecnoacademia_id} placeholder="Buscar por el nombre de la línea" required />
                </div>
            </div>
        {/if}

        <div class="mt-44 grid grid-cols-1">
            <div>
                <Label required class="mb-4" labelFor="resumen" value="Resumen del proyecto" />
            </div>
            <div>
                <Textarea maxlength="40000" id="resumen" error={errors.resumen} bind:value={$form.resumen} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="palabras_clave" value="Palabras claves relacionadas con el proyecto (Separados por coma)" />
            </div>
            <div>
                <Tags id="palabras_clave" class="mt-4" enforceWhitelist={false} bind:tags={$form.palabras_clave} placeholder="Palabras clave" error={errors.palabras_clave} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label class="mb-4" labelFor="especies" value="En caso de aplicar, por favor incluir las especies (nombre científico) que hacen parte del proyecto" />
            </div>
            <div>
                <Tags id="especies" class="mt-4" enforceWhitelist={false} bind:tags={$form.especies} placeholder="Especies" error={errors.especies} />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label class="mb-4" value="¿El proyecto hace parte de una línea de investigación de la TecnoAcademia?" />
            </div>
            <div>
                <Switch bind:checked={$form.tiene_linea_investigacion} />
            </div>
        </div>

        {#if $form.tiene_linea_investigacion}
            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="lineas_investigacion" value="¿Cuáles líneas de investigación hacen parte del proyecto? (Separar por coma)" />
                </div>
                <div>
                    <Tags id="lineas_investigacion" class="mt-4" enforceWhitelist={false} bind:tags={$form.lineas_investigacion} placeholder="Líneas de investigación" error={errors.lineas_investigacion} required />
                </div>
            </div>
        {/if}

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label class="mb-4" value="¿Es un proyecto nuevo?" />
            </div>
            <div>
                <Switch bind:checked={$form.proyecto_nuevo} />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label class="mb-4" value="¿Es un proyecto que genera continuidad de uno anterior?" />
            </div>
            <div>
                <Switch bind:checked={$form.proyecto_con_continuidad} />
            </div>
        </div>

        {#if $form.proyecto_con_continuidad}
            <div class="mt-44 grid grid-cols-1">
                <div>
                    <Label required class="mb-4" labelFor="productos_premios" value="Si es un proyecto que ha tenido continuidad, por favor relacione los productos obtenidos previamente y los reconocimientos o premios" />
                </div>
                <div>
                    <Textarea maxlength="40000" id="productos_premios" error={errors.productos_premios} bind:value={$form.productos_premios} required />
                </div>
            </div>

            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="proyecto_id" value="Seleccione el código SGPS del proyecto" />
                </div>
                <div>
                    <Select id="proyecto_id" items={proyectos} bind:selectedValue={$form.proyecto_id} error={errors.proyecto_id} autocomplete="off" placeholder="Busque por el código SGPS" required />
                </div>
            </div>
        {/if}

        <div class="mt-44 grid grid-cols-1">
            <div>
                <Label required class="mb-4" labelFor="texto_exposicion" value="Texto para exposición: Un texto corto que resuma la experiencia y que pueda ser publicado en espacios como el MUSEO SENA para introducir la iniciativa y los resultados." />
            </div>
            <div>
                <Textarea maxlength="40000" id="texto_exposicion" error={errors.texto_exposicion} bind:value={$form.texto_exposicion} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="pdf_proyecto" value="Proyecto en documento pdf" />
            </div>
            <div>
                <File id="pdf_proyecto" maxSize="10000" accept="application/pdf" bind:value={$form.pdf_proyecto} valueDb={proyectoIdiTecnoacademia?.pdf_proyecto} error={errors.pdf_proyecto} route={proyectoIdiTecnoacademia?.pdf_proyecto?.includes('http') || method == 'store' ? null : route('proyectos-idi-tecnoacademia.download-file-sharepoint', [proyectoIdiTecnoacademia, 'pdf_proyecto'])} />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="nombre_aprendices_vinculados" value="Nombre de los aprendices vinculados al proyecto (Por favor separar los nombres por coma- ,)" />
            </div>
            <div>
                <Tags id="nombre_aprendices_vinculados" class="mt-4" enforceWhitelist={false} bind:tags={$form.nombre_aprendices_vinculados} placeholder="Aprendices vinculados" error={errors.nombre_aprendices_vinculados} />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required={$form.nombre_instituciones_educativas ? undefined : true} class="mb-4" labelFor="nombre_instituciones_educativas" value="Nombre de las instituciones educativas de los aprendices vinculados al proyecto" />
            </div>
            <div>
                <Select id="departamento" bind:selectedValue={departamentoIE} items={regionales} placeholder="Seleccione un departamento" />

                <Tags id="nombre_instituciones_educativas" class="mt-4" whitelist={whitelistInstitucionesEducativas} bind:tags={$form.nombre_instituciones_educativas} placeholder="Nombre(s) de la(s) IE" error={errors.nombre_instituciones_educativas} required={$form.nuevas_instituciones_educativas ? undefined : true} />
                <div class="mt-10">
                    <InfoMessage>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto (Separadas por coma)</InfoMessage>
                    <Tags id="nuevas_instituciones_educativas" class="mt-4" enforceWhitelist={false} bind:tags={$form.nuevas_instituciones_educativas} placeholder="Instituciones educativas (Separadas por coma)" error={errors.nuevas_instituciones_educativas} />
                </div>
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="programa_sennova_participante" value="¿El proyecto vincula otro programa sennova?" />
            </div>
            <div>
                <SelectMulti id="programa_sennova_participante" bind:selectedValue={$form.programa_sennova_participante} items={programasSennova} isMulti={true} error={errors.programa_sennova_participante} placeholder="Seleccione un programa" required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="nombre_centro_programa" value="Por favor incluya el nombre y centro del programa sennova que participa en el proyecto" />
            </div>
            <div>
                <Input label="Nombre" id="nombre_centro_programa" type="text" class="mt-1" error={errors.nombre_centro_programa} bind:value={$form.nombre_centro_programa} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="programa_formacion_articulado_media" value="El proyecto está vinculado a un programa de formación de articulación con la media? por favor indicar cual y la institución educativa" />
            </div>
            <div>
                <Input label="Nombre" id="programa_formacion_articulado_media" type="text" class="mt-1" error={errors.programa_formacion_articulado_media} bind:value={$form.programa_formacion_articulado_media} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label class="mb-4" value="¿Otras organizaciones externas vinculadas al proyecto?" />
            </div>
            <div>
                <Switch bind:checked={hayEntidadesVinculadas} />
            </div>
        </div>

        {#if hayEntidadesVinculadas}
            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="entidades_vinculadas" value="Nombre de las entidades vinculadas al proyecto (Por favor separar los nombres por coma- ,)" />
                </div>
                <div>
                    <Tags id="entidades_vinculadas" class="mt-4" enforceWhitelist={false} bind:tags={$form.entidades_vinculadas} placeholder="Entidades vinculadas" />
                </div>
            </div>
        {/if}

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="fuente_recursos" value="Fuente de recursos para el proyecto" />
            </div>
            <div>
                <Input label="Fuente" id="fuente_recursos" type="text" class="mt-1" error={errors.fuente_recursos} bind:value={$form.fuente_recursos} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="presupuesto" value="Presupuesto del proyecto por año (o por la duración del proyecto si es menor a un año)" />
            </div>
            <div>
                <Input label="Presupuesto" id="presupuesto" type="number" input$min="0" class="mt-1" error={errors.presupuesto} bind:value={$form.presupuesto} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="municipios" value="Nombre los municipios en los que se desarrolla" />
            </div>
            <div>
                <SelectMulti id="municipios" bind:selectedValue={$form.municipios} items={municipios} isMulti={true} error={errors.municipios} placeholder="Buscar municipios" required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="semillero_investigacion_id" value="¿Hace parte de un semillero?" />
            </div>
            <div>
                <Switch bind:checked={$form.hace_parte_de_semillero} />
            </div>
        </div>

        {#if $form.hace_parte_de_semillero}
            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="semillero_investigacion_id" value="Semillero de investigación" />
                </div>
                <div>
                    <Select id="semillero_investigacion_id" items={semillerosInvestigacion} bind:selectedValue={$form.semillero_investigacion_id} error={errors.semillero_investigacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                </div>
            </div>
        {/if}

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="estado_proyecto" value="Estado del proyecto" />
            </div>
            <div>
                <Select id="estado_proyecto" items={estadosProyectoIdiTecnoacademia} bind:selectedValue={$form.estado_proyecto} error={errors.centro_formacion_id} autocomplete="off" placeholder="Seleccione un estado" required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="beneficiados" value="El proyecto beneficiará a" />
            </div>
            <div>
                <SelectMulti id="beneficiados" bind:selectedValue={$form.beneficiados} items={beneficiados} isMulti={true} error={errors.beneficiados} placeholder="Selecciona los beneficiados" required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-1">
            <div>
                <Label required class="mb-4" labelFor="poblacion_beneficiada" value="Por favor describa la población que beneficia la iniciativa" />
            </div>
            <div>
                <Textarea maxlength="40000" id="poblacion_beneficiada" error={errors.poblacion_beneficiada} bind:value={$form.poblacion_beneficiada} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-1">
            <div>
                <Label class="mb-4" labelFor="otra_poblacion_beneficiada" value="Si es OTRA, por favor aclarar cuál" />
            </div>
            <div>
                <Textarea maxlength="40000" id="otra_poblacion_beneficiada" error={errors.otra_poblacion_beneficiada} bind:value={$form.otra_poblacion_beneficiada} />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-1">
            <div>
                <Label required class="mb-4" labelFor="resultados_obtenidos" value="Resultados obtenidos" />
            </div>
            <div>
                <Textarea maxlength="40000" id="resultados_obtenidos" error={errors.resultados_obtenidos} bind:value={$form.resultados_obtenidos} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <p>¿Existen documentos tipo contrato, convenio o acuerdos que hagan parte del proyecto?</p>
            </div>
            <div>
                <Switch bind:checked={existenDocumentos} />
            </div>
        </div>

        {#if existenDocumentos}
            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="documentos_resultados" value="Si, sí, por favor cargar el documento con los resultados. (Si son varios comprímalos en un archivo .zip)" />
                </div>
                <div>
                    <File
                        id="documentos_resultados"
                        maxSize="10000"
                        bind:value={$form.documentos_resultados}
                        valueDb={proyectoIdiTecnoacademia?.documentos_resultados}
                        error={errors.documentos_resultados}
                        route={proyectoIdiTecnoacademia?.documentos_resultados?.includes('http') || method == 'store' ? null : route('proyectos-idi-tecnoacademia.download-file-sharepoint', [proyectoIdiTecnoacademia, 'documentos_resultados'])}
                    />
                </div>
            </div>
        {/if}

        <div class="mt-44 grid grid-cols-1">
            <div>
                <Label required class="mb-4" labelFor="observaciones_resultados" value="Observaciones" />
            </div>
            <div>
                <Textarea maxlength="40000" id="observaciones_resultados" error={errors.observaciones_resultados} bind:value={$form.observaciones_resultados} required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="rol_sennova" value="Rol" />
            </div>

            <div>
                <Select id="rol_sennova" items={roles} bind:selectedValue={$form.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="cantidad_meses" value="Número de meses de vinculación al proyecto" />
            </div>
            <div>
                <Input label="Número de meses de vinculación" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max={monthDiff($form.fecha_inicio, $form.fecha_finalizacion)} class="mt-1" bind:value={$form.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" required />
            </div>
        </div>

        <div class="mt-44 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="cantidad_horas" value="Número de horas semanales dedicadas para el desarrollo del proyecto" />
            </div>
            <div>
                <Input label="Número de horas semanales dedicadas para el desarrollo del proyecto" id="cantidad_horas" type="number" input$step="1" input$min="1" input$max={$form.rol_sennova?.maxHoras} class="mt-1" bind:value={$form.cantidad_horas} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" autocomplete="off" required />
                {#if $form.rol_sennova?.maxHoras}
                    <InfoMessage>Horas máximas permitidas para este rol: {$form.rol_sennova?.maxHoras}.</InfoMessage>
                {/if}
            </div>
        </div>

        {#if $form.progress}
            <progress value={$form.progress.percentage} max="100" class="mt-4">
                {$form.progress.percentage}%
            </progress>
        {/if}
    </fieldset>

    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if proyectoIdiTecnoacademia}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {proyectoIdiTecnoacademia?.updated_at}
            </small>
        {/if}

        <Button on:click={() => (dialogGuardar = true)} class="ml-auto" type="button">Revisar información antes de guardar</Button>
    </div>
</form>

<Dialog bind:open={dialogGuardar}>
    <div slot="title">
        <div class="m-auto relative text-app-600">
            <figure>
                <img src="/images/megaphone.png" alt="" class="m-auto w-20" />
            </figure>
        </div>
    </div>
    <div slot="header-info" class="ml-10 shadow-md">
        <InfoMessage>
            Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                El recurso se ha modificado correctamente</strong
            >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" class="underline">sgpssipro@sena.edu.co</a>
            desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del semillero).
        </InfoMessage>
    </div>
    <div slot="content">
        <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
            <h1 class="font-black text-center my-10">Información del proyecto I+D+i Tecnoacademia</h1>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué:</strong>
                {$form.titulo ? $form.titulo : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Fecha de ejecución:</strong>
                Del {$form.fecha_inicio + ' hasta ' + $form.fecha_finalizacion}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Tecnoacademia:</strong>
                {$form.tecnoacademia_id ? $form.tecnoacademia_id?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Líneas temáticas a ejecutar en la vigencia del proyecto:</strong>
                {#if $form.tecnoacademia_linea_tecnoacademia_id}
                    {#each $form.tecnoacademia_linea_tecnoacademia_id as lineaTecnoacademia}
                        <br />
                        {lineaTecnoacademia.label}
                    {/each}
                {:else}
                    Sin información registrada
                {/if}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Resumen del proyecto:</strong>
                {$form.resumen ? $form.resumen : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line">
                <strong>Palabras claves relacionadas con el proyecto (Separados por coma):</strong>
            </p>
            {#if JSON.parse($form.palabras_clave)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.palabras_clave) as palabraClave}
                        <li>{palabraClave.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line">
                <strong>En caso de aplicar, por favor incluir las especies (nombre científico) que hacen parte del proyecto:</strong>
            </p>
            {#if JSON.parse($form.especies)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.especies) as especie}
                        <li>{especie.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿El proyecto hace parte de una línea de investigación de la Tecnoacademia?:</strong>
                {$form.tiene_linea_investigacion ? 'Si' : 'No'}
            </p>

            <p style="white-space: pre-line">
                <strong>¿Cuáles líneas de investigación hacen parte del proyecto? (Separar por coma)</strong>
            </p>
            {#if JSON.parse($form.lineas_investigacion)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.lineas_investigacion) as especie}
                        <li>{especie.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿Es un proyecto nuevo?</strong>
                {$form.proyecto_nuevo ? 'Si' : 'No'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿Es un proyecto que genera continuidad de uno anterior?</strong>
                {$form.proyecto_con_continuidad ? 'Si' : 'No'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Si es un proyecto que ha tenido continuidad, por favor relacione los productos obtenidos previamente y los reconocimientos o premios:</strong>
                {$form.productos_premios ? $form.productos_premios : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Seleccione el código SGPS del proyecto:</strong>
                {$form.proyecto_id ? $form.proyecto_id?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Texto para exposición: Un texto corto que resuma la experiencia y que pueda ser publicado en espacios como el MUSEO SENA para introducir la iniciativa y los resultados:</strong>
                {$form.texto_exposicion ? $form.texto_exposicion : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line">
                <strong>Nombre de los aprendices vinculados al proyecto (Por favor separar los nombres por coma- ,):</strong>
            </p>
            {#if JSON.parse($form.nombre_aprendices_vinculados)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.nombre_aprendices_vinculados) as aprendiz}
                        <li>{aprendiz.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line">
                <strong>Nombre de las instituciones educativas de los aprendices vinculados al proyecto:</strong>
            </p>
            {#if JSON.parse($form.nombre_instituciones_educativas)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.nombre_instituciones_educativas) as institucionEducativa}
                        <li>{institucionEducativa.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line">
                <strong>Si no encuentra alguna institución educativa en la anterior lista por favor escriba el nombre en el siguiente campo de texto (Separadas por coma):</strong>
            </p>
            {#if JSON.parse($form.nuevas_instituciones_educativas)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.nuevas_instituciones_educativas) as institucionEducativa}
                        <li>{institucionEducativa.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿El proyecto vincula otro programa sennova?</strong>
                {$form.programa_sennova_participante ? $form.programa_sennova_participante?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Por favor incluya el nombre y centro del programa sennova que participa en el proyecto:</strong>
                {$form.nombre_centro_programa ? $form.nombre_centro_programa : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>El proyecto está vinculado a un programa de formación de articulación con la media? por favor indicar cual y la institución educativa:</strong>
                {$form.programa_formacion_articulado_media ? $form.programa_formacion_articulado_media : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿Otras organizaciones externas vinculadas al proyecto?:</strong>
                {hayEntidadesVinculadas ? 'Si' : 'No'}
            </p>

            <p style="white-space: pre-line">
                <strong>Nombre de las entidades vinculadas al proyecto (Por favor separar los nombres por coma- ,):</strong>
            </p>
            {#if JSON.parse($form.entidades_vinculadas)?.length > 0}
                <ul style="margin-bottom: 4rem">
                    {#each JSON.parse($form.entidades_vinculadas) as entidad}
                        <li>{entidad.value}</li>
                    {/each}
                </ul>
            {:else}
                <p style="margin-bottom: 4rem">Sin información registrada</p>
            {/if}

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Fuente de recursos para el proyecto:</strong>
                {$form.fuente_recursos ? $form.fuente_recursos : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Presupuesto del proyecto por año (o por la duración del proyecto si es menor a un año):</strong>
                {$form.presupuesto ? $form.presupuesto : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Nombre los municipios en los que se desarrolla:</strong>
                <br />
                {#if $form.municipios}
                    {#each $form.municipios as municipio}
                        <br />
                        {municipio.label}
                    {/each}
                {:else}
                    Sin información registrada
                {/if}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿Hace parte de un semillero?</strong>
                {$form.hace_parte_de_semillero ? 'Si' : 'No'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Semillero de investigación:</strong>
                {$form.semillero_investigacion_id ? $form.semillero_investigacion_id?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Estado del proyecto:</strong>
                {$form.estado_proyecto ? $form.estado_proyecto?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>El proyecto beneficiará a:</strong>
                <br />
                {#if $form.beneficiados}
                    {#each $form.beneficiados as beneficiado}
                        <br />
                        {beneficiado.label}
                    {/each}
                {:else}
                    Sin información registrada
                {/if}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Por favor describa la población que beneficia la iniciativa:</strong>
                {$form.poblacion_beneficiada ? $form.poblacion_beneficiada : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Si es OTRA, por favor aclarar cuál:</strong>
                {$form.otra_poblacion_beneficiada ? $form.otra_poblacion_beneficiada : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Resultados obtenidos:</strong>
                {$form.resultados_obtenidos ? $form.resultados_obtenidos : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿Existen documentos tipo contrato, convenio o acuerdos que hagan parte del proyecto?:</strong>
                {existenDocumentos ? 'Si' : 'No'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Observaciones :</strong>
                {$form.observaciones_resultados ? $form.observaciones_resultados : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Rol:</strong>
                {$form.rol_sennova ? $form.rol_sennova?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Número de meses de vinculación al proyecto:</strong>
                {$form.cantidad_meses ? $form.cantidad_meses : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Número de horas semanales dedicadas para el desarrollo del proyecto:</strong>
                {$form.cantidad_horas ? $form.cantidad_horas : 'Sin información registrada'}
            </p>
        </Export2Word>
    </div>
    <div slot="actions">
        <div class="p-4">
            <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
            <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(proyectoIdiTecnoacademia ? proyectoIdiTecnoacademia.codigo : 'IDITA-BORRADOR')}>Descargar borrador en Word</Button>
            {#if proyectoIdiTecnoacademia?.allowed.to_update || allowedToCreate}
                <LoadingButton loading={$form.processing} form="proyecto-idi-tecnoacademia-form">Guardar</LoadingButton>
            {:else}
                <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
            {/if}
        </div>
    </div>
</Dialog>

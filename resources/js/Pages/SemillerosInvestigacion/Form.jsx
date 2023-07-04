<script>
    import { route } from '@/Utils'

    import Label from '@/Components/Label'
    import Input from '@/Components/Input'
    import Textarea from '@/Components/Textarea'
    import MultipleSelect from '@/Components/MultipleSelect'
    import Select from '@/Components/Select'
    import InfoMessage from '@/Components/InfoMessage'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Button from '@/Components/Button'
    import File from '@/Components/File'

    import Dialog from '@/Components/Dialog'
    import Export2Word from '@/Components/Export2Word'

    export let grupoInvestigacion
    export let semilleroInvestigacion
    export let form
    export let errors
    export let submit
    export let opcionesSiNo
    export let lineasInvestigacion
    export let programasFormacion
    export let programasFormacionSemilleroInvestigacion
    export let redesConocimiento
    export let allowedToCreate
    export let method
    export let dialogGuardar = false

    let exportComponent

    let arrayProgramasFormacion = programasFormacion
    function selectProgramasFormacion(event) {
        arrayProgramasFormacion = programasFormacion.filter(function (obj) {
            return obj.linea_investigacion_id == event.detail?.value
        })
    }
</script>

<form on:submit|preventDefault={submit} className="bg-white rounded shadow" id="semillero-investigacion-form">
    <fieldset className="p-8">
        {#if semilleroInvestigacion}
            <div className="mt-8">
                <Label labelFor="nombre" value="Código" />
                <Input disabled id="codigo" type="text" className="mt-1" bind:value={semilleroInvestigacion.codigo} error={errors.codigo} required />
            </div>
        {/if}

        <div className="mt-8">
            <Label required className="mb-4" labelFor="es_semillero_tecnoacademia" value="¿Es semillero de TecnoAcademia?" />
            <Select items={opcionesSiNo} id="es_semillero_tecnoacademia" bind:selectedValue={$form.es_semillero_tecnoacademia} error={errors.es_semillero_tecnoacademia} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="linea_investigacion_id" value="Línea de investigación principal" />
            <Select id="linea_investigacion_id" items={lineasInvestigacion} bind:selectedValue={$form.linea_investigacion_id} error={errors.linea_investigacion_id} autocomplete="off" placeholder="Seleccione una línea de investigación" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="lineas_investigacion" value="Articulación con líneas de investigación" />
            <MultipleSelect id="lineas_investigacion" bind:selectedValue={$form.lineas_investigacion} items={lineasInvestigacion}  error={errors.lineas_investigacion} placeholder="Buscar por el nombre de la línea de investigación" required />
        </div>

        <div className="mt-8">
            <Label required labelFor="nombre" value="Nombre del semillero" />
            <Input id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-4 ">
            <Label required labelFor="fecha_creacion_semillero" value="Fecha creación del semillero" />
            <input id="fecha_creacion_semillero" type="date" className="mt-1 p-2" bind:value={$form.fecha_creacion_semillero} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="nombre_lider_semillero" value="Nombre del líder del semillero" />
            <Input id="nombre_lider_semillero" type="text" className="mt-1" bind:value={$form.nombre_lider_semillero} error={errors.nombre_lider_semillero} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="email_contacto" value="Email de contacto" />
            <Input id="email_contacto" type="email" className="mt-1" bind:value={$form.email_contacto} error={errors.email_contacto} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="reconocimientos_semillero_investigacion" value="Reconocimientos semillero de investigación" />
            <Textarea maxlength="40000" id="reconocimientos_semillero_investigacion" bind:value={$form.reconocimientos_semillero_investigacion} error={errors.reconocimientos_semillero_investigacion} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="vision" value="Visión" />
            <Textarea maxlength="40000" id="vision" bind:value={$form.vision} error={errors.vision} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="mision" value="Misión" />
            <Textarea maxlength="40000" id="mision" bind:value={$form.mision} error={errors.mision} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="objetivo_general" value="Objetivo general" />
            <Textarea maxlength="40000" id="objetivo_general" bind:value={$form.objetivo_general} error={errors.objetivo_general} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="objetivos_especificos" value="Objetivos específicos " />
            <Textarea maxlength="40000" id="objetivos_especificos" bind:value={$form.objetivos_especificos} error={errors.objetivos_especificos} required />
        </div>

        <div className="mt-8">
            <Label labelFor="link_semillero" value="Link del semillero" />
            <Input id="link_semillero" type="url" className="mt-1" bind:value={$form.link_semillero} error={errors.link_semillero} />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="redes_conocimiento" value="Red o redes de conocimiento afines al Semillero de Investigación" />
            <MultipleSelect id="redes_conocimiento" bind:selectedValue={$form.redes_conocimiento} items={redesConocimiento}  error={errors.redes_conocimiento} placeholder="Buscar redes de conocimiento" required />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label required={$form.programas_formacion?.length > 0 ? undefined : 'required'} className="mb-4" labelFor="linea_investigacion" value="Seleccione una línea de investigación y posteriormente asocie los programas de formación" />
            <Select id="linea_investigacion" items={lineasInvestigacion} bind:selectedValue={$form.linea_investigacion} selectFunctions={[(event) => selectProgramasFormacion(event)]} error={errors.linea_investigacion} autocomplete="off" placeholder="Seleccione una línea de investigación" required={$form.programas_formacion?.length > 0 ? undefined : 'required'} />
        </div>

        {#if ($form.linea_investigacion?.value && programasFormacion.length > 0) || programasFormacionSemilleroInvestigacion?.length > 0}
            <div className="mt-8">
                <Label required className="mb-4" labelFor="programas_formacion" value="Programa(s) de formación" />
                <MultipleSelect id="programas_formacion" bind:selectedValue={$form.programas_formacion} items={arrayProgramasFormacion}  error={errors.programas_formacion} placeholder="Programa(s) de formación" required />
            </div>
        {:else if ($form.linea_investigacion?.value && programasFormacion.length == 0) || programasFormacionSemilleroInvestigacion?.length == 0}
            <InfoMessage alertMsg={true} className="mt-10">
                <p className="mt-3 py-4 text-justify">La línea de investigación seleccionada no tiene programas de formación asociados, por favor antes de crear/modificar semilleros de investigación debe actualizar las líneas de investigación.</p>
            </InfoMessage>
        {/if}

        <div className="mt-8">
            <Label className="mb-4 mt-8" labelFor="formato_gic_f_021" value="Formato GIC – F – 021" />
            <File
                id="formato_gic_f_021"
                maxSize="10000"
                bind:value={$form.formato_gic_f_021}
                valueDb={semilleroInvestigacion?.formato_gic_f_021}
                error={errors.formato_gic_f_021}
                route={semilleroInvestigacion?.formato_gic_f_021?.includes('http') || method == 'store' ? null : route('semilleros-investigacion.download-file-sharepoint', [grupoInvestigacion, semilleroInvestigacion, 'formato_gic_f_021'])}
            />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label className="mb-4 mt-8" labelFor="formato_gic_f_032" value="Formato GIC – F – 032" />
            <File
                id="formato_gic_f_032"
                maxSize="10000"
                bind:value={$form.formato_gic_f_032}
                valueDb={semilleroInvestigacion?.formato_gic_f_032}
                error={errors.formato_gic_f_032}
                route={semilleroInvestigacion?.formato_gic_f_032?.includes('http') || method == 'store' ? null : route('semilleros-investigacion.download-file-sharepoint', [grupoInvestigacion, semilleroInvestigacion, 'formato_gic_f_032'])}
            />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label className="mb-4 mt-8" labelFor="formato_aval_semillero" value="Aval del semillero" />
            <File
                id="formato_aval_semillero"
                maxSize="10000"
                bind:value={$form.formato_aval_semillero}
                valueDb={semilleroInvestigacion?.formato_aval_semillero}
                error={errors.formato_aval_semillero}
                route={semilleroInvestigacion?.formato_aval_semillero?.includes('http') || method == 'store' ? null : route('semilleros-investigacion.download-file-sharepoint', [grupoInvestigacion, semilleroInvestigacion, 'formato_aval_semillero'])}
            />
        </div>
    </fieldset>

    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if semilleroInvestigacion}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {semilleroInvestigacion?.updated_at}
            </small>
        {/if}

        <Button on:click={() => (dialogGuardar = true)} className="ml-auto" type="button">Revisar información antes de guardar</Button>
    </div>
</form>

<Dialog bind:open={dialogGuardar}>
    <div slot="title">
        <div className="m-auto relative text-app-600">
            <figure>
                <img src="/images/megaphone.png" alt="" className="m-auto w-20" />
            </figure>
        </div>
    </div>
    <div slot="header-info" className="ml-10 shadow-md">
        <InfoMessage>
            Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                El recurso se ha modificado correctamente</strong
            >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" className="underline">sgpssipro@sena.edu.co</a>
            desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del semillero).
        </InfoMessage>
    </div>
    <div slot="content">
        <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
            <h1 className="font-black text-center my-10">Información del semillero de investigación</h1>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Nombre del semillero:</strong>
                {$form.nombre ? $form.nombre : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Fecha creación del semillero:</strong>
                {$form.fecha_creacion_semillero ? $form.fecha_creacion_semillero : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Línea de investigación principal:</strong>
                {$form.linea_investigacion_id ? $form.linea_investigacion_id?.label : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Nombre del líder del semillero:</strong>
                {$form.nombre_lider_semillero ? $form.nombre_lider_semillero : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Correo electrónico de contacto:</strong>
                {$form.email_contacto ? $form.email_contacto : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Reconocimientos semillero de investigación:</strong>
                {$form.reconocimientos_semillero_investigacion ? $form.reconocimientos_semillero_investigacion : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Visión:</strong>
                {$form.vision ? $form.vision : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Misión:</strong>
                {$form.mision ? $form.mision : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Objetivo general:</strong>
                {$form.objetivo_general ? $form.objetivo_general : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Objetivos específicos:</strong>
                {$form.objetivos_especificos ? $form.objetivos_especificos : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Link del semillero:</strong>
                {$form.link_semillero ? $form.link_semillero : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>¿Es semillero de TecnoAcademia?</strong>
                <br />
                {$form.es_semillero_tecnoacademia ? $form.es_semillero_tecnoacademia?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Red o redes de conocimiento afines al Semillero de Investigación:</strong>
                <br />
                {#if $form.redes_conocimiento}
                    {#each $form.redes_conocimiento as redConocimiento}
                        <br />
                        {redConocimiento.label}
                    {/each}
                {:else}
                    Sin información registrada
                {/if}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Programas de formación:</strong>
                <br />
                {#if $form.programas_formacion}
                    {#each $form.programas_formacion as programaFormacion}
                        <br />
                        {programaFormacion.label}
                    {/each}
                {:else}
                    Sin información registrada
                {/if}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Articulación con líneas de investigación:</strong>
                <br />
                {#if $form.lineas_investigacion}
                    {#each $form.lineas_investigacion as lineaInvestigacion}
                        <br />
                        {lineaInvestigacion.label}
                    {/each}
                {:else}
                    Sin información registrada
                {/if}
            </p>
        </Export2Word>
    </div>
    <div slot="actions">
        <div className="p-4">
            <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
            <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(semilleroInvestigacion?.codigo)}>Descargar borrador en Word</Button>
            {#if semilleroInvestigacion?.allowed.to_update || allowedToCreate}
                <PrimaryButton loading={$form.processing} form="semillero-investigacion-form">Guardar</PrimaryButton>
            {:else}
                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
            {/if}
        </div>
    </div>
</Dialog>

<script>
    import { route } from '@/Utils'

    import Input from '@/Components/Input'
    import Textarea from '@/Components/Textarea'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import MultipleSelect from '@/Components/MultipleSelect'
    import Dialog from '@/Components/Dialog'
    import InfoMessage from '@/Components/InfoMessage'
    import Button from '@/Components/Button'
    import File from '@/Components/File'
    import Export2Word from '@/Components/Export2Word'

    export let submit
    export let form
    export let errors
    export let grupoInvestigacion
    export let categoriasMinciencias
    export let redesConocimiento
    export let centrosFormacion
    export let allowedToCreate
    export let method
    export let dialogGuardar = false

    let exportComponent
</script>

<form on:submit|preventDefault={submit} className="bg-white rounded shadow" id="grupo-investigacion-form">
    <fieldset className="p-8" disabled={grupoInvestigacion?.allowed.to_update || allowedToCreate ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
            <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
        </div>

        <div className="mt-8">
            <Label required labelFor="nombre" value="Nombre del grupo de investigación" />

            <Input id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="email" value="Acrónimo" />
            <Input id="acronimo" type="text" className="mt-1" bind:value={$form.acronimo} error={errors.acronimo} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="email" value="Correo electrónico" />
            <Input id="email" type="email" className="mt-1" bind:value={$form.email} error={errors.email} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="enlace_gruplac" value="Enlace GrupLAC" />
            <Input id="enlace_gruplac" type="url" className="mt-1" bind:value={$form.enlace_gruplac} error={errors.enlace_gruplac} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="codigo_minciencias" value="Código Minciencias" />
            <Input id="codigo_minciencias" type="text" className="mt-1" bind:value={$form.codigo_minciencias} error={errors.codigo_minciencias} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="categoria_minciencias" value="Clasificación MinCiencias 894 – 2021" />
            <Select id="categoria_minciencias" items={categoriasMinciencias} bind:selectedValue={$form.categoria_minciencias} error={errors.categoria_minciencias} autocomplete="off" placeholder="Seleccione una categoría Minciencias" required />
        </div>

        <div className="mt-4 ">
            <Label required labelFor="fecha_creacion_grupo" value="Fecha creación del grupo" />
            <input id="fecha_creacion_grupo" type="date" className="mt-1 p-4" bind:value={$form.fecha_creacion_grupo} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="nombre_lider_grupo" value="Nombre del líder del grupo" />
            <Input id="nombre_lider_grupo" type="text" className="mt-1" bind:value={$form.nombre_lider_grupo} error={errors.nombre_lider_grupo} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="email_contacto" value="Email de contacto" />
            <Input id="email_contacto" type="email" className="mt-1" bind:value={$form.email_contacto} error={errors.email_contacto} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="reconocimientos_grupo_investigacion" value="Reconocimientos grupo de investigación" />
            <Textarea maxlength="40000" id="reconocimientos_grupo_investigacion" bind:value={$form.reconocimientos_grupo_investigacion} error={errors.reconocimientos_grupo_investigacion} required />
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
            <Label required labelFor="programa_nal_ctei_principal" value="Programa Nal. CTeI (Principal)" />
            <Input id="programa_nal_ctei_principal" type="text" className="mt-1" bind:value={$form.programa_nal_ctei_principal} error={errors.programa_nal_ctei_principal} required />
        </div>

        <div className="mt-8">
            <Label required labelFor="programa_nal_ctei_secundaria" value="Programa Nal. CTeI (Secundaria)" />
            <Input id="programa_nal_ctei_secundaria" type="text" className="mt-1" bind:value={$form.programa_nal_ctei_secundaria} error={errors.programa_nal_ctei_secundaria} required />
        </div>

        <div className="mt-8">
            <Label labelFor="link_propio_grupo" value="Link propio del grupo" />
            <Input id="link_propio_grupo" type="url" className="mt-1" bind:value={$form.link_propio_grupo} error={errors.link_propio_grupo} />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="redes_conocimiento" value="Red o redes de conocimiento afines al Grupo de Investigación" />
            <MultipleSelect id="redes_conocimiento" bind:selectedValue={$form.redes_conocimiento} items={redesConocimiento}  error={errors.redes_conocimiento} placeholder="Buscar redes de conocimiento" required />
        </div>

        <div className="mt-8">
            <Label className="mb-4 mt-8" labelFor="formato_gic_f_020" value="Formato GIC – F – 021" />
            <File id="formato_gic_f_020" maxSize="10000" bind:value={$form.formato_gic_f_020} valueDb={grupoInvestigacion?.formato_gic_f_020} error={errors.formato_gic_f_020} route={grupoInvestigacion?.formato_gic_f_020?.includes('http') || method == 'store' ? null : route('grupos-investigacion.download-file-sharepoint', [grupoInvestigacion, 'formato_gic_f_020'])} />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label className="mb-4 mt-8" labelFor="formato_gic_f_032" value="Formato GIC – F – 032" />
            <File id="formato_gic_f_032" maxSize="10000" bind:value={$form.formato_gic_f_032} valueDb={grupoInvestigacion?.formato_gic_f_032} error={errors.formato_gic_f_032} route={grupoInvestigacion?.formato_gic_f_032?.includes('http') || method == 'store' ? null : route('grupos-investigacion.download-file-sharepoint', [grupoInvestigacion, 'formato_gic_f_032'])} />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if grupoInvestigacion && grupoInvestigacion?.allowed.to_update}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {grupoInvestigacion?.updated_at}
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
            desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del grupo de investigación).
        </InfoMessage>
    </div>

    <div slot="content">
        <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
            <h1 className="font-black text-center my-10">Información del grupo de investigación</h1>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Centro de formación:</strong>
                {$form.centro_formacion_id ? $form.centro_formacion_id?.label : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Nombre del grupo de investigación:</strong>
                {$form.nombre ? $form.nombre : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Acrónimo:</strong>
                {$form.acronimo ? $form.acronimo : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Corre electrónico:</strong>
                {$form.email ? $form.email : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Nombre del líder del semillero:</strong>
                {$form.nombre_lider_semillero ? $form.nombre_lider_semillero : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Enlace GrupLAC:</strong>
                {$form.enlace_gruplac ? $form.enlace_gruplac : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Código Minciencias:</strong>
                {$form.codigo_minciencias ? $form.codigo_minciencias : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Clasificación MinCiencias 894 – 2021:</strong>
                {$form.categoria_minciencias ? $form.categoria_minciencias : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Fecha de creación del grupo:</strong>
                {$form.fecha_creacion_grupo ? $form.fecha_creacion_grupo : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Nombre del líder del grupo:</strong>
                {$form.nombre_lider_grupo ? $form.nombre_lider_grupo : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Correo electrónico de contacto:</strong>
                {$form.email_contacto ? $form.email_contacto : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Reconocimientos grupo de investigación:</strong>
                {$form.reconocimientos_grupo_investigacion ? $form.reconocimientos_grupo_investigacion : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Programa Nal. CTeI (Principal):</strong>
                {$form.programa_nal_ctei_principal ? $form.programa_nal_ctei_principal : 'Sin información registrada'}
            </p>
            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Programa Nal. CTeI (Secundaria):</strong>
                {$form.programa_nal_ctei_secundaria ? $form.programa_nal_ctei_secundaria : 'Sin información registrada'}
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
                <strong>Link del grupo:</strong>
                {$form.link_propio_grupo ? $form.link_propio_grupo : 'Sin información registrada'}
            </p>

            <p style="white-space: pre-line; margin-bottom: 4rem">
                <strong>Red o redes de conocimiento afines al Grupo de Investigación:</strong>
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
        </Export2Word>
    </div>
    <div slot="actions">
        <div className="p-4">
            <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
            <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(grupoInvestigacion.nombre)}>Descargar borrador en Word</Button>
            {#if grupoInvestigacion?.allowed.to_update || allowedToCreate}
                <PrimaryButton loading={$form.processing} form="grupo-investigacion-form">Guardar</PrimaryButton>
            {:else}
                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
            {/if}
        </div>
    </div>
</Dialog>

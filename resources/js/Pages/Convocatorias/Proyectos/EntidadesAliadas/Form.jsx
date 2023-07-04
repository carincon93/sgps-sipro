<script>
    import { route } from '@/Utils'

    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Input from '@/Components/Input'
    import Switch from '@/Components/Switch'
    import Select from '@/Components/Select'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import InputError from '@/Components/InputError'
    import File from '@/Components/File'

    export let errors
    export let convocatoria
    export let proyecto
    export let entidadAliada
    export let actividades
    export let tiposEntidadAliada
    export let naturalezaEntidadAliada
    export let tiposEmpresa
    export let form
    export let submit
    export let method
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="tipo" value="Tipo de entidad aliada" />
            <Select id="tipo" items={tiposEntidadAliada} bind:selectedValue={$form.tipo} error={errors.tipo} autocomplete="off" placeholder="Seleccione el tipo de entidad" required />
        </div>

        <div className="mt-8">
            <Textarea label="Nombre de la entidad aliada/Centro de formación" maxlength="255" id="nombre" error={errors.nombre} bind:value={$form.nombre} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="naturaleza" value="Naturaleza de la entidad" />
            <Select id="naturaleza" items={naturalezaEntidadAliada} bind:selectedValue={$form.naturaleza} error={errors.naturaleza} autocomplete="off" placeholder="Seleccione la naturaleza de la entidad" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="tipo_empresa" value="Tipo de empresa" />
            <Select id="tipo_empresa" items={tiposEmpresa} bind:selectedValue={$form.tipo_empresa} error={errors.tipo_empresa} autocomplete="off" placeholder="Seleccione el tipo de empresa" required />
        </div>

        <div className="mt-8">
            <Input label="NIT" id="nit" type="text" className="mt-1" bind:value={$form.nit} error={errors.nit} required />
        </div>

        {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
            <div className="mt-8">
                <p>¿Hay convenio?</p>
                <Switch bind:checked={$form.tiene_convenio} />
            </div>
            {#if $form.tiene_convenio}
                <div className="mt-8">
                    <Textarea label="Descipción del convenio" maxlength="400" id="descripcion_convenio" error={errors.descripcion_convenio} bind:value={$form.descripcion_convenio} required />
                </div>
            {/if}

            <div className="mt-8">
                <p>¿La entidad aliada tiene grupo de investigación?</p>
                <Switch bind:checked={$form.tiene_grupo_investigacion} />
            </div>
            {#if $form.tiene_grupo_investigacion}
                <div className="mt-8">
                    <Textarea label="Grupo de investigación" maxlength="191" id="grupo_investigacion" error={errors.grupo_investigacion} bind:value={$form.grupo_investigacion} required />
                </div>

                <div className="mt-8">
                    <Input label="Código del GrupLAC" id="codigo_gruplac" type="text" className="mt-1" error={errors.codigo_gruplac} placeholder="Ejemplo: COL0000000" bind:value={$form.codigo_gruplac} required={!form.tiene_grupo_investigacion ? undefined : 'required'} />
                </div>

                <div className="mt-8">
                    <Input label="Enlace del GrupLAC" id="enlace_gruplac" type="url" className="mt-1" error={errors.enlace_gruplac} placeholder="Ejemplo: https://scienti.minciencias.gov.co/gruplac/jsp/Medicion/graficas/verPerfiles.jsp?id_convocatoria=0nroIdGrupo=0000000" bind:value={$form.enlace_gruplac} required={!form.tiene_grupo_investigacion ? undefined : 'required'} />
                </div>
            {/if}

            <div className="mt-8">
                <Input label="Recursos en especie entidad aliada ($COP)" id="recursos_especie" type="number" input$min="0" className="mt-1" error={errors.recursos_especie} placeholder="COP" bind:value={$form.recursos_especie} required />
            </div>

            <div className="mt-8">
                <Textarea label="Descripción de los recursos en especie aportados" maxlength="2500" id="descripcion_recursos_especie" error={errors.descripcion_recursos_especie} bind:value={$form.descripcion_recursos_especie} required />
            </div>

            <div className="mt-8">
                <Input label="Recursos en dinero entidad aliada ($COP)" id="recursos_dinero" type="number" input$min="0" className="mt-1" error={errors.recursos_dinero} placeholder="COP" bind:value={$form.recursos_dinero} required />
            </div>

            <div className="mt-8">
                <Textarea label="Descripción de la destinación del dinero aportado" maxlength="2500" id="descripcion_recursos_dinero" error={errors.descripcion_recursos_dinero} bind:value={$form.descripcion_recursos_dinero} required />
            </div>

            <div className="mt-8">
                <Textarea label="Metodología o actividades de transferencia al centro de formación" maxlength="2500" id="actividades_transferencia_conocimiento" error={errors.actividades_transferencia_conocimiento} bind:value={$form.actividades_transferencia_conocimiento} required />
            </div>

            {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
                <div className="mt-8">
                    <Label className="mb-4" labelFor="carta_intencion" value="ANEXO 7. Carta de intención o acta que soporta el trabajo articulado con entidades aliadas (diferentes al SENA)" />

                    <File
                        id="carta_intencion"
                        maxSize="10000"
                        bind:value={$form.carta_intencion}
                        valueDb={entidadAliada?.entidad_aliada_idi?.carta_intencion}
                        error={errors.carta_intencion}
                        route={entidadAliada?.entidad_aliada_idi?.carta_intencion?.includes('http') || method == 'store' ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria.id, proyecto.id, entidadAliada, 'carta_intencion'])}
                    />
                </div>

                <div className="mt-8">
                    <Label className="mb-4" labelFor="carta_propiedad_intelectual" value="ANEXO 8. Propiedad intelectual" />

                    <File
                        id="carta_propiedad_intelectual"
                        maxSize="10000"
                        bind:value={$form.carta_propiedad_intelectual}
                        valueDb={entidadAliada?.entidad_aliada_idi?.carta_propiedad_intelectual}
                        error={errors.carta_propiedad_intelectual}
                        route={entidadAliada?.entidad_aliada_idi?.carta_propiedad_intelectual?.includes('http') || method == 'store' ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria.id, proyecto.id, entidadAliada, 'carta_propiedad_intelectual'])}
                    />
                </div>
            {/if}
        {:else if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
            <div className="mt-8">
                <Label className="mb-4" labelFor="soporte_convenio" value="Archivo del convenio" />

                <File
                    id="soporte_convenio"
                    maxSize="10000"
                    bind:value={$form.soporte_convenio}
                    valueDb={entidadAliada?.entidad_aliada_ta_tp?.soporte_convenio}
                    error={errors.soporte_convenio}
                    route={entidadAliada?.entidad_aliada_ta_tp?.soporte_convenio?.includes('http') || method == 'store' ? null : route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [convocatoria.id, proyecto.id, entidadAliada, 'soporte_convenio'])}
                />
            </div>

            <div className="mt-8">
                <p className="text-center">Fechas de vigencia Convenio/Acuerdos</p>
                <div className="mt-4 flex items-start justify-around">
                    <div className="mt-4 flex {errors.fecha_inicio_convenio ? '' : 'items-center'}">
                        <Label required labelFor="fecha_inicio_convenio" className={errors.fecha_inicio_convenio ? 'top-3.5 relative' : ''} value="Del" />
                        <div className="ml-4">
                            <input id="fecha_inicio_convenio" type="date" className="mt-1 block w-full p-4" bind:value={$form.fecha_inicio_convenio} required />
                        </div>
                    </div>
                    <div className="mt-4 flex {errors.fecha_fin_convenio ? '' : 'items-center'}">
                        <Label required labelFor="fecha_fin_convenio" className={errors.fecha_fin_convenio ? 'top-3.5 relative' : ''} value="hasta" />
                        <div className="ml-4">
                            <input id="fecha_fin_convenio" type="date" className="mt-1 block w-full p-4" bind:value={$form.fecha_fin_convenio} required />
                        </div>
                    </div>
                </div>
                {#if errors.fecha_inicio_convenio || errors.fecha_fin_convenio}
                    <InputError message={errors.fecha_inicio_convenio || errors.fecha_fin_convenio} />
                {/if}
            </div>
        {/if}

        {#if $form.progress}
            <progress value={$form.progress.percentage} max="100" className="mt-4">
                {$form.progress.percentage}%
            </progress>
        {/if}

        {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
            <h6 className="mt-20 mb-12 text-2xl" id="actividades">Actividades</h6>

            <div className="bg-white rounded shadow overflow-hidden">
                <div className="p-4">
                    <Label required className="mb-4" labelFor="actividad_id" value="Relacione alguna actividad" />
                    <InputError message={errors.actividad_id} />
                </div>
                {#if proyecto.allowed.to_update}
                    <div className="grid grid-cols-2">
                        {#each actividades as { id, descripcion }, i}
                            <FormField>
                                <Checkbox bind:group={$form.actividad_id} value={id} />
                                <span slot="label">{descripcion}</span>
                            </FormField>
                        {/each}
                    </div>
                {:else}
                    <div className="p-2">
                        <ul className="list-disc p-4">
                            {#each actividades as { id, descripcion }, i}
                                {#each $form.actividad_id as actividad}
                                    {#if id == actividad}
                                        <li className="first-letter-uppercase mb-4">{descripcion}</li>
                                    {/if}
                                {/each}
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        {/if}
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if entidadAliada}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {entidadAliada.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>

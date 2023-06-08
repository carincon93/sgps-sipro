<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import FormField from '@smui/form-field'
    import InputError from '@/Shared/InputError'
    import InfoMessage from '@/Shared/InfoMessage'
    import Checkbox from '@smui/checkbox'
    import { onMount } from 'svelte'

    export let isSuperAdmin
    export let errors
    export let proyecto
    export let proyectoRolSennova
    export let convocatoriaRolesSennova
    export let form
    export let submit
    export let lineasTecnologicas
    export let actividades
    export let evaluacion = false

    let diff_meses = proyecto.diff_meses
    $: if ($form.convocatoria_rol_sennova_id) {
        if (proyecto.codigo_linea_programatica == 68) {
            $form.numero_meses = proyecto.max_meses_ejecucion
        }
    }

    let infoRolSennova = null

    $: if (infoRolSennova?.perfil != null) {
        if (infoRolSennova?.value == proyectoRolSennova?.convocatoria_rol_sennova_id) {
            $form.descripcion = proyectoRolSennova?.descripcion
        } else {
            $form.descripcion = infoRolSennova.perfil
        }
    } else {
        $form.descripcion = proyectoRolSennova ? proyectoRolSennova?.descripcion : ''
    }

    $: if (infoRolSennova?.perfil != null) {
        $form.descripcion = infoRolSennova.perfil
    }

    let esFacilitador
    let esMonitor
    onMount(() => {
        esFacilitador = $form.convocatoria_rol_sennova_id?.label?.includes('facilitador') || $form.convocatoria_rol_sennova_id?.label?.includes('Facilitador')
        esMonitor = $form.convocatoria_rol_sennova_id?.label?.includes('monitor') || $form.convocatoria_rol_sennova_id?.label?.includes('Monitor')
    })

    function selectRolSennova(event, label = null) {
        esFacilitador = event.detail.label.includes('facilitador') || event.detail.label.includes('Facilitador')
        esMonitor = event.detail.label.includes('monitor') || event.detail.label.includes('Monitor')
    }

    let numeroMonitoria = [
        {
            value: 1,
            label: '1 monitor(a)',
        },
        {
            value: 2,
            label: '2 monitores',
        },
        {
            value: 3,
            label: '3 monitores',
        },
        {
            value: 4,
            label: '4 monitores',
        },
    ]

    let numeroMesesMonitoria = [
        {
            value: 3,
            label: '3 meses',
        },
        {
            value: 4,
            label: '4 meses',
        },
        {
            value: 5,
            label: '5 meses',
        },
        {
            value: 6,
            label: '6 meses',
        },
    ]
</script>

<form on:submit|preventDefault={submit} class="bg-white rounded shadow">
    <fieldset class="p-8" disabled={proyecto?.allowed?.to_update ? undefined : true}>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="convocatoria_rol_sennova_id" value="Rol SENNOVA" />
            <Select id="convocatoria_rol_sennova_id" items={convocatoriaRolesSennova} bind:selectedValue={$form.convocatoria_rol_sennova_id} selectFunctions={[(event) => selectRolSennova(event)]} error={errors.convocatoria_rol_sennova_id} autocomplete="off" placeholder="Busque por el nombre del rol" required />
        </div>
        {#if proyecto.codigo_linea_programatica != 68}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="descripcion" value="Descripción del perfil requerido" />
                <Textarea maxlength="40000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
            </div>
        {/if}

        {#if proyecto.codigo_linea_programatica == 68}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="educacion" value="Educación" />
                <Textarea maxlength="40000" id="educacion" error={errors.educacion} bind:value={$form.educacion} required />
            </div>

            <div class="mt-8">
                <Label required class="mb-4" labelFor="formacion" value="Formación" />
                <Textarea maxlength="40000" id="formacion" error={errors.formacion} bind:value={$form.formacion} required />
            </div>

            <div class="mt-8">
                <Label required class="mb-4" labelFor="experiencia" value="Experiencia" />
                <Textarea maxlength="40000" id="experiencia" error={errors.experiencia} bind:value={$form.experiencia} required />
            </div>
        {/if}

        {#if proyecto.codigo_linea_programatica != 68 && esMonitor == false}
            <div class="mt-8">
                <Input label="Número de meses que requiere el apoyo" id="numero_meses" type="number" input$min="1" input$step="0.1" input$max={diff_meses < 6 ? 6 : diff_meses} class="mt-1" error={errors.numero_meses} bind:value={$form.numero_meses} required />

                <InfoMessage>
                    <small>
                        El proyecto se ejecutará entre {proyecto.fecha_inicio} y {proyecto.fecha_finalizacion}, por lo tanto el número de meses máximo es: {diff_meses}
                        <br />
                        <span class="flex">
                            Uitlice las flechas <span class="flex flex-col relative top-[-0.4rem]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span> que aparecen dentro del campo para ajustar los decimales.
                        </span>
                    </small>
                </InfoMessage>
            </div>
        {:else if esMonitor == true}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="numero_meses_monitorias" value="Número meses" />
                <Select id="numero_meses_monitorias" items={numeroMesesMonitoria} bind:selectedValue={$form.numero_meses_monitorias} error={errors.numero_meses_monitorias} autocomplete="off" placeholder="Seleccione la cantidad de meses" required />
            </div>
        {/if}

        {#if esMonitor == false}
            <div class="mt-8">
                <Input label="Número de personas requeridas" id="numero_roles" type="number" input$min="1" input$max={esMonitor ? 4 : undefined} class="mt-1" error={errors.numero_roles} bind:value={$form.numero_roles} required />
            </div>
        {:else if esMonitor == true}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="numero_monitorias" value="Número de monitorías" />
                <Select id="numero_monitorias" items={numeroMonitoria} bind:selectedValue={$form.numero_monitorias} error={errors.numero_monitorias} autocomplete="off" placeholder="Seleccione la cantidad de monitorías" required />
            </div>
            <InfoMessage>Máximo 4 monitorías</InfoMessage>
        {/if}

        {#if esFacilitador || proyecto.codigo_linea_programatica == 69}
            <h6 class="mt-20 mb-12 text-2xl">Líneas tecnológicas</h6>
            <InfoMessage class="ml-10 mb-6">Seleccione una o varias líneas</InfoMessage>
            <div class="bg-white rounded shadow overflow-hidden">
                <div class="p-4">
                    <Label class="mb-4" labelFor="linea_tecnologica_id" value="Relacione alguna línea" />
                    <InputError message={errors.linea_tecnologica_id} />
                </div>
                {#if isSuperAdmin || proyecto?.allowed?.to_update}
                    <div class="flex flex-col">
                        {#each lineasTecnologicas as lineaTecnologica}
                            <FormField class="border-b border-l">
                                <Checkbox bind:group={$form.linea_tecnologica_id} value={lineaTecnologica.id} />
                                <span slot="label">
                                    <div class="mb-8">
                                        <small class="block mt-4">Nombre</small>
                                        {lineaTecnologica.nombre}
                                    </div>
                                </span>
                            </FormField>
                        {/each}
                        {#if lineasTecnologicas.length == 0}
                            <p class="p-4">Sin información registrada</p>
                        {/if}
                    </div>
                {:else}
                    <div class="p-2">
                        <ul class="list-disc p-4">
                            {#each lineasTecnologicas as lineaTecnologica}
                                <li class="mb-4">
                                    <div class="mb-8">
                                        <small class="block">Nombre</small>
                                        {lineaTecnologica.nombre}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        {/if}

        <h6 class="mt-20 mb-12 text-2xl">Actividades</h6>
        <InfoMessage class="ml-10 mb-6">Seleccione las actividades que debe ejecutar el rol</InfoMessage>
        <div class="bg-white rounded shadow overflow-hidden">
            <div class="p-4">
                <Label class="mb-4" labelFor="actividad_id" value="Relacione alguna actividad" />
                <InputError message={errors.actividad_id} />
            </div>
            {#if (isSuperAdmin && !evaluacion) || (proyecto?.allowed?.to_update && !evaluacion)}
                <div class="flex flex-col">
                    {#each actividades as actividad}
                        <FormField class="border-b border-l">
                            <Checkbox bind:group={$form.actividad_id} value={actividad.id} />
                            <span slot="label">
                                <div class="mb-8">
                                    <small class="block mt-4">Descripción</small>
                                    {actividad.descripcion}
                                    <br />
                                    <small class="block mt-4">Objetivo específico # {actividad.objetivo_especifico.numero}</small>
                                    {actividad.objetivo_especifico ? actividad.objetivo_especifico.descripcion : 'Sin '}
                                </div>
                            </span>
                        </FormField>
                    {/each}
                    {#if actividades.length == 0}
                        <p class="p-4">Sin información registrada</p>
                    {/if}
                </div>
            {:else}
                <div class="p-2">
                    <ul class="list-disc p-4">
                        {#each actividades as actividad}
                            <li class="mb-4">
                                <div class="mb-8">
                                    <small class="block">Actividad</small>
                                    {actividad.descripcion}
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if proyectoRolSennova}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {proyectoRolSennova.updated_at}
            </small>
        {/if}
        {#if proyecto?.allowed?.to_update}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>

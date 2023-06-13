<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import InputError from '@/Shared/InputError'
    import LoadingButton from '@/Shared/LoadingButton'
    import InfoMessage from '@/Shared/InfoMessage'
    import Textarea from '@/Shared/Textarea'
    import Switch from '@/Shared/Switch'
    import Select from '@/Shared/Select'

    export let errors
    export let convocatoria
    export let fases

    $: $title = convocatoria ? 'Convocatoria ' + convocatoria.year : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formFase = useForm({
        fase: convocatoria.fase,
    })

    function submitFase() {
        if (isSuperAdmin) {
            $formFase.put(route('convocatorias.update-fase', convocatoria.id), {
                preserveScroll: true,
            })
        }
    }
    let form = useForm({
        descripcion: convocatoria.descripcion,
        esta_activa: convocatoria.esta_activa,
        visible: convocatoria.visible,
        fecha_finalizacion_fase: convocatoria.fecha_finalizacion_fase,
        hora_finalizacion_fase: convocatoria.hora_finalizacion_fase,
        min_fecha_inicio_proyectos_idi: convocatoria.min_fecha_inicio_proyectos_idi,
        max_fecha_finalizacion_proyectos_idi: convocatoria.max_fecha_finalizacion_proyectos_idi,
        min_fecha_inicio_proyectos_cultura: convocatoria.min_fecha_inicio_proyectos_cultura,
        max_fecha_finalizacion_proyectos_cultura: convocatoria.max_fecha_finalizacion_proyectos_cultura,
        min_fecha_inicio_proyectos_st: convocatoria.min_fecha_inicio_proyectos_st,
        max_fecha_finalizacion_proyectos_st: convocatoria.max_fecha_finalizacion_proyectos_st,
        min_fecha_inicio_proyectos_ta: convocatoria.min_fecha_inicio_proyectos_ta,
        max_fecha_finalizacion_proyectos_ta: convocatoria.max_fecha_finalizacion_proyectos_ta,
        min_fecha_inicio_proyectos_tp: convocatoria.min_fecha_inicio_proyectos_tp,
        max_fecha_finalizacion_proyectos_tp: convocatoria.max_fecha_finalizacion_proyectos_tp,
        mostrar_recomendaciones: convocatoria.mostrar_recomendaciones,
        idi_activa: convocatoria.idi_activa,
        st_activa: convocatoria.st_activa,
        ta_activa: convocatoria.ta_activa,
        tp_activa: convocatoria.tp_activa,
        cultura_activa: convocatoria.cultura_activa,
    })

    function submitInfo() {
        if (isSuperAdmin) {
            $form.put(route('convocatorias.update', convocatoria.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.index')} class="text-app-400 hover:text-app-600"> Convocatorias </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('convocatorias.dashboard', convocatoria.id)} class="text-app-400 hover:text-app-600">
                        {convocatoria.descripcion}
                    </a>
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3">
        <div>
            <h1 class="font-black text-4xl sticky top-0 uppercase">Editar convocatoria</h1>
        </div>
        <div class=" col-span-2">
            {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
                <form on:submit|preventDefault={submitFase} class="bg-white rounded shadow">
                    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
                        <div class="grid grid-cols-2">
                            <div>
                                <Label required class="mb-4" labelFor="fase" value="Fase" />
                            </div>
                            <div>
                                <Select id="fase" items={fases} bind:selectedValue={$formFase.fase} error={errors.fase} autocomplete="off" placeholder="Seleccione una fase" required />
                            </div>
                        </div>

                        <InfoMessage class="mt-10">
                            {#if $formFase.fase?.value == 1}
                                <strong>Tenga en cuenta:</strong> La fase de {$formFase.fase?.label.toLowerCase()} permitirá a los formuladores crear, modificar y eliminar proyectos.
                            {:else if $formFase.fase?.value == 2}
                                <strong>Tenga en cuenta:</strong> La fase de {$formFase.fase?.label.toLowerCase()} bloqueará a los formuladores las acciones de crear, modificar y eliminar proyectos.
                            {:else if $formFase.fase?.value == 3}
                                <strong>Tenga en cuenta:</strong> La fase de {$formFase.fase?.label.toLowerCase()} permitirá a los formuladores modificar aquellos proyectos que pueden ser subsanados y a los evaluadores se le bloqueará la acción de modificar las evaluaciones.
                            {:else if $formFase.fase?.value == 4}
                                <strong>Tenga en cuenta:</strong> La fase de {$formFase.fase?.label.toLowerCase()} bloqueará a los formuladores la acción de modificar aquellos proyectos que pasaron a etapa de subsanación y a los evaluadores se le habilitarán aquellas evaluaciones de proyectos subsanados.
                            {:else if $formFase.fase?.value == 5}
                                <strong>Tenga en cuenta:</strong> La fase de {$formFase.fase?.label.toLowerCase()} bloqueará a los formuladores la modificación de proyectos y a los evaluadores la modificación de las evaluaciones.
                            {/if}
                        </InfoMessage>
                    </fieldset>
                    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                        {#if isSuperAdmin}
                            <LoadingButton class="ml-auto" type="submit" loading={$formFase.processing}>Editar fase</LoadingButton>
                        {/if}
                    </div>
                </form>

                <hr class="mt-10 mb-10" />
            {/if}

            <div class="bg-white rounded shadow">
                <form on:submit|preventDefault={submitInfo}>
                    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
                        {#if $formFase.fase?.label}
                            <div class="mt-4 mb-20">
                                <div class="mt-4 ">
                                    <Label required labelFor="fecha_finalizacion_fase" value="Fecha de finalización de la fase: {$formFase.fase?.label.toLowerCase()}" />
                                    <input id="fecha_finalizacion_fase" type="date" class="mt-1 p-2" bind:value={$form.fecha_finalizacion_fase} required />
                                </div>
                            </div>
                            {#if errors.fecha_finalizacion_fase}
                                <InputError message={errors.fecha_finalizacion_fase} />
                            {/if}
                        {/if}

                        <div class="mt-4 mb-20">
                            <div class="mt-4 ">
                                <Label required labelFor="hora_finalizacion_fase" value="Hora límite" />
                                <input id="hora_finalizacion_fase" type="time" step="1" class="mt-1 p-2 border rounded border-gray-300" bind:value={$form.hora_finalizacion_fase} required />
                                <InputError message={errors.hora_finalizacion_fase} />
                            </div>
                        </div>

                        <div class="mt-8">
                            <Textarea label="Descripción" maxlength="40000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
                        </div>

                        <div class="mt-10 mb-20">
                            <Label required labelFor="esta_activa" value="¿Desea activar esta convocatoria? (Si la opción está habilitada permite a los usuarios formular proyectos. Tenga en cuenta que solo puede activar una convocatoria por tipo --Proyectos de convocatoria - Proyectos de ejecicio DEMO)" class="inline-block mb-4" />
                            <br />
                            <Switch bind:checked={$form.esta_activa} />
                            <InputError message={errors.esta_activa} />
                        </div>

                        {#if $form.esta_activa}
                            <div class="pl-8">
                                <div class="mt-10 mb-20">
                                    <Label required labelFor="idi_activa" value="¿Desea activar el flujo de formulación de I+D+i?" class="inline-block mb-4" />
                                    <br />
                                    <Switch bind:checked={$form.idi_activa} />
                                    <InputError message={errors.idi_activa} />
                                </div>
                                <div class="mt-10 mb-20">
                                    <Label required labelFor="st_activa" value="¿Desea activar el flujo de formulación de ST?" class="inline-block mb-4" />
                                    <br />
                                    <Switch bind:checked={$form.st_activa} />
                                    <InputError message={errors.st_activa} />
                                </div>
                                <div class="mt-10 mb-20">
                                    <Label required labelFor="ta_activa" value="¿Desea activar el flujo de formulación de TA?" class="inline-block mb-4" />
                                    <br />
                                    <Switch bind:checked={$form.ta_activa} />
                                    <InputError message={errors.ta_activa} />
                                </div>
                                <div class="mt-10 mb-20">
                                    <Label required labelFor="tp_activa" value="¿Desea activar el flujo de formulación de TP?" class="inline-block mb-4" />
                                    <br />
                                    <Switch bind:checked={$form.tp_activa} />
                                    <InputError message={errors.tp_activa} />
                                </div>
                                <div class="mt-10 mb-20">
                                    <Label required labelFor="cultura_activa" value="¿Desea activar el flujo de formulación de Apropiación de la Cultura de la Innovación?" class="inline-block mb-4" />
                                    <br />
                                    <Switch bind:checked={$form.cultura_activa} />
                                    <InputError message={errors.cultura_activa} />
                                </div>
                            </div>
                        {/if}

                        <div class="mt-10 mb-20">
                            <Label required labelFor="visible" value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)" class="inline-block mb-4" />
                            <br />
                            <Switch bind:checked={$form.visible} onMessage="Visible" offMessage="Oculta" />
                            <InputError message={errors.visible} />
                        </div>

                        {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
                            <div class="mt-4 mb-20">
                                <Label required labelFor="mostrar_recomendaciones" value="¿Desea que el formulador visualice las recomendaciones hechas por los evaluadores?" class="inline-block mb-4" />
                                <br />
                                <Switch bind:checked={$form.mostrar_recomendaciones} />
                                <InputError message={errors.mostrar_recomendaciones} />
                            </div>
                        {/if}

                        {#if convocatoria.tipo_convocatoria == 1}
                            <div class="mt-20">
                                <p class="text-center">Fechas máximas de ejecución de proyectos I+D+i</p>
                                <div class="mt-4 flex items-start justify-around">
                                    <div class="mt-4 flex {errors.min_fecha_inicio_proyectos_idi ? '' : 'items-center'}">
                                        <Label required labelFor="min_fecha_inicio_proyectos_idi" class={errors.min_fecha_inicio_proyectos_idi ? 'top-3.5 relative' : ''} value="Del" />
                                        <div class="ml-4">
                                            <input id="min_fecha_inicio_proyectos_idi" type="date" class="mt-1 p-2" bind:value={$form.min_fecha_inicio_proyectos_idi} required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex {errors.max_fecha_finalizacion_proyectos_idi ? '' : 'items-center'}">
                                        <Label required labelFor="max_fecha_finalizacion_proyectos" class={errors.max_fecha_finalizacion_proyectos_idi ? 'top-3.5 relative' : ''} value="hasta" />
                                        <div class="ml-4">
                                            <input id="max_fecha_finalizacion_proyectos" type="date" class="mt-1 p-2" bind:value={$form.max_fecha_finalizacion_proyectos_idi} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if errors.min_fecha_inicio_proyectos_idi || errors.max_fecha_finalizacion_proyectos_idi}
                                <InputError message={errors.min_fecha_inicio_proyectos_idi || errors.max_fecha_finalizacion_proyectos_idi} />
                            {/if}
                        {/if}

                        {#if convocatoria.tipo_convocatoria == 1}
                            <div class="mt-20">
                                <p class="text-center">Fechas máximas de ejecución de proyectos Cultura de la innovación</p>
                                <div class="mt-4 flex items-start justify-around">
                                    <div class="mt-4 flex {errors.min_fecha_inicio_proyectos_cultura ? '' : 'items-center'}">
                                        <Label required labelFor="min_fecha_inicio_proyectos_cultura" class={errors.min_fecha_inicio_proyectos_cultura ? 'top-3.5 relative' : ''} value="Del" />
                                        <div class="ml-4">
                                            <input id="min_fecha_inicio_proyectos_cultura" type="date" class="mt-1 p-2" bind:value={$form.min_fecha_inicio_proyectos_cultura} required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex {errors.max_fecha_finalizacion_proyectos_cultura ? '' : 'items-center'}">
                                        <Label required labelFor="max_fecha_finalizacion_proyectos_cultura" class={errors.max_fecha_finalizacion_proyectos_cultura ? 'top-3.5 relative' : ''} value="hasta" />
                                        <div class="ml-4">
                                            <input id="max_fecha_finalizacion_proyectos_cultura" type="date" class="mt-1 p-2" bind:value={$form.max_fecha_finalizacion_proyectos_cultura} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if errors.min_fecha_inicio_proyectos_cultura || errors.max_fecha_finalizacion_proyectos_cultura}
                                <InputError message={errors.min_fecha_inicio_proyectos_cultura || errors.max_fecha_finalizacion_proyectos_cultura} />
                            {/if}
                        {/if}

                        {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
                            <div class="mt-20">
                                <p class="text-center">Fechas máximas de ejecución de proyectos Tecnoacademia</p>
                                <div class="mt-4 flex items-start justify-around">
                                    <div class="mt-4 flex {errors.min_fecha_inicio_proyectos_ta ? '' : 'items-center'}">
                                        <Label required labelFor="min_fecha_inicio_proyectos_ta" class={errors.min_fecha_inicio_proyectos_ta ? 'top-3.5 relative' : ''} value="Del" />
                                        <div class="ml-4">
                                            <input id="min_fecha_inicio_proyectos_ta" type="date" class="mt-1 p-2" bind:value={$form.min_fecha_inicio_proyectos_ta} required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex {errors.max_fecha_finalizacion_proyectos_ta ? '' : 'items-center'}">
                                        <Label required labelFor="max_fecha_finalizacion_proyectos_ta" class={errors.max_fecha_finalizacion_proyectos_ta ? 'top-3.5 relative' : ''} value="hasta" />
                                        <div class="ml-4">
                                            <input id="max_fecha_finalizacion_proyectos_ta" type="date" class="mt-1 p-2" bind:value={$form.max_fecha_finalizacion_proyectos_ta} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if errors.min_fecha_inicio_proyectos_ta || errors.max_fecha_finalizacion_proyectos_ta}
                                <InputError message={errors.min_fecha_inicio_proyectos_ta || errors.max_fecha_finalizacion_proyectos_ta} />
                            {/if}
                        {/if}

                        {#if convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3}
                            <div class="mt-20">
                                <p class="text-center">Fechas máximas de ejecución de proyectos Tecnoparque</p>
                                <div class="mt-4 flex items-start justify-around">
                                    <div class="mt-4 flex {errors.min_fecha_inicio_proyectos_tp ? '' : 'items-center'}">
                                        <Label required labelFor="min_fecha_inicio_proyectos_tp" class={errors.min_fecha_inicio_proyectos_tp ? 'top-3.5 relative' : ''} value="Del" />
                                        <div class="ml-4">
                                            <input id="min_fecha_inicio_proyectos_tp" type="date" class="mt-1 p-2" bind:value={$form.min_fecha_inicio_proyectos_tp} required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex {errors.max_fecha_finalizacion_proyectos_tp ? '' : 'items-center'}">
                                        <Label required labelFor="max_fecha_finalizacion_proyectos_tp" class={errors.max_fecha_finalizacion_proyectos_tp ? 'top-3.5 relative' : ''} value="hasta" />
                                        <div class="ml-4">
                                            <input id="max_fecha_finalizacion_proyectos_tp" type="date" class="mt-1 p-2" bind:value={$form.max_fecha_finalizacion_proyectos_tp} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if errors.min_fecha_inicio_proyectos_tp || errors.max_fecha_finalizacion_proyectos_tp}
                                <InputError message={errors.min_fecha_inicio_proyectos_tp || errors.max_fecha_finalizacion_proyectos_tp} />
                            {/if}
                        {/if}

                        {#if convocatoria.tipo_convocatoria == 1}
                            <div class="mt-20">
                                <p class="text-center">Fechas máximas de ejecución de proyectos Servicios tecnológicos</p>
                                <div class="mt-4 flex items-start justify-around">
                                    <div class="mt-4 flex {errors.min_fecha_inicio_proyectos_st ? '' : 'items-center'}">
                                        <Label required labelFor="min_fecha_inicio_proyectos_st" class={errors.min_fecha_inicio_proyectos_st ? 'top-3.5 relative' : ''} value="Del" />
                                        <div class="ml-4">
                                            <input id="min_fecha_inicio_proyectos_st" type="date" class="mt-1 p-2" bind:value={$form.min_fecha_inicio_proyectos_st} required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex {errors.max_fecha_finalizacion_proyectos_st ? '' : 'items-center'}">
                                        <Label required labelFor="max_fecha_finalizacion_proyectos_st" class={errors.max_fecha_finalizacion_proyectos_st ? 'top-3.5 relative' : ''} value="hasta" />
                                        <div class="ml-4">
                                            <input id="max_fecha_finalizacion_proyectos_st" type="date" class="mt-1 p-2" bind:value={$form.max_fecha_finalizacion_proyectos_st} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if errors.min_fecha_inicio_proyectos_st || errors.max_fecha_finalizacion_proyectos_st}
                                <InputError message={errors.min_fecha_inicio_proyectos_st || errors.max_fecha_finalizacion_proyectos_st} />
                            {/if}
                        {/if}
                    </fieldset>
                    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                        {#if convocatoria}
                            <small class="flex items-center text-app-700">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {convocatoria?.updated_at}
                            </small>
                        {/if}
                        {#if isSuperAdmin}
                            <LoadingButton class="ml-auto" type="submit" loading={$form.processing}>Guardar</LoadingButton>
                        {/if}
                    </div>
                </form>
            </div>
        </div>
    </div>
</AuthenticatedLayout>

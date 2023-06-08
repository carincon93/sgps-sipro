<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import InputError from '@/Shared/InputError'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import Switch from '@/Shared/Switch'
    import Select from '@/Shared/Select'

    export let errors
    export let convocatorias
    export let tiposConvocatoria

    $: $title = 'Crear convocatoria'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        descripcion: '',
        esta_activa: false,
        visible: false,
        fecha_finalizacion_fase: '',
        min_fecha_inicio_proyectos_idi: '',
        max_fecha_finalizacion_proyectos_idi: '',
        min_fecha_inicio_proyectos_cultura: '',
        max_fecha_finalizacion_proyectos_cultura: '',
        min_fecha_inicio_proyectos_st: '',
        max_fecha_finalizacion_proyectos_st: '',
        min_fecha_inicio_proyectos_ta: '',
        min_fecha_inicio_proyectos_tp: '',
        max_fecha_finalizacion_proyectos_ta: '',
        max_fecha_finalizacion_proyectos_tp: '',
        hora_finalizacion_fase: '',
        convocatoria_id: null,
        tipo_convocatoria: null,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.post(route('convocatorias.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.index')} class="text-app-400 hover:text-app-600"> Convocatorias </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3">
        <div>
            <h1 class="font-black text-4xl sticky top-0 uppercase">Nueva convocatoria</h1>
        </div>
        <div class="bg-white rounded shadow col-span-2">
            <form on:submit|preventDefault={submit}>
                <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
                    <div class="mt-4 mb-20">
                        {#if $form.fase}
                            <p class="text-center">Fecha de finalización de la fase: {$form.fase?.label.toLowerCase()}</p>
                        {/if}
                        <div class="mt-4 ">
                            <Label required labelFor="fecha_finalizacion_fase" value="Fecha límite de la fase de formulación" />
                            <input id="fecha_finalizacion_fase" type="date" class="mt-1 p-2" bind:value={$form.fecha_finalizacion_fase} required />
                        </div>
                    </div>
                    {#if errors.fecha_finalizacion_fase}
                        <InputError message={errors.fecha_finalizacion_fase} />
                    {/if}

                    <div class="mt-4 mb-20">
                        <div class="mt-4 ">
                            <Label required labelFor="hora_finalizacion_fase" value="Hora límite de la fase de formulación" />
                            <input id="hora_finalizacion_fase" type="time" step="1" class="mt-1 p-2 border rounded border-gray-300" bind:value={$form.hora_finalizacion_fase} required />
                            <InputError message={errors.hora_finalizacion_fase} />
                        </div>
                    </div>

                    <div class="mt-44 mb-20 grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="tipo_convocatoria" value="Seleccione un tipo de convocatoria (Proyectos de convocatoria para habilitar la formulación de proyectos de todas las líneas - Proyectos demo I+D+i para permitir el ejercicio de formulación)" />
                        </div>
                        <div>
                            <Select id="tipo_convocatoria" items={tiposConvocatoria} bind:selectedValue={$form.tipo_convocatoria} error={errors.tipo_convocatoria} autocomplete="off" placeholder="Seleccione un tipo de convocatoria" required />
                        </div>
                    </div>

                    <div class="mt-44 mb-20 grid grid-cols-2">
                        <div>
                            <Label class="mb-4" labelFor="fase" value="Fase" />
                        </div>
                        <div>Formulación</div>
                    </div>

                    <div class="mt-44 mb-20 grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="convocatoria_id" value="Seleccione una convocatoria de la cual desee copiar los presupuestos y roles SENNOVA" />
                        </div>
                        <div>
                            <Select id="convocatoria_id" items={convocatorias} bind:selectedValue={$form.convocatoria_id} error={errors.convocatoria_id} autocomplete="off" placeholder="Seleccione una convocatoria" required />
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

                    <div class="mt-10 mb-20">
                        <Label required labelFor="visible" value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)" class="inline-block mb-4" />
                        <br />
                        <Switch bind:checked={$form.visible} onMessage="Visible" offMessage="Oculta" />
                        <InputError message={errors.visible} />
                    </div>

                    <hr />

                    {#if $form.tipo_convocatoria?.value == 1}
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

                    {#if $form.tipo_convocatoria?.value == 1}
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

                    {#if $form.tipo_convocatoria?.value == 1 || $form.tipo_convocatoria?.value == 3}
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

                    {#if $form.tipo_convocatoria?.value == 1 || $form.tipo_convocatoria?.value == 3}
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

                    {#if $form.tipo_convocatoria?.value == 1}
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
                <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                    {#if isSuperAdmin}
                        <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Crear convocatoria</LoadingButton>
                    {/if}
                </div>
            </form>
        </div>
    </div>
</AuthenticatedLayout>

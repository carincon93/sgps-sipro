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
    import SelectMulti from '@/Shared/SelectMulti'

    export let errors
    export let convocatorias
    export let lineasProgramaticas
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
        lineas_programaticas_activas: null,
        visible: false,
        fecha_finalizacion_fase: '',
        hora_finalizacion_fase: '',
        year: '',
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
                        <div class="mt-4">
                            <Label required labelFor="fecha_finalizacion_fase" value="Fecha límite de la fase de formulación" />
                            <input id="fecha_finalizacion_fase" type="date" class="mt-1 p-2" bind:value={$form.fecha_finalizacion_fase} required />
                        </div>
                    </div>
                    {#if errors.fecha_finalizacion_fase}
                        <InputError message={errors.fecha_finalizacion_fase} />
                    {/if}

                    <div>
                        <Label required labelFor="year" value="Año" />
                        <input id="year" type="month" class="mt-1 block w-full p-4" error={errors.year} bind:value={$form.year} required />
                    </div>

                    <div class="mt-4 mb-20">
                        <div class="mt-4">
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

                    <div>
                        <div class="mt-10 mb-20">
                            <Label required labelFor="lineas_programaticas_activas" class="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                            <SelectMulti id="lineas_programaticas_activas" bind:selectedValue={$form.lineas_programaticas_activas} items={lineasProgramaticas} isMulti={true} error={errors.lineas_programaticas_activas} placeholder="Seleccione las líneas programáticas" required />
                        </div>
                    </div>
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

<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'
    import InputError from '@/Shared/InputError'
    import SelectMulti from '@/Shared/SelectMulti'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let convocatoria
    export let tecnoacademias
    export let lineasTecnoacademia
    export let allowedToCreate

    $: $title = 'Crear proyecto Tecnoacademia'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        fecha_inicio: null,
        fecha_finalizacion: null,
        max_meses_ejecucion: 0,
        tecnoacademia_id: null,
        centro_formacion_id: null,
        tecnoacademia_linea_tecnoacademia_id: null,
        linea_programatica: null,
    })

    let arrayLineasTecnoacademia = []
    function selectLineasTecnoacademia(event) {
        arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
            return obj.tecnoacademia_id == event.detail?.value
        })
    }

    let tecnoacademia

    $: if ($form.fecha_inicio && $form.fecha_finalizacion) {
        $form.max_meses_ejecucion = monthDiff($form.fecha_inicio, $form.fecha_finalizacion)
    }

    $: if (tecnoacademia) {
        $form.centro_formacion_id = tecnoacademia.centro_formacion_id
    }

    function submit() {
        if (allowedToCreate) {
            $form.post(route('convocatorias.ta.store', [convocatoria.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.ta.index', [convocatoria.id])} class="text-app-400 hover:text-app-600"> Tecnoacademia </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <form on:submit|preventDefault={submit}>
        <fieldset class="p-8 divide-y">
            <div class="py-24">
                <p class="text-center">Fecha de ejecución</p>
                <small class="text-red-400 block text-center"> * Campo obligatorio </small>
                <InfoMessage message={convocatoria.fecha_maxima_ta} class="my-5" />

                <div class="mt-4 flex items-start justify-around">
                    <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                        <Label labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                        <div class="ml-4">
                            <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_ta} max={convocatoria.max_fecha_finalizacion_proyectos_ta} error={errors.fecha_inicio} bind:value={$form.fecha_inicio} required />
                        </div>
                    </div>
                    <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                        <Label labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                        <div class="ml-4">
                            <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={convocatoria.min_fecha_inicio_proyectos_ta} max={convocatoria.max_fecha_finalizacion_proyectos_ta} error={errors.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                        </div>
                    </div>
                </div>
                {#if errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion}
                    <div class="mb-20 flex justify-center mt-4">
                        <InputError classes="text-center" message={errors.fecha_inicio} />
                        <InputError classes="text-center" message={errors.fecha_finalizacion} />
                        <InputError classes="text-center" message={errors.max_meses_ejecucion} />
                    </div>
                {/if}
            </div>

            {#if tecnoacademias.length > 0}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="tecnoacademia_id" value="Tecnoacademia" />
                        </div>
                        <div>
                            <Select id="tecnoacademia_id" items={tecnoacademias} bind:selectedValue={$form.tecnoacademia_id} selectFunctions={[(event) => selectLineasTecnoacademia(event)]} error={errors.tecnoacademia_id} autocomplete="off" placeholder="Busque por el nombre de la TecnoAcademia" required />
                        </div>
                    </div>
                </div>
            {:else}
                <div class="py-24">
                    <InfoMessage message="Su centro de formación no tiene TecnoAcademias asociadas." alertMsg={true} />
                </div>
            {/if}

            {#if $form.tecnoacademia_id?.value}
                <div class="py-24">
                    <div class="grid grid-cols-2">
                        <div>
                            <Label required class="mb-4" labelFor="tecnoacademia_linea_tecnoacademia_id" value="Líneas temáticas a ejecutar en la vigencia del proyecto:" />
                        </div>
                        <div>
                            <SelectMulti id="tecnoacademia_linea_tecnoacademia_id" bind:selectedValue={$form.tecnoacademia_linea_tecnoacademia_id} items={arrayLineasTecnoacademia} isMulti={true} error={errors.tecnoacademia_linea_tecnoacademia_id} placeholder="Buscar por el nombre de la línea" required />
                        </div>
                    </div>
                </div>
            {/if}
        </fieldset>

        <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
            {#if allowedToCreate}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">
                    {$_('Continue')}
                </LoadingButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>

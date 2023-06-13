<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let lineaInvestigacion
    export let grupoInvestigacion
    export let programasFormacionLineaInvestigacion
    export let programasFormacion

    $: $title = lineaInvestigacion ? lineaInvestigacion.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: lineaInvestigacion.nombre,
        grupo_investigacion_id: lineaInvestigacion.grupo_investigacion_id,
        programas_formacion: programasFormacionLineaInvestigacion.length > 0 ? programasFormacionLineaInvestigacion : null,
    })

    function submit() {
        if (lineaInvestigacion.allowed.to_update) {
            $form.put(route('grupos-investigacion.lineas-investigacion.update', [grupoInvestigacion.id, lineaInvestigacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('grupos-investigacion.index')} class="text-app-400 hover:text-app-600"> Grupos de investigación </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('grupos-investigacion.edit', grupoInvestigacion.id)} class="text-app-400 hover:text-app-600"> {grupoInvestigacion.nombre} </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('grupos-investigacion.lineas-investigacion.index', grupoInvestigacion.id)} class="text-app-400 hover:text-app-600"> Líneas de investigación </a>
                    <span class="text-app-400 font-medium">/</span>
                    {lineaInvestigacion.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar línea de investigación</h1>
        </div>

        <div class="col-span-2">
            <h1 class="font-black text-4xl uppercase">{lineaInvestigacion.nombre}</h1>

            <Form {submit} {form} {errors} {programasFormacion} {lineaInvestigacion} />
        </div>
    </div>
</AuthenticatedLayout>

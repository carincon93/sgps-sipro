<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let participacionGrupoInvestigacionSena
    export let gruposInvestigacion
    export let semillerosInvestigacion

    $: $title = 'Editar participación'

    let form = useForm({
        pertenece_grupo_investigacion_centro: participacionGrupoInvestigacionSena.pertenece_grupo_investigacion_centro,
        pertenece_semillero_investigacion_centro: participacionGrupoInvestigacionSena.pertenece_semillero_investigacion_centro,
        grupo_investigacion_id: participacionGrupoInvestigacionSena.grupo_investigacion_id,
        semillero_investigacion_id: participacionGrupoInvestigacionSena.semillero_investigacion_id,
    })

    function submit() {
        $form.put(route('participaciones-grupos-investigacion-sena.update', participacionGrupoInvestigacionSena.id), {
            preserveScroll: true,
        })
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('users.change-user-profile')} class="text-app-400 hover:text-app-600"> Perfil </a>
                    <span class="text-app-400 font-medium">/</span>
                    Editar participación
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar participación</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {participacionGrupoInvestigacionSena} {form} {submit} {gruposInvestigacion} {semillerosInvestigacion} />
        </div>
    </div>
</AuthenticatedLayout>

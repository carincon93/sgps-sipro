<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let gruposInvestigacion
    export let semillerosInvestigacion

    $: $title = 'Agregar participación participación'

    let form = useForm({
        pertenece_grupo_investigacion_centro: false,
        pertenece_semillero_investigacion_centro: false,
        grupo_investigacion_id: null,
        semillero_investigacion_id: null,
    })

    function submit() {
        $form.post(route('participaciones-grupos-investigacion-sena.store'))
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('users.change-user-profile')} class="text-app-400 hover:text-app-600"> Perfil </a>
                    <span class="text-app-400 font-medium">/</span>
                    Agregar participación
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Agregar participación</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {form} {submit} {gruposInvestigacion} {semillerosInvestigacion} />
        </div>
    </div>
</AuthenticatedLayout>

<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let centroFormacion
    export let regionales
    export let subdirectores
    export let dinamizadoresSennova

    $: $title = centroFormacion ? centroFormacion.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: centroFormacion.nombre,
        codigo: centroFormacion.codigo,
        regional_id: centroFormacion.regional_id,
        subdirector_id: centroFormacion.subdirector_id,
        dinamizador_sennova_id: centroFormacion.dinamizador_sennova_id,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('centros-formacion.update', centroFormacion.id), {
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
                    <a use:inertia href={route('centros-formacion.index')} class="text-app-400 hover:text-app-600"> Centros de formación </a>
                    <span class="text-app-400 font-medium">/</span>
                    {centroFormacion.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar centro de formación</h1>
        </div>

        <div class="col-span-2">
            <h1 class="font-black text-4xl uppercase">{centroFormacion.nombre}</h1>

            <Form {submit} {form} {errors} {regionales} {subdirectores} {centroFormacion} {dinamizadoresSennova} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>

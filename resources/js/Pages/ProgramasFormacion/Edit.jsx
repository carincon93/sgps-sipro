<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let programaFormacion
    export let centrosFormacion
    export let modalidades
    export let nivelesFormacion

    $: $title = programaFormacion ? programaFormacion.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: programaFormacion.nombre,
        codigo: programaFormacion.codigo,
        modalidad: programaFormacion.modalidad,
        nivel_formacion: programaFormacion.nivel_formacion,
        registro_calificado: programaFormacion.registro_calificado,
        centro_formacion_id: programaFormacion.centro_formacion_id,
    })

    function submit() {
        if (programaFormacion.allowed.to_update) {
            $form.put(route('programas-formacion.update', programaFormacion.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('programas-formacion.index')} className="text-app-400 hover:text-app-600"> Programas de formación </a>
                    <span className="text-app-400 font-medium">/</span>
                    {programaFormacion.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar programa de formación</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {form} {submit} {programaFormacion} {centrosFormacion} {modalidades} {nivelesFormacion} />
        </div>
    </div>
</AuthenticatedLayout>

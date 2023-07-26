<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let tecnoacademia
    export let lineasTecnoacademia
    export let modalidades
    export let lineasTecnoacademiaRelacionadas
    export let centrosFormacion

    $: $title = tecnoacademia ? tecnoacademia.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: tecnoacademia.nombre,
        modalidad: tecnoacademia.modalidad,
        centro_formacion_id: tecnoacademia.centro_formacion_id,
        fecha_creacion: tecnoacademia.fecha_creacion,
        foco: tecnoacademia.foco,
        linea_tecnoacademia_id: lineasTecnoacademiaRelacionadas,
    })

    function submit() {
        if (is_super_admin || checkRole(auth_user, [5])) {
            $form.put(route('tecnoacademias.update', tecnoacademia.id), {
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
                    <a use:inertia href={route('tecnoacademias.index')} className="text-app-400 hover:text-app-600"> Tecnoacademias </a>
                    <span className="text-app-400 font-medium">/</span>
                    {tecnoacademia.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar Tecnoacademia</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {tecnoacademia} {lineasTecnoacademia} {modalidades} {centrosFormacion} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>

<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let proyectoIdiTecnoacademia
    export let tiposProductos
    export let estadosProductos

    $: $title = 'Crear producto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        descripcion: '',
        tipo_productos_linea_66_id: null,
        estado: null,
        soporte: null,
        link: '',
        lugar: '',
        fecha_realizacion: '',
    })

    function submit() {
        if (is_super_admin || checkRole(auth_user, [5, 10, 12, 22])) {
            $form.post(route('proyectos-idi-tecnoacademia.productos.store', [proyectoIdiTecnoacademia.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} className="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.edit', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600">Información básica</a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.participantes.index', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600">Participantes</a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600 font-extrabold underline">Productos</a>
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo producto</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyectoIdiTecnoacademia} {tiposProductos} {estadosProductos} {form} {submit} method="store" />
        </div>
    </div>
</AuthenticatedLayout>

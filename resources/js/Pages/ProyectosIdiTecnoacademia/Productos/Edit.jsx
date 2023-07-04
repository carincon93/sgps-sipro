<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let proyectoIdiTecnoacademia
    export let producto
    export let tiposProductos
    export let estadosProductos

    $: $title = 'Editar producto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        descripcion: producto.descripcion,
        tipo_producto_idi_id: producto.tipo_producto_idi_id,
        estado: producto.estado,
        soporte: producto.soporte,
        link: producto.link,
        lugar: producto.lugar,
        fecha_realizacion: producto.fecha_realizacion,
    })

    function submit() {
        if (proyectoIdiTecnoacademia.allowed.to_update) {
            $form.post(route('proyectos-idi-tecnoacademia.productos.update', [proyectoIdiTecnoacademia.id, producto.id]), {
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
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} class="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.edit', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600">Información básica</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.participantes.index', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600">Participantes</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600 font-extrabold underline">Productos</a>
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar producto</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyectoIdiTecnoacademia} {producto} {tiposProductos} {estadosProductos} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>

<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let estadosInventarioEquipos

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    $: $title = 'Crear inventario de equipos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: '',
        marca: '',
        serial: '',
        codigo_interno: '',
        fecha_adquisicion: '',
        estado: '',
        uso_st: null,
        uso_otra_dependencia: null,
        dependencia: '',
        descripcion: '',
        mantenimiento_prox_year: null,
        calibracion_prox_year: null,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.inventario-equipos.store', [convocatoria.id, proyecto.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.proyectos.inventario-equipos.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600">Inventario de equipos</a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo inventario</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {estadosInventarioEquipos} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>

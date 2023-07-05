<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let producto
    export let resultados
    export let actividadesRelacionadas
    export let subtipologiasMinciencias
    export let tiposProducto

    $: $title = producto ? producto.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: producto.nombre,
        resultado_id: producto.resultado_id,
        fecha_inicio: producto.fecha_inicio,
        fecha_finalizacion: producto.fecha_finalizacion,
        indicador: producto.indicador,
        medio_verificacion: producto.producto_ta_tp ? producto.producto_ta_tp?.medio_verificacion : producto.producto_servicio_tecnologico ? producto.producto_servicio_tecnologico?.medio_verificacion : '',

        nombre_indicador: producto.producto_servicio_tecnologico?.nombre_indicador,
        formula_indicador: producto.producto_servicio_tecnologico?.formula_indicador,
        meta_indicador: producto.producto_servicio_tecnologico?.meta_indicador,

        tipo: producto.producto_idi ? producto.producto_idi.tipo : producto.producto_cultura_innovacion?.tipo,
        subtipologia_minciencias_id: producto.producto_idi ? producto.producto_idi?.subtipologia_minciencias_id : producto.producto_cultura_innovacion?.subtipologia_minciencias_id,

        valor_proyectado: producto.producto_ta_tp ? producto.producto_ta_tp?.valor_proyectado : '',
        tatp_servicio_tecnologico: proyecto.ta || proyecto.tp || proyecto.servicio_tecnologico ? true : false,
        actividad_id: actividadesRelacionadas,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.productos.update', [convocatoria.id, proyecto.id, producto.id]), {
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
                    <a use:inertia href={route('convocatorias.proyectos.productos.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600"> Productos </a>
                    <span className="text-app-400 font-medium">/</span>
                    {producto.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar producto</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {producto} {resultados} {subtipologiasMinciencias} {tiposProducto} {form} {submit} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>

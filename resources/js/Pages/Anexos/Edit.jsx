<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let anexo
    export let lineasProgramaticas
    export let convocatorias
    export let anexoLineasProgramaticas
    export let convocatoriaAnexos

    $: $title = anexo ? anexo.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        nombre: anexo.nombre,
        descripcion: anexo.descripcion,
        obligatorio: anexo.obligatorio,
        habilitado: anexo.habilitado,
        convocatoria_id: convocatoriaAnexos?.length > 0 ? convocatoriaAnexos : null,

        linea_programatica_id: anexoLineasProgramaticas,
        archivo: null,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.post(route('anexos.update', anexo.id), {
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
                    <a use:inertia href={route('anexos.index')} className="text-app-400 hover:text-app-600"> Anexos </a>
                    <span className="text-app-400 font-medium">/</span>
                    {anexo.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Editar anexo</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <Form {form} {submit} {errors} {anexo} {lineasProgramaticas} {isSuperAdmin} {convocatorias} />
        </div>
    </div>
</AuthenticatedLayout>

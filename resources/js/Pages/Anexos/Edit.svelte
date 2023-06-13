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
    let authUser = $page.props.auth.user
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
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('anexos.index')} class="text-app-400 hover:text-app-600"> Anexos </a>
                    <span class="text-app-400 font-medium">/</span>
                    {anexo.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3">
        <div>
            <h1 class="font-black text-4xl sticky top-0 uppercase">Editar anexo</h1>
        </div>
        <div class="bg-white rounded shadow col-span-2">
            <Form {form} {submit} {errors} {anexo} {lineasProgramaticas} {isSuperAdmin} {convocatorias} />
        </div>
    </div>
</AuthenticatedLayout>

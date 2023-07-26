<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'
    import Input from '@/Components/Input'

    export let convocatoria
    export let evaluacion
    export let edt
    export let tiposEvento
    export let proyectoPresupuesto

    $: $title = 'EDT'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let edtInfo = {
        tipo_evento: edt.tipo_evento,
        descripcion_evento: edt.descripcion_evento,
        descripcion_participacion_entidad: edt.descripcion_participacion_entidad,
        publico_objetivo: edt.publico_objetivo,
        numero_asistentes: edt.numero_asistentes,
        estrategia_comunicacion: edt.estrategia_comunicacion,
        proyecto_presupuesto_id: edt.proyecto_presupuesto_id,
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.edt', [convocatoria.id, evaluacion.id])} className="text-app-400 hover:text-app-600">EDT</a>
                    <span className="text-app-400 font-medium">/</span>
                    Editar
                </h1>
            </div>
        </div>
    </header>

    <div className="bg-white rounded shadow max-w-3xl">
        <form className="p-8">
            <div className="mt-4">
                <Label className="mb-4" labelFor="proyecto_presupuesto_id" value="Presupuesto" />
                <Select disabled={true} id="proyecto_presupuesto_id" items={proyectoPresupuesto} bind:selectedValue={edtInfo.proyecto_presupuesto_id} autocomplete="off" placeholder="Seleccione el presupuesto" />
            </div>
            <div className="mt-4">
                <Label className="mb-4" labelFor="tipo_evento" value="Tipo de evento" />
                <Select disabled={true} id="tipo_evento" items={tiposEvento} bind:selectedValue={edtInfo.tipo_evento} autocomplete="off" placeholder="Seleccione el tipo de evento" />
            </div>

            <div className="mt-8">
                <Textarea disabled label="Descripción del evento" maxlength="40000" id="descripcion_evento" bind:value={edtInfo.descripcion_evento} />
            </div>

            <div className="mt-8">
                <Textarea disabled label="Descripción de participación de la entidad" maxlength="40000" id="descripcion_participacion_entidad" bind:value={edtInfo.descripcion_participacion_entidad} />
            </div>

            <div className="mt-8">
                <Input disabled label="Público objetivo" id="publico_objetivo" type="text" className="mt-1" bind:value={edtInfo.publico_objetivo} />
            </div>

            <div className="mt-8">
                <Input disabled label="Número de asistentes" id="numero_asistentes" type="number" input$min="0" input$max="9999" className="mt-1" placeholder="Escriba el número de asistentes" bind:value={edtInfo.numero_asistentes} />
            </div>

            <div className="mt-8">
                <Input disabled label="Estrategia de comunicación" id="estrategia_comunicacion" type="text" className="mt-1" bind:value={edtInfo.estrategia_comunicacion} />
            </div>
            <div className="flex items-center justify-between mt-14 px-8 py-4" />
        </form>
    </div>
</AuthenticatedLayout>

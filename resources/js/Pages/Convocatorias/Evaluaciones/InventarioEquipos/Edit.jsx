<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'

    export let convocatoria
    export let evaluacion
    export let inventarioEquipo
    export let estadosInventarioEquipos

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    $: $title = inventarioEquipo ? inventarioEquipo.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let inventarioEquiposInfo = {
        nombre: inventarioEquipo.nombre,
        marca: inventarioEquipo.marca,
        serial: inventarioEquipo.serial,
        codigo_interno: inventarioEquipo.codigo_interno,
        fecha_adquisicion: inventarioEquipo.fecha_adquisicion,
        estado: inventarioEquipo.estado,
        uso_st: inventarioEquipo.uso_st,
        uso_otra_dependencia: inventarioEquipo.uso_otra_dependencia,
        dependencia: inventarioEquipo.dependencia,
        descripcion: inventarioEquipo.descripcion,
        mantenimiento_prox_year: inventarioEquipo.mantenimiento_prox_year,
        calibracion_prox_year: inventarioEquipo.calibracion_prox_year,
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.inventario-equipos', [convocatoria.id, evaluacion.id])} className="text-app-400 hover:text-app-600">Inventario de equipos</a>
                    <span className="text-app-400 font-medium">/</span>
                    Editar
                </h1>
            </div>
        </div>
    </header>

    <div className="bg-white rounded shadow max-w-3xl">
        <form className="p-8">
            <div className="mt-8">
                <Textarea label="Nombre del equipamiento" maxlength="255" id="nombre" bind:value={inventarioEquiposInfo.nombre} />
            </div>

            <div className="mt-8">
                <Textarea label="Marca" maxlength="255" id="marca" bind:value={inventarioEquiposInfo.marca} />
            </div>

            <div className="mt-8">
                <Textarea label="Serial" maxlength="255" id="serial" bind:value={inventarioEquiposInfo.serial} />
            </div>

            <div className="mt-8">
                <Textarea label="Código interno" maxlength="255" id="codigo_interno" bind:value={inventarioEquiposInfo.codigo_interno} />
            </div>

            <div className="mt-8">
                <Label labelFor="fecha_adquisicion" value="Fecha de adquisición" />
                <input id="fecha_adquisicion" type="date" className="mt-1 block w-full p-4" bind:value={inventarioEquiposInfo.fecha_adquisicion} />
            </div>

            <div className="mt-4">
                <Label className="mb-4" labelFor="estado" value="Estado" />
                <Select id="estado" items={estadosInventarioEquipos} bind:selectedValue={inventarioEquiposInfo.estado} autocomplete="off" placeholder="Seleccione el estado del equipo" />
            </div>

            <div className="mt-4">
                <Label className="mb-4" labelFor="uso_st" value="¿Uso exclusivo de Servicios tecnológicos?" />
                <Select id="uso_st" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.uso_st} autocomplete="off" placeholder="Seleccione una opción" />
            </div>

            <div className="mt-4">
                <Label className="mb-4" labelFor="uso_otra_dependencia" value="¿Otra dependencia que usa el equipo?" />
                <Select id="uso_otra_dependencia" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.uso_otra_dependencia} autocomplete="off" placeholder="Seleccione una opción" />
            </div>

            {#if inventarioEquiposInfo.uso_otra_dependencia?.value == 1}
                <div className="mt-8">
                    <Textarea label="Dependencia" maxlength="255" id="dependencia" bind:value={inventarioEquiposInfo.dependencia} />
                </div>
            {/if}

            <div className="mt-8">
                <Label className="mb-4" labelFor="descripcion" value="Descripción del equipo (Detalle con qué metodología del proyecto está relacionado este equipamiento)" />
                <Textarea maxlength="10000" id="descripcion" bind:value={inventarioEquiposInfo.descripcion} />
            </div>

            <div className="mt-4">
                <Label className="mb-4" labelFor="mantenimiento_prox_year" value="¿Para el próximo año el equipo necesita mantenimiento?" />
                <Select id="mantenimiento_prox_year" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.mantenimiento_prox_year} autocomplete="off" placeholder="Seleccione una opción" />
            </div>

            <div className="mt-4">
                <Label className="mb-4" labelFor="calibracion_prox_year" value="¿Para el próximo año el equipo necesita calibración?" />
                <Select id="calibracion_prox_year" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.calibracion_prox_year} autocomplete="off" placeholder="Seleccione una opción" />
            </div>
            <div className="flex items-center justify-between mt-14 px-8 py-4" />
        </form>
    </div>
</AuthenticatedLayout>

<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'

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
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

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
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.inventario-equipos', [convocatoria.id, evaluacion.id])} class="text-app-400 hover:text-app-600">Inventario de equipos</a>
                    <span class="text-app-400 font-medium">/</span>
                    Editar
                </h1>
            </div>
        </div>
    </header>

    <div class="bg-white rounded shadow max-w-3xl">
        <form class="p-8">
            <div class="mt-8">
                <Textarea label="Nombre del equipamiento" maxlength="255" id="nombre" bind:value={inventarioEquiposInfo.nombre} />
            </div>

            <div class="mt-8">
                <Textarea label="Marca" maxlength="255" id="marca" bind:value={inventarioEquiposInfo.marca} />
            </div>

            <div class="mt-8">
                <Textarea label="Serial" maxlength="255" id="serial" bind:value={inventarioEquiposInfo.serial} />
            </div>

            <div class="mt-8">
                <Textarea label="Código interno" maxlength="255" id="codigo_interno" bind:value={inventarioEquiposInfo.codigo_interno} />
            </div>

            <div class="mt-8">
                <Label labelFor="fecha_adquisicion" value="Fecha de adquisición" />
                <input id="fecha_adquisicion" type="date" class="mt-1 block w-full p-4" bind:value={inventarioEquiposInfo.fecha_adquisicion} />
            </div>

            <div class="mt-4">
                <Label class="mb-4" labelFor="estado" value="Estado" />
                <Select id="estado" items={estadosInventarioEquipos} bind:selectedValue={inventarioEquiposInfo.estado} autocomplete="off" placeholder="Seleccione el estado del equipo" />
            </div>

            <div class="mt-4">
                <Label class="mb-4" labelFor="uso_st" value="¿Uso exclusivo de Servicios tecnológicos?" />
                <Select id="uso_st" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.uso_st} autocomplete="off" placeholder="Seleccione una opción" />
            </div>

            <div class="mt-4">
                <Label class="mb-4" labelFor="uso_otra_dependencia" value="¿Otra dependencia que usa el equipo?" />
                <Select id="uso_otra_dependencia" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.uso_otra_dependencia} autocomplete="off" placeholder="Seleccione una opción" />
            </div>

            {#if inventarioEquiposInfo.uso_otra_dependencia?.value == 1}
                <div class="mt-8">
                    <Textarea label="Dependencia" maxlength="255" id="dependencia" bind:value={inventarioEquiposInfo.dependencia} />
                </div>
            {/if}

            <div class="mt-8">
                <Label class="mb-4" labelFor="descripcion" value="Descripción del equipo (Detalle con qué metodología del proyecto está relacionado este equipamiento)" />
                <Textarea maxlength="10000" id="descripcion" bind:value={inventarioEquiposInfo.descripcion} />
            </div>

            <div class="mt-4">
                <Label class="mb-4" labelFor="mantenimiento_prox_year" value="¿Para el próximo año el equipo necesita mantenimiento?" />
                <Select id="mantenimiento_prox_year" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.mantenimiento_prox_year} autocomplete="off" placeholder="Seleccione una opción" />
            </div>

            <div class="mt-4">
                <Label class="mb-4" labelFor="calibracion_prox_year" value="¿Para el próximo año el equipo necesita calibración?" />
                <Select id="calibracion_prox_year" items={opcionesSiNo} bind:selectedValue={inventarioEquiposInfo.calibracion_prox_year} autocomplete="off" placeholder="Seleccione una opción" />
            </div>
            <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky" />
        </form>
    </div>
</AuthenticatedLayout>

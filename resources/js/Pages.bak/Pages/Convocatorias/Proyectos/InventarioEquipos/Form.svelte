<script>
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'

    export let errors
    export let proyecto
    export let inventarioEquipo
    export let estadosInventarioEquipos
    export let form
    export let submit

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <div class="mt-8">
            <Textarea label="Nombre del equipamiento" maxlength="255" id="nombre" error={errors.nombre} bind:value={$form.nombre} required />
        </div>

        <div class="mt-8">
            <Textarea label="Marca" maxlength="255" id="marca" error={errors.marca} bind:value={$form.marca} required />
        </div>

        <div class="mt-8">
            <Textarea label="Serial" maxlength="255" id="serial" error={errors.serial} bind:value={$form.serial} required />
        </div>

        <div class="mt-8">
            <Textarea label="Código interno" maxlength="255" id="codigo_interno" error={errors.codigo_interno} bind:value={$form.codigo_interno} required />
        </div>

        <div class="mt-8">
            <Label labelFor="fecha_adquisicion" value="Fecha de adquisición" />
            <input id="fecha_adquisicion" type="date" class="mt-1 block w-full p-4" error={errors.fecha_adquisicion} bind:value={$form.fecha_adquisicion} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="estado" value="Estado" />
            <Select id="estado" items={estadosInventarioEquipos} bind:selectedValue={$form.estado} error={errors.estado} autocomplete="off" placeholder="Seleccione el estado del equipo" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="uso_st" value="¿Uso exclusivo de Servicios tecnológicos?" />
            <Select id="uso_st" items={opcionesSiNo} bind:selectedValue={$form.uso_st} error={errors.uso_st} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="uso_otra_dependencia" value="¿Otra dependencia que usa el equipo?" />
            <Select id="uso_otra_dependencia" items={opcionesSiNo} bind:selectedValue={$form.uso_otra_dependencia} error={errors.uso_otra_dependencia} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        {#if $form.uso_otra_dependencia?.value == 1}
            <div class="mt-8">
                <Textarea label="Dependencia" maxlength="255" id="dependencia" error={errors.dependencia} bind:value={$form.dependencia} required />
            </div>
        {/if}

        <div class="mt-8">
            <Label required class="mb-4" labelFor="descripcion" value="Descripción del equipo (Detalle con qué metodología del proyecto está relacionado este equipamiento)" />
            <Textarea maxlength="10000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="mantenimiento_prox_year" value="¿Para el próximo año el equipo necesita mantenimiento?" />
            <Select id="mantenimiento_prox_year" items={opcionesSiNo} bind:selectedValue={$form.mantenimiento_prox_year} error={errors.mantenimiento_prox_year} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="calibracion_prox_year" value="¿Para el próximo año el equipo necesita calibración?" />
            <Select id="calibracion_prox_year" items={opcionesSiNo} bind:selectedValue={$form.calibracion_prox_year} error={errors.calibracion_prox_year} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if inventarioEquipo}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {inventarioEquipo.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>

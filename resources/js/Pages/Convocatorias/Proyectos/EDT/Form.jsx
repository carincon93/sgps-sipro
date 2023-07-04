<script>
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'
    import Input from '@/Components/Input'

    export let errors
    export let proyecto
    export let edt
    export let tiposEvento
    export let proyectoPresupuesto
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="nombre_evento" value="Nombre del evento" />

            <Input id="nombre_evento" type="text" className="mt-1" error={errors.nombre_evento} bind:value={$form.nombre_evento} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="organizador" value="Organizador" />

            <Input id="organizador" type="text" className="mt-1" error={errors.organizador} bind:value={$form.organizador} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="fecha_evento" value="Fecha probable del evento" />

            <input id="fecha_evento" type="date" className="mt-1 block w-full p-4" bind:value={$form.fecha_evento} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="proyecto_presupuesto_id" value="Presupuesto" />
            <Select id="proyecto_presupuesto_id" items={proyectoPresupuesto} bind:selectedValue={$form.proyecto_presupuesto_id} error={errors.proyecto_presupuesto_id} autocomplete="off" placeholder="Seleccione el presupuesto" required />
        </div>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="tipo_evento" value="Tipo de evento" />
            <Select id="tipo_evento" items={tiposEvento} bind:selectedValue={$form.tipo_evento} error={errors.tipo_evento} autocomplete="off" placeholder="Seleccione el tipo de evento" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="descripcion_evento" value="Descripción del evento" />
            <Textarea maxlength="40000" id="descripcion_evento" error={errors.descripcion_evento} bind:value={$form.descripcion_evento} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="descripcion_participacion_entidad" value="Descripción de participación de la entidad" />

            <Textarea maxlength="40000" id="descripcion_participacion_entidad" error={errors.descripcion_participacion_entidad} bind:value={$form.descripcion_participacion_entidad} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="publico_objetivo" value="Público objetivo" />

            <Input id="publico_objetivo" type="text" className="mt-1" error={errors.publico_objetivo} bind:value={$form.publico_objetivo} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="numero_asistentes" value="Número de asistentes" />

            <Input id="numero_asistentes" type="number" input$min="0" input$max="9999" className="mt-1" error={errors.numero_asistentes} placeholder="Escriba el número de asistentes" bind:value={$form.numero_asistentes} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="estrategia_comunicacion" value="Estrategia de comunicación" />

            <Input id="estrategia_comunicacion" type="text" className="mt-1" error={errors.estrategia_comunicacion} bind:value={$form.estrategia_comunicacion} required />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if edt}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {edt.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>

<script>
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Select from '@/Components/Select'
    import Input from '@/Components/Input'
    import File from '@/Components/File'
    import Label from '@/Components/Label'
    import { route } from '@/Utils'

    export let errors
    export let proyectoIdiTecnoacademia
    export let producto
    export let tiposProductos
    export let estadosProductos
    export let form
    export let submit
    export let method

    let mensajeDescripcion = ''
    let mensajeLink = ''
    let mensajeFecha = ''
    $: if ($form.tipo_productos_linea_66_id?.value == 2) {
        mensajeLink = 'Link de consulta'
    }
    $: if ($form.tipo_productos_linea_66_id?.value == 6) {
        mensajeFecha = 'Fecha de realización'
    } else {
        mensajeFecha = 'Fecha'
    }

    $: if ($form.tipo_productos_linea_66_id?.value == 8) {
        mensajeFecha = 'Fecha de publicación'
    } else {
        mensajeFecha = 'Fecha'
    }
    $: if ($form.tipo_productos_linea_66_id?.value == 1 || $form.tipo_productos_linea_66_id?.value == 2) {
        mensajeDescripcion = 'Referencia bibliográfica (NA Si no aplica)'
    } else if ($form.tipo_productos_linea_66_id?.value == 4) {
        mensajeDescripcion = 'Productos tecnológicos (NA Si no aplica)'
    } else if ($form.tipo_productos_linea_66_id?.value == 6) {
        mensajeDescripcion = 'Espacio o evento de participación cuidadana (NA Si no aplica)'
    } else if ($form.tipo_productos_linea_66_id?.value == 7) {
        mensajeDescripcion = 'Programa/Estrategia pedagógica de fomento a la CTI (NA Si no aplica)'
    } else if ($form.tipo_productos_linea_66_id?.value == 8) {
        mensajeDescripcion = 'Estrategias de comunicación del conocimiento, generación de contenidos impresos, multimedia y virtuales (NA Si no aplica)'
    } else if ($form.tipo_productos_linea_66_id?.value == 9) {
        mensajeDescripcion = 'Eventos científicos y participación en redes de conocimiento (NA Si no aplica) Incluir organizador y persona (s) representante(s)'
    }
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyectoIdiTecnoacademia.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Select id="tipo_productos_linea_66_id" items={tiposProductos} bind:selectedValue={$form.tipo_productos_linea_66_id} error={errors.tipo_productos_linea_66_id} autocomplete="off" placeholder="Seleccione un tipo" required />
        </div>
        <div className="mt-8">
            <Select id="estado" items={estadosProductos} bind:selectedValue={$form.estado} error={errors.estado} autocomplete="off" placeholder="Seleccione un estado" required />
        </div>
        <div className="mt-8">
            <Label className="mb-4" value={mensajeDescripcion} />
            <Textarea label="Descripción del producto" maxlength="255" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>
        {#if $form.tipo_productos_linea_66_id?.value == 2 || $form.tipo_productos_linea_66_id?.value == 8}
            <div className="mt-8">
                <Label className="mb-4" value={mensajeLink} />
                <Input label="Link" id="link" type="url" className="mt-1" error={errors.link} placeholder="Ejemplo: https://dominio.co" bind:value={$form.link} />
            </div>
        {/if}
        <div className="mt-8">
            <Label className="mb-4" labelFor="soporte" value="Soporte" />
            <File id="soporte" maxSize="10000" bind:value={$form.soporte} valueDb={producto?.soporte} error={errors.soporte} route={producto?.soporte?.includes('http') || method == 'store' ? null : route('proyectos-idi-tecnoacademia.productos.download-file-sharepoint', [proyectoIdiTecnoacademia, producto, 'soporte'])} />
        </div>
        {#if $form.tipo_productos_linea_66_id?.value == 1 || $form.tipo_productos_linea_66_id?.value == 6 || $form.tipo_productos_linea_66_id?.value == 8 || $form.tipo_productos_linea_66_id?.value == 9}
            <div className="mt-8">
                <Label labelFor="fecha_realizacion" value={mensajeFecha} />
                <div>
                    <input id="fecha_realizacion" type="date" className="mt-1 block w-full p-4" bind:value={$form.fecha_realizacion} />
                </div>
            </div>
        {/if}
        {#if $form.tipo_productos_linea_66_id?.value == 6 || $form.tipo_productos_linea_66_id?.value == 8 || $form.tipo_productos_linea_66_id?.value == 9}
            <div className="mt-8">
                <Input label="Lugar" id="lugar" type="text" className="mt-1" error={errors.lugar} bind:value={$form.lugar} />
            </div>
        {/if}
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if producto}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {producto?.updated_at}
            </small>
        {/if}
        {#if proyectoIdiTecnoacademia.allowed.to_update}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>

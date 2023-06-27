<script>
    import Label from '@/Shared/Label'
    import InputError from '@/Shared/InputError'
    import InfoMessage from '@/Shared/InfoMessage'

    export let id
    export let value
    export let valueDb = null
    export let label
    export let error
    export let maxSize
    export let route
    export let change

    let input
    let size

    let ruta = ''

    $: {
        ruta = valueDb?.name ? route : valueDb?.includes('/sites/gruposennova') ? route : valueDb
    }

    export const focus = () => input.focus()
    export const select = () => input.select()

    $: props = {
        ...$$restProps,
        class: `w-full border-gray-300 focus:border-app-300 focus:ring focus:ring-app-200 focus:ring-opacity-50 rounded-md shadow-sm ${$$restProps.class || ''}`,
    }

    function update(event) {
        value = event.target.files[0]
    }

    $: if (value?.size) size = value?.size / 1e6

    $: size > maxSize / 1000 ? (error = `El archivo pesa más de ${maxSize / 1000} MB. Por favor optimice el tamaño.`) : (error = null)
</script>

<div class={$$restProps.class}>
    <Label required={$$restProps.required ? 'required' : undefined} {label} {id} />

    <div class={$$restProps.class && ruta == '' ? $$restProps.class : 'gap-4 grid grid-cols-3'}>
        <div class="col-span-2">
            <input
                {...props}
                type="file"
                class="w-full bg-white p-2 border rounded-md"
                {id}
                on:change={(event) => {
                    update(event), change?.map((item) => item(event))
                }}
                required={$$restProps.required ? 'required' : undefined}
            />
            {#if maxSize}
                <InfoMessage>
                    El archivo debe pesar máximo {maxSize / 1000} MB.
                    {#if value?.size}
                        El peso del archivo seleccionado es: {size.toFixed(2)} MB
                    {/if}
                </InfoMessage>
            {/if}
            {#if error}
                <InputError message={error} />
            {/if}
        </div>

        {#if ruta}
            <a href={ruta} target="_blank" class="flex flex-col items-center justify-center hover:bg-app-100 bg-app-200 delay-100 text-app-500 p-2 rounded shadow-lg mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 mr-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />
                </svg>
                Descargar archivo cargado previamente
            </a>
        {/if}
    </div>
</div>

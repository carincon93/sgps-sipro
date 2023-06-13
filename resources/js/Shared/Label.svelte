<script>
    export let labelFor
    export let value
    export let required

    $: props = {
        ...$$restProps,
        class: `block text-sm text-gray-700 ${$$restProps.class || ''}`,
    }
</script>

{#if value}
    <label {...props} for={labelFor}>
        {@html value}
        {!required ? '(Opcional)' : ''}
        {#if required}
            <small>*</small>
        {/if}
    </label>
{/if}

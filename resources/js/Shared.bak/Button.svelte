<script>
    import Button, { Label } from '@smui/button'

    export let variant = 'raised'
    export let href
    export let labelClass
    export let style

    $: props = {
        ...$$restProps,
        class: `${$$restProps.class || ''}`,
    }
</script>

<Button {...props} {href} {variant} {style} height="100px" action={null} on:click>
    <Label class={labelClass}>
        <slot />
    </Label>
</Button>

<style>
    :global(.mdc-button) {
        height: auto;
        min-height: 36px;
    }
</style>

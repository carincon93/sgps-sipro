<script>
    import { onMount } from 'svelte'
    import { createPopper } from '@popperjs/core'

    export let placement = 'right'

    let container

    $: props = {
        ...$$restProps,
        class: `p-2 ${$$restProps.class || ''}`,
    }

    onMount(() => {
        const popcorn = container.querySelector('div[aria-describedby="tooltip"]')
        const tooltip = container.querySelector('div[role="tooltip"]')
        const arrow = container.querySelector('div[data-popper-arrow]')

        createPopper(popcorn, tooltip, {
            placement: placement,
            modifiers: [
                {
                    name: 'arrow',
                    options: {
                        element: arrow,
                    },
                },
            ],
        })
    })
</script>

<div bind:this={container}>
    <div aria-describedby="tooltip" />
    <div role="tooltip" data-popper-placement {...props}>
        <slot />
        <div data-popper-arrow />
    </div>
</div>

<style>
    [role='tooltip'] {
        display: inline-block;
        border-radius: 4px;
        --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }

    [data-popper-arrow],
    [data-popper-arrow]::before {
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    }

    [data-popper-arrow] {
        visibility: hidden;
    }

    [data-popper-arrow]::before {
        visibility: visible;
        content: '';
        transform: rotate(45deg);
    }
</style>

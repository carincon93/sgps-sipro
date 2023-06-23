<script>
    import { createPopper } from '@popperjs/core'
    import { onMount, onDestroy } from 'svelte'

    export let label = 'Información'
    let tooltipVisible = false
    let tooltipInstance = null

    $: props = {
        ...$$restProps,
        class: `z-10 relative ${$$restProps.class || ''}`,
    }

    const showTooltip = () => {
        tooltipVisible = true
    }

    const hideTooltip = () => {
        tooltipVisible = false
    }

    onMount(() => {
        const target = document.getElementById('targetElement')
        const tooltip = document.getElementById('tooltipElement')

        tooltipInstance = createPopper(target, tooltip, {
            placement: 'top',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 10], // Adjust the offset as per your design
                    },
                },
            ],
        })
    })

    onDestroy(() => {
        tooltipInstance.destroy()
    })
</script>

<div {...props}>
    <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-app-500" on:mouseenter={showTooltip} on:mouseleave={hideTooltip}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span class="ml-2 text-app-500" id="targetElement" on:mouseenter={showTooltip} on:mouseleave={hideTooltip}>{label}</span>
    </div>

    <div id="tooltipElement" class="tooltip p-2 bg-white rounded inline-block" style="position: absolute; z-index: 999; visibility: {tooltipVisible ? 'visible' : 'hidden'}" role="tooltip">
        <slot />
    </div>
</div>

<style>
    #tooltipElement {
        color: #313131;
        font-size: 12px;
    }
</style>

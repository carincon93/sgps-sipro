<script>
    $: props = {
        ...$$restProps,
        class: `bg-zinc-900 flex items-center justify-center px-4 py-2 rounded shadow text-white w-1/4 ${$$restProps.class || ''}`,
    }
</script>

<div>
    <span {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h1 class="font-black text-xs">Recomendaciones de los evaluadores</h1>
    </span>

    <slot />
</div>

<script>
    import { _ } from 'svelte-i18n'
    import Menu from '@smui/menu'
    import List from '@smui/list'
    import Button from '@smui/button'

    export let style

    let menu
    let container

    $: props = {
        ...$$restProps,
        class: `min-w-[100px] relative ${$$restProps.class || ''}`,
    }
</script>

<div {...props} bind:this={container}>
    <Button on:click={() => menu.setOpen(true)} {style} type="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
    </Button>
    <Menu bind:this={menu}>
        <List>
            <slot />
        </List>
    </Menu>
</div>

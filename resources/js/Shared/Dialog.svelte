<script>
    import Dialog, { Title, Content, Actions } from '@smui/dialog'

    export let open = false
    export let id
    export let size = '850px'
    export let height
    export let hexBgColor = '#fff'

    $: props = {
        ...$$restProps,
        class: `${$$restProps.class || ''}`,
    }
</script>

<Dialog surface$style="width: {size}; max-width: calc(100vw - 32px); min-height: {height}px; background-color: {hexBgColor}" bind:open scrimClickAction="" {...props} escapeKeyAction="" aria-labelledby="mandatory-title" aria-describedby="mandatory-content" id="{id}-dialog">
    <Title id="mandatory-title">
        <slot name="title" />
    </Title>
    <div class="px-4">
        <slot name="header-info" />
    </div>
    <Content id="mandatory-content">
        <slot name="content" />
    </Content>
    <Actions>
        <slot name="actions" />
    </Actions>
</Dialog>

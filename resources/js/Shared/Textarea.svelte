<script>
    import fitTextarea from 'fit-textarea'
    import InputError from '@/Shared/InputError'
    import Textarea from '@smui/textfield'
    import CharacterCounter from '@smui/textfield/character-counter'
    import { onMount } from 'svelte'

    export let error
    export let id
    export let value
    export let label
    export let disabled
    export let sinContador = false
    export let maxlength = 2000

    let container

    $: props = {
        ...$$restProps,
        class: `w-full block bg-white ${$$restProps.class || ''}`,
    }

    onMount(() => {
        fitTextarea.watch(container.querySelector('textarea'))
        container.querySelector('textarea').setAttribute('id', id)
    })
</script>

<div bind:this={container}>
    {#if sinContador == true}
        <Textarea {disabled} textarea bind:value {label} {...props} on:input on:blur />
    {:else}
        <Textarea {disabled} textarea input$maxlength={maxlength} bind:value {label} {...props} on:input on:blur>
            <CharacterCounter slot="internalCounter">0 / {maxlength}</CharacterCounter>
        </Textarea>
    {/if}
</div>

{#if error}
    <InputError message={error} />
{/if}

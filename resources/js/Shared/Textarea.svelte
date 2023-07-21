<script>
    import fitTextarea from 'fit-textarea'
    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import Textarea from '@smui/textfield'
    import CharacterCounter from '@smui/textfield/character-counter'
    import { onMount } from 'svelte'

    export let error
    export let id
    export let value = ''
    export let label
    export let disabled
    export let sinContador = false
    export let maxlength = 2000

    let container

    $: props = {
        ...$$restProps,
        class: `w-full p-1 block bg-white ${$$restProps.class || ''}`,
    }

    onMount(() => {
        fitTextarea.watch(container.querySelector('textarea'))
        container.querySelector('textarea').setAttribute('id', id)
    })

    if (!value) {
        value = ''
    }
</script>

<div bind:this={container}>
    {#if sinContador == true}
        {#if label}
            <Label class="mb-2" required={props.required} value={label} labelFor={id} />
        {/if}
        <Textarea {disabled} textarea bind:value {...props} on:input on:blur />
    {:else}
        {#if label}
            <Label class="mb-2" required={props.required} value={label} labelFor={id} />
        {/if}

        <Textarea {disabled} textarea input$maxlength={maxlength} bind:value {...props} input$resizable={false} on:input on:blur>
            <!-- <CharacterCounter slot="internalCounter">0 / {maxlength}</CharacterCounter> -->
        </Textarea>
    {/if}
</div>

{#if error}
    <InputError message={error} />
{/if}

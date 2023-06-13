<script>
    import { page } from '@inertiajs/inertia-svelte'
    import { _ } from 'svelte-i18n'
    import { scale } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'

    let showSuccessMessage = false
    let showErrorMessage = false

    $: warnMessage = $page.props.flash.warn
    $: successMessage = $page.props.flash.success
    $: errorMessage = $page.props.flash.error
    $: errors = $page.props.errors

    $: if (successMessage) {
        showSuccessMessage = true

        setTimeout(() => {
            showSuccessMessage = false
            successMessage = ''
        }, 5000)
    }

    $: if (errorMessage) {
        showErrorMessage = true

        setTimeout(() => {
            showErrorMessage = false
            errorMessage = ''
        }, 5000)
    }

    $: if (Object.keys(errors).length > 0) {
        showErrorMessage = true

        setTimeout(() => {
            showErrorMessage = false
            errors = {}
        }, 5000)
    }

    $: console.log($page.props.errors)
</script>

{#if (showSuccessMessage && successMessage) || warnMessage}
    <div class="fixed flex h-full items-center justify-center left-0 top-0 w-full" style="z-index: 9999;">
        <div class="{warnMessage ? 'bg-yellow-500' : 'bg-green-500'}  fixed h-80 max-w-md mb-8 rounded svelte-193iq1 w-10/12 shadow-lg" transition:scale={{ delay: 250, duration: 300, easing: quintOut }}>
            <img src="/images/save-success.png" alt="" class="my-10 mx-auto w-44" />

            <div class="flex flex-col items-center justify-center text-center pb-6">
                <div class="p-4 text-white font-black">
                    {warnMessage ? warnMessage : successMessage}
                </div>
            </div>
        </div>
    </div>
{/if}

{#if (showErrorMessage && errorMessage) || (Object.keys(errors).length > 0 && showErrorMessage)}
    <div class="fixed flex h-full items-center justify-center left-0 top-0 w-full" style="z-index: 9999;">
        <div class="bg-red-500 fixed h-80 max-w-md mb-8 rounded svelte-193iq1 w-10/12 shadow-lg" transition:scale={{ delay: 250, duration: 300, easing: quintOut }}>
            <img src="/images/save-error.png" alt="" class="my-10 mx-auto w-44" />
            <div class="flex flex-col items-center justify-center text-center pb-6">
                {#if errorMessage}
                    <div class="p-4 text-white font-black">
                        {errorMessage}
                    </div>
                {:else}
                    <div class="p-4 text-white font-black">
                        {#if Object.keys(errors).length === 1}
                            <span>Hay un error en el formulario.</span>
                        {:else}
                            <span>
                                Hay {Object.keys(errors).length} errores en el formulario.
                            </span>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

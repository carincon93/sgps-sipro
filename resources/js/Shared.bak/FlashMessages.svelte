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

    $: console.log(errors)
</script>

{#if showSuccessMessage && successMessage}
    <div class="fixed flex h-full flex-col items-center justify-center left-0 top-0 w-full" style="z-index: 9999;" transition:scale={{ delay: 250, duration: 300, easing: quintOut }}>
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
        <h1 class="bg-white rounded mt-4 shadow-md p-4">{successMessage}</h1>
    </div>
{/if}

{#if (showErrorMessage && errorMessage) || (Object.keys(errors).length > 0 && showErrorMessage)}
    <div class="fixed flex h-full items-center justify-center left-0 top-0 w-full" style="z-index: 9999;">
        <div class="bg-red-500 fixed max-w-md mb-8 rounded svelte-193iq1 w-10/12 shadow-lg" transition:scale={{ delay: 250, duration: 300, easing: quintOut }}>
            <img src="/images/save-error.png" alt="" class="my-10 mx-auto w-44" />
            <div class="flex flex-col items-center justify-center text-center pb-6">
                {#if errorMessage}
                    <div class="p-4 text-white font-black">
                        {errorMessage}
                    </div>
                {:else}
                    <div class="p-4 text-white font-black">
                        {#if Object.keys(errors).length > 0}
                            <span>
                                Hay {Object.keys(errors).length} campos con errores. Por favor revise el formulario nuevamente.

                                <ul>
                                    {#each Object.keys(errors) as error}
                                        <li class="text-xs">{error}</li>
                                    {/each}
                                </ul>
                            </span>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    :root {
        --green: #7ac142;
        --white: #fff;
    }

    .checkmark {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: var(--white);
        stroke-miterlimit: 10;
        box-shadow: inset 0px 0px 0px var(--green);
        animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    }

    .checkmark__circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        stroke: var(--green);
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark__check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    @keyframes stroke {
        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes scale {
        0%,
        100% {
            transform: none;
        }
        50% {
            transform: scale3d(1.1, 1.1, 1);
        }
    }

    @keyframes fill {
        100% {
            box-shadow: inset 0px 0px 0px 30px var(--green);
        }
    }
</style>

<script>
    import Button from '@/Shared/Button'

    export let id

    export let showButton = true

    export function export2Word(filename = '') {
        var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
        var postHtml = '</body></html>'
        var html = preHtml + document.getElementById(id).innerHTML + postHtml

        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword',
        })

        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

        // Specify file name
        filename = filename ? filename + '.doc' : 'document.doc'

        // Create download link element
        var downloadLink = document.createElement('a')

        document.body.appendChild(downloadLink)

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename)
        } else {
            // Create a link to the file
            downloadLink.href = url

            // Setting the file name
            downloadLink.download = filename

            //triggering the function
            downloadLink.click()
        }

        document.body.removeChild(downloadLink)
    }
</script>

<div {id}>
    <slot />
</div>

{#if showButton}
    <Button type="button" variant="raised" on:click={() => export2Word()}>Descargar borrador en Word</Button>
{/if}

<script>
    import { route } from '@/Utils'
    import { Inertia } from '@inertiajs/inertia'

    import Select from '@/Shared/Select'
    import SelectMulti from '@/Shared/SelectMulti'
    import Switch from '@/Shared/Switch'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Radio from '@smui/radio'
    import Input from '@/Shared/Input'
    import InputError from '@/Shared/InputError'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import InfoMessage from '@/Shared/InfoMessage'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'

    export let isSuperAdmin
    export let idi
    export let convocatoria
    export let evaluacion
    export let form
    export let errors
    export let redesConocimiento
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let lineasInvestigacion
    export let tecnoacademia
    export let lineasTecnoacademia
    export let tecnoacademias
    export let municipios
    export let areasTematicasEni
    export let lineasInvestigacionEni
    export let opcionesIDiDropdown
    export let programasFormacionConRegistroCalificado
    export let programasFormacionSinRegistroCalificado
    export let tieneVideo
    export let requiereJustificacionIndustria4
    export let requiereJustificacionEconomiaNaranja
    export let requiereJustificacionPoliticaDiscapacidad
    export let requiereJustificacionAntencionPluralista
    export let requiereJustificacionSectorAgricola
    export let lineasProgramaticas
    export let gruposInvestigacion
    export let mesasSectoriales

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
        return obj.tecnoacademia_id == tecnoacademia?.id
    })
    function selectLineasTecnoacademia(event) {
        arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
            return obj.tecnoacademia_id == event.detail?.value
        })
    }

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == $form.area_conocimiento_id
    })
    function selectAreaConocimiento(event) {
        arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
            return obj.area_conocimiento_id == event.detail?.value
        })
    }

    let arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
        return obj.subarea_conocimiento_id == $form.subarea_conocimiento_id
    })
    function selectSubreaConocimiento(event) {
        arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
            return obj.subarea_conocimiento_id == event.detail?.value
        })
    }

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if (typeof column !== undefined && typeof form !== undefined && idi.proyecto.allowed.to_update) {
                //guardar
                Inertia.put(
                    route('convocatorias.idi.updateLongColumn', [convocatoria.id, idi.id, column]),
                    { [column]: form[column] },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }
</script>

<div class="grid grid-cols-2 gap-4">
    <div>
        <h1 class="font-semibold text-2xl">Details</h1>
        <p class="text-gray-400">Title, short description, image...</p>
    </div>

    <div class="bg-white shadow-sm rounded-md p-8">
        <form>
            <div>
                <Textarea label="Título" id="titulo" sinContador={true} error={errors.titulo} bind:value={$form.titulo} classes="bg-transparent block border-0 {errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required disabled={evaluacion ? 'disabled' : undefined} />
            </div>
        </form>
    </div>
</div>

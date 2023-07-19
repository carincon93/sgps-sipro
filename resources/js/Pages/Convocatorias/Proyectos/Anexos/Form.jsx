import FileInput from '@/Components/FileInput'
import Label from '@/Components/Label'
import PrimaryButton from '@/Components/PrimaryButton'

import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const Form = ({ convocatoria, proyecto, anexo, proyectoAnexo, ...props }) => {
    const form = useForm({
        archivo: null,
        anexo_id: anexo.id,
    })

    const submit = (e) => {
        e.preventDefault()
        if (proyecto.allowed.to_update) {
            form.post(route('convocatorias.proyectos.proyecto-anexos.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    const [archivo, setArchivo] = useState(null)

    useEffect(() => {
        if (proyectoAnexo) {
            const proyectoAnexoItem = proyectoAnexo.find((item) => item.anexo_id === anexo.id)

            if (proyectoAnexoItem) {
                setArchivo(proyectoAnexoItem)
            } else {
                setArchivo(null)
            }
        }
    }, [proyectoAnexo, anexo.id])

    return (
        <form onSubmit={submit} className="mt-4 p-4">
            <fieldset disabled={proyecto?.allowed?.to_update && anexo.habilitado == true ? false : true}>
                <div className="mt-20">
                    <Label value="Archivo/anexo" />

                    <FileInput
                        id="archivo"
                        value={form.data.archivo}
                        filename={archivo?.filename}
                        extension={archivo?.extension}
                        label="Seleccione un archivo"
                        downloadRoute={archivo ? (archivo?.archivo.includes('http') == true || archivo?.archivo.includes('http') == undefined ? null : route('convocatorias.proyectos.proyecto-anexos.download-file-sharepoint', [convocatoria.id, proyecto.id, archivo.id, 'archivo'])) : null}
                        onChange={(e) => form.setData('archivo', e.target.files[0])}
                        error={form.errors.archivo}
                    />

                    <div className="mt-4">
                        <strong>Fecha de carga del archivo: </strong>
                        {archivo ? archivo.updated_at : 'Aún no se ha cargado el anexo'}.
                    </div>
                </div>
                <div>
                    <PrimaryButton disabled={form.processing} className="w-full mt-4" type="submit">
                        Cargar {anexo.nombre}
                    </PrimaryButton>
                </div>
            </fieldset>
        </form>
    )
}

export default Form

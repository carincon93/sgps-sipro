import FileInput from '@/Components/FileInput'
import PrimaryButton from '@/Components/PrimaryButton'

import AutorenewIcon from '@mui/icons-material/Autorenew'

import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const Form = ({ convocatoria, proyecto, convocatoria_anexo, proyecto_anexo, ...props }) => {
    const form = useForm({
        archivo: null,
        convocatoria_anexo_id: convocatoria_anexo?.id,
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
        if (proyecto_anexo) {
            const proyecto_anexo_info = proyecto_anexo.find((item) => item.convocatoria_anexo_id === convocatoria_anexo?.id)

            if (proyecto_anexo_info) {
                setArchivo(proyecto_anexo_info)
            } else {
                setArchivo(null)
            }
        }
    }, [proyecto_anexo, convocatoria_anexo?.anexo.id])

    return (
        <form onSubmit={submit} className="mt-4 p-4">
            <fieldset>
                <div className="mt-20">
                    <FileInput
                        id={convocatoria_anexo?.id}
                        value={form.data.archivo}
                        filename={archivo?.filename}
                        extension={archivo?.extension}
                        label={convocatoria_anexo?.anexo.nombre}
                        downloadRoute={
                            archivo
                                ? archivo?.archivo.includes('http') == true || archivo?.archivo.includes('http') == undefined
                                    ? archivo?.archivo
                                    : route('convocatorias.proyectos.proyecto-anexos.download-file-sharepoint', [convocatoria.id, proyecto.id, archivo.id, 'archivo'])
                                : null
                        }
                        accept={convocatoria_anexo.anexo.mime_type}
                        onChange={(e) => form.setData('archivo', e)}
                        disabled={proyecto?.allowed?.to_update && convocatoria_anexo?.habilitado == true ? false : true}
                        error={form.errors.archivo}
                    />
                </div>
                <div>
                    <PrimaryButton disabled={form.processing || !proyecto.allowed.to_update} className="w-full mt-4" type="submit">
                        <AutorenewIcon className="mr-2" />
                        Cargar {convocatoria_anexo?.anexo.nombre}
                    </PrimaryButton>
                </div>

                <div className="mt-4">
                    <strong>Fecha de carga del archivo: </strong>
                    {archivo ? archivo.updated_at : 'Aún no se ha cargado el anexo'}.
                </div>
            </fieldset>
        </form>
    )
}

export default Form

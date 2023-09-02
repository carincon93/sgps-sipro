import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'

import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { checkRole } from '@/Utils'

import FormRoles from './FormRoles'
import EditComponent from './EditComponent'

const Edit = ({
    auth,
    usuario,
    tipos_documento,
    tipos_vinculacion,
    municipios,
    redes_conocimiento,
    disciplinas_conocimiento,
    niveles_ingles,
    grupos_etnicos,
    opciones_genero,
    tipos_discapacidad,
    roles_sennova,
    subareas_experiencia,
    centros_formacion,
    estudios_academicos,
    niveles_academicos,
    formaciones_academicas_sena,
    modalidades_estudio,
    niveles_formacion,
    grupos_investigacion,
    semilleros_investigacion,
    tipos_proyectos,
    participaciones_grupos_investigacion_sena,
    participaciones_proyectos_sennova,
    roles_sistema,
}) => {
    const { props: page_props } = usePage()

    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])
    const [nuevo_usuario_dialog_status, setNuevoUsuarioDialogStatus] = useState(page_props.ziggy.query.nuevo_usuario == 1)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil</h2>}>
            <EditComponent
                auth_user={auth_user}
                usuario={usuario}
                tipos_documento={tipos_documento}
                tipos_vinculacion={tipos_vinculacion}
                municipios={municipios}
                redes_conocimiento={redes_conocimiento}
                disciplinas_conocimiento={disciplinas_conocimiento}
                niveles_ingles={niveles_ingles}
                grupos_etnicos={grupos_etnicos}
                opciones_genero={opciones_genero}
                tipos_discapacidad={tipos_discapacidad}
                roles_sennova={roles_sennova}
                subareas_experiencia={subareas_experiencia}
                centros_formacion={centros_formacion}
                estudios_academicos={estudios_academicos}
                niveles_academicos={niveles_academicos}
                formaciones_academicas_sena={formaciones_academicas_sena}
                modalidades_estudio={modalidades_estudio}
                niveles_formacion={niveles_formacion}
                grupos_investigacion={grupos_investigacion}
                semilleros_investigacion={semilleros_investigacion}
                tipos_proyectos={tipos_proyectos}
                participaciones_grupos_investigacion_sena={participaciones_grupos_investigacion_sena}
                participaciones_proyectos_sennova={participaciones_proyectos_sennova}
                roles_sistema={roles_sistema}
            />

            <DialogMui
                open={nuevo_usuario_dialog_status}
                dialogContent={
                    <>
                        <AlertMui>
                            <h1>Pasos a seguir:</h1>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    1. Las credenciales de acceso son:
                                    <br />
                                    Correo electrónico: <strong>{usuario?.email}</strong>
                                    <br />
                                    Contraseña: <strong>sena{usuario?.numero_documento}*</strong>
                                </li>
                                <li>2. Por favor, indíquele al usuario que complete el CENSO SENNOVA una vez ingrese al sistema.</li>
                                <li>3. Seleccione los respectivos roles de sistema de la siguiente lista:.</li>
                            </ul>
                        </AlertMui>
                        <FormRoles usuario={usuario} roles_sistema={roles_sistema} className="mt-10" />
                    </>
                }
                dialogActions={
                    <ButtonMui onClick={() => setNuevoUsuarioDialogStatus(false)} primary={false} className="!mr-4">
                        Cerrar
                    </ButtonMui>
                }
            />
        </AuthenticatedLayout>
    )
}

export default Edit

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import EditComponent from './EditComponent'

const Perfil = ({
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
    const auth_user = auth.user
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
        </AuthenticatedLayout>
    )
}

export default Perfil

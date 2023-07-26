import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// import Stepper from '@/Components/Stepper';

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({ auth, convocatoria, centrosFormacion, lineasProgramaticas, lineasTecnoacademia, rolesSennova }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                is_super_admin={is_super_admin}
                auth_user={auth_user}
                method="crear"
                convocatoria={convocatoria}
                centrosFormacion={centrosFormacion}
                lineasTecnoacademia={lineasTecnoacademia}
                lineasProgramaticas={lineasProgramaticas}
                rolesSennova={rolesSennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create

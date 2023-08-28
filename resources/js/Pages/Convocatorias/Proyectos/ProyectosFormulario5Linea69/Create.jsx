import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// import Stepper from '@/Components/Stepper';

import Form from './Form'

import { checkRole } from '@/Utils'

const Create = ({ auth, convocatoria, nodos_tecnoparque, lineas_programaticas, lineas_tecnoacademia, roles_sennova }) => {
    const auth_user = auth.user

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formular proyecto</h2>}>
            <Form
                auth_user={auth_user}
                method="POST"
                convocatoria={convocatoria}
                nodos_tecnoparque={nodos_tecnoparque}
                lineas_tecnoacademia={lineas_tecnoacademia}
                lineas_programaticas={lineas_programaticas}
                roles_sennova={roles_sennova}
            />
        </AuthenticatedLayout>
    )
}

export default Create

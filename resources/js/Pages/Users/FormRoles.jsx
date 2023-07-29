import Checkbox from '@/Components/Checkbox'
import PrimaryButton from '@/Components/PrimaryButton'
import { useForm } from '@inertiajs/react'

import { FormControlLabel, FormGroup } from '@mui/material'

const FormRoles = ({ usuario, roles_sistema, ...props }) => {
    const form = useForm({
        roles: [1],
    })

    const handleCheckboxChange = (value) => {
        if (form.data.roles.includes(value)) {
            form.setData((prevData) => ({
                ...prevData,
                roles: prevData.roles.filter((role) => role !== value),
            }))
        } else {
            form.setData((prevData) => ({
                ...prevData,
                roles: [...prevData.roles, value],
            }))
        }
    }

    const submit = (e) => {
        e.preventDefault()
        form.put(route('users.asignacion-roles', [usuario.id]), {
            preserveScroll: true,
        })
    }

    return (
        <form onSubmit={submit} {...props}>
            <fieldset>
                <FormGroup className="!grid !grid-cols-2">
                    {roles_sistema.map((rol, i) => (
                        <FormControlLabel
                            key={i}
                            label={rol.name}
                            className={`${form.data.roles?.includes(rol.id) ? 'bg-gray-100' : ''} py-2 px-4`}
                            control={<Checkbox checked={form.data.roles?.includes(rol.id)} name={rol.name} onChange={() => handleCheckboxChange(rol.id)} />}
                        />
                    ))}
                </FormGroup>
            </fieldset>
            <div className="flex items-center justify-end">
                <PrimaryButton disabled={form.processing || !form.isDirty} type="submit" className="mt-4">
                    Guardar cambios
                </PrimaryButton>
            </div>
        </form>
    )
}

export default FormRoles

import AlertMui from '@/Components/Alert'
import Checkbox from '@/Components/Checkbox'
import PrimaryButton from '@/Components/PrimaryButton'

import { useForm } from '@inertiajs/react'

import { FormControlLabel, FormGroup } from '@mui/material'

const FormRoles = ({ usuario, roles_sistema, ...props }) => {
    const form = useForm({
        user_id: usuario?.id,
        roles: usuario?.roles.map((item) => item.id),
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
        form.put(route('users.asignacion-roles', []), {
            preserveScroll: true,
        })
    }

    return (
        <form onSubmit={submit} {...props}>
            <fieldset>
                <AlertMui className="mb-4">
                    <strong>Si el usuario es subdirector/a, líder de grupo de investigación o líder de semilleros, por favor seleccione la casilla correspondiente.</strong>
                </AlertMui>
                <FormGroup className="!grid !grid-cols-2 mb-10">
                    <FormControlLabel
                        label="Subdirector/a"
                        className={`py-2 px-4`}
                        control={<Checkbox checked={form.data.roles?.includes(3)} onChange={() => handleCheckboxChange(3)} name="Subdirector/a" />}
                    />
                    <FormControlLabel
                        label="Líder de Grupo de investigación"
                        className={`py-2 px-4`}
                        control={<Checkbox checked={form.data.roles?.includes(21)} onChange={() => handleCheckboxChange(21)} name="Líder de Grupo de investigación" />}
                    />
                    <FormControlLabel
                        label="Líder de semilleros de investigación"
                        className={`py-2 px-4`}
                        control={<Checkbox checked={form.data.roles?.includes(27)} onChange={() => handleCheckboxChange(27)} name="Líder de semilleros de investigación" />}
                    />
                </FormGroup>

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

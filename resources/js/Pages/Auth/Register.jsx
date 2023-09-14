import GuestLayout from '@/Layouts/GuestLayout'

import AlertMui from '@/Components/Alert'
import Autocomplete from '@/Components/Autocomplete'
import Checkbox from '@/Components/Checkbox'
import DatePicker from '@/Components/DatePicker'
import PasswordInput from '@/Components/PasswordInput'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'

import { Head, Link, useForm, usePage } from '@inertiajs/react'
export default function Login({ tipos_documento, tipos_vinculacion, roles, centros_formacion, municipios, opciones_genero, user, status, ...props }) {
    const { props: page_props } = usePage()

    const rol = page_props.ziggy.query.rol

    const form = useForm({
        nombre: user?.nombre,
        email: user?.email,
        password: user?.password,
        password_confirmation: user?.password_confirmation,
        tipo_documento: user?.tipo_documento,
        numero_documento: user?.numero_documento,
        lugar_expedicion_id: user?.lugar_expedicion_id,
        genero: user?.genero,
        fecha_nacimiento: user?.fecha_nacimiento,
        numero_celular: user?.numero_celular,
        tipo_vinculacion: user?.tipo_vinculacion,
        centro_formacion_id: user?.centro_formacion_id,
        autorizacion_datos: user?.autorizacion_datos ?? false,
        rol: rol,
    })

    const submit = (e) => {
        e.preventDefault()

        form.post(route('register'))
    }

    return (
        <GuestLayout>
            <Head title="Registro" />

            {status && <AlertMui error={props.flash?.error}>{status}</AlertMui>}

            {user ? (
                <AlertMui>
                    El usuario con número de documento <strong>{user.numero_documento}</strong> ya está registrado en el sistema. Por favor inicie sesión desde el formulario inicial. Si no recuerda la
                    contraseña la puede recuperar en la opcion: Recuperar contraseña.
                </AlertMui>
            ) : (
                <AlertMui>
                    El usuario con número de documento <strong>{page_props.ziggy.query.numero_documento}</strong> no está registrado en el sistema. Por favor diligencie el siguiente formulario:
                </AlertMui>
            )}
            <form onSubmit={submit} className="mt-20 w-[22rem]">
                <div>
                    <TextInput
                        label="Nombre completo"
                        id="nombre"
                        type="text"
                        className="mt-1 w-full"
                        value={form.data.nombre}
                        error={form.errors.nombre}
                        onChange={(e) => form.setData('nombre', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8 relative">
                    <TextInput
                        label="Correo electrónico institucional"
                        id="email"
                        type="email"
                        className="mt-1 w-full"
                        value={form.data.email}
                        error={form.errors.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        required
                    />
                    {form.errors.email == 'El campo correo electrónico ya ha sido tomado.' && (
                        <AlertMui severity="error">
                            El correo electrónico ya fue registrado, Por favor inicie sesión haciendo{' '}
                            <Link href="/" className="underline">
                                clic aquí
                            </Link>
                            . Si no recuerda la contraseña la puede recuperar en el siguiente enlace{' '}
                            <Link href="/forgot-password" className="underline">
                                Recuperar contraseña
                            </Link>
                        </AlertMui>
                    )}
                </div>

                <div className="mt-8">
                    <PasswordInput
                        label="Contraseña"
                        id="password"
                        type="password"
                        className="mt-1 w-full"
                        value={form.data.password}
                        error={form.errors.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <PasswordInput
                        label="Confirmar contraseña"
                        id="password_confirmation"
                        type="password"
                        className="mt-1 w-full"
                        value={form.data.password_confirmation}
                        error={form.errors.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="tipo_documento"
                        options={tipos_documento}
                        selectedValue={form.data.tipo_documento}
                        error={form.errors.tipo_documento}
                        onChange={(event, newValue) => {
                            form.setData('tipo_documento', newValue.value)
                        }}
                        label="Tipo de documento"
                        required
                    />
                </div>

                <div className="mt-8">
                    <TextInput
                        label="Número de documento"
                        id="numero_documento"
                        type="number"
                        min="55555"
                        max="3900000000"
                        className="mt-1 w-full"
                        value={form.data.numero_documento}
                        error={form.errors.numero_documento}
                        onChange={(e) => form.setData('numero_documento', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="lugar_expedicion_id"
                        options={municipios}
                        selectedValue={form.data.lugar_expedicion_id}
                        error={form.errors.lugar_expedicion_id}
                        onChange={(event, newValue) => {
                            form.setData('lugar_expedicion_id', newValue.value)
                        }}
                        label="Lugar de expedición"
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="genero"
                        options={opciones_genero}
                        className="mt-1 w-full"
                        selectedValue={form.data.genero}
                        error={form.errors.genero}
                        onChange={(event, newValue) => {
                            form.setData('genero', newValue.value)
                        }}
                        label="Género"
                        required
                    />
                </div>

                <div className="mt-8">
                    <DatePicker
                        variant="outlined"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        label="Fecha de nacimiento"
                        value={form.data.fecha_nacimiento}
                        className="p-4 w-full"
                        onChange={(e) => form.setData('fecha_nacimiento', e.target.value)}
                        error={form.errors.fecha_nacimiento}
                        required
                    />
                </div>

                <div className="mt-8">
                    <TextInput
                        label="Número de celular"
                        id="numero_celular"
                        type="number"
                        min="3000000000"
                        max="3900000000"
                        className="mt-1 w-full"
                        value={form.data.numero_celular}
                        error={form.errors.numero_celular}
                        onChange={(e) => form.setData('numero_celular', e.target.value)}
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="tipo_vinculacion"
                        options={tipos_vinculacion}
                        selectedValue={form.data.tipo_vinculacion}
                        error={form.errors.tipo_vinculacion}
                        onChange={(event, newValue) => {
                            form.setData('tipo_vinculacion', newValue.value)
                        }}
                        label="Tipo de vinculación"
                        required
                    />
                </div>

                <div className="mt-8">
                    <Autocomplete
                        id="centro_formacion_id"
                        options={centros_formacion}
                        selectedValue={form.data.centro_formacion_id}
                        error={form.errors.centro_formacion_id}
                        onChange={(event, newValue) => {
                            form.setData('centro_formacion_id', newValue.value)
                        }}
                        label="Centro de formación"
                        required
                    />
                </div>

                <div className="block mt-8">
                    <AlertMui>
                        Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (Acuerdo No. 0009 del 2016)
                    </AlertMui>

                    <Checkbox
                        className="mt-8"
                        name="autorizacion_datos"
                        checked={form.data.autorizacion_datos}
                        error={form.errors.autorizacion_datos}
                        onChange={(e) => form.setData('autorizacion_datos', e.target.checked)}
                        label="Autorizo el tratamiento de mis datos personales."
                    />
                </div>

                <div className="flex options-center justify-end mt-4">
                    <Link href={route('login')} className="mr-4 underline text-sm text-gray-600 hover:text-gray-900">
                        Ya tengo una cuenta
                    </Link>

                    <PrimaryButton type="submit" disabled={form.processing || !form.data.autorizacion_datos}>
                        Continuar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}

import { useState } from "react"
import { MainTitle } from "../components"
import { Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlertHelper"

// Este componente permite al admin crear nuevos usuarios (especialmente jueces)
export const CreateUserPage = () => {
    const [shouldRedirect, setShouldRedirect] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const onHandleSubmit = async (data, e) => {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:3000/api/auth/admin/create-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Error al crear el usuario')
            }

            const result = await response.json()

            showSuccessAlert('¡Éxito!', `Usuario creado correctamente: ${result.user.name} (${result.user.role})`).then(() => {
                reset()
                // Opcional: redirigir a una página de listado de usuarios
                // setShouldRedirect(true)
            })
        } catch (error) {
            showErrorAlert('Error', error.message)
        }
    }

    if (shouldRedirect) {
        return <Navigate to="/dashboard" />
    }

    return (
        <>
            <MainTitle title="Agregar Nuevo Juez" />
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Panel de Administración
                        </h2>
                        <form
                            onSubmit={handleSubmit(onHandleSubmit)}
                            className="flex flex-col space-y-4"
                        >
                            <label className="flex flex-col text-lg">
                                Nombre:
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Este campo es requerido",
                                        minLength: {
                                            value: 2,
                                            message: "El nombre debe tener al menos 2 caracteres",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "El nombre no puede tener más de 50 caracteres",
                                        },
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ingrese el nombre"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </label>

                            <label className="flex flex-col text-lg">
                                Email:
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Este campo es requerido",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Ingrese un email válido",
                                        },
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="ejemplo@correo.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </label>

                            <label className="flex flex-col text-lg">
                                Contraseña:
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Este campo es requerido",
                                        minLength: {
                                            value: 6,
                                            message: "La contraseña debe tener al menos 6 caracteres",
                                        },
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </label>

                            {/* El admin solo puede crear jueces */}
                            <input type="hidden" value="juez" {...register("role")} />

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Rol:</strong> Juez
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Los administradores solo pueden crear usuarios con rol de Juez
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6"
                            >
                                Agregar Juez
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

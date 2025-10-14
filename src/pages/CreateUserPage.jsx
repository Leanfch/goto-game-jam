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
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <MainTitle title="Agregar Nuevo Juez" />

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Panel de Administración
                        </h2>
                        <p className="text-gray-600">
                            Crea un nuevo usuario con rol de Juez
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Ej: Juan Pérez"
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
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="ejemplo@correo.com"
                                {...register("email", {
                                    required: "Este campo es requerido",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Ingrese un email válido",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Mínimo 6 caracteres"
                                {...register("password", {
                                    required: "Este campo es requerido",
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* El admin solo puede crear jueces */}
                        <input type="hidden" value="juez" {...register("role")} />

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        Rol asignado: Juez
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Los administradores solo pueden crear usuarios con rol de Juez
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar Juez
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

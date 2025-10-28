import { useState } from "react"
import { MainTitle } from "../components"
import { Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { showSuccessAlert, showErrorAlert } from "../utils/sweetAlertHelper"

// Este componente permite al usuario agregar un nuevo juego
export const AddNewGame = () => {
    const [shouldRedirect, setShouldRedirect] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onHandleSubmit = (data, e) => {
        e.preventDefault()

        // Convertir members de string a array
        const game = {
            ...data,
            members: data.members ? data.members.split(',').map(m => m.trim()).filter(m => m !== '') : []
        }

        fetch("http://localhost:3000/api/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // IMPORTANTE: Enviar cookies con JWT
            body: JSON.stringify(game),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Error al agregar el juego')
                    })
                }
                return response.json()
            })
            .then(() => {
                showSuccessAlert('¡Éxito!', 'Juego agregado correctamente').then(() => {
                    setShouldRedirect(true)
                })
            })
            .catch((error) => {
                showErrorAlert('Error', 'No se pudo agregar el juego: ' + error.message)
            })
    }

    if (shouldRedirect) {
        return <Navigate to="/games" />
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <MainTitle title={"Agregar nuevo juego"} />

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6">
                            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Nuevo Juego
                        </h2>
                        <p className="text-gray-600">
                            Completa la información del juego para agregarlo a la competencia
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onHandleSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre del Juego
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Ej: Space Adventure"
                                {...register("name", {
                                    required: "Este valor es requerido",
                                    minLength: {
                                        value: 1,
                                        message: "El mínimo de caracteres permitidos es 1",
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "El máximo de caracteres permitidos es 30",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-2">
                                Género
                            </label>
                            <input
                                type="text"
                                id="genre"
                                placeholder="Ej: Aventura, Puzzle, Acción"
                                {...register("genre", {
                                    required: "Este valor es requerido",
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Solo se permiten letras y espacios",
                                    },
                                    minLength: {
                                        value: 1,
                                        message: "El mínimo de caracteres permitidos es 1",
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "El máximo de caracteres permitidos es 30",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.genre && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.genre.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="edition" className="block text-sm font-semibold text-gray-700 mb-2">
                                Edición (Año)
                            </label>
                            <input
                                type="text"
                                id="edition"
                                placeholder="Ej: 2024"
                                {...register("edition", {
                                    required: "Este valor es requerido",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Solo se permiten números",
                                    },
                                    min: {
                                        value: 1950,
                                        message: "El número mínimo permitido es 1950",
                                    },
                                    max: {
                                        value: 2025,
                                        message: "El número máximo permitido es 2025",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.edition && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.edition.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                                URL de la Foto del Juego
                            </label>
                            <input
                                type="text"
                                id="photo"
                                placeholder="Ej: https://ejemplo.com/imagen.jpg"
                                {...register("photo", {
                                    required: false,
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: "Debe ser una URL válida (http:// o https://)",
                                    },
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all outline-none"
                            />
                            {errors.photo && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.photo.message}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">Opcional: URL de la imagen del juego</p>
                        </div>

                        <div>
                            <label htmlFor="members" className="block text-sm font-semibold text-gray-700 mb-2">
                                Miembros del Equipo
                            </label>
                            <textarea
                                id="members"
                                rows="3"
                                placeholder="Ej: Juan Pérez, María García, Carlos López"
                                {...register("members", {
                                    required: false,
                                })}
                                className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:bg-white transition-all outline-none resize-none"
                            />
                            {errors.members && (
                                <p className="text-red-600 text-sm mt-1.5">
                                    {errors.members.message}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">Opcional: Separar nombres con comas</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Agregar Juego
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

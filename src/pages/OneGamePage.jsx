import { useState, useEffect } from "react"
import { useParams, Navigate, Link } from "react-router-dom"
import Swal from "sweetalert2"

// ESTE COMPONENTE MUESTRA UN JUEGO
export const OneGamePage = () => {
    const { id } = useParams()

    const [game, setGame] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const [userRole, setUserRole] = useState(null)

    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch(
                `http://localhost:3000/api/games/${id}`
            )
            const data = await response.json()

            setGame(data)
            setIsLoading(false)
        }

        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/profile", {
                    credentials: "include",
                })
                if (response.ok) {
                    const data = await response.json()
                    setUserRole(data.role)
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
            }
        }

        fetchGames()
        fetchUserProfile()
    }, [id])

    const handleDelete = async () => {
        // Mostrar confirmación con SweetAlert
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/games/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({ id }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.message || 'Error al eliminar el juego')
                }

                await Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El juego ha sido eliminado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })

                setShouldRedirect(true)
            } catch (error) {
                console.error("Error:", error)
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudo eliminar el juego',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }

    if (shouldRedirect) {
        return <Navigate to="/games" />
    }

    const { name, genre, edition, totalPoints } = game

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <span className="text-2xl text-gray-600">Cargando...</span>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    {/* Header con icono */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-6">
                            <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
                    </div>

                    {/* Información del juego */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                            <p className="text-sm text-gray-600 mb-2 font-semibold">Género</p>
                            <p className="text-2xl font-bold text-gray-900">{genre}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                            <p className="text-sm text-gray-600 mb-2 font-semibold">Edición</p>
                            <p className="text-2xl font-bold text-gray-900">{edition}</p>
                        </div>
                    </div>

                    {/* Puntuación Total */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-8">
                        <p className="text-lg mb-2 opacity-90">Puntuación Total</p>
                        <p className="text-5xl md:text-6xl font-bold">{totalPoints || 0}</p>
                        <p className="text-sm mt-2 opacity-75">puntos acumulados</p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {userRole === 'juez' && (
                            <Link
                                to={`/games/${id}/vote`}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Votar Este Juego
                            </Link>
                        )}

                        {userRole === 'usuario' && (
                            <>
                                <Link
                                    to={`/games/update/${id}`}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Modificar
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            </>
                        )}
                    </div>

                    {/* Botón volver */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/games"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a Juegos
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

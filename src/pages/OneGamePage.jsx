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

    return (
        <>
            {isLoading && <span className="text-3xl">Estoy cargando...</span>}

            <div className="p-5 bg-white rounded shadow-lg text-center">
                <h1 className="text-4xl font-bold mb-4">{name}</h1>
                <p className="text-xl mb-2">
                    Genero:{" "}
                    <span className="bg-yellow-300 text-black p-1 font-medium">
                        {genre}
                    </span>
                </p>
                <p className="text-xl mb-2">
                    Edición:{" "}
                    <span className="bg-yellow-300 text-black p-1 font-medium">
                        {edition}
                    </span>
                </p>
                <p className="text-xl my-10">
                    Puntuación Total:{" "}
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-2xl">
                        {totalPoints || 0}
                    </span>
                </p>
                {/* Botón de Votar - Solo para jueces */}
                {userRole === 'juez' && (
                    <Link
                        to={`/games/${id}/vote`}
                        className="text-white bg-purple-700 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 transition-all"
                    >
                        Votar
                    </Link>
                )}

                {/* Botones de Modificar y Eliminar - Solo para usuarios */}
                {userRole === 'usuario' && (
                    <>
                        <Link
                            to={`/games/update/${id}`}
                            className="text-black hover:text-white bg-cyan-400 hover:bg-cyan-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-all"
                        >
                            Modificar
                        </Link>

                        <button
                            className="text-white hover:text-black bg-red-700 hover:bg-red-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-all"
                            onClick={handleDelete}
                        >
                            Eliminar
                        </button>
                    </>
                )}
            </div>
        </>
    )
}

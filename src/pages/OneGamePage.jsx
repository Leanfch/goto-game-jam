import { useState, useEffect } from "react"
import { useParams, Navigate, Link } from "react-router-dom"

// ESTE COMPONENTE MUESTRA UN JUEGO
export const OneGamePage = () => {
    const { id } = useParams()

    const [game, setGame] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [shouldRedirect, setShouldRedirect] = useState(false)

    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch(
                `http://localhost:3000/api/games/${id}`
            )
            const data = await response.json()

            setGame(data)
            setIsLoading(false)
        }

        fetchGames()
    }, [id])

    const handleDelete = () => {
        {
            window.confirm(
                "¿Estás seguro que deseas eliminar este juego? Esta acción no se puede deshacer"
            ) &&
                fetch(`http://localhost:3000/api/games/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Pasamos el ID del juego en el cuerpo de la solicitud
                    body: JSON.stringify({ id }),
                })
                    .then((response) => response.json())
                    .then(() => {
                        console.log("El juego ha sido eliminado correctamente")
                        setShouldRedirect(true)
                    })
                    .catch((error) => {
                        console.error("Error:", error)
                    })
        }
    }

    if (shouldRedirect) {
        return <Navigate to="/games" />
    }

    const { name, genre, edition } = game

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
                <p className="text-xl my-10">
                    Edición:{" "}
                    <span className="bg-yellow-300 text-black p-1 font-medium">
                        {edition}
                    </span>
                </p>
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
            </div>
        </>
    )
}

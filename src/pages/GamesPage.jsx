import { useState, useEffect } from "react"
import { MainTitle } from "../components"
import { Link } from "react-router-dom"
import LoaderSpinner from "../components/LoaderSpinner"

// ESTE COMPONENTE MUESTRA UNA LISTA DE JUEGOS
export const GamesPage = () => {
    const [games, setGames] = useState([])
    const [allGames, setAllGames] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEdition, setSelectedEdition] = useState("all")
    const [sortByScore, setSortByScore] = useState(false)
    const [editions, setEditions] = useState([])
    const [userRole, setUserRole] = useState(null)

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/games")
                if (!response.ok) {
                    throw new Error("Algo salió mal")
                }
                const data = await response.json()
                setGames(data)
                setAllGames(data)

                // Extraer ediciones únicas
                const uniqueEditions = [...new Set(data.map(game => game.edition))].sort()
                setEditions(uniqueEditions)
            } catch (error) {
                console.error("Failed to fetch games -" + error);
            }
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
    }, [])

    useEffect(() => {
        let filteredGames = [...allGames]

        // Filtrar por edición
        if (selectedEdition !== "all") {
            filteredGames = filteredGames.filter(game => game.edition === parseInt(selectedEdition))
        }

        // Ordenar por puntuación
        if (sortByScore) {
            filteredGames.sort((a, b) => b.totalPoints - a.totalPoints)
        }

        setGames(filteredGames)
    }, [selectedEdition, sortByScore, allGames])

    return (
        <>
                <>
                    <MainTitle title="Juegos" />
                    <div className="flex flex-col items-center">
                        {isLoading && <LoaderSpinner />}

                        {/* Controles de filtro y ordenamiento */}
                        <div className="w-full max-w-4xl mb-6 flex gap-4 justify-center items-center flex-wrap px-4">
                            <div className="flex items-center gap-2">
                                <label htmlFor="edition-filter" className="font-semibold text-gray-700">
                                    Filtrar por Edición:
                                </label>
                                <select
                                    id="edition-filter"
                                    value={selectedEdition}
                                    onChange={(e) => setSelectedEdition(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Todas las ediciones</option>
                                    {editions.map((edition) => (
                                        <option key={edition} value={edition}>
                                            Edición {edition}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="sort-by-score"
                                    checked={sortByScore}
                                    onChange={(e) => setSortByScore(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="sort-by-score" className="font-semibold text-gray-700">
                                    Ordenar por puntuación
                                </label>
                            </div>
                        </div>

                        <ul className="mx-auto max-w-md divide-y divide-gray-200 dark:divide-gray-700 m-16">
                            {games.length === 0 && !isLoading && (
                                <p className="text-center text-gray-500 mt-8">
                                    No se encontraron juegos para esta edición.
                                </p>
                            )}
                            {games.map((game) => (
                                <li
                                    className="pb-3 sm:pb-4"
                                    key={game._id}
                                    id={game._id}
                                >
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xl font-medium text-gray-900 truncate dark:text-white">
                                                {game.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Edición {game.edition} - Puntuación: {game.totalPoints || 0}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <Link
                                                to={`/games/${game._id}`}
                                                type="button"
                                                className="text-white bg-rose-600 hover:bg-cyan-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-all"
                                            >
                                                Ir al Juego
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {/* Botón de Agregar nuevo juego - Solo para usuarios */}
                        {userRole === 'usuario' && (
                            <div>
                                <Link
                                    to={"/games/new/"}
                                    className="text-white hover:py-5 hover:px-7 hover:text-black bg-emerald-700 hover:bg-emerald-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-all"
                                >
                                    Agregar nuevo juego
                                </Link>
                            </div>
                        )}
                    </div>
                </>
        </>
    )
}

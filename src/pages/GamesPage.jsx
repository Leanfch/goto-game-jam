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
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <MainTitle title="Juegos" />

                {isLoading && (
                    <div className="flex justify-center">
                        <LoaderSpinner />
                    </div>
                )}

                {/* Controles de filtro y ordenamiento */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <div className="w-full md:w-auto">
                            <label htmlFor="edition-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                                Filtrar por Edición
                            </label>
                            <select
                                id="edition-filter"
                                value={selectedEdition}
                                onChange={(e) => setSelectedEdition(e.target.value)}
                                className="w-full md:w-auto px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                                <option value="all">Todas las ediciones</option>
                                {editions.map((edition) => (
                                    <option key={edition} value={edition}>
                                        Edición {edition}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="sort-by-score"
                                checked={sortByScore}
                                onChange={(e) => setSortByScore(e.target.checked)}
                                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                            />
                            <label htmlFor="sort-by-score" className="font-semibold text-gray-700 cursor-pointer">
                                Ordenar por puntuación
                            </label>
                        </div>
                    </div>
                </div>

                {games.length === 0 && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-600">
                            No se encontraron juegos para esta edición
                        </p>
                    </div>
                )}

                {/* Lista de juegos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {games.map((game) => (
                        <div
                            key={game._id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex-1 pr-2">
                                        {game.name}
                                    </h3>
                                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                        {game.totalPoints || 0}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Edición:</span> {game.edition}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Género:</span> {game.genre || 'No especificado'}
                                    </p>
                                </div>

                                <Link
                                    to={`/games/${game._id}`}
                                    className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md"
                                >
                                    Ver Detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón de Agregar nuevo juego - Solo para usuarios */}
                {userRole === 'usuario' && (
                    <div className="flex justify-center">
                        <Link
                            to="/games/new/"
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar Nuevo Juego
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}

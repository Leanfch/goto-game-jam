import { useState, useEffect } from "react"
import { MainTitle } from "../components"
import { Link } from "react-router-dom"

// ESTE COMPONENTE MUESTRA UNA LISTA DE JUEGOS
export const GamesPage = () => {
    const [games, setGames] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch("http://localhost:3000/api/games")
            const data = await response.json()

            setGames(data)
            setIsLoading(false)
        }

        fetchGames()
    }, [games])

    return (
        <>
            <MainTitle title="Juegos" />
            <div className="flex flex-col items-center">
                {isLoading && (
                    <span className="text-3xl">Estoy cargando...</span>
                )}
                <ul className="mx-auto max-w-md divide-y divide-gray-200 dark:divide-gray-700 m-16">
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
                <div>
                    <Link
                        to={"/games/new/"}
                        className="text-white hover:py-5 hover:px-7 hover:text-black bg-emerald-700 hover:bg-emerald-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-all"
                    >
                        Agregar nuevo juego
                    </Link>
                </div>
            </div>
        </>
    )
}

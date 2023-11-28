import { useState, useEffect } from "react"
import { MainTitle } from "../components"
import { Link } from "react-router-dom"
// ESTE COMPONENTE MUESTRA UNA LISTA DE JUECES
export const JudgesPage = () => {
    const [judges, setJudges] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch("http://localhost:3000/api/judges")
            const data = await response.json()

            setJudges(data)
            setIsLoading(false)
        }

        fetchGames()
    }, [])

    return (
        <>
            <MainTitle title="Jueces" />
            <div>
                <div className="flex flex-wrap justify-center">
                    {isLoading && (
                        <span className="text-3xl text-center">
                            Estoy cargando...
                        </span>
                    )}
                    {judges.map((judge) => (
                        <div
                            key={judge._id}
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4 hover:shadow-lg"
                        >
                            <Link
                                to={`/judges/judge/${judge._id}/${judge.name}`}
                                className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                            >
                                <img
                                    className="rounded-t-lg"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBjZn8mOw7F4rtWWKbEIIHOr_w_GAeHiXPgA&usqp=CAU"
                                    alt="No image user"
                                />
                            </Link>
                            <div>
                                <Link
                                    to={`/judges/judge/${judge._id}`}
                                    className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                                >
                                    <p className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                                        {judge.name}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

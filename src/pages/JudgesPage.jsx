import { useState, useEffect } from "react"
import { MainTitle } from "../components"
import { Link, Navigate } from "react-router-dom"
import { useCookies } from "react-cookie"

// ESTE COMPONENTE MUESTRA UNA LISTA DE JUECES
export const JudgesPage = () => {
    const [judges, setJudges] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [cookies] = useCookies(["token"])

    useEffect(() => {
        const fetchJudges = async () => {
            try {
                // Cambiar al nuevo endpoint que obtiene usuarios con rol de juez
                const response = await fetch("http://localhost:3000/api/auth/users/judges")
                const data = await response.json()

                console.log('Judges data:', data)
                setJudges(data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching judges:', error)
                setIsLoading(false)
            }
        }

        fetchJudges()
    }, [])

    if (!cookies.token) {
        return <Navigate to="/" />
    }

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
                        <Link
                            key={judge._id}
                            to={`/judges/${judge._id}/${judge.name}`}
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4 hover:shadow-xl transition-shadow cursor-pointer"
                        >
                            <img
                                className="rounded-t-lg"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBjZn8mOw7F4rtWWKbEIIHOr_w_GAeHiXPgA&usqp=CAU"
                                alt="No image user"
                            />
                            <div className="p-4">
                                <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                                    {judge.name}
                                </p>
                                <p className="text-sm text-center text-gray-500 mt-2">
                                    {judge.email}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

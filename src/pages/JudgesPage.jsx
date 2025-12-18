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
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <MainTitle title="Jueces" />

                {isLoading && (
                    <div className="flex justify-center">
                        <span className="text-2xl text-gray-600">Cargando jueces...</span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {judges.map((judge) => (
                        <Link
                            key={judge._id}
                            to={`/judges/${judge._id}/${judge.name}`}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] border border-gray-100 overflow-hidden"
                        >
                            <div className="relative">
                                <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-600"></div>
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-16 pb-6 px-6 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    {judge.name}
                                </h3>
                                <p className="text-sm text-gray-500 break-words">
                                    {judge.email}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-sm text-purple-600 font-semibold group-hover:underline">
                                        Ver votos →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {judges.length === 0 && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-600">
                            No hay jueces registrados
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MainTitle } from "../components"
import LoaderSpinner from "../components/LoaderSpinner"

// ESTE COMPONENTE MUESTRA UN JUEZ
export const OneJudgePage = () => {
    const { name, judgeId } = useParams()

    const [votes, setVotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchVote = async () => {
            try {
                const responseJudgeVotes = await fetch(
                    `http://localhost:3000/api/judges/judge/${judgeId}`
                )

                if (!responseJudgeVotes.ok) {
                    throw new Error('Error al cargar los votos del juez')
                }

                const dataJudgeVotes = await responseJudgeVotes.json()
                console.log('Votes data:', dataJudgeVotes)
                setVotes(dataJudgeVotes)
            } catch (err) {
                console.error('Error fetching votes:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (judgeId) {
            fetchVote()
        }
    }, [judgeId])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderSpinner />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <MainTitle title={`Votos del Juez ${name}`} />

                {votes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-600">
                            Este juez aún no ha votado por ningún juego
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {votes.map((vote) => {
                            const totalPoints =
                                vote.artPoints +
                                vote.gameplayPoints +
                                vote.soundPoints +
                                vote.themePoints
                            const averagePoints = (totalPoints / 4).toFixed(1)

                            return (
                                <div
                                    key={vote._id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                                        <h3 className="text-xl font-bold text-center">
                                            {vote.gameId?.name || 'Juego no encontrado'}
                                        </h3>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="text-gray-700 font-semibold">Jugabilidad</span>
                                            <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">
                                                {vote.gameplayPoints}/10
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="text-gray-700 font-semibold">Arte</span>
                                            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                                                {vote.artPoints}/10
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="text-gray-700 font-semibold">Sonido</span>
                                            <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                                                {vote.soundPoints}/10
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                            <span className="text-gray-700 font-semibold">Temática</span>
                                            <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-sm">
                                                {vote.themePoints}/10
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-1">Total</p>
                                            <p className="text-3xl font-bold text-purple-600">{totalPoints}/40</p>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Promedio: <span className="font-semibold text-gray-900">{averagePoints}/10</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}

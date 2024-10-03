import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MainTitle } from "../components"

// ESTE COMPONENTE MUESTRA UN JUEZ
export const OneJudgePage = () => {
    const { name, judgeId } = useParams()

    // const [games, setGames] = useState([])
    const [votes, setVotes] = useState([])
    useEffect(() => {
        const fetchVote = async () => {
            const responseJudgeVotes = await fetch(
                `http://localhost:3000/api/judges/judge/${judgeId}`
            )
            const dataJudgeVotes = await responseJudgeVotes.json()
            setVotes(dataJudgeVotes)

            // const gamesFetch = await Promise.all(gamePromises)
            // setGames(gamesFetch)

            // const votesPromises = dataJudgeVotes.map(async (vote) => {
            //     if (vote.game) {
            //         const responseVote =
            //             (vote.artPoints +
            //                 vote.gameplayPoints +
            //                 vote.soundPoints +
            //                 vote.themePoints) /
            //             4

            //         const idGameVote = vote.game

            //         return { totalVotes: responseVote, gameId: idGameVote }
            //     }
            // })
        }

        fetchVote()
    }, [judgeId])

    if (!judgeId) {
        return <span className="text-3xl">Estoy cargando...</span>
    }

    return (
        <>
            <MainTitle title={`Voto del Juez ${name}`} />
            <div className="flex">
                {votes.map((vote) => {
                    let totalVotes =
                        (vote.artPoints +
                            vote.gameplayPoints +
                            vote.soundPoints +
                            vote.themePoints) /
                        4
                    return (
                        <div
                            key={vote._id}
                            className="text-center w-[50%] mx-auto"
                        >
                            <p className="text-3xl font-bold mb-2">
                                {vote.game.name}
                            </p>
                            <p>Promedio Voto :{totalVotes} </p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

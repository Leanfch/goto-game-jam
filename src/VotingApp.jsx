import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "./router"

export const VotingApp = () => {
    return (
        <>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </>
    )
}

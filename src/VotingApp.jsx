import { BrowserRouter } from "react-router-dom"
import { CookiesProvider } from "react-cookie"
import { AppRouter } from "./router"

export const VotingApp = () => {
    return (
        <CookiesProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </CookiesProvider>
    )
}

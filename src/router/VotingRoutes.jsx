import { Navigate, Route, Routes } from "react-router-dom"
import {
    HomePage,
    GamesPage,
    JudgesPage,
    OneGamePage,
    AddNewGame,
    OneJudgePage,
    UpdateGamePage,
} from "../pages"
import { NavBar, FooterComponent } from "../components"
import { LoginPage } from "../auth/pages"

export const VotingRoutes = () => {
    return (
        <>
            <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/games/new" element={<AddNewGame />} />
                    <Route
                        path="/games/update/:id"
                        element={<UpdateGamePage />}
                    />
                    <Route path="/games/:id" element={<OneGamePage />} />
                    <Route path="/judges" element={<JudgesPage />} />
                    <Route
                        path="/judges/:judgeId/:name"
                        element={<OneJudgePage />}
                    />

                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            <FooterComponent />
        </>
    )
}

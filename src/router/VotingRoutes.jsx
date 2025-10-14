import { Navigate, Route, Routes } from "react-router-dom"
import {
    HomePage,
    GamesPage,
    JudgesPage,
    OneGamePage,
    AddNewGame,
    OneJudgePage,
    UpdateGamePage,
    VotingPage,
    CreateUserPage,
} from "../pages"
import { NavBar, FooterComponent } from "../components"
import { LoginPage } from "../auth/pages"
import { ProtectedRoute } from "./ProtectedRoute"

export const VotingRoutes = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route
                    path="/games/new"
                    element={
                        <ProtectedRoute allowedRoles={['usuario']}>
                            <AddNewGame />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/games/update/:id"
                    element={
                        <ProtectedRoute allowedRoles={['usuario']}>
                            <UpdateGamePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/games/:id" element={<OneGamePage />} />
                <Route
                    path="/games/:gameId/vote"
                    element={
                        <ProtectedRoute allowedRoles={['juez']}>
                            <VotingPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/judges" element={<JudgesPage />} />
                <Route
                    path="/judges/:judgeId/:name"
                    element={<OneJudgePage />}
                />

                {/* Ruta para que el admin cree usuarios (jueces) */}
                <Route
                    path="/admin/create-user"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <CreateUserPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
            <FooterComponent />
        </div>
    )
}

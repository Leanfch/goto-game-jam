import { Route, Routes } from "react-router-dom"
import { VotingRoutes } from "./VotingRoutes"
import { AuthRoutes } from "../auth/routes/AuthRoutes"

export const AppRouter = () => {
    return (
        <>
        <Routes>
            <Route path="/*" element={<VotingRoutes />} />
            <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
        </>
    )
}

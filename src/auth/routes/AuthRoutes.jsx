import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../pages"
import { FooterComponent, NavBar } from "../../components"

export const AuthRoutes = () => {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="/*" element={<Navigate to="/auth/login" />} />
            </Routes>
            <FooterComponent />
        </>
    )
}

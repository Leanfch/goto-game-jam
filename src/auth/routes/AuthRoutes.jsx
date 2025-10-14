import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "../pages"
import { FooterComponent, NavBar } from "../../components"

export const AuthRoutes = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="/*" element={<Navigate to="/auth/login" />} />
            </Routes>
            <FooterComponent />
        </div>
    )
}

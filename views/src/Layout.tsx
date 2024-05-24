import { Breadcrumbs } from "./features/Breadcrumbs/Breadcrumb"
import { Outlet } from "react-router-dom"
import { Header } from "./features/Header/Header"
import { NavBar } from "./features/NavBar/NavBar"

export const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <NavBar />
            <Breadcrumbs />
            <Outlet />
        </div>
    )
}
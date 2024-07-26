import { Breadcrumbs } from "../features/Breadcrumbs/Breadcrumb"
import { Outlet, useLocation } from "react-router-dom"
import { Header } from "../features/Header/Header"
import { NavBar } from "../features/NavBar/NavBar"
import { Footer } from "../features/Footer/Footer"
import { FeaturedDeals } from "../features/FeaturedDeals/FeaturedDeals"
import { SlidingAd } from "../features/Home/SlidingAd/SlidingAd"
import { NewArrivals } from "../features/NewArrivals/NewArrivals"

export const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-gray-100 montserrat w-full">
            <Header />
            <NavBar />
            <Breadcrumbs />
            <Outlet />
            <FeaturedDeals marketingLabel="On Sale" />
            <NewArrivals />
            <FeaturedDeals marketingLabel="Top Seller" />
            {!isHomePage && <SlidingAd />}
            <Footer />
        </div>
    )
}
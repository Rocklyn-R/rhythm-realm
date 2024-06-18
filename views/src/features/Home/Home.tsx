import { SlidingAd } from "./SlidingAd/SlidingAd"
import { Categories } from "./Categories/Categories"
import { Footer } from "../Footer/Footer"

export const Home = () => {
    return (
        <div>
            <SlidingAd />
            <Categories />
            <Footer />
        </div>
    )
}
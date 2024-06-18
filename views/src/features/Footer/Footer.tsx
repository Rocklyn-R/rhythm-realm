import { NewsletterSignUp } from "./NewsletterSignUp/NewsletterSignUp"
import { ShopRhythmRealm } from "./ShopRhythmRealm/ShopRhythmRealm"

export const Footer = () => {
    return (
        <div className="mt-14 flex flex-col">
            <ShopRhythmRealm />
            <NewsletterSignUp />
        </div>
    )
}
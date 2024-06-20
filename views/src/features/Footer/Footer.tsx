import { Copyright } from "./Copyright/Copyright"
import { NewsletterSignUp } from "./NewsletterSignUp/NewsletterSignUp"
import { ShopRhythmRealm } from "./ShopRhythmRealm/ShopRhythmRealm"
import { SocialMedia } from "./SocialMedia/SocialMedia"

export const Footer = () => {
    return (
        <div className="flex flex-col">
            <ShopRhythmRealm />
            <NewsletterSignUp />
            <SocialMedia />
            <Copyright />
        </div>
    )
}
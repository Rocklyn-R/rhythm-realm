import GuitarsImg from "../../../images/categories/Guitars.png";
import BassesImg from "../../../images/categories/Bass.png";
import DrumsImg from "../../../images/categories/Drums.png";
import KeysImg from "../../../images/categories/Keys.png";
import StringsImg from "../../../images/categories/Strings.png";
import WindsImg from "../../../images/categories/Winds.png";
import AudioImg from "../../../images/categories/Audio.png";
import AccessoriesImg from "../../../images/categories/Accessories.png";
import { useEffect } from "react";

export const Categories = () => {

    //const instrumentCategories = ["Guitars", "Basses", "Drums", "Keys", "Strings", "Winds", "Audio", "Accessories"];
    const instrumentCategories = {
        Guitars: GuitarsImg,
        Basses: BassesImg,
        Drums: DrumsImg,
        Keys: KeysImg,
        Strings: StringsImg,
        Winds: WindsImg,
        Audio: AudioImg,
        Accessories: AccessoriesImg
    }

    useEffect(() => {
        const someFunc = () => {
           const object =  Object.entries(instrumentCategories);
           console.log(object);
        };
        someFunc(); // Call the function inside useEffect
    }, []); //
    return (
        <div className="flex flex-col items-center">
            <h1 className="mb-8 text-3xl text-center font-bold">Rhythm Realm - Online Shop for Musical Instruments</h1>
            <h2 className="text-center text-xl">Shop by category:</h2>
            <div className="flex flex-wrap justify-center sm:w-full md:w-full lg:w-5/6">
                {Object.entries(instrumentCategories).map(([category, imgSrc]) => (
                <div className="border border-black mx-8 w-32 sm:w-36 md:w-40 lg:w-48 mt-8">
                    <button>
                        <a>
                            <img src={imgSrc} />
                            {category}
                        </a>
                    </button>
                </div>
            ))}
            </div>
        </div>
    )
}
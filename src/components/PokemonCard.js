import Image from "next/image";
import {StarIcon} from "@heroicons/react/24/solid";
import {addRemoveFavorite, getFavorites} from "@/helpers/api_calls/pokemons/favorites";
import {useAtom} from "jotai";
import {favorites} from "@/atoms/favorites";
import {useEffect, useState} from "react";
import {user} from "@/atoms/user";
import Link from "next/link";


export default function PokemonCard(props) {

    const {image_url, name, isFavorite, info_url} = props;
    const [favoritePokemons, setFavoritePokemons] = useAtom(favorites);
    const [atomUser, setAtomUser] = useAtom(user);
    const [fav, setFav] = useState(isFavorite);

    useEffect(() => {
        setFav(isFavorite);
    }, [isFavorite]);

    async function addRemoveHandler() {
        setFav(true);
        const result = await addRemoveFavorite({image_url, name, info_url});
        if (result) {
            getFavorites().then((result) => {
                setFavoritePokemons(result);
            });
        }
    }

    return (
        <div
            className={'lg:w-1/5 w-full relative rounded-lg bg-white m-1 cursor-pointer hover:shadow-2xl hover:border-2 border-yellow-200 hover:text-yellow-400'}>
            {
                atomUser && Object.keys(atomUser).length > 0 ? <button onClick={addRemoveHandler}>
                    <StarIcon
                        className={`h-8 hover:h-9 hover:w-9 w-8 ${fav ? 'text-yellow-300' : 'text-slate-300'}  absolute top-2 right-2 z-20`}/>
                </button> : null
            }
            <Link
                href={`/pokemon/${name} ${fav ? '?favorite=true' : ''}`}>


                <div
                    className={'h-3/4 overflow-hidden flex items-center justify-center'}>
                    <Image
                        className={'h-auto w-auto'}
                        alt={name}
                        src={image_url}
                        width={250} height={250}/>
                </div>
                <p className={'text-2xl text-center '}>{name.charAt(0).toUpperCase() + name.slice(1)}</p>

            </Link>
        </div>
    )
}
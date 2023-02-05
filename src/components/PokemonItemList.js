import Image from "next/image";
import {StarIcon} from "@heroicons/react/24/solid";
import {useAtom} from "jotai";
import {favorites} from "@/atoms/favorites";
import {user} from "@/atoms/user";
import {addRemoveFavorite, getFavorites} from "@/helpers/api_calls/pokemons/favorites";
import {useEffect, useState} from "react";
import Link from "next/link";

export default function PokemonItemList(props) {

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
            className={'flex items-center w-full rounded-lg bg-white mb-3 cursor-pointer hover:shadow-2xl hover:border-2 border-yellow-200 hover:text-yellow-400'}>
            {
                atomUser && Object.keys(atomUser).length > 0 ? <button onClick={addRemoveHandler}>
                    <StarIcon
                        className={`h-8 hover:h-9 hover:w-9 w-8 ${Object.keys(isFavorite).length > 0 || Object.keys(fav).length > 0 ? 'text-yellow-300' : 'text-slate-300'}  absolute top-2 left-2`}/>
                </button> : null
            }
            <Link
                className={`flex items-center w-full`}
                href={`/pokemon/${name} ${Object.keys(isFavorite).length > 0 || Object.keys(fav).length > 0 ? '?favorite=true' : ''}`}>

                <div
                    className={'relative h-56 w-56 px-10 py-3 overflow-hidden flex items-start justify-center'}>

                    <Image
                        className={'h-auto w-auto'}
                        alt={name}
                        src={image_url}
                        width={150} height={150}/>
                </div>
                <p className={'text-2xl text-center '}>{name.charAt(0).toUpperCase() + name.slice(1)}</p>

            </Link>
        </div>
    )
}
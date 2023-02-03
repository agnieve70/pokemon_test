import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {user} from "@/atoms/user";
import {login} from "@/helpers/api_calls/login";
import {getAllPokemon} from "@/helpers/api_calls/pokemons/all";
import {getFavorites} from "@/helpers/api_calls/pokemons/favorites";
import Image from "next/image";
import PokemonGrid from "@/components/PokemonGrid";
import PokemonList from "@/components/PokemonList";
import {favorites} from "@/atoms/favorites";
import Head from "next/head";

export default function FavoritesPage(props) {

    const [atomUser, setAtomUser] = useAtom(user);
    const [favoritePokemons, setFavoritePokemons] = useAtom(favorites);
    const [isGrid, setIsGrid] = useState(true);
    const [page, setPage] = useState(1);

    const router = useRouter();

    useEffect(() => {

        (async () => {
            const myCreds = localStorage.getItem('user');
            if (myCreds) {
                setAtomUser(JSON.parse(myCreds));
            } else {
                await router.push('/');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            getFavorites().then((result) => {
                setFavoritePokemons(result);
            });
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Pokemon Test - Favorites</title>
                <meta name="description" content="Pokemon Test"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <div className={'min-h-[52rem]'}>
                <div className={'flex items-center flex-col'}>
                    <Image className={'h-auto w-auto mb-3'} alt={'header2'} src={'/header3-01.png'} width={500}
                           height={150}/>
                    {isGrid ? <PokemonGrid favorites={favoritePokemons} pokemons={favoritePokemons} page={page}/> :
                        <PokemonList pokemons={favoritePokemons} page={page}/>}
                </div>
            </div>
        </>
    )
}
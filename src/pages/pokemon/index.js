import {useAtom} from "jotai";
import {user} from "@/atoms/user";
import {useEffect, useState} from "react";
import {getAllPokemon} from "@/helpers/api_calls/pokemons/all";
import Image from "next/image";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    ListBulletIcon,
    RectangleGroupIcon
} from '@heroicons/react/24/solid'
import PokemonGrid from "@/components/PokemonGrid";
import PokemonList from "@/components/PokemonList";
import {pokemon_backup} from "@/contants/pokemon_backup";
import Head from "next/head";
import {getFavorites} from "@/helpers/api_calls/pokemons/favorites";
import {favorites} from "@/atoms/favorites";

export default function HomePage() {

    const [atomUser, setAtomUser] = useAtom(user);
    const [atomFavoritePokemons, setAtomFavoritePokemons] = useAtom(favorites);
    const [pokemons, setPokemons] = useState([]);
    const [favoritePokemons, setFavoritePokemons] = useState([]);
    const [currentUrl, setCurrentUrl] = useState("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [search, setSearch] = useState("");
    const [isGrid, setIsGrid] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        (async () => {
            const myCreds = localStorage.getItem('user');
            if (myCreds) {
                setAtomUser(JSON.parse(myCreds));
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const result1 = await getFavorites();
            const result2 = await getAllPokemon(currentUrl);

            setFavoritePokemons(result1);
            setAtomFavoritePokemons(result1);
            setPokemons(result2.results);
            setNextUrl(result2.next);
            setPrevUrl(result2.previous);

            setIsLoading(false);

        })();
    }, [currentUrl]);

    function searchPokemonHandler() {
        let regex = new RegExp(search, 'i');

        if (!search.trim()) {
            setCurrentUrl('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20');
            return;
        }

        let arrSearch = [];

        pokemon_backup.map((pokemon) => {
            const test = pokemon.url.replace(/\/$/, '');

            if (regex.test(pokemon.name)) {
                arrSearch.push({...pokemon, ...{id: test.substring(test.lastIndexOf('/') + 1)}});
            }
        });

        setCurrentUrl("");
        setNextUrl(null);
        setPrevUrl(null);
        setPokemons(arrSearch);

    }

    function resetHandler() {
        setSearch("");
        setNextUrl(null);
        setPrevUrl(null);
        setCurrentUrl('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20');
        setPage(1);
    }

    return (

        <>
            <Head>
                <title>Pokemon Test - Home</title>
                <meta name="description" content="Pokemon Test"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <div className={'min-h-[39rem] flex items-center justify-center flex-col'}>
                <Image className={'h-auto w-auto'} alt={'header2'} src={'/header2-01.png'} width={500} height={150}/>
                <div className={`w-3/4 flex justify-between`}>
                    <div className={'flex items-center lg:w-1/3 w-3/4'}>
                        <input placeholder={'Search for Pokemon'} className={'h-10 px-3 rounded-lg w-full mr-2'}
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}/>

                        <button onClick={searchPokemonHandler}>
                            <MagnifyingGlassIcon className="h-8 w-8 text-white"/>
                        </button>
                        <button onClick={resetHandler}
                                className={'text-white bg-slate-800 px-3 py-2 rounded-lg ml-3'}>Reset
                        </button>
                    </div>
                    <div>
                        <button onClick={() => setIsGrid(prev => !prev)}>
                            {isGrid ?
                                <ListBulletIcon className="h-8 w-8 text-white"/> :
                                <RectangleGroupIcon className="h-8 w-8 text-white"/>}
                        </button>
                    </div>
                </div>
                {isLoading ? <div className="flex items-center justify-center">
                        <Image className={'animate-bounce-slow h-auto lg:w-auto w-full mt-5'} alt={'loading'}
                               src={'/loading-01.png'}
                               width={350} height={100}/>
                    </div>
                    : isGrid ?
                        <PokemonGrid favorites={favoritePokemons} pokemons={pokemons} page={page}/> :
                        <PokemonList favorites={favoritePokemons} pokemons={pokemons} page={page}/>}

                <div className={'w-3/4 flex justify-between mb-5'}>
                    <button className={``} disabled={prevUrl ? false : true} onClick={() => {
                        setCurrentUrl(prevUrl);
                        setPage(prev => prev - 1);
                    }}>
                        <ChevronLeftIcon
                            className={`h-8 w-8  ${prevUrl ? 'text-white hover:h-10 hover:w-10' : 'text-slate-500'}`}/>
                    </button>
                    <button disabled={nextUrl ? false : true} onClick={() => {
                        setCurrentUrl(nextUrl);
                        setPage(prev => prev + 1);
                        window.scrollTo(0, 0);
                    }}>
                        <ChevronRightIcon
                            className={`h-8 w-8  ${nextUrl ? 'text-white hover:h-10 hover:w-10' : 'text-slate-500'}`}/>
                    </button>
                </div>
            </div>
        </>
    )
}
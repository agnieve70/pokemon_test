import {useRouter} from "next/router";
import Head from "next/head";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {user} from "@/atoms/user";
import Image from "next/image";
import {addRemoveFavorite, getFavorites} from "@/helpers/api_calls/pokemons/favorites";
import {getPokemonDetail} from "@/helpers/api_calls/pokemons/pokemon_detail";
import {ChevronLeftIcon, ChevronRightIcon, StarIcon} from "@heroicons/react/24/solid";
import {favorites} from "@/atoms/favorites";


export default function PokemonDetail() {

    const router = useRouter();

    const {id, favorite} = router.query;
    const [atomUser, setAtomUser] = useAtom(user);
    const [thisPokemon, setThisPokemon] = useState({});
    const [moveNumber, setMoveNumber] = useState(1);
    const [favoritePokemons, setFavoritePokemons] = useAtom(favorites);
    const [fav, setFav] = useState(undefined);

    useEffect(() => {

        (async () => {
            const myCreds = localStorage.getItem('user');
            if (myCreds) {
                setAtomUser(JSON.parse(myCreds));
            }
        })();

    }, []);

    if (!router) {
        return (<Image className={'h-auto w-auto mt-5'} alt={'header2'}
                       src={'/loading-01.png'} width={300} height={300}/>)
    }

    useEffect(() => {
        (async () => {

            getPokemonDetail(id).then((result) => {
                setFav(favorite);
                setThisPokemon(result);
            });
        })();
    }, [router]);


    async function addRemoveHandler() {
        setFav(prev => !prev);
        const result = await addRemoveFavorite({
            image_url: thisPokemon?.sprites?.other['official-artwork'].front_default,
            name: id,
            info_url: thisPokemon.forms[0].url
        });
        if (result) {
            getFavorites().then((result) => {
                setFavoritePokemons(result);
            });
        }
    }

    return (
        <>
            <Head>
                <title>Pokemon Test - {id?.charAt(0).toUpperCase() + id?.slice(1)}</title>
                <meta name="description" content="Pokemon Test"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <div className="min-h-[51rem] flex items-center flex-col">

                <Image className={'h-auto w-auto mt-5'} alt={'header2'} src={'/header5-01.png'} width={350}
                       height={150}/>
                <h1 className="text-6xl font-bold text-center text-white mb-10">It's {id}!</h1>
                <div className="w-full">
                    <h2 className={'text-3xl text-white text-center'}>Data Information</h2>
                </div>
                <div className="flex w-3/4">
                    {
                        <>

                            <div className={'w-1/4 m-5 relative'}>
                                {
                                    atomUser && Object.keys(atomUser).length > 0 ? <button onClick={addRemoveHandler}>
                                        <StarIcon
                                            className={`h-8 hover:h-9 hover:w-9 w-8 ${fav ? 'text-yellow-300' : 'text-slate-300'}  absolute top-2 right-2`}/>
                                    </button> : null
                                }
                                <Image className={'animate-bounce-slow h-auto w-auto mt-5'} alt={'header2'}
                                       src={thisPokemon?.sprites ? thisPokemon.sprites.other['official-artwork'].front_default : '/loading-01.png'}
                                       width={350} height={100}/>
                            </div>
                            <div className="w-1/4 m-5">

                                <p className={'text-lg text-slate-500 mt-3'}>Exp <span
                                    className={'text-white'}>{thisPokemon?.base_experience}</span></p>
                                <p className={'text-lg text-slate-500 mt-3'}>Weight <span
                                    className={'text-white'}>{thisPokemon?.weight}</span></p>
                                <p className={'text-lg text-slate-500 mt-3'}>Height <span
                                    className={'text-white'}>{thisPokemon?.height}</span></p>
                                <p className={'text-lg text-slate-500 mt-3'}>Abilities</p>
                                {
                                    thisPokemon?.abilities?.map((ability, index) =>
                                        <p className={'text-white'} key={index}>
                                            {ability.ability.name?.charAt(0).toUpperCase() + ability.ability.name?.slice(1)}
                                        </p>)
                                }
                                <p className={'mt-3 text-lg text-slate-500'}>Pokemon Type </p>
                                {
                                    thisPokemon?.types?.map((type, index) => <p key={index} className={'text-white'}>
                                        {type.type.name?.charAt(0).toUpperCase() + type.type.name?.slice(1)}
                                    </p>)
                                }
                            </div>
                            <div className="w-1/4 m-5">

                                <p className={'text-lg text-slate-500 mt-3'}>Stats</p>
                                <table className={'text-white'}>
                                    <thead>
                                    <tr className={'py-3 border'}>
                                        <th className={'text-left px-3'}>Stat</th>
                                        <th className={'text-left px-3'}>Effort</th>
                                        <th className={'text-left px-3'}>Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        thisPokemon?.stats?.map((stat, index) =>
                                            <tr key={index}>
                                                <td className={'px-3'}>{stat.stat.name?.charAt(0).toUpperCase() + stat.stat.name?.slice(1)}</td>
                                                <td className={'px-3'}>{stat.effort}</td>
                                                <td className={'px-3'}>{stat.base_stat}</td>
                                            </tr>)
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-1/6 m-5">
                                <p className={'text-lg text-slate-500 mt-3'}>Moves</p>
                                {
                                    thisPokemon?.moves?.map((move, index) => {
                                        if (index + 1 >= moveNumber && index + 1 < moveNumber + 7) {
                                            return <p key={index}
                                                      className={'text-white'}>{move.move.name?.charAt(0).toUpperCase() + move.move.name?.slice(1)}</p>
                                        }
                                        return null;
                                    })
                                }
                                <div className="flex space-x-10">
                                    <button disabled={moveNumber <= 1 ? true : false}
                                            onClick={() => setMoveNumber(prev => prev - 5)}>
                                        <ChevronLeftIcon
                                            className={`h-5 w-5  ${moveNumber > 1 ? 'text-white hover:h-6 hover:w-6' : 'text-slate-500'}`}/>
                                    </button>
                                    <button onClick={() => setMoveNumber(prev => prev + 5)}>
                                        <ChevronRightIcon
                                            className={`h-5 w-5  ${moveNumber <= thisPokemon?.moves?.length ? 'text-white hover:h-6 hover:w-6' : 'text-slate-500'}`}/>
                                    </button>
                                </div>

                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
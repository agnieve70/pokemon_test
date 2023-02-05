import {useRouter} from "next/router";
import Head from "next/head";
import Image from "next/image";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {user} from "@/atoms/user";
import {ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {pokemon_backup} from "@/contants/pokemon_backup";
import {addPokemon, myPokemonTeam} from "@/helpers/api_calls/teams/pokemon";


export default function TeamDetails() {

    const [atomUser, setAtomUser] = useAtom(user);
    const [moveNumber, setMoveNumber] = useState(1);
    const [search, setSearch] = useState("");
    const [pokemons, setPokemons] = useState(pokemon_backup);
    const [teamPokemons, setTeamPokemons] = useState([]);
    const [monitorChange, setMonitorChange] = useState({});

    const router = useRouter();
    const {id, name} = router.query;

    useEffect(() => {

        (async () => {
            const myCreds = localStorage.getItem('user');
            if (myCreds) {
                setAtomUser(JSON.parse(myCreds));
            }
        })();

    }, []);

    useEffect(() => {
        if (id) {
            myPokemonTeam(id).then((team_pokemons) => {
                setTeamPokemons(team_pokemons);
            });
        }

    }, [router, monitorChange]);


    function searchHandler() {
        let regex = new RegExp(search, 'i');

        let arrSearch = [];

        pokemon_backup.map((pokemon) => {
            const test = pokemon.url.replace(/\/$/, '');

            if (regex.test(pokemon.name)) {
                arrSearch.push({...pokemon, ...{id: test.substring(test.lastIndexOf('/') + 1)}});
            }
        });

        setPokemons(arrSearch);
        setMoveNumber(-1);
    }

    async function addTeamPokemonHandler(pokemon) {
        const result = await addPokemon({
            team_id: id,
            name: pokemon.name,
            info_url: pokemon.info_url,
            image_url: pokemon.image_url,
        });
        setMonitorChange(result);
    }


    return (
        <>
            <Head>
                <title>Pokemon Test - Teams ({name})</title>
                <meta name="description" content="Pokemon Test"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="logo.png"/>
            </Head>
            <div className={'flex items-center justify-center flex-col px-5'}>
                <div className={''}>
                    <Image className={'h-auto w-auto mb-3'} alt={'header2'} src={'/header4-01.png'} width={400}
                           height={100}/>
                    <h1 className="text-2xl text-white text-center">{name}</h1>
                </div>
                <div className={'min-h-[39rem] lg:w-3/4 w-full mx-2 mb-5 flex lg:flex-row flex-col'}>

                    <div className="lg:w-1/4 w-full h-[40rem] bg-white p-3 rounded-lg overflow-y-scroll relative">

                        <div className={'flex'}>
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={'Search'}
                                   className={'w-full h-10 rounded-lg border-2 border-slate-900 px-3'}/>
                            <button onClick={searchHandler}>
                                <MagnifyingGlassIcon className="h-8 w-8 text-slate-900"/>
                            </button>
                        </div>

                        {
                            pokemons.map((pokemon, index) => {
                                if (index + 1 >= moveNumber && index + 1 < moveNumber + 5) {
                                    return (<div
                                        key={index}
                                        className={'flex items-center justify-between shadow-lg bg-slate-100 rounded-lg mt-3 overflow-hidden'}>
                                        <div className={'w-1/2 h-auto'}>
                                            <Image className={'h-auto w-auto'} alt={'header2'}
                                                   src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(index + 1)}.png`}
                                                   width={65}
                                                   height={100}/>
                                        </div>
                                        <h1 className={'text-lg'}>{pokemon.name}</h1>
                                        <button onClick={addTeamPokemonHandler.bind(this, {
                                            name: pokemon.name,
                                            info_url: pokemon.url,
                                            image_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(index + 1)}.png`
                                        })}>
                                            <ChevronRightIcon
                                                className={`h-7 w-7  ${moveNumber <= pokemon_backup?.length ? 'text-slate-300 hover:h-8 hover:w-8' : 'text-slate-300'}`}/>
                                        </button>
                                    </div>);
                                }
                            })
                        }

                        <div className={'mt-2 bottom-5 w-full'}>
                            <div className="flex justify-around">
                                <button disabled={moveNumber <= 1}
                                        onClick={() => setMoveNumber(prev => prev - 5)}>
                                    <ChevronLeftIcon
                                        className={`h-7 w-7  ${moveNumber > 1 ? 'text-slate-900 hover:h-8 hover:w-8' : 'text-slate-400'}`}/>
                                </button>
                                <button disabled={moveNumber < 1 || moveNumber > pokemon_backup?.length}
                                        onClick={() => setMoveNumber(prev => prev + 5)}>
                                    <ChevronRightIcon
                                        className={`h-7 w-7  ${moveNumber >= 1 && moveNumber <= pokemon_backup?.length ? 'text-slate-900 hover:h-8 hover:w-8' : 'text-slate-400'}`}/>
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className={'lg:w-3/4 w-full px-5 flex flex-wrap m-3'}>
                        {teamPokemons?.map((pokemon, index) => <div key={index}>
                            <Image className={'animate-bounce-slow h-auto w-auto'} alt={'header2'}
                                   src={`${pokemon.image_url}`}
                                   width={200}
                                   height={100}/>
                            <p className={'text-white text-center'}>{pokemon.name?.charAt(0).toUpperCase() + pokemon.name?.slice(1)}</p>
                        </div>)}
                    </div>

                </div>
            </div>
        </>
    )
}
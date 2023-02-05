import PokemonCard from "@/components/PokemonCard";
import {useEffect} from "react";

export default function PokemonGrid(props) {

    const {pokemons, page, favorites} = props;

    const currentData = page !== 1 ? (page - 1) * 20 : page;

    useEffect(()=> {

    },[pokemons, favorites]);

    return (
        pokemons && pokemons.length > 0 ?
            <div className={'w-full lg:pl-[18.5rem] flex px-2 flex-wrap flex-grow m-2'}>
                {
                    pokemons?.map((pokemon, index) => {

                        const result = favorites?.find((favorite) => favorite.name === pokemon.name);
                        console.log(result);

                        return (
                            <PokemonCard
                                key={index}
                                info_url={pokemon.url ? pokemon.url : pokemon.info_url}
                                image_url={pokemon.image_url ? pokemon.image_url : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(pokemon.id ? pokemon.id : (index) + currentData)}.png`}
                                name={pokemon.name}
                                isFavorite={result ? result : {}}
                            />
                        )
                    })
                }
            </div>
            : <div className={'h-[36rem]'}>
                <p className={'text-white m-20'}>No Pokemon available</p>
            </div>
    )
}
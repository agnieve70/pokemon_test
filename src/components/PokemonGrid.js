import PokemonCard from "@/components/PokemonCard";
import {useEffect} from "react";

export default function PokemonGrid(props) {

    const {pokemons, page, favorites} = props;

    const currentData = page !== 1 ? (page - 1) * 20 : page;

    useEffect(()=> {

    },[pokemons, favorites]);

    return (
        pokemons && pokemons.length > 0 ?
            <div className={'w-3/4 flex flex-wrap flex-grow mt-5'}>
                {
                    pokemons?.map((pokemon, index) => {

                        const result = favorites?.find((favorite) => favorite.name === pokemon.name);

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
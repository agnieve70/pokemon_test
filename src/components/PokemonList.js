import PokemonItemList from "./PokemonItemList";

export default function PokemonList(props){

    const { pokemons, page, favorites } = props;

    const currentData = page !== 1 ? (page - 1) * 20 : page;


    return (
        pokemons.length > 0 ?
            <div className={'w-3/4 flex flex-col px-4 mt-5'}>
                {
                    pokemons?.map((pokemon, index) => {

                        const result = favorites?.find((favorite) => favorite.name === pokemon.name);

                        return (<PokemonItemList
                            key={index}
                            info_url={pokemon.url ? pokemon.url : pokemon.info_url}
                            image_url={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${(pokemon.id ? pokemon.id : (index) + currentData)}.png`}
                            name={pokemon.name}
                            isFavorite={result ? result : {}}
                        />)
                    })
                }
            </div>
            : <p className={'text-white m-20'}>No Pokemon available</p>
    )
}
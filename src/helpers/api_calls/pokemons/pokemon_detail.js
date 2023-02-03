
export async function getPokemonDetail(pokemon){
    try{

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if(response.ok){
            return response.json();
        }

    }catch (error){
        return error;
    }
}
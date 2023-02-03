

export async function getAllPokemon(url){
    try{

        const response = await fetch(url);

        if(response.ok){
            return response.json();
        }

    }catch (error){
        return error;
    }
}
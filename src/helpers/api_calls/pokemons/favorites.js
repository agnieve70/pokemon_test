export async function getFavorites() {
    try {
        const user = localStorage.getItem('user');
        const token = JSON.parse(user);

        const response = await fetch(`${process.env.base_url}/api/favorites`, {
            headers: {
                Authorization: `Bearer ${token.token}`,
            }
        });

        if (response.ok) {
            return response.json();
        }

    } catch (error) {
        console.log(error.message);
    }
}

export async function addRemoveFavorite(data) {
    try {
        const user = localStorage.getItem('user');
        const token = JSON.parse(user);

        const response = await fetch(`${process.env.base_url}/api/favorites/add-remove`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const resp = await response.json();
            return resp;
        }

    } catch (err) {
        console.log(err.message);
    }
}
export async function myTeams() {
    try {
        const user = localStorage.getItem('user');
        const token = JSON.parse(user);

        const response = await fetch(`${process.env.base_url}/api/teams`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`
            }
        });

        if (response.ok) {
            return response.json();
        }

    } catch (error) {
        return error;
    }
}

export async function deleteTeam(id) {
    try {
        const user = localStorage.getItem('user');
        const token = JSON.parse(user);

        const response = await fetch(`${process.env.base_url}/api/teams/delete?id=${id}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`
            },
        })

        if (response.ok) {
            const resp = await response.json();
            return resp;
        }

    } catch (err) {
        console.log(err.message);
    }
}

export async function addTeam(data) {
    try {
        const user = localStorage.getItem('user');
        const token = JSON.parse(user);

        const response = await fetch(`${process.env.base_url}/api/teams/add`, {
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
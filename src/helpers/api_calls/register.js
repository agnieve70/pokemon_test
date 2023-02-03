export async function register(creds) {

    try {
        const response = await fetch(`${process.env.base_url}/api/register`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(creds)
        })

        if (response.ok) {
            const resp = await response.json();
            return resp;
        }

    } catch (err) {
        console.log(err.message);
    }

}

import {hashPassword} from "../../helpers/auth-utils";
import {connectDatabase} from "../../helpers/db-util";
import jwt from "jsonwebtoken";

async function handler(req, res) {

    if (req.method === 'POST') {
        const {email, password, name} = req.body;

        if (!name.trim() || !email.trim() || !email.includes('@') || !password || password.trim().length < 7) {
            res.status(422).json({message: 'Invalid Input'});
        }

        let client;
        let db;

        try {
            client = await connectDatabase();
            db = client.db();
        } catch (error) {
            res.status(500).json({message: "Connecting to the database failed"});
            return;
        }

        try {

            const existingUser = await db.collection('users').findOne({email: email});

            if (existingUser) {
                res.status(422).json({message: 'User exists already!'});
                await client.close();
                return;
            }

            const hashedPassword = await hashPassword(password);

            const result = await db.collection("users").insertOne({
                email: email.trim(),
                password: hashedPassword,
                name: name.trim(),
            });

            if (!result) {
                throw new Error('There was an error adding user');
            }

            res.status(201).json(result);
            await client.close();

        } catch (error) {
            console.log(error);

            res.status(500).json({message: error.message});
            return;
        }

    }else{
        res.status(500).json({message: "Method Not Allowed"});
        return;
    }
}

export default handler;
import {connectDatabase} from "../../helpers/db-util";
import {verifyPassword} from "../../helpers/auth-utils";


export default async function handler(req, res) {

    if (req.method === 'POST') {

        const {email, password} = req.body;

        if (!email || !password) {
            res.status(422).json({message: 'Invalid Input! Email and Password Required'});
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

            const userCollection = db.collection("users");

            const user = await userCollection.findOne({
                email: email,
            });

            if (!user) {
                await client.close();
                throw new Error("Invalid Credentials");
            }

            const result = await verifyPassword(password, user.password);

            if (!result) {
                await client.close();
                throw new Error("Invalid Credentials");
            }

            await client.close();

            const secret = process.env.NEXTAUTH_SECRET;
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({email: user.email, _id: user._id}, secret);

            res.status(200).json({...user, ...{token: token}});
            return;


        } catch (error) {
            console.log(error.message);
            res.status(500).json({message: error.message});
            return;
        }

    }else{
        res.status(500).json({message: "Method Not Allowed"});
        return;
    }
}

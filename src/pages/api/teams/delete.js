import {connectDatabase} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

async function handler(req, res) {

    if (req.method === 'DELETE') {
        const {id} = req.query;

        if (!id.trim()) {
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
            const secret = process.env.NEXTAUTH_SECRET;
            const token = req.headers.authorization.split(' ')[1];

            const payload = jwt.verify(token, secret);

            if (!payload) {
                throw new Error('Invalid Token');
            }

            const result = await db.collection("teams").deleteOne({
                _id: new ObjectId(id)
            });

            const result2 = await db.collection("teams_pokemon").deleteMany({
                team_id: id
            });


            if (!result || !result2) {
                throw new Error('There was an error deleting to team');
            }

            res.status(201).json(result);
            await client.close();

        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }

    } else {
        res.status(500).json({message: "Method Not Allowed"});
        return;
    }
}

export default handler;
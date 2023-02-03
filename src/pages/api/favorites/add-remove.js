import {connectDatabase} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

async function handler(req, res) {

    if (req.method === 'POST') {
        const {name, info_url, image_url} = req.body;

        if (!name.trim() || !info_url.trim() || !image_url.trim()) {
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

            const existingFav = await db.collection('favorites').findOne({
                name: name,
                user_id: payload._id
            });

            let result;
            if (existingFav) {
                 result = await db.collection("favorites").deleteOne({
                    _id: new ObjectId(existingFav._id)
                });

                if (!result) {
                    throw new Error('There was an error removing to favorites');
                }
            }else{
                result = await db.collection("favorites").insertOne({
                    user_id: payload._id,
                    name: name,
                    image_url: image_url,
                    info_url: info_url,
                });

                if (!result) {
                    throw new Error('There was an error adding to favorites');
                }
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
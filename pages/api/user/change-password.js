import {getSession} from "next-auth/react";
import {connectToDB} from "../../../lib/db";
import {hashPassword, verifyPassword} from "../../../lib/auth";

const handler = async (req, res) => {
    if (req.method !== 'PATCH') return;
    const session = await getSession({req})

    if (!session) {
        res.status(401).json({message: 'Not authenticated'})
        return;
    }

    const userEmail = session.user.email;
    const {oldPassword, newPassword} = req.body

    const client = await connectToDB()

    const usersCollection = client.db().collection('users')

    const user = await usersCollection.findOne({email: userEmail})

    if (!user) {
        res.status(404).json({message: 'User not found.'})
        await client.close();
        return;
    }

    const currentPassword = user.password;

    const matched = await verifyPassword(oldPassword, currentPassword);

    if (!matched) {
        res.status(403).json({message: 'Invalid Password'})
        await client.close();
        return;
    }

    const newHashedPassword = await hashPassword(newPassword)

    const result = await usersCollection.updateOne({email: userEmail}, {$set: {password: newHashedPassword}})

    await client.close();

    res.status(200).json({message: 'Password updated'})

}

export default handler;
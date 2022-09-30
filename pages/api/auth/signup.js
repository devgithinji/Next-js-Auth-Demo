import React from 'react';
import {connectToDB} from "../../../lib/db";
import {hashPassword} from "../../../lib/auth";

const handler = async (req, res) => {
    if (req.method !== 'POST') return;

    const {email, password} = req.body;

    if (!email || !email.includes('@') || !password || password.trim().length < 7) {
        res.status(422).json({
            message: 'Invalid input - password should also be at least 7 characters long.'
        })
        return;
    }
    const client = await connectToDB();
    const db = client.db();

    //check existing user

    const existingUser = await db.collection('users').findOne({email});

    if (existingUser) {
        res.status(422).json({message: 'user exists!'})
        await client.close();
        return;
    }

    const hashedPassword = await hashPassword(password)

    const result = await db.collection('users').insertOne({
        email,
        password: hashedPassword
    })

    res.status(201).json({message: 'created user'})
    await client.close();

};

export default handler;
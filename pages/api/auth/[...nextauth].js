import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {connectToDB} from "../../../lib/db";
import {verifyPassword} from "../../../lib/auth";

export default NextAuth({
    session:{
        jwt: true
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const client = await connectToDB();
                const usersCollections = client.db().collection('users')
                const user = await usersCollections.findOne({email: credentials.email})

                if (!user) {
                    await client.close();
                    throw new Error('No user found!')
                }

                const isValid = await verifyPassword(credentials.password, user.password)

                if (!isValid) {
                    await client.close();
                    throw new Error('Invalid credentials')
                }

                await client.close();

                return {email: user.email};

            }
        })
    ]
});
import {MongoClient} from "mongodb"

export const connectToDB = async () => {
    return await MongoClient.connect('mongodb+srv://user:Densoft1@cluster0.lorgx6p.mongodb.net/next-auth?retryWrites=true&w=majority');
}


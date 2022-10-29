import mongoose, { Mongoose, ConnectOptions, Connection } from 'mongoose';

export default async function ConnectToDatabase(uri: string, user?: string, password?: string): Promise<Connection> {
    const options: ConnectOptions = {
        user,
        pass: password
    };
    
    const connection = await mongoose.connect(uri, options);

    return connection.connection;
}
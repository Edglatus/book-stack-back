import mongoose from 'mongoose';
import ConnectToDatabase from '../../../../src/adapter/mongo/connection';

describe("Basic Connection", () => {
    it("Should create connection", async () => {
        const connection = await ConnectToDatabase("mongodb://mongo:27017/test");

        expect(connection).toBeDefined();

        connection.close();
    });
});
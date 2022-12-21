import mongoose from 'mongoose';
const dbConnection = async (url) => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(url);
        console.log('Connection Successfull');
    } catch (error) {
        console.log(error);
        console.log('Failed to connect');
    }
};
export { dbConnection };

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URL } = process.env;

const connect = (): void => {
  if (!MONGODB_URL) {
    console.log('MONGODB_URL is not defined in environment variables');
    process.exit(1);
  }

  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log(`DB Connection Success`))
    .catch((err) => {
      console.log(`DB Connection Failed`);
      console.log(err);
      process.exit(1);
    });
};

export default { connect }; 
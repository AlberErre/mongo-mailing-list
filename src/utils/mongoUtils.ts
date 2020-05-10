import mongoose from "mongoose";

export const mongoConnect = async (
  url?: string
): Promise<mongoose.Connection> => {
  if (!url) throw new Error("MONGO_URL env param is missing.");

  await mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to database!"))
    .catch((err) => {
      console.log(
        "An error ocurred while connecting to database: ",
        err.message
      );
    });

  return mongoose.connection;
};

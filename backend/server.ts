import { app } from "@app";
import { env } from "@config/env.js";

const port = env.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer()
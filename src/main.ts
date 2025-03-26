import app from "./app";

const PORT: number | string = (Bun.env.PORT as string) || 3000;
app.listen(PORT, () => console.log(`APP is running on PORT ${PORT}`));

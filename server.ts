import { app } from "./app"

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
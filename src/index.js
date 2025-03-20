const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const userRouter = require('./routers/authRoutes.js')
const cardRouter = require('./routers/cardRoutes.js')
const projetoRouter = require('./routers/projetoRoutes.js')

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use("/card", cardRouter )
app.use("/projeto", projetoRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Servidor na porta '+PORT));
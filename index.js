// El archivo encargado de ejecutar el proyecto (Levantarlo)

    //Desestructurar
import { initServer } from "./configs/app.js";
import { config } from "dotenv";
import { connect } from "./configs/mongo.js";

config()
connect()
initServer()
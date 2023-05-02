import type { NextApiRequest, NextApiResponse } from "next";
import {RespostaPadraoMsg} from "../../types/RespostaPadraoMsg";
import {validarTokenJWT} from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";

const usuarioEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        const {userId} = req?.query
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);
    } catch (e) {
        console.log(e);
    } 

    return res.status(400).json({erro: "não foi possivel obter dados do usuario"})
}

export default validarTokenJWT(conectarMongoDB(usuarioEndPoint)); 
import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from "../../middlewares/validarTokenJwt";
const usuarioEndPoint = (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json('Usuario Autenticado com sucesso');
}

export default validarTokenJWT(usuarioEndPoint); //////////// funciona colocando o token manualmente!!!!!!!!!!!!!!!!!!!!!!!
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";

const comentarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === "PUT") {
      const {userId, id} = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      
      if(!usuarioLogado){
        return res.status(405).json({erro: "usuario logado não encontrado"});
      }

      const publicacao = await PublicacaoModel.findById(id);
      if(!publicacao){
        return res.status(405).json({erro: "publicacao não encontrada"});
      }

      if(!req.body || !req.body.comentario || req.body.comentario < 2){
        return res.status(405).json({erro: "Comentario não é valido"});
      }

      const comentario = {
        idUsuario : usuarioLogado.id,
        nome : usuarioLogado.nome,
        comentario: req.body.comentario
      }

      publicacao.comentarios.push(comentario);
      await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
      return res.status(200).json({msg: "Comentario adicionado com sucesso"});
    }
    
    return res.status(405).json({erro: "Metodo informado não é valido"});
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: "Não foi possivel salvar o comentario"});
    
  }
}
export default validarTokenJWT(conectarMongoDB(comentarioEndpoint));
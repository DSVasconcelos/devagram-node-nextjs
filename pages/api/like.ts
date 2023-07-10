import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { InteracaoModel } from "../../models/InteracaoModel";

const likeEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === "PUT") {
     
      const {id} = req?.query;
      const publicacao = await PublicacaoModel.findById(id);
      if(!publicacao) {
        return res.status(400).json({erro:"Publicação não encontrada"});
      }

      const {userId} = req?.query;
      const usuario = await UsuarioModel.findById(userId);
      if(!usuario) {
        return res.status(400).json({erro:"Usuario não encontrado"});
      }

      const IndexUsuarioLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
      //se for maior que -1 -> já curtiu
      if (IndexUsuarioLike != -1) {
        publicacao.likes.splice(IndexUsuarioLike, 1);
        await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
        return res.status(200).json({ msg:"Descurtida com sucesso" });
        
      }else{ //se for maior que  -> curtiu
        publicacao.likes.push(usuario._id);
        await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
        
      //incluir uma nova notificação
        
        const notificacao ={ //dados da nova notificação criada após uma nova curtida
          idPublicacao:publicacao._id,
          idUsuario: usuario._id,
          data: new Date(),
          visualizado: false,
          tipo: "curtida"
        }
        await InteracaoModel.create(notificacao); //salva a nova notificação
        
        return res.status(200).json({ msg:"Curtida com sucesso" });
      }
    }
    return res.status(400).json({ erro:"Metodo Informado não é valido" });
    
  } catch (e) {
    console.log(e);
    return res.status(400).json({ erro:"Ocorreu um erro ao curtir/descurtir uma publicação" });
  }
}

export default validarTokenJWT(conectarMongoDB(likeEndPoint));
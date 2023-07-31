import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { SeguidorModel } from "../../models/SeguidorModel";
import { InteracaoModel } from "../../models/InteracaoModel";
import usuario from "./usuario";

const seguirEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === "PUT") {
   
      const {userId, id} = req?.query;
  
      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({erro:"usuario logado não encontrado"});
      }

      const usuarioASerSeguido = await UsuarioModel.findById(id);
      if (!usuarioASerSeguido) {
        return res.status(400).json({erro:"usuario à ser seguido não encontrado"});
     }

     const JaSigoEsseUsuario = await SeguidorModel.find({
      usuarioId: usuarioLogado._id ,usuarioSeguidoId: usuarioASerSeguido._id
    });
    if (JaSigoEsseUsuario && JaSigoEsseUsuario.length > 0 ) {
      JaSigoEsseUsuario.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id:e._id}));
      usuarioLogado.seguindo--;
      
      await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
      usuarioASerSeguido.seguidores--;
      await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

      return res.status(200).json({erro:"Deixou de seguir o usuario"});
    }
    else{
      const seguidor = {usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id};
      await SeguidorModel.create(seguidor);

      usuarioLogado.seguindo++;
      await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

      usuarioASerSeguido.seguidores++;
      await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

      //adiciona notificação de um novo seguidor
      const notificacao ={ 
        idPublicacao: null,
        idUsuarioSeguido: usuarioASerSeguido._id,
        idUsuario: usuarioLogado._id,
        data: new Date(),
        visualizado: false,
        tipo: "Novo Seguidor"
      }
      await InteracaoModel.create(notificacao);

      return res.status(200).json({erro:"usuario Seguido com sucesso"});
    }
  }
  else{
      return res.status(405).json({erro:"metodo invalido"});
  }
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro:"erro ao seguir/deixar de seguir"});
  }
}

export default validarTokenJWT(conectarMongoDB(seguirEndpoint));
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { InteracaoModel } from "../../models/InteracaoModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";

const NotificacoesEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg> | any) =>{
  try {

    //validar metodo - GET
    if (req.method === "GET"){
      //validar usuario logado
      const {userId} = req.query; //onde é definido userId ???????
      const usuarioLogado = await UsuarioModel.findById(userId);
     
      if (!usuarioLogado){
        return res.status(405).json({erro: "usuario logado não encontrado"});
      }

      //const Notificacoes = await InteracaoModel.find({visualizado:'false'}).sort({data:-1});
      
      const Publicacoes = await PublicacaoModel.find({idUsuario: usuarioLogado.id}); 
      const PublicacoesUsuarioLogado = Publicacoes.map(p => p._id);
      
      const NovasNotificacoes = await InteracaoModel.find({
        $and : [
            {visualizado:'false'},
            {idPublicacao: PublicacoesUsuarioLogado}
        ]
      }).sort({data:-1});

     const HistoricoNotificacoes = await InteracaoModel.find({
        $and : [
            {visualizado:'true'},
            {idPublicacao: PublicacoesUsuarioLogado}
        ]
      }).sort({data:-1});

      return res.status(200).json(HistoricoNotificacoes);
    }
   
    //trazer todas as INTERAÇÕES das PUBLICACÕES do USUARIO LOGADO que constem como NÃO visualizadas
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: "Não foi possivel carregar notificações"});
  }
}

export default validarTokenJWT(conectarMongoDB(NotificacoesEndpoint));
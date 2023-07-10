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
      
      const Publicacoes = await PublicacaoModel.find({idUsuario: usuarioLogado.id}); //traz todas as publicacoes do usuario logado
      const PublicacoesUsuarioLogado = Publicacoes.map(p => p._id);//pega somente id das publicacoes trazidas do usuario logado
      
      const NovasNotificacoes = await InteracaoModel.find({
        $and : [                                            //filtros das novas notificacoes 
            {visualizado:'false'},                         
            {idPublicacao: PublicacoesUsuarioLogado} 
        ]
      }).sort({data:-1});                                  //ordenação dos resultados da busca pela data mais recente

     const HistoricoNotificacoes = await InteracaoModel.find({ 
        $and : [                                          //filtro das notificacoes já vistas
            {visualizado:'true'},
            {idPublicacao: PublicacoesUsuarioLogado}
        ]
      }).sort({data:-1});

      return res.status(200).json(NovasNotificacoes);
    }
   
    /*
      oq falta ? 
      - entender como sempre trazer as notificacoes vistas e não vistas
      - marcar as notificações novas como lidas após consulta.
    */
   
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: "Não foi possivel carregar notificações"});
  }
}

export default validarTokenJWT(conectarMongoDB(NotificacoesEndpoint));
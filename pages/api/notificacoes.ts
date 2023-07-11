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
      
      //obtem todas as publicacoes do usuario logado e mapea somente o id delas
      const Publicacoes = await PublicacaoModel.find({idUsuario: usuarioLogado.id}); 
      const PublicacoesUsuarioLogado = Publicacoes.map(p => p._id);
      
      //filtra as notificacoes novas e ordena pela mais recente
      const NovasNotificacoes = await InteracaoModel.find({
        $and : [                                            
            {visualizado:'false'},                         
            {idPublicacao: PublicacoesUsuarioLogado} 
        ]
      }).sort({data:-1});        

     //filtra e ordena as notificacoes que já foram vistas
      const HistoricoNotificacoes = await InteracaoModel.find({ 
        $and : [                                          //filtro das notificacoes já vistas
            {visualizado:'true'},
            {idPublicacao: PublicacoesUsuarioLogado}
        ]
      }).sort({data:-1});

      /*após a consulta ser feita as notificações novas são marcadas como visualizadas
        na proxima consulta vão aparecer no historico de notificações ⬇⬇⬇⬇*/
      
      const filtro = {visualizado: 'false', idPublicacao:PublicacoesUsuarioLogado}
      const novosValores = {$set:{visualizado: "true"}};
      //"altera muitos" registros com base nos filtros e valores definidos acima
      await InteracaoModel.updateMany(filtro, novosValores);

      return res.status(200).json(HistoricoNotificacoes);
    }
   
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: "Não foi possivel carregar notificações"});
  }
}

export default validarTokenJWT(conectarMongoDB(NotificacoesEndpoint));
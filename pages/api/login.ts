import type {NextApiRequest, NextApiResponse} from 'next'; //importa tipos de requisição e resposta
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'; //importa função de conexão com banco de dados
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import {UsuarioModel} from '../../models/UsuarioModel';
// eslint-disable-next-line import/no-anonymous-default-export
const endpointLogin = async (
  //  cria as variaveis com os tipos importados acima
  req : NextApiRequest,
  res : NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method === 'POST') //valida se o metodo de requisição é POST
    {
      const {login, senha} = req.body; // variaveis para validação, que recebem valores da pagina que está sendo acessada/exibida
      
      const usuariosEncontrado = await UsuarioModel.find({email : login, senha : md5(senha)});

      if(usuariosEncontrado && usuariosEncontrado.length > 0)
        {
          const UsuarioLogado = usuariosEncontrado[0]
          return res.status(200).json({msg: `Usuario ${UsuarioLogado.nome} autenticado com sucesso`}); // Mensagem de sucesso caso o usuario estiver correto e o methodo for POST
        }
        return res.status(405).json({erro: 'Usuario não encontrado'}); //mensagem caso o usuario/senha informado não esteja correto
    }
      
    return res.status(405).json({erro: 'Metodo informado não é valido'}); //mensagem caso o method não seja POST
}

export default conectarMongoDB(endpointLogin); //faz a conexão com o banco antes de tentar fazer a função de login
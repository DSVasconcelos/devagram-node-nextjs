import type {NextApiRequest, NextApiResponse} from 'next'; //importa tipos de requisição e resposta
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'; //importa função de conexão com banco de dados
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
// eslint-disable-next-line import/no-anonymous-default-export
const endpointLogin = (
  //  cria as variaveis com os tipos importados acima
  req : NextApiRequest,
  res : NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method === 'POST') //valida se o metodo de requisição é POST
    {
      const {login, senha} = req.body; // variaveis para validação, que recebem valores da pagina que está sendo acessada/exibida
      
      if(login === 'adm' && senha === '123')
        {
          return res.status(200).json({msg: 'Success'}); // Mensagem de sucesso caso o usuario estiver correto e o methodo for POST
        }
        return res.status(405).json({erro: 'Usuario não encontrado'}); //mensagem caso o usuario/senha informado não esteja correto
    }
      
    return res.status(405).json({erro: 'Metodo informado não é valido'}); //mensagem caso o method não seja POST
}

export default conectarMongoDB(endpointLogin); //faz a conexão com o banco antes de tentar fazer a função de login
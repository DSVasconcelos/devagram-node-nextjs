import type {NextApiRequest, NextApiResponse} from 'next'; //importa tipos de requisição e resposta
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'; //importa função de conexão com banco de dados
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'; //importa as variaveis de resposta erro e msg
import type {LoginResposta} from '../../types/LoginResposta'; //importa as variaveis de resposta nome, email e token
import {UsuarioModel} from '../../models/UsuarioModel'; //importa schema de usuarios para que seja possível salvar os registros
import md5 from 'md5'; // importa padrão de criptografia da senha
import jwt from 'jsonwebtoken'; //importa sistema de autenticação de usuario por token

const endpointLogin = async (
  
  req : NextApiRequest,
  res : NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {

  const {MINHA_CHAVE_JWT} = process.env; //busca a variavel que contem a chave para o token
  if(!MINHA_CHAVE_JWT){
    res.status(500).json({erro:'Chave JWT não encontrada!'}); //validação de autenticidade do token
  }

  if (req.method === 'POST') //valida o metodo
    {
      const {login, senha} = req.body; //pega as variaveis login e senha enviadas pelo usuario
      
      const usuariosEncontrado = await UsuarioModel.find({
        email : login, senha : md5(senha)});   // consulta no banco de dados algum registro com o mesmo login e senha (criptografada)
       
      if(usuariosEncontrado && usuariosEncontrado.length > 0) // valida se os resultados da consulta foram maiores que 1
        {
          const UsuarioLogado = usuariosEncontrado[0] // atribui os registros encontrados à variavel UsuarioLogado
          
          const token = jwt.sign({_id: UsuarioLogado._id}, MINHA_CHAVE_JWT); //criação do token para o id do usuario logado
          
          return res.status(200).json({
            nome: UsuarioLogado.nome, 
            email: UsuarioLogado.email, 
            token
          }); 
        }
        return res.status(405).json({erro: 'Usuario não encontrado'}); 
    }
      
    return res.status(405).json({erro: 'Metodo informado não é valido'}); 
}

export default conectarMongoDB(endpointLogin); //faz a conexão com o banco antes de tentar fazer a função de login
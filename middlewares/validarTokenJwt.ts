import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type {RespostaPadraoMsg} from "../types/RespostaPadraoMsg";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler: NextApiHandler) => 
  (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const {MINHA_CHAVE_JWT} = process.env;
      
      if(!MINHA_CHAVE_JWT){ //verifica se a chave/token possui algum valor
        return res.status(500).json({erro : 'ENV de chave de JWT não informado na execução do projeto'});
      }
      
      if(!req || !req.headers){ //verifica se o usuario enviou algum valor dentro do header
        return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
      }
      console.log("oi");
      if(req.method !== 'OPTIONS'){ 
        const authorization = req.headers['authorization']; //obtem o valor do token que vem nos dados de header
        
        if(!authorization){
          return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
        }

        const token = authorization.substring(7); //lê o token a partir do setimo caracter
        
        if(!token){
          return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
        }

        const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload; //recebe o valor do token e decodifica ele
        
        if(!decoded){
          return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
        }

        if(!req.query){ 
          req.query = {};
        }
        req.query.userId = decoded._id; //salva o valor id do usuario logado
      }
    } catch (e) {
      console.log(e);
      return res.status(401).json({erro: 'Não foi possivel validar o token de acesso'});
    }
    
  return handler(req, res);
}
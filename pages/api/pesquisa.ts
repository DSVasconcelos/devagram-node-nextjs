import { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJwt";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import usuario from "./usuario";

const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) =>{
  try {
    if(req.method === "GET"){
      if (req?.query?.id){
        const usuarioEncontrado = await UsuarioModel.findById(req.query?.id);
        
        if(!usuarioEncontrado){
          return res.status(400).json({erro:"Usuario não encontrado"});
        }
        usuarioEncontrado.senha = null;
        return res.status(200).json(usuarioEncontrado); 
      }else{ 
          const {filtro} = req.query;
      
          if(!filtro || filtro.length < 2){
            return res.status(400).json({erro:"informe ao menos 2 caracteres para fazer a busca"});
          }

          const usuariosEncontrados = await UsuarioModel.find({
            $or:[{
              nome: {$regex : filtro, $options: 'i'}, 
              email: {$regex : filtro, $options: 'i'}
            }]
          });
          
        return res.status(200).json(usuariosEncontrados);
      }     
    }
      return res.status(405).json({erro:"metodo invalido"});
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro:"Erro ao fazer a busca"});
  }
}
export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) => 
  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => 
  {
      if(mongoose.connections[0].readyState){
        return handler(req, res);
      }
      
      const {DB_CONEXAO_STRING} = process.env;
      
      if(!DB_CONEXAO_STRING){
        return res.status(500).json({ erro: 'ENV DE CONFIGURAÇÃO DO BANCO NÃO INFORMADO'});
      }

      mongoose.connection.on('connected', () => console.log('Banco Conectado'));
      mongoose.connection.on('error', error => console.log('Não Conectado'));
      console.log(DB_CONEXAO_STRING);
      await mongoose.connect(DB_CONEXAO_STRING);

      return handler(req, res);
  }

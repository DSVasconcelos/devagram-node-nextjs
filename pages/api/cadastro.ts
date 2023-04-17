import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel'; // importa as funções do banco de dados
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'; // permite fazer a conexão com o banco
import md5 from 'md5';
const endpointCadastro = 
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    if (req.method === 'POST') {
      const usuario = req.body as CadastroRequisicao;
      
      if(!usuario.nome || usuario.nome.length < 2){
        return res.status(400).json({erro:'Nome invalido'});
      }
      
      if(!usuario.email || usuario.email.length < 5 
         || !usuario.email.includes('@') 
         || !usuario.email.includes('.')){
        return res.status(400).json({erro:'Email invalido'});
      }

      if(!usuario.senha || usuario.senha.length < 4){
        return res.status(400).json({erro:'Senha invalida'});
      }
      //valida se o email não está repetindo
      const validacaoEmail = await UsuarioModel.find({email: usuario.email});
      if(validacaoEmail && validacaoEmail.length > 0){
        return res.status(400).json({erro:"já existe usuario com o email informado"});
      }
      // salva os dados no banco
      
      const dadosUsuario = {
        nome : usuario.nome,
        email : usuario.email,
        senha : md5(usuario.senha)
      }
      await UsuarioModel.create(dadosUsuario);
      return res.status(200).json({msg:'Usuario criado com sucesso!'});
    }
    return res.status(405).json({erro:'Metodo invalido'});
}

export default conectarMongoDB(endpointCadastro); //aciona a função
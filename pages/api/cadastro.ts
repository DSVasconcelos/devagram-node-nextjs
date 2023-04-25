import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel'; // importa as funções do banco de dados
import {conectarMongoDB} from '../../middlewares/conectarMongoDB'; // permite fazer a conexão com o banco
import md5 from 'md5';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic'
import nc from 'next-connect';

const handler = nc ()
.use(upload.single('file'))
.post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => 
  {    
    try {
      console.log('cadastro endpoint', req.body);
    const usuario = req.body as CadastroRequisicao;
    
    if(!usuario.nome || usuario.nome.length < 2){
          return res.status(400).json({erro:'Nome invalido'});
    }
    
    if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){
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
    // enviar a imagem do multer para o cosmic
    const image = await uploadImagemCosmic(req);
    // salva os dados no banco
    const dadosUsuario = {
      nome : usuario.nome,
      email : usuario.email,
      senha : md5(usuario.senha),
      avatar : image?.media?.url
    }
    await UsuarioModel.create(dadosUsuario);
    return res.status(200).json({msg:'Usuario criado com sucesso!'});
  
} catch (e) {
    console.log(e);
  }
});
export const config = {
  api: {
    bodyParser : false
  }
}

export default conectarMongoDB(handler); //aciona a função
import mongoose, {Schema} from "mongoose"

const InteracaoSchema = new Schema({
  idPublicacao:  {type: String},
  idUsuarioSeguido: {type: String},
  idUsuario: {type: String, required: true}, // que interagiu
  data: {type: Date, required: true},
  visualizado: {type: Boolean}, //true - false
  tipo: {type: String, required: true} // curtida, comentario, novo seguidor
});

export const InteracaoModel= (mongoose.models.interacoes || mongoose.model('interacoes', InteracaoSchema))
  //Cria a classe Notificacao caso ainda não exista


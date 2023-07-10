import mongoose, {Schema} from "mongoose"

const InteracaoSchema = new Schema({
  idPublicacao:  {type: String, required: true},
  idUsuario: {type: String, required: true}, // que interagiu
  data: {type: Date, required: true},
  visualizado: {type: Boolean}, //true - false
  tipo: {type: String, required: true} // curtida ou comentario
});

export const InteracaoModel= (mongoose.models.interacoes || mongoose.model('interacoes', InteracaoSchema))
  //Cria a classe Notificacao caso ainda não exista


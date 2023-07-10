import multer from "multer";
import cosmicjs from "cosmicjs";
import { createBucketClient } from "@cosmicjs/sdk";

const bucketDevagram = createBucketClient({
  bucketSlug: 'devagram-imagens',
  readKey: '6anNZ80ttL6RhyVr4B8VsdutvV6TbprrkEzpZPeGcCyppCUXnK',
  writeKey: 'Fq4N9xYvk7Xy2ZAl75JCw5T2Wdi1l8rKDcKscKN2w7Tfw4wUx2'
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
  if(req?.file?.originalname){
    if(!req?.file?.originalname.includes('.png') && 
       !req?.file?.originalname.includes('.jpg')&&
       !req?.file?.originalname.includes('.jpeg'))
      {
        throw new Error('Extensão da imagem invalida');
      }

    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };
    
    if(req.url && req.url.includes('publicacao')){
      console.log("nova publicacao");
      return await bucketDevagram.media.insertOne({
        media: media_object,
        folder: 'publicacoes'
      });
     
    }else{
      console.log("foto usuario");
      return await bucketDevagram.media.insertOne({
        media: media_object,
        folder: 'avatares'
    });
   }
  }
}

export {upload, uploadImagemCosmic}
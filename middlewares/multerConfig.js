const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination:(req,file,callback)=>{
      let folder = path.join(__dirname, '../public/images/products')
      callback(null,folder);
  },

  filename:(req,file,callback)=>{
      let imageName = Date.now()+ path.extname(file.originalname);
      callback(null,imageName)
  }
})

const upload = multer({ storage: storage });

module.exports = upload;


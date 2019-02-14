const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const unzip = require('unzip');

const uploadZipDir = multer({
    dest: 'uploadFiles/zip'
})
const uploadUnZipDir = 'uploadFiles/unzip/'

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.send({stats: false, msg: '로그인 필요'});
}

router.get('/getAllData', (req, res) => {
    const searchFolder = uploadUnZipDir + 'user/';
    // 유저 디렉토리 검사
    const check = fs.existsSync(searchFolder);
    let list = []
    if (check) {
        // 유저의 디렉토리가 존재한다면
        walkSync(searchFolder, list);
    }
    res.send({status: true, msg: list})
    
})

const walkSync = (dir, filelist) => {
    const files = fs.readdirSync(dir);
    letfilelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', filelist);
      }
      else {
        filelist.push(dir + file);
      }
    });
    return filelist;
  };

router.post('/upload', isAuthentication, uploadZipDir.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const user = req.user;

        const check = await fileCheck(file, user.username);
        if (!check) {
            res.send({status: false, msg: 'zip, tar 확장자 파일이 아닙니다.'})
        } else {
            res.send(check);
        }
    } catch(e) {
        console.error(e);
        res.send({status: false, msg: e});
    }
    
})

const fileCheck = (file, username) => {
    return new Promise((resolve, reject) => {
        const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1]
        const path = file.path;
        //확장자가 맞다면
        if (fileType === 'zip' || fileType === 'tar') {
            const userDir = uploadUnZipDir + username;
            if(!fs.existsSync(userDir)) {
                //해당 유저의 디렉토리가 존재 하지 않다면 username 디렉토리 생성
                fs.mkdirSync(userDir)
            } else {
                //존재 하지 않다면 압축풀기
                
            }
            fs.createReadStream(path).pipe(unzip.Extract({path: uploadUnZipDir}));
            resolve(true)
        }
        else {
            fs.unlink(path, (err) => {
                if (err) reject(err);
                else {
                    console.log('삭제 완료');
                    // 확장자가 호환되지 않는 파일
                    resolve(false);
                }
            });
        };
    });
};

router.put('/update', async(req, res) => {

})

router.get('/read', async(req, res) => {
    const name = req.query.name;

})
module.exports = router;

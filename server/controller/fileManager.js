const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const unzip = require('unzip');
const tar = require('tar-fs');
const dirTree = require('directory-tree');

const uploadZipDir = multer({
  dest: 'uploadFiles/zip'
});
const uploadUnZipDir = 'uploadFiles/unzip/';
const User = require('../models/users');
const File = require('../models/files');

// 로그인 검사
const isAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.send({ stats: false, msg: '로그인 필요' });
};

router.get('/getAllData', isAuthentication, (req, res) => {
  // 유저의 아이디 디렉토리 검색 경로
  const searchFolder = uploadUnZipDir + req.user.username + '/';
  // 유저 디렉토리 검사
  const check = fs.existsSync(searchFolder);
  let tree = null;
  if (check) {
    // 유저의 디렉토리가 존재한다면
    tree = dirTree(searchFolder);
  }
  res.send({ status: true, msg: tree });
});

router.get('/duplicateFile', isAuthentication, async (req, res) => {
  const fileName = req.query.fileName;
  const user = req.user;

  const userFiles = await User.findOne({ username: user.username }).select(
    'files'
  );

  if (!userFiles.files) {
    res.send({ status: true, msg: '파일이 없으므로 업로드 가능', id: null });
  } else {
    const file = await File.findOne({
      _id: { $in: userFiles.files },
      originalname: fileName
    });

    if (file) {
      // 유저가 가지고 있던 파일이름이라면
      res.send({ status: false, msg: '존재', id: file._id });
    } else {
      res.send({
        status: true,
        msg: '비존재',
        id: null
      });
    }
  }
});

router.post(
  '/upload',
  isAuthentication,
  uploadZipDir.single('file'),
  async (req, res) => {
    try {
      const file = req.file;
      const user = req.user;
      const duplicateId = req.body.id;

      const check = await fileCheckAndExtract(file, user.username);
      if (!check) {
        res.send({ status: false, msg: 'zip, tar 확장자 파일이 아닙니다.' });
      } else {
        //압축해제와 파일 체크가 완료되었다면
        const data = {
          filename: file.filename,
          path: file.path,
          originalname: file.originalname,
          createdDate: Date.now(),
          size: file.size
        };
        let saveResult;

        if (duplicateId !== 'null') {
          // 중복파일이 존재한다면
          saveResult = await File.updateOne(
            { _id: duplicateId },
            { $set: data }
          );
        } else {
          const fileData = new File(data);
          const fileSaveResult = await fileData.save();
          const userData = await User.findOne({ username: user.username });
          userData.files.push(fileSaveResult._id);
          saveResult = await userData.save();
        }
        if (saveResult) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    } catch (e) {
      console.error(e);
      res.send({ status: false, msg: e });
    }
  }
);

const fileCheckAndExtract = (file, username) => {
  return new Promise((resolve, reject) => {
    const fileType = file.originalname.split('.')[
      file.originalname.split('.').length - 1
    ];
    const path = file.path;
    //확장자가 맞다면
    if (fileType === 'zip' || fileType === 'tar') {
      // 유저아이디의 업로드 디렉토리 경로
      const userDir = uploadUnZipDir + username;
      if (!fs.existsSync(userDir)) {
        //해당 유저의 디렉토리가 존재 하지 않다면 username 디렉토리 생성
        fs.mkdirSync(userDir);
      }
      fileType === 'zip'
        ? fs.createReadStream(path).pipe(unzip.Extract({ path: userDir }))
        : fs.createReadStream(path).pipe(tar.extract(userDir));

      resolve(true);
    } else {
      fs.unlink(path, err => {
        if (err) reject(err);
        else {
          // 확장자가 호환되지 않는 파일
          resolve(false);
        }
      });
    }
  });
};

router.get('/read', isAuthentication, async (req, res) => {
  try {
    const path = req.query.path;
    const data = await readFile(path);
    res.send({ status: true, msg: data });
  } catch (e) {
    res.send({ status: false, msg: '해당경로에 맞는 파일이 없습니다.' });
  }
});

// 파일 읽기
const readFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, result) => {
      if (err) reject(err);
      else {
        resolve(result);
      }
    });
  });
};

router.put('/update', isAuthentication, async (req, res) => {
  try {
    const path = req.body.path;
    const newData = req.body.fileContent;
    await isExistPath(path);
    const updateCheck = await updateFile(path, newData);
    res.send({ status: true, msg: updateCheck });
  } catch (e) {
    res.send({ status: false, msg: e });
  }
});

// 경로에 파일 검사
const isExistPath = path => {
  return new Promise((resolve, reject) => {
    fs.exists(path, exists => {
      if (exists) resolve(true);
      else reject('해당 경로에 파일이 존재 하지 않습니다.');
    });
  });
};

// 파일 수정
const updateFile = (path, newData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, newData, 'utf8', err => {
      if (err) {
        console.error(err);
        reject('파일 업데이트 실패');
      } else {
        resolve('파일 업데이트 성공');
      }
    });
  });
};
module.exports = router;

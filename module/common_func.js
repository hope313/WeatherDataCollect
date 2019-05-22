const fs = require('fs');
const path = require('path');
const cfg = require('./config');


// 파일 데이터 내용 읽기(promise)
exports.getData = function (filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(cfg.html_down_dir + filename, function (err, data) {
            if (err) reject(err);
            else {
                resolve(data);
            }
        });
    });
}

// 정보 데이터 파일 생성
exports.writeFile = function (filename, auction_info_json) {
    var json_file_path = './json_data/' + filename + '.json';

    this.checkSaveDir(json_file_path);

    fs.writeFile(json_file_path, auction_info_json, (err) => {
        if (err) throw err;
        console.log('@#@@#@@#@#@#@@##@#@#@#@#', auction_info_json + '@#@@#@@#@#@#@@##@#@#@#@#');
    });
}

// 저장할 디렉토리 존재유무 확인
exports.checkSaveDir = function (fname) {
    // 디렉터리 부분만 검출
    var dir = path.dirname(fname);

    // 디렉토리를 재귀적으로 생성
    var dirlist = dir.split("/");
    var p = "";
    for (var i in dirlist) {
        p += dirlist[i] + "/";
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
}


var fs = require('fs'),
    path = require('path'),
    cp = require('child_process'),
    gulp = require('gulp'),
    args = require('yargs').argv,
    watch = require('gulp-watch');

function renameFile() {
    var p = arguments[0];
    var dirname = p.dirname;
    p.dirname = dirname.slice(0, dirname.indexOf('/')) + '/resource/css/';
}

function renameProjectFile() {
    var p = arguments[0];
    var dirname = p.dirname;
    p.dirname = "";
}

/**
 * [createFile 创建一个文件]
 * @param  {[string]} path    [文件的路径]
 * @param  {[string]} content [文件的内容]
 */
function createFile(_filePath, _content, success) {
    fs.open(_filePath, "w", 0644, function(e, fd) {
        fs.write(fd, _content, 0, 'utf8', function(e) {
            if (e) throw e;
            fs.closeSync(fd);
            success && success.apply(null, [_filePath]);
        })
    });
}

gulp.task('listen', function() {
    var info = args.name;
    info = info.replace(/\/\.\//,'/');
    info = info.replace(/\~$/,'');
    var isSvgRe = /svg\/[\w\-]+\.svg/i;
    if (!isSvgRe.test(args.name)) {
        return;
    };

    console.log(info)

    var re = /(\w*[\/]){1,}iconfonts\//;
    var re2 = /\w*\.svg/;
    var re3 = /svg\//;
    var foldPath = info.replace(re2, '');
    var outerPath = foldPath.replace(re3, '');
    var path = info.replace(re, '');
    var name = path.split('/')[0];
    console.log(outerPath);
    fs.exists(outerPath + '/fontcustom.yml', function(exist) {
           if (exist) {
               console.error('已经存在配置文件！！');
           } else {
               console.log('创建配置文件！');
               fs.open(outerPath + '/fontcustom.yml', "w", 0644, function(e, fd) {
                   var string = 'font_name: '+ name + '\n' +
                                'css_selector: .icon-{{glyph}}' + '\n' +
                                'preprocessor_path: ""' + '\n' +
                                'autowidth: false' + '\n' + 
                                'no_hash: true' + '\n' +
                                'force: false' + '\n' +
                                'debug: false' + '\n' +
                                'quiet: false' + '\n' +

                                'input:' + '\n' + 
                                '  vectors: ' + foldPath + '\n' +

                                'output:' + '\n' +
                                '  fonts: '+outerPath+'fonts/' + '\n';

                   fs.write(fd, string, 0, 'utf8', function(e) {
                       if (e) throw e;
                       fs.closeSync(fd);
                   })
               });
           }
       });
       console.log('cd '+outerPath+' && fontcustom compile');
       cp.exec('cd '+outerPath+' && fontcustom compile');
})


gulp.task('create',function(){
    // 修改支持2个参数，第一个参数项目名，第二个参数icon名
    var param = args.name;
    var arr = param.split(':');
    var name = arr[0];
    var iconName = (arr[1]) ? arr[1] : 'icon';

    var dir = path.join(__dirname,name);

    var svgPath = path.join(dir,'svg');

    var yml = path.join(dir,'fontcustom.yml');
    var link = path.join(dir,'link.url');

    fs.exists(yml, function(exist) {
        if (exist) {
            console.error('已经存在配置文件！！');
        } else {
            console.log('创建配置文件！');
            fs.open(yml, "w", 0644, function(e, fd) {
                var string = 'font_name: ' + name + '\n' +
                    'css_selector: .'+iconName+'-{{glyph}}' + '\n' +
                    'preprocessor_path: ""' + '\n' +
                    'autowidth: false' + '\n' +
                    'no_hash: true' + '\n' +
                    'force: false' + '\n' +
                    'debug: false' + '\n' +
                    'quiet: false' + '\n' +

                    'input:' + '\n' +
                    '  vectors: ' + svgPath + '\n' +

                    'output:' + '\n' +
                    '  fonts: ' + dir + '/fonts/' + '\n';

                fs.write(fd, string, 0, 'utf8', function(e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                })
            });
        }
    });


    fs.exists(link, function(exist) {
        if (exist) {
            console.error('已经存在链接！！');
        } else {
            console.log('创建链接！');
            fs.open(link, "w", 0644, function(e, fd) {
                var string = '[InternetShortcut]' + '\n' +
                    'URL=http://tvvt.yhd.cn:3000/iconfonts/' + name + '/fonts/' + name + '-preview.html' + '\n' ;

                fs.write(fd, string, 0, 'utf8', function(e) {
                    if (e) throw e;
                    fs.closeSync(fd);
                })
            });
        }
    });
    console.log('cd ' + dir + ' && fontcustom compile');
    cp.exec('cd ' + dir + ' && fontcustom compile');

})


// 监控svg文件夹变化
gulp.task('watch', function() {
    gulp.watch('**/svg/*.svg',function(info){
        console.log(info);
        console.log('start watch svg change at: ' + info.path);
        var re = /(\w*[\/]){1,}iconfonts\//;
        var re2 = /\w*\.svg/;
        var re3 = /svg\//;
        var foldPath = info.path.replace(re2, '');
        var outerPath = foldPath.replace(re3, '');
        var path = info.path.replace(re, '');
        // 修改支持2个参数，第一个参数项目名，第二个参数icon名
        var param = args.name;
        var arr = param.split(':');
        var name = arr[0];
        var iconName = (arr[1]) ? arr[1] : 'icon';
        console.log(foldPath, outerPath);

        fs.exists(outerPath + '/fontcustom.yml', function(exist) {
            if (exist) {
                console.error('已经存在配置文件！！');
            } else {
                console.log('创建配置文件！');
                fs.open(outerPath + '/fontcustom.yml', "w", 0644, function(e, fd) {
                    var string = 'font_name: ' + name + '\n' +
                        'css_selector: .'+iconName+'-{{glyph}}' + '\n' +
                        'preprocessor_path: ""' + '\n' +
                        'autowidth: false' + '\n' +
                        'no_hash: true' + '\n' +
                        'force: false' + '\n' +
                        'debug: false' + '\n' +
                        'quiet: false' + '\n' +

                        'input:' + '\n' +
                        '  vectors: ' + foldPath + '\n' +

                        'output:' + '\n' +
                        '  fonts: ' + outerPath + 'fonts/' + '\n';

                    fs.write(fd, string, 0, 'utf8', function(e) {
                        if (e) throw e;
                        fs.closeSync(fd);
                    })
                });
            }
        });

        fs.exists(outerPath + '/link.url', function(exist) {
            if (exist) {
                console.error('已经存在链接！！');
            } else {
                console.log('创建链接！');
                fs.open(outerPath + '/link.url', "w", 0644, function(e, fd) {
                    var string = '[InternetShortcut]' + '\n' +
                        'URL=http://tvvt.yhd.cn:3000/iconfonts/' + name + '/fonts/' + name + '-preview.html' + '\n' ;

                    fs.write(fd, string, 0, 'utf8', function(e) {
                        if (e) throw e;
                        fs.closeSync(fd);
                    })
                });
            }
        });
        console.log('cd ' + outerPath + ' && fontcustom compile');
        cp.exec('cd ' + outerPath + ' && fontcustom compile');
    });

});

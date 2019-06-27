/*
 * @Author: Mr Jiang.Xu 
 * @Date: 2019-06-27 10:50:10 
 * @Last Modified by:   Mr Jiang.Xu 
 * @Last Modified time: 2019-06-27 10:50:10 
 */

(function(win, doc){
    function xjFile(opt) {
        var defaultOption = {
            el: doc.body,
            accept: '*', // 格式按照'image/jpg,image/gif'传
            clsName: 'xj-wrap',
            beforeUpload: function(e) { console.log(e) },
            onProgress: function(e) { console.log(e) },
            onLoad: function(e) { console.log(e) },
            onError: function(e) { console.error('文件读取错误', e) }
        };

        // 获取dom
        if(opt.el) {
            opt.el = typeof opt.el === 'object' ? opt.el : document.querySelector(opt.el);
        }

        this.opt = minix(defaultOption, opt);
        this.value = '';
        this.init();
    }

    xjFile.prototype.init = function() {
        this.render();
        this.watch();
    }

    xjFile.prototype.render = function() {
        var fragment = document.createDocumentFragment(),
            file = document.createElement('input'),
            imgBox = document.createElement('div');
        file.type = 'file';
        file.accept = this.opt.accept || '*';
        file.className = 'xj-file';
        imgBox.className = 'xj-pre-img';
        // 插入fragment
        fragment.appendChild(file);
        fragment.appendChild(imgBox);
        // 给包裹组件设置class
        this.opt.el.className = this.opt.clsName;
        this.opt.el.appendChild(fragment);
    }

    xjFile.prototype.watch = function() {
        var ipt = this.opt.el.querySelector('.xj-file');
        var _this = this;
        ipt.addEventListener('change', (e) => {
            var file = ipt.files[0];

            // 给组件赋值
            _this.value = file;

            var fileReader = new FileReader();

            // 读取文件开始时触发
            fileReader.onloadstart = function(e) {
                if(_this.opt.accept !== '*' && _this.opt.accept.indexOf(file.type.toLowerCase()) === -1) {
                    fileReader.abort();
                    _this.opt.beforeUpload(file, e);
                    console.error('文件格式有误', file.type.toLowerCase());
                }
            }

            // 读取完成触发的事件
            fileReader.onload = (e) => {
                var imgBox = this.opt.el.querySelector('.xj-pre-img');
                if(isImage(file.type)) {
                    imgBox.innerHTML = '';
                    imgBox.style.backgroundImage = 'url(' + fileReader.result + ')';
                } else {
                    imgBox.innerHTML = fileReader.result;
                }
                
                imgBox.title = file.name;

                this.opt.onLoad(e);
            }

            // 文件读取出错事件
            fileReader.onerror = (e) => {
                this.opt.onError(e);
            }

            // 文件读取进度事件
            fileReader.onprogress = (e) => {
                this.opt.onProgress(e);
            }

            isImage(file.type) ? fileReader.readAsDataURL(file) : fileReader.readAsText(file);
            
        }, false);
    }

    // 清除ipt和组件的值，支持链式调用
    xjFile.prototype.clearFile = function() {
        this.opt.el.querySelector('.xj-file').value = '';
        this.value = '';
        return this
    }

    // 简单对象混合
    function minix(source, target) {
        for(var key in target) {
            source[key] = target[key];
        }
        return source
    }

    // 检测图片类型
    function isImage(type) {
        var reg = /(image\/jpeg|image\/jpg|image\/gif|image\/png)/gi;
        return reg.test(type)
    }

    // 将方法挂载到window上
    win.xjFile = xjFile;

})(window, document);
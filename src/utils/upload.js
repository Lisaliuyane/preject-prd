import { Base64 } from './Base64'
import { CryptoUtil } from './index'
//  import Crypto from 'crypto'
import plupload from 'plupload'
import Moxieswf from './Moxie.swf'
import Moxiexap from './Moxie.xap'
import uuidv3  from 'uuid/v1'
import moment from 'moment'

const accessid= 'LTAIbH8hu0UeKsCM';
const accesskey= 'h3RdiKm0ohUUN5tzRMoZ0nvqh0ohOp';
const host = 'http://frdscm.oss-cn-shenzhen.aliyuncs.com';
// const host = 'http://post-test.oss-cn-hangzhou.aliyuncs.com';

let g_dirname = ''
let g_object_name = ''
let g_object_name_type = ''
let suffix = ''

const now = Date.parse(new Date()); 
const timestamp = now

const HMAC = function (hasher, message, key, options) {

	// Allow arbitrary length keys
	key = key.length > hasher._blocksize * 4 ?
	      hasher(key, { asBytes: true }) :
	      CryptoUtil.stringToBytes(key);

	// XOR keys with pad constants
	var okey = key,
	    ikey = key.slice(0);
	for (var i = 0; i < hasher._blocksize * 4; i++) {
		okey[i] ^= 0x5C;
		ikey[i] ^= 0x36;
	}

	var hmacbytes = hasher(CryptoUtil.bytesToString(okey) +
	                       hasher(CryptoUtil.bytesToString(ikey) + message, { asString: true }),
	                       { asBytes: true });
	return options && options.asBytes ? hmacbytes :
	       options && options.asString ? CryptoUtil.bytesToString(hmacbytes) :
	       CryptoUtil.bytesToHex(hmacbytes);

}

const SHA1 = function (message, options) {
	var digestbytes = CryptoUtil.wordsToBytes(SHA1._sha1(message));
	return options && options.asBytes ? digestbytes :
	       options && options.asString ? CryptoUtil.bytesToString(digestbytes) :
	       CryptoUtil.bytesToHex(digestbytes);
}
SHA1._sha1 = function (message) {

	var m  = CryptoUtil.stringToWords(message),
	    l  = message.length * 8,
	    w  =  [],
	    H0 =  1732584193,
	    H1 = -271733879,
	    H2 = -1732584194,
	    H3 =  271733878,
	    H4 = -1009589776;

	// Padding
	m[l >> 5] |= 0x80 << (24 - l % 32);
	m[((l + 64 >>> 9) << 4) + 15] = l;

	for (var i = 0; i < m.length; i += 16) {

		var a = H0,
		    b = H1,
		    c = H2,
		    d = H3,
		    e = H4;

		for (var j = 0; j < 80; j++) {

			if (j < 16) w[j] = m[i + j];
			else {
				var n = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
				w[j] = (n << 1) | (n >>> 31);
			}

			var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
			         j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
			         j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
			         j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
			                  (H1 ^ H2 ^ H3) - 899497514);

			H4 =  H3;
			H3 =  H2;
			H2 = (H1 << 30) | (H1 >>> 2);
			H1 =  H0;
			H0 =  t;

		}

		H0 += a;
		H1 += b;
		H2 += c;
		H3 += d;
		H4 += e;

	}

	return [H0, H1, H2, H3, H4];

};
SHA1._blocksize = 16;

let policyText = {
    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};

let policyBase64 = Base64.encode(JSON.stringify(policyText))
let message = policyBase64
let bytes = HMAC(SHA1, message, accesskey, { asBytes: true });
let signature = CryptoUtil.bytesToBase64(bytes);

function check_object_radio() {
    // let tt = document.getElementsByName('myradio');
    // for (let i = 0; i < tt.length ; i++ )
    // {
    //     if(true)
    //     {
    //         g_object_name_type = 'local_name';
    //         break;
    //     }
    // }
    // g_object_name_type = 'local_name'
    g_object_name_type = 'random_name'
}

function get_dirname() {
    // let dir = document.getElementById("dirname").value;
    // if (dir != '' && dir.indexOf('/') != dir.length - 1)
    // {
    //     dir = dir + '/'
    // }
    //alert(dir)
    let time = moment(timestamp).format('YYYY-MM-DD')
    g_dirname = time + '/'
}

function random_string() {
    let reg = /-/g;
    let pwd = uuidv3().replace(reg, '')
    return pwd;
}

function get_suffix(filename) {
    let pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename, s) {
    if (g_object_name_type == 'local_name') {
        g_object_name += "${filename}"
    } else if (g_object_name_type == 'random_name') {
        suffix = get_suffix(filename)
        g_object_name = g_dirname + s + suffix
    }
    return g_object_name
}

function get_uploaded_object_name(filename) {
    if (g_object_name_type == 'local_name') {
        let tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    } else if(g_object_name_type == 'random_name') {
        return g_object_name
    }
}

function set_upload_param(up, filename, ret) {
    g_object_name = g_dirname;
    let fileuname = random_string() || ''
    let suffix = get_suffix(filename) || ''
    let key = calculate_object_name(filename, fileuname) || ''
    // if (filename != '') {
    //     suffix = get_suffix(filename)
    //     fileuname = random_string()
    //     calculate_object_name(filename, fileuname)
    // }
    let new_multipart_params = {
        'key' : key,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
    return {
        fileuname: fileuname,
        suffix: suffix,
        key: key
    }
}

// export default (button, dom) => {
//     let uploader = new plupload.Uploader({
//         runtimes: 'html5,flash,silverlight,html4',
//         browse_button: button, 
//         //multi_selection: false,
//         container: dom,
//         flash_swf_url : Moxieswf,
//         silverlight_xap_url : Moxiexap,
//         url : 'http://oss.aliyuncs.com',
    
//         init: {
//             PostInit: function() {
//                 // document.getElementById('ossfile').innerHTML = '';
//                 // document.getElementById('postfiles').onclick = function() {
//                 //     set_upload_param(uploader, '', false);
//                 //     return false;
//                 // };
//             },
    
//             FilesAdded: function(up, files) {
//                 plupload.each(files, function(file) {
//                     // document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
//                     // +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
//                     // +'</div>';
//                     console.log('file', file)
//                 });
//             },
    
//             BeforeUpload: function(up, file) {
//                 check_object_radio();
//                 get_dirname();
//                 set_upload_param(up, file.name, true);
//             },
    
//             UploadProgress: function(up, file) {
//                 // let d = document.getElementById(file.id);
//                 // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
//                 // let prog = d.getElementsByTagName('div')[0];
//                 // let progBar = prog.getElementsByTagName('div')[0]
//                 // progBar.style.width= 2*file.percent+'px';
//                 // progBar.setAttribute('aria-valuenow', file.percent);
//                 console.log('file.percent', file.percent)
//             },
    
//             FileUploaded: function(up, file, info) {
//                 if (info.status == 200) {
//                     console.log('success')
//                     // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
//                 } else {
//                     // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
//                     // console.log('info.response', info.response)
//                 } 
//                 console.log('info.response', info.response)
//             },
    
//             Error: function(up, err) {
//                 // document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
//             }
//         }
//     });
    
//     uploader.init();
    
//     return () => {
//         set_upload_param(uploader, '', false)
//     }
// }

export const UploadFile = () => {
    return new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        // browse_button: button, 
        //multi_selection: false,
        // container: dom,
        flash_swf_url : Moxieswf,
        silverlight_xap_url : Moxiexap,
        url : 'http://oss.aliyuncs.com',
        filters: { //限制文件格式
            mime_types: [
                {title : "Image files", extensions : "doc,docx,xls,xlsx,csv,txt,ppt,pptx,pdf,zip,png,jpg,gif,bmp,jepg" }
            ]
        }
    })
}

export default class UploaderLib {

    listener={}

    constructor(button, dom) {
        this.uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: button, 
            //multi_selection: false,
            container: dom,
            flash_swf_url : Moxieswf,
            silverlight_xap_url : Moxiexap,
            url : 'http://oss.aliyuncs.com',
            filters: { //限制文件格式
                mime_types: [
                    {title : "Image files", extensions : "doc,docx,xls,xlsx,csv,txt,ppt,pptx,pdf,zip,png,jpg,gif,bmp,jepg" }
                ]
            },
            // multi_selection: true, //支持多选
            init: {
                PostInit: () => {
                    // document.getElementById('ossfile').innerHTML = '';
                    // document.getElementById('postfiles').onclick = function() {
                    //     set_upload_param(uploader, '', false);
                    //     return false;
                    // };
                },
        
                FilesAdded: (up, files) => {
                    let ansyFiles = []
                    plupload.each(files, function(file) {
                        // document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                        // +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                        // +'</div>';
                        //console.log('file', file)
                        ansyFiles.push(file)
                        
                    });
                    this.event({
                        type: 'addfile',
                        content: ansyFiles
                    })
                },
        
                BeforeUpload: (up, file) => {
                    check_object_radio();
                    get_dirname();
                    let param = set_upload_param(up, file.name, true);
                    this.fileuname = param.fileuname
                    this.event({
                        type: 'beforeUpload',
                        content: Object.assign({}, param, {name: file.name}, {file: file})
                    })
                },
        
                UploadProgress: (up, file) => {
                    // let d = document.getElementById(file.id);
                    // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    // let prog = d.getElementsByTagName('div')[0];
                    // let progBar = prog.getElementsByTagName('div')[0]
                    // progBar.style.width= 2*file.percent+'px';
                    // progBar.setAttribute('aria-valuenow', file.percent);
                    // console.log('file.percent', file)
                    this.event({
                        type: 'percent',
                        content: file.percent,
                    })
                },
        
                FileUploaded: (up, file, info) => {
                    if (info.status == 200) {
                        //console.log('success')
                        // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
                    } else {
                        // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                        // console.log('info.response', info.response)
                    } 
                    //console.log('info.response', info)
                    this.event({
                        type: 'success',
                        content: {
                            file: file,
                            filename: this.fileuname
                        }
                    })
                },
        
                Error: (up, err) => {
                    // document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                    this.event({
                        type: 'uperror',
                        content: err
                    })
                }
            }
        });
        
        this.uploader.init();
    }

    addListen(key, fuc) {
        this.listener[key] = fuc
    }

    event(e) {
        for (let key in this.listener) {
            this.listener[key](e)
        }
    }

    submit() {
        set_upload_param(this.uploader, '', false)
    }

    getUploader() {
        return this.uploader
    }

}

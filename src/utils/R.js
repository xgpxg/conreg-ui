import axios from 'axios'
import qs from 'qs';
import {ElLoading, ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import {U} from "./util";
import store from "@/store";

const DefaultParam = {loading: false, repeatable: false};

const API = import.meta.env.VITE_API

export const R = {
    PREFIX: API,
    requestingApi: new Set(),
    extractUrl: function (url) {
        return url ? url.split('?')[0] : '';
    },
    isRequesting: function (url) {
        let api = this.extractUrl(url);
        return this.requestingApi.has(api);
    },
    addRequest: function (url) {
        let api = this.extractUrl(url);
        this.requestingApi.add(api);
    },
    deleteRequest: function (url) {
        let api = this.extractUrl(url);
        this.requestingApi.delete(api);
    },
    get: function (url, param, extendParam) {
        let params = {
            url,
            method: 'GET'
        };
        if (param) {
            params.params = param;
        }
        return this.ajax(params, extendParam);
    },
    post: function (url, param, extendParam) {
        var params = {
            url,
            method: 'POST'
        };
        if (param) params.data = qs.stringify(param);
        return this.ajax(params, extendParam);
    },
    postJson: function (url, paramJson, extendParam) {
        return this.ajax({
            url,
            method: 'POST',
            data: paramJson
        }, extendParam);
    },
    patchJson: function (url, paramJson, dataType, extendParam) {
        return this.ajax({
            url,
            method: 'PATCH',
            data: paramJson
        }, extendParam);
    },
    delete: function (url, extendParam) {
        return this.ajax({
            url: url,
            method: 'DELETE'
        }, extendParam);
    },
    /**
     * 上传文件
     * @param url
     * @param file
     * @param paramJson
     * @returns {Promise<unknown>}
     */
    upload(url, file, paramJson) {
        let formData = new FormData()
        formData.append('file', file)
        if (paramJson) {
            Object.keys(paramJson).forEach(key => {
                formData.append(key, paramJson[key])
            })
        }
        const params = {
            url,
            method: 'POST',
            data: formData

        };
        return this.ajax(params, {});
    },
    ajax: function (param, extendParam) {
        let params = this.extend({}, DefaultParam, param, extendParam || {});
        params.crossDomain = params.url.indexOf('http') === 0;
        let url = params.url;
        if (!params.crossDomain) {
            url = params.url = this.PREFIX + params.url;
        }

        if (params.method !== 'GET') {
            if (this.isRequesting(url)) {
                return new Promise((resolve, reject) => {
                    resolve({ok: false, msg: 'Duplicate request'});
                });
            }
            if (params.repeatable === false) {
                this.addRequest(url);
            }
        }
        let header = {
            Authorization: 'Bearer ' + store.state.user.token,
            //SystemCode: 'console'
        };
        let defaultParam = {
            headers: header,
            responseType: 'json',
            validateStatus: function (status) {
                return true;
            },
            paramsSerializer: (params) => {
                return qs.stringify(params, {allowDots: true});
            }
        };
        if (params.crossDomain) {
            defaultParam.headers = {};
        }
        let that = this;
        if (params.loading)
            ElLoading.service({text: "Loading..."});

        params = this.extend({}, defaultParam, params);
        return new Promise((resolve) => {
            return axios.request(params).then((response) => {
                that.deleteRequest(params.url);
                let data = response.data;
                let status = response.status;
                if (status === 500) {
                    ElMessage.error('服务异常');
                } else if (status === 503) {
                    ElMessage.error('服务升级中，请稍后');
                } else if (status > 300) {
                    let errMsg = `${response.status} ${response.statusText} : ${JSON.stringify(data)}`;
                    if (status === 404) {
                        errMsg = `${response.status} ${response.statusText} : ${url}`
                    }
                    if (status === 401) {
                        reLogin()
                        return
                    }
                    //let errMsg = data.error;
                    ElMessage.error(errMsg);
                    throw new Error(errMsg);
                } else {
                    //服务端统一返回码
                    if (data.code === 6) {
                        ElMessage.error(`${data.msg}`);
                        throw new Error(data.msg);
                    } else if (data.code === 10003 || data.code === 10004 || data.code === 10005) {
                        reLogin()
                        return
                    } else if (data.code) {
                        ElMessage.error(`${data.msg}`);
                        throw new Error(data.msg);
                    }

                    if (typeof data == 'object') {
                        data.ok = true;
                    } else {
                        data = {};
                        data.ok = true;
                    }
                }
                resolve(data);
            }).catch((err) => {
                that.deleteRequest(params.url);
                if (params.loading) {
                    Loading.service().close();
                }
                resolve({
                    ok: false
                });
            });
        });
    },
    extend() {
        let options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};

            i = 2;
        }
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;

            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (U.isPlainObject(copy) || (copyIsArray = U.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && U.isArray(src) ? src : [];
                        } else {
                            clone = src && U.isPlainObject(src) ? src : {};
                        }

                        target[name] = this.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
};


////////////////重新登录//////////////////

//是否已经打开了未登录提示框，防止同时打开多个
let TO_LOGIN_BOX_IS_OPEN = 0

function reLogin() {
    if (!TO_LOGIN_BOX_IS_OPEN) {
        ElMessageBox.alert('登录状态已失效，请重新登录', {
            beforeClose: (action, instance, done) => {
                done()
                TO_LOGIN_BOX_IS_OPEN = 0
                //重定向到首页
                window.location.replace('/login')
            },
            showClose: false
        })
        TO_LOGIN_BOX_IS_OPEN = 1
        //清理token
        store.commit('user/resetToken')
    }
}

//////////////////////////////////////////
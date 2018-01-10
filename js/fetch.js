var NODE_ENV = "api"; //api是服务器实测环境，easy是mock环境
/*var api_server = axios.create({
  baseURL: 'https://easy-mock.com/mock/5a29537670188c51fc72df8f/irh',
  timeout: 5000,
});*/
var ROOT = 'http://120.76.200.217:9090';
if(NODE_ENV == "api"){
    var api_server = axios.create({
      baseURL: ROOT,
      timeout: 5000,
    });
    api_server.defaults.headers = {
        token: "M3Bu8CXsuQhCvBH8JTkkjpCc81qUz4DK44bL3vhDsCungmuLrHseo2SNeDVNFBJzBq/1SbeEU0VVrq/CPVurCyMt5+YlQ735w/W/auBpyQSE9kkn24eySK7T2ZdoYZgX6PXALReS5l51QwzVf0eQnYvDJJBKxG91Wpz9cvbg3Rw=",
        post:{
            'Content-Type':'application/json;charset=UTF-8'
        }
    };
}
// api_server.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


//请求拦截器
api_server.interceptors.request.use(function (config) {
    if (config.method == 'post') {
        config.data = JSON.stringify(config.data)
        console.log('请求地址' + config.url, '请求参数', JSON.parse(config.data))
    }
    return config
}, function (error) {
    console.log("错误的传参")
    return Promise.reject(error)
})
//响应拦截器
api_server.interceptors.response.use(function (res) {
    if (res.data.code >= 0) {
        if (res.data.code > 40000){
            return Promise.reject('错误代码:'+res.data.code+","+res.data.msg)
        }else{
            return res.data.data
        }
    } else{
        return res.data
    }
    
}, function (error) {
    if (error.message.indexOf('timeout') >= 0) {
        return Promise.reject('请求超时')
    }
    else if (error.message.indexOf('Network Error') >= 0) {
        return Promise.reject('网络连接错误')
    }
    else if (error.message.indexOf('404') >= 0) {
        console.log('404');return;
    }
    return Promise.reject('网络好像出问题了')
})

get = function (url, para) {
    return new Promise(function (resolve, reject) {
        api_server.get( url , {params: para })
            .then(function (res) {
                resolve(res);
            }, function (err) {
                reject(err)
            })
            .catch(function (error) {
                reject(error)
            })
    })
};

post = function (url, params) {
    return new Promise(function (resolve, reject) {
        api_server.post(url, params)
            .then(function (response) {
                resolve(response)
            }, function (err) {
                reject(err)
            })
            .catch(function (error) {
                reject(error)
            })
    })
}


Vue.component('layer', function (resolve, reject) {
  axios.get(
      "/template/layer.html",
      {baseURL: "/", headers: {} }
    )
  .then(
      function(res){
          resolve({
            template: res,
            props:{
              visible: {type: [Boolean], default: false},
              tt: {type: [Number], default: 2}   
            }
          })
    })
});

Vue.component('test', {
props:{
    visi: {type: [Boolean], default: true},
    visi2: {type: [String], default: ""}
},
    data:function (){
        return  {link:""}
    },
    template: "<div>{{visi2}}fdfd--<a href='#' @click='clickH'>测试组件</a></div>",
    methods: {
clickH:function(n) {
  this.$emit('update:visi', false);
  this.$emit('update:visi2', "bbb")
}
    }
});



// 接收传参地址的返回链接
Vue.component('bb', {
    props:{
        // 在上一页地址为空时，链接到href
        href: {type: [String], default: ""}
    },
    data:function (){
        return  {
            link:getQS("from")
        }
    },
    template: "<a :href='link'><slot></slot></a>",
    mounted:function () {
        if (getQS("from")==null) {
            this.link=this.href;
        }
    },
});

// select
Vue.component('du_select', {
    props:{
      default: {type: [String], default: "请选择"}  
    },
    mounted: function() {
      this.val = this.default;
    },
    data:function (){
        return  {
           val:""
        }
    },
    template: "<div class='du_select'>{{val}} <i class='iconfont icon-enter'></i></div>"
});

// select
Vue.component('du_option', {
    props: ["arr","show"] ,
    data:function (){return  {} },
    methods: {
      clickH:function(n) {
        this.$emit('change',n);
      }
    },
    template: "<transition name='t2'><ul class='du_option' v-if='show'> <li v-for='item in arr' @click='clickH(item)'>{{item}}</li> </ul></transition>"
});

// 顶部导航header
Vue.component('du_header', {
 
    props:{
      href: {type: [String], default: ""},  
      tit: {type: [String], default: ""}  
    },
    
    data:function (){
        return  {
           val:""
        }
    },
    template: "<nav class='layout_head' >\
                  <bb class='left' :href='href'><i class='iconfont icon-nav_fanhui_baise'></i></bb>\
                  <h1>{{tit}}</h1>\
                  <div class='right'><slot></slot></div>\
                </nav>"
});


// 过滤器，限止10个字
Vue.filter('substr', function(str) {  
  var tt = (str.length>10)?"..":"";
  var v = str.substring(0,10) + tt;
  return v;
})

// 时间转换1--输出“早上 07:22”
Vue.filter('ctime1', function(str) {  
  moment.locale("zh-cn");
  var v = moment(new Date(str)).format("a HH:mm");
  return v;
})
var MMD = moment().format('YYYY-MM-DD');
var MMT = moment().format('HH:mm');

// 获取当前坐标位置
function getPosition()
{
    return new Promise(function(resolve) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(resolve);
        })
}

// 获取当前文件名前缀
function getJsonName()
{
    var str = window.location.pathname;
    var name = str.split("/").pop().split(".")[0];
    return 'data/' + name+'.json';
}


// 获取路径参数
function getQS(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function str2arr(str)
{
  if(str){
    return str.split(",");
  }else{
    return []
  }
}

function arr2str(arr)
{
  return arr.join(",");
}


var mixin_common = {
    data:{
      search_key:"",
      qs:{}   //专门用来接收页面传参
    }, 
    mounted: function() {
      
    },
    /*watch:{
      loading:function(curVal,oldVal){}
    },*/
    
    methods: {
      toast:function(str,flag) {
        flag = flag?flag:"";
        this.$dialog.toast({
          mes: str,
          icon: flag,
          timeout: 2000
        });
      },

      loading:function(flag) {
        if(flag){
          document.querySelector("#loading").style.display="block";
        }else{
          document.querySelector("#loading").style.display="none";
        }
      },
    }
    
};


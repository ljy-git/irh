var mixin_test = {
    props:["test"],
    methods: {
      init_test:function() {
        this.list = this.test;
        this.$root.loading(false);
        return false;
      }
    }
};

Vue.component('du_list_post', function (resolve, reject) {
  axios.get(
      "template/du_list.html"
    )
  .then(
      function(res){
          resolve({
            mixins: [mixin_test],
            template: res.data,
            props:["url","api_para"],
            data:function (){
                return  {
                    page : 0,
                    para : {},
                    list : []
                }
            },
            methods: {
              init:function() {
                
                var _this = this;
                this.para = this.api_para?this.api_para:{};

                this.page = 0;
                this.list = [];
                this.$refs.end.$emit('ydui.infinitescroll.reInit');
                this.loadList();
              },
              loadList:function() {
                  var _this = this;
                  this.page++
                  this.para["page"] = this.page;
                  post(this.url, this.para )
                  .then(
                      function (res) {
                          if(res.total){
                            console.log(_this.$attrs.name,'--此列表分页');
                            var num_page = Math.ceil(res.total/res.pageSize);
                            if(_this.page < num_page){
                                _this.$refs.end.$emit('ydui.infinitescroll.finishLoad');
                            }else{
                                _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                            }
                          }else{
                            console.log(_this.$attrs.name,'--此列表不分页');
                            _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                          }
                          
                          _this.$root.loading(false);
                          _this.list = _this.list.concat(res.items);
                          
                      }
                  ).catch(
                      function (err) {
                          _this.$dialog.toast({mes: err, icon: 'error', timeout: 2000 });
                      }
                  )
                   
              }
            },
            mounted: function() {
              if(this.test){
                this.init_test();
              }else{
                this.init();
              }
            }
          })
    })
});

Vue.component('du_list', function (resolve, reject) {
  axios.get(
      "template/du_list.html"
    )
  .then(
      function(res){
          resolve({
            mixins: [mixin_test],
            template: res.data,
            props:["url","api_para"],
            data:function (){
                return  {
                    page : 0,
                    para : {},
                    list : []
                }
            },
            methods: {
              init:function() {
                var _this = this;
                this.para = this.api_para?this.api_para:{};

                this.page = 0;
                this.list = [];
                this.$refs.end.$emit('ydui.infinitescroll.reInit');
                this.loadList();
              },
              loadList:function() {
                  var _this = this;
                  this.page++
                  this.para["page"] = this.page;
                  get(this.url, this.para )
                  .then(
                      function (res) {
                          if(res.pageSize){
                            console.log(_this.$attrs.name,'--此列表分页');
                            var num_page = Math.ceil(res.total/res.pageSize);
                            if(_this.page < num_page){
                                _this.$refs.end.$emit('ydui.infinitescroll.finishLoad');
                            }else{
                                _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                            }
                          }else{
                            console.log(_this.$attrs.name,'--此列表不分页');
                            _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                          }
                          
                          _this.$root.loading(false);
                          _this.list = _this.list.concat(res.items);
                      }
                  ).catch(
                      function (err) {
                          _this.$dialog.toast({mes: err, icon: 'error', timeout: 2000 });
                      }
                  )
                   
              }
            },
            mounted: function() {
              if(this.test){
                this.init_test();
              }else{
                this.init();
              }
            }
          })
    })
});

Vue.component('du_2_1', function (resolve, reject) {
  axios.get(
      "template/du_2_1.html"
    )
  .then(
      function(res){
          resolve({
            template: res.data,
            props:{
              url1: {type: [String], default: ""},  //输入
              url2: {type: [String], default: ""},  //输出
              tit: {type: [String], default: ""}  //窗口标题
            },
            data:function (){
                return  {
                    my:{
                      work_type:"",
                      date1: "",
                      date2: "",
                      time1: "",
                      time2: "",
                      val_disease:[],
                      remark:""
                    },
                    arr_type:[],
                    arr_disease: []
                    
                }
            },
            methods: {
              init:function() {
                console.log(this.$attrs.name,'====初始化!!!');
                this.my.work_type="";
                this.my.val_disease=[];
                this.my.remark="";
                this.my.date1 = moment().add(3, 'days').format("YYYY-MM-DD HH:mm");
                this.my.date2 = moment().format("YYYY-MM-DD HH:mm");
                this.my.time1 = moment().format("YYYY-MM-DD HH:mm");
                this.my.time2 = moment().format("YYYY-MM-DD HH:mm");
              },

              // 远程得到两个select框的备选项
              ajax1:function() {
                get(this.url1)
                .then(
                    function (res) {
                        this.arr_type = res.items;
                    }.bind(this)
                );

                get("/arr_disease")
                .then(
                    function (res) {
                        this.arr_disease = res.items;
                    }.bind(this)
                )
              },

              // 确定
              form_submit:function() {
                var _this = this;
                if(this.my.work_type==""){
                  this.$dialog.toast({
                    mes: "作业项目必须选择",
                    icon: 'error',
                    timeout: 1000
                  });
                  return false;
                };

                post(this.url2,{})
                .then(
                    function (res) {
                      if(res.flag){
                        this.$dialog.toast({
                          mes: "提交成功!",
                          icon: 'success',
                          timeout: 1000,
                          callback: function () {
                            _this.$emit('success');
                            _this.$emit('close');
                          }
                        });
                        
                      }else{
                        this.$dialog.toast({
                          mes: "提交失败",
                          icon: 'error',
                          timeout: 1000
                        });
                        // this.$emit('fail');
                      }
                    }.bind(this)
                );
              }
            },
            mounted: function() {
              this.init();
              this.ajax1();
            }
          })
    })
});


Vue.component('du_2_3', function (resolve, reject) {
  axios.get(
      "template/du_2_3.html"
    )
  .then(
      function(res){
          resolve({
            template: res.data,
            props:{
              url1: {type: [String], default: ""},  //输入
              url2: {type: [String], default: ""},  //输出
              pid: {type: [String], default: ""} 
            },
            data:function (){
                return  {
                    tit:"",
                    arr:[]
                    
                }
            },
            methods: {
              init:function() {
                console.log(this.$attrs.name,'====初始化!!!');
              },

              // 远程得到两个select框的备选项
              ajax1:function() {
                console.log(this.url1,"===pid:",this.pid);
                get(this.url1,{pid:this.pid})
                .then(
                    function (res) {
                        _.map(res.items, function (n) {
                            var val_default="";
                            switch(n.type)
                            {
                            case "input":
                              val_default = "";
                              break;
                            case "select":
                              val_default = "";
                              break;
                            case "date":
                              val_default = moment().format("YYYY-MM-DD HH:mm");
                              break;
                            case "time":
                              val_default = moment().format("YYYY-MM-DD HH:mm");
                              break;
                            }
                            Vue.set(n,"val",val_default);
                            // console.log(n);
                        });

                        this.tit = res.type;
                        this.arr = res.items;
                    }.bind(this)
                );
              },

              // 确定
              form_submit:function() {
                var _this = this;

                // 表单验证
                /*if(this.my.work_type==""){
                  this.$dialog.toast({
                    mes: "作业项目必须选择",
                    icon: 'error',
                    timeout: 1000
                  });
                  return false;
                };*/

                var final_arr = _.map(this.arr, function (n) {
                    return m = _.omit(n, ["option","placeholder","type"]);
                });
                console.log(final_arr);
                post(this.url2,final_arr)
                .then(
                    function (res) {
                      if(res.flag){
                        this.$dialog.toast({
                          mes: "提交成功!",
                          icon: 'success',
                          timeout: 1000,
                          callback: function () {
                            _this.$emit('success');
                            _this.$emit('close');
                          }
                        });
                        
                      }else{
                        this.$dialog.toast({
                          mes: "提交失败",
                          icon: 'error',
                          timeout: 1000
                        });
                        // this.$emit('fail');
                      }
                    }.bind(this)
                );
              }
            },
            mounted: function() {
              this.init();
              this.ajax1();
            }
          })
    })
});


Vue.component('du_2_7', function (resolve, reject) {
  axios.get(
      "template/du_2_7.html"
    )
  .then(
      function(res){
          resolve({
            template: res.data,
            props:{
              url1: {type: [String], default: ""},  //输入
              pid: {type: [String], default: ""} 
            },
            data:function (){
                return  {
                    tit:"",
                    arr:[]
                    
                }
            },
            methods: {
              init:function() {
                console.log(this.$attrs.name,'====初始化!!!');
              },

              // 远程得到两个select框的备选项
              ajax1:function() {
                console.log(this.url1,"===pid:",this.pid);
                get(this.url1,{pid:this.pid})
                .then(
                    function (res) {
                        this.tit = res.type;
                        this.arr = res.items;
                    }.bind(this)
                );
              }
            },
            mounted: function() {
              this.init();
              this.ajax1();
            }
          })
    })
});

//做业项目选择框
Vue.component('du_project_id', function (resolve, reject) {
  axios.get("template/du_project_id.html")
  .then(
      function(res){
          resolve({
            template: res.data,
            props:["pid"],
            methods: {
              changeH:function(n) {
                this.$emit('update:change', n);
              },
            },
            data:function (){
                return  {
                    projectId:this.pid,
                    ProjectId_option:[]
                }
            },
            mounted: function() {
              api_server.get( "MyHomeWork/GetHomeWorkProjectList")
                  .then(function (res) {
                      this.ProjectId_option = res.items;
                  }.bind(this))
            }
          })
    })
});

//关联病种-多选框
Vue.component('du_demand_names', function (resolve, reject) {
  axios.get("template/du_demand_names.html")
  .then(
      function(res){
          resolve({
            template: res.data,

            // 此入入值是一个字符型，注意要转成数组型后，再传给el-select控件
            props:["str_vals"],
            methods: {
              changeH:function(n) {
                this.$emit('update:str_vals', arr2str(this.arr_vals) );
              },
            },
            data:function (){
                return  {
                    arr_vals:[], 
                    DemandName_option:[]
                }
            },
            mounted: function() {
              
              var _this = this;
              api_server.get( "/DataInput/GetDiseaseInfo")
                  .then(function (res) {
                      this.DemandName_option = res.items;
                      this.arr_vals= str2arr(this.str_vals);
                  }.bind(this))
            }
          })
    })
});

// a链接加强版，可通过地址传参方式，发送对象型数据，以及传送当前url
Vue.component('aa', {
    props:["href","obj","store"],
    data:function (){
        return  {link:""}
    },
    template: "<a :href='link'><slot></slot></a>",
    mounted: function() {
        var str = "";
        if(this.obj){
          var _obj = this.obj;
          for (var ii in _obj) {
            str = str + ii + "=" + _obj[ii] + "&"
          }
        }

        //再加上当前地址，备用
        var base = window.location.pathname;
        var self_name = base.split("/").pop();
        this.link = this.href+"?"+ str+"from="+ self_name ;
    }
});

Vue.component('nav2', {
    props:["current"],
    data:function (){
        return  {
          arr:[
            {url:"p8.html",tit:"我的作业", ico:"icon-label_wodezuoye"},
            {url:"p1.html",tit:"保健组", ico:"icon-label_baojianzu"},
            {url:"know.html",tit:"知识库", ico:"icon-label_zhishiku"},
            {url:"my.html",tit:"我", ico:"icon-label_wo"}
          ]
        }
    },
    template: "<div class='layout_foot'><nav class='nav2'>\
                <a v-for='(item,index) in arr' :href='item.url' :class=\"{'active':current==index}\"><i class='iconfont' :class='item.ico'></i>{{item.tit}}</a></nav></div>",
    mounted: function() {}
});

Vue.component('loading', {
    props:["current"],
    data:function (){
        return  {}
    },
    template: "<div id='loading'> <div class='line-scale-pulse-out'> <i></i><i></i><i></i><i></i><i></i> </div></div>"
});

// 暂时不启用
/*Vue.component('du_form', {
    props:["href","obj","store"],
    data:function (){
        return  {link:""}
    },
    template: "<a :href='link'><slot></slot></a>",
    mounted: function() {
        var str = "";
        if(this.obj){
          var _obj = this.obj;
          for (var ii in _obj) {
            str = str + ii + "=" + _obj[ii] + "&"
          }
          console.log(str);
        }

        //再加上当前地址，备用
        var base = window.location.pathname;
        var self_name = base.split("/").pop();
        this.link = this.href+"?"+ str+"from="+ self_name ;
    }
});*/



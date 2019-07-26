new Vue({
    el: '#app',
    data: {
        selTabName: 'first',
        message: 'Hello Vue!',
        processinit_id:'',
        processrun_id:'',
        perc1:0,
        perc2:0,
        customColor1:'#AAAAAA',
        customColor: '#AAAAAA',
        updateId:'',
        //左上选择框
        options: [],
        value: '',
        value1: '',
        //右下选择框
        options1: [],
        value2: '',
        //右下选择框
        options2: [{
            value: 'RR',
            label: 'RR'
          }, {
            value: 'RC',
            label: 'RC'
          }],
        nodetype: [{
            value: 'master',
            label: 'master'
          }, {
            value: 'slave',
            label: 'slave'
          }],
        nodetypeValue:'',
        selectText: '',
        selectText2: '',
        addNode:{},
        updateNode:{},
        updateFormVisible:null,
        dialogUpdateFormVisible:null,
        tableData: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ],
        brokenLineConvert: {
          '1001': {
            title: '转账',
          },
          '1002': {
            title: '查询',
          },
          '1003': {
            title: '代发工资',
          },
          '1004': {
            title: '存款',
          },
          '1005': {
            title: '取款',
          }
        },
        pillarLineConvert: {
          '1001': {
            title: '转账',
          },
          '1002': {
            title: '查询',
          },
          '1003': {
            title: '代发工资',
          },
          '1004': {
            title: '存款',
          },
          '1005': {
            title: '取款',
          }
        },
        showWords: '',
        pillarShow: false,  // 柱状图显示
        brokenShow: false,  // 折线图显示
        //折线图无数据显示隐藏
        zhexian:false,
        //柱状 同上
        zhuzhuang:false,
        tableData: [
            ],
            clusterData: [
                ],
            dialog_add: false,
            title: '测试详情',//标题
            detail:'',
            deleteMessage:'确认删除集群节点'
    },
    beforeCreate() {
        Vue.prototype.$http = axios;
        console.log('beforeCreate');
    },
    methods: {
    	//行内编辑
        showDetail: function (row) {//整条记录编辑前，弹出编辑表单
        	this.dialog_add = true;
        	this.detail = row.process_content;
        },
        // 柱形图 main1
        initFirstEcharts() {
            // 初始化第一个柱状图
            const myEcharts = echarts.init(document.getElementById('main1'));
            var option = {
                title: {
                    text: 'title'
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };
            myEcharts.setOption(option);
        },
        // tab改变
        tabHandleClick(tab, event) {
            console.log(tab, event)
        },
        // 数据初始化配置，点击提交
        selectChange() {
        	if(this.value==''){
        		this.$message({
                    showClose: true,
                    message: "请选择数据规模",
                    type: 'warning'
                });
        		return;
        	}
          this.$http.get(`../begin`, {
              params: {
            	  datacfg_id: this.value
                }
              }).then(res => {
            	  if(res.data.code==0){
            		  this.processinit_id = res.data.data;
            		  setTimeout(this.getProcessInit(),2000);
            	  }
          })
        },
        getProcessInit(){
        	 this.$http.get(`../getProcessStatus`, {
                 params: {
                	 uuid: this.processinit_id
                   }
                 }).then(res => {
               	  if(res.data.code==0){
               		  if(res.data.data!=null){
                   		  this.selectText = res.data.data.process_content;
                  		  this.perc1 = res.data.data.process_perc;
                   		  if(res.data.data.process_perc!=100){
                    		 setTimeout(this.getProcessInit(),1000);
                    	  }
               		  }else{
                  		setTimeout(this.getProcessInit(),1000);
               		  }
               	  }
             })
        },
        getProcessRun(){
       	 this.$http.get(`../getProcessStatus`, {
                params: {
               	 uuid: this.processrun_id
                  }
                }).then(res => {
              	  if(res.data.code==0){
              		  if(res.data.data!=null){
                  		  this.selectText2 = res.data.data.process_content;
                  		  this.perc2 = res.data.data.process_perc
                  		  if(res.data.data.process_perc!=100){
                  			  setTimeout(this.getProcessRun(),1000);
                  		  }else{
                  	        this.getProcessList();
//                            // 获取折线图数据接口
                            this.getBrokenData();
                            // 获取柱状图数据接口
                            this.getPillarData();
                  		  }
              		  }else{
                 		setTimeout(this.getProcessRun(),1000);
              		  }
              	  }
            })
       },
        // 业务运行配置，点击提交
        selectChange2() {
    	   if(this.value==''){
       		this.$message({
                   showClose: true,
                   message: "请选择数据规模",
                   type: 'warning'
               });
       		return;
       	}
    	   if(this.value1==''){
       		this.$message({
                   showClose: true,
                   message: "请选择业务运行规模",
                   type: 'warning'
               });
       		return;
       	}
    	if(this.value2==''){
       		this.$message({
                   showClose: true,
                   message: "请选择数据库隔离级别",
                   type: 'warning'
               });
       		return;
       	}
        document.getElementById('brokenLineParent').innerHTML='';
        document.getElementById('pillarLineParent').innerHTML='';
          // 提交接口，获取数据
          this.$http.get(`./business`, {
            params: {
              datacfg_id: this.value,
              trancfg_testid: this.value1,
              isolationLevel:this.value2,
            }
          }).then(res => {
        	  if(res.data.code==0){
        		  this.processrun_id = res.data.message
        		  setTimeout(this.getProcessRun(),2000);
        	  }
          })
        },

        // 获取折线图数据接口
        getBrokenData() {
          // 折线图数据接口
          this.$http.get('../sequence-time', {
              params: {
            	  process_id: this.processrun_id
                   }
                 }).then(res => {
            // 处理初始化折线图标数据
            this.handleBrokenLienInitialData(res.data);
            this.brokenShow = true;
          });
        },

        // 获取柱状图数据接口
        getPillarData() {
          // 柱状图数据接口
          this.$http.get('../time-count', {
              params: {
            	  process_id: this.processrun_id
                   }
                 }).then(res => {
            this.handlePillarLineInitialData(res.data);
            this.pillarShow = true;
          });
        },

        // 初始化数据
        initialData() {
          // 获取下拉框数据1
          this.$http.get('../getData').then(res => {
            this.options = res.data.map(item => ({
              label: item[Object.keys(item)[0]],
              value: Object.keys(item)[0]
            }))
          });
          // 获取下拉框数据2
          this.$http.get('../getTranData').then(res => {
            this.options1 = res.data.map(item => ({
              label: item[Object.keys(item)[0]],
              value: Object.keys(item)[0]
            }))
          })

        },

        // 处理初始化折线图标数据
        handleBrokenLienInitialData(data = {}) {
          // const result = Object.keys(data).map(key => data[key]);
          document.getElementById('brokenLineParent').innerHTML='';
          this.handleBrokenLineEcharts({data, parentId: 'brokenLineParent'});
        },

        // 处理折线echarts
        handleBrokenLineEcharts({data = {}, parentId = '', width =1000, height = 400}) {
          if(!parentId) return;
          Object.keys(data).map(key => {
            const item = data[key];
            const childId = `broken${+new Date()}`;
            this.commonAddElement({
              childId,
              parentId,
              type: 'div',
              style: `width: ${width}px; height: ${height}px;`,
            });
            const xData = Object.keys([...new Array(item.length)]);
            const option = {
              title: {
                text: this.brokenLineConvert[key].title,
            },
              tooltip: {},
              legend: {
                  data:['everything']
              },
              xAxis: {
                  name: '笔数',
                  type: 'category',
                  data: xData,
              },
              yAxis: {
                  name: '耗时(ms)',
                  type: 'value'
              },
              series: {
                  name: '',
                  type: 'line',
                  stack: '总量',
                  data: item,
              },
            };
            this.initialCommonEcharts({
              option,
              id: childId,
            })


          })

        },

        // 处理初始化柱状图表
        handlePillarLineInitialData(data = {}) {
          // const result = Object.keys(data).map(key => data[key]);
          document.getElementById('pillarLineParent').innerHTML='';
          this.handlePillarLineEcharts({data, parentId: 'pillarLineParent'});
          
        },
        goAdd(){
        	this.dialogUpdateFormVisible = true;
        },
        addData(){
    	   this.$http.get(`../addClustercfg`, {
               params: {
            	   cluster_type: this.nodetypeValue,
            	   cluster_url:this.addNode.cluster_url
                 }
               }).then(res => {
             	  if(res.data.code==0){
             		 this.$message({
                         showClose: true,
                         message: "添加节点成功",
                         type: 'success'
                     });  
                  	this.dialogUpdateFormVisible = false;
               		this.getClusterList();
             	  }else{
             		 this.$message({
                         showClose: true,
                         message: res.data.message,
                         type: 'error'
                     }); 
             	  }
           })
        },
        updateData(){
     	   this.$http.get(`../updateClustercfg`, {
                params: {
                   cluster_id:this.updateId,
             	   cluster_url:this.updateNode.cluster_url
                  }
                }).then(res => {
              	  if(res.data.code==0){
              		 this.$message({
                          showClose: true,
                          message: "修改节点成功",
                          type: 'success'
                      });  
                   	this.updateFormVisible = false;
                		this.getClusterList();
              	  }else{
              		 this.$message({
                          showClose: true,
                          message: res.data.message,
                          type: 'error'
                      }); 
              	  }
            })
         },
        goUpdateRow(row){
        	this.updateId = row.cluster_id;
         	this.updateFormVisible = true;
        },
        deleteRow(row){
        	 this.$http.get(`../deleteClustercfg`, {
                 params: {
                	 cluster_id: row.cluster_id
                   }
                 }).then(res => {
               	  if(res.data.code==0){
               		 this.$message({
                           showClose: true,
                           message: "删除节点成功",
                           type: 'success'
                       });  
               		row.visible = false;
               		this.getClusterList();
               	  }else{
             		 this.$message({
                         showClose: true,
                         message: "删除节点失败",
                         type: 'error'
                     }); 
             	  }
             })
        },
        // 处理柱状echarts
        handlePillarLineEcharts({data = [], parentId = '', width =1000, height = 400}) {
          if(!parentId) return;
          Object.keys(data).map(key => {
            const item = data[key];
            const childId = `pillar${+new Date()}`;
            const [xData, yData] = data[key].reduce((arr, i) => {
              return [
                arr[0].concat(i.tmcost),
                arr[1].concat(i.countNum),
              ]
            }, [[],[]]);
            this.commonAddElement({
              childId,
              parentId,
              type: 'div',
              style: `width: ${width}px; height: ${height}px;`,
            });
            const option = {
                title: {
                    text: this.pillarLineConvert[key].title,
                },
                tooltip: {},
                legend: {
                    data:[' ']
                },
                xAxis: {
                  name: '耗时',
                  type: 'category',
                  data: xData
                },
                yAxis: {
                  name: '次数',
                  type: 'value',
                  data: yData,
                },
                series: [{
                    name: '',
                    type: 'bar',
                    data: yData
                }]
            }
            this.initialCommonEcharts({
              option,
              id: childId,
            })
          })
        },

        // 通用添加元素
        commonAddElement({parentId = '', childId = '', style = '', type = 'div'} = {}) {
          if(!childId && !parentId && document.getElementById(parentId)) return;
          const parentEle = document.getElementById(parentId);
          const ele = document.createElement(type);
          ele.id = childId;
          ele.style = style;
          parentEle.appendChild(ele);
        },
        // 通用echarts
        initialCommonEcharts({option = {}, id} = {}) {
          if(!id) return;
          const myEcharts = echarts.init(document.getElementById(id));
          myEcharts.setOption(option);
        },
        getProcessList(){
        	   
            this.$http.get('../getProcessList').then(res => {
        		this.tableData = res.data;
              })
        },
        getClusterList(){
        	this.$http.get('../getClusterList').then(res => {
        		this.clusterData = res.data;
            })
        }
    },
    mounted() {

        this.initialData();//zhu
        this.getProcessList();
        this.getClusterList();
    }
})
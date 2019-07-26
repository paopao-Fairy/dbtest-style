
const httpRequestConfig = {
    // 全局配置
    base:{
        // 全局http请求路径
        baseurl:'',
    },
    // 错误信息
    errmsg:{
        title: '错误',
        message: '操作失败！',
        type: 'error'
    },
    // 加载
    loading:{
        lock: true,
        // 超时时间
        time: 1000,
        // 显示文字
        text: 'Loading',
        // 可查看element-ui api
        spinner: 'el-icon-loading',
        // 背景色
        background: 'rgba(0, 0, 0, 0.7)'
    }
}

{

    const Loading = ELEMENT.Loading;
    const Notification = ELEMENT.Notification;
    axios.defaults.baseURL = httpRequestConfig.base.baseurl;
    // axios.defaults.headers.common['Authorization'] = httpRequestConfig.base.token;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    let time = httpRequestConfig.base.time;
    let loadId = '';
    let loadingClose = '';
    // 错误信息
    function notiMsg(data){
        loadClose();
        if (!data) {
            Notification(httpRequestConfig.errmsg)
        }
    }
    // 关闭对话框
    function loadClose(){
        try {
            loadingClose && loadingClose.close();
            clearTimeout(loadId);
        } catch(err){

        }
    }
}
// import ROSLIB from "roslib";

var $vm;
export default {
    install: (app, options) => {
        $vm = app;
        app.config.globalProperties.$ros = new ROSLIB.Ros();
        app.config.globalProperties.$ros.isConnected = false
    }
}
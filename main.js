const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const GS = require('gameserver-nodejs');
const App = require('./src/app');

const CONFIG_PATH = path.resolve(__dirname, './conf/config.json');

/**
 * gameServer入口
 * 读取配置文件，初始化日志，启动gameServer服务
 */
function main() {
    fs.readFile(CONFIG_PATH, function(err, data) {
        if (err) throw err;

        // 解析配置文件
        let conf = JSON.parse(data);
        log4js.configure(conf.log);

        // 创建 app
        let app = new App();

        // 创建 gameserver 服务
        let gs = new GS({
            app: app,
            addr: conf.addr,
            regConf: conf.register,
            roomConf: conf.roomConf,
            metricConf: conf.metrics,
        });

        // 启动 gameserver 服务
        let pushHander = gs.start();

        // 设置消息推送 handler
        app.setPushHander(pushHander);
        
        const log = log4js.getLogger();
        log.info('Game server started, listen on:', conf.addr);
    });
}

main();

var http = require('http')
let EventEmitter = require('events');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application extends EventEmitter {
    constructor(){
        super()
        this.middlewares = []; //保留一个中间件
        this.callbackFunc; //定义回调函数
        this.context = context;
        this.request = request;
        this.response = response;
    }
     /**
     * 开启http server并传入callback
     */
    listen(...arg){
        //实例化 等于
        // let server = http.createServer((req,res)=>{

        // })
        let server = http.createServer(this.callback())
        server.listen(...arg)
    }
    /**
     * 挂载回调函数
     * @param {Function} fn 回调处理函数
     */
    use(middleware){
        this.middlewares.push(middleware);
    }

    compose(){
        return async ctx=>{
            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext);
                }
            }
            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve();
            };
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next);
            }
            await next();
        };
    }

    /**
     * 获取http server所需的callback函数
     * @return {Function} fn
     */

    callback(){
        return (req, res) => {
            let ctx = this.createContent(req,res)
            //注册返回函数的处理
            let respond = () => this.responseBody(ctx);
            //注册错误函数的处理
            let onerror = (err) => this.onerror(err, ctx);
            //执行完 所有的中间件
            let fn = this.compose();
            // 在这里catch异常，调用onerror方法处理异常
            return fn(ctx).then(respond).catch(onerror);
        };
    }
    createContent(req,res){
        // 针对每个请求，都要创建ctx对象
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        //将node自带的req 赋值给 ctx.request.req  
        ctx.req = ctx.request.req = req;
        //将node自带的res 赋值给 ctx.response.res
        ctx.res = ctx.response.res = res;
        return ctx;
    }

     /**
     * 对客户端消息进行回复
     * @param {Object} ctx ctx实例
     */
    responseBody(ctx) {
        let content = ctx.body;
        if (typeof content === 'string') {
            ctx.res.end(content);
        }
        else if (typeof content === 'object') {
            ctx.res.end(JSON.stringify(content));
        }
    }

    onerror(err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        }
        else {
            ctx.status = 500;
        }
        let msg = 'Server Internal error 500';
        ctx.res.end(msg);
        // 触发error事件
        this.emit('error', err);
    }




}

module.exports = Application


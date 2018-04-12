var Application = require('./application');
var Router = require('koa-router');
let app = new Application();
let router = new Router();
// 对ctx进行扩展   app中的content对象相当于ctx
app.context.echoData = function (errno = 0, data = null, errmsg = '') {
    this.res.setHeader('Content-Type', 'application/json;charset=utf-8');
    this.body = {
        errno: errno,
        data: data,
        errmsg: errmsg
    };
};

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        // 在这里进行定制化的错误处理
        console.log(err)
        throw new Error(err.message);
    }
});






router.get('/test',async (ctx)=>{
    let res = {
        name:"xiaobaijun",
        age:20,
    }
    ctx.echoData(0,res,'success')
})

router.get('/test/add',async(ctx)=>{
    ctx.echoData(0,{
        name:'add'
    },'success')
})





//routers  
app.use(router.routes())






app.listen(3000, () => {
    console.log('listening on 3000');
});

const koa = require('koa')
const app = new koa()
const fs = require('fs')
const Router = require('koa-router')
const path = require('path')
var router = new Router()


//获取中间件   
let middles = {}
let  files = fs.readdirSync('./middlewares')
files.forEach((file)=>{
    file = file.split('.')[0]
    middles[file] = require(`./middlewares/${file}`)
})

//
app.get  = function(...arg){
    arg = routerParse(...arg)
    router.get(...arg)
}
app.post = function(...arg){
    arg = routerParse(...arg)
    router.post(...arg)
}

/**
 * 解析留有
 * @param {*} arg 
 */
function routerParse(...arg){
    let conteroller = arg[arg.length-1]
    let [dir,func] = conteroller.split('.')
    let conterollerDir = `./controllers/${dir}`;
    let contro = require(conterollerDir)
    let controMod = new contro()
    var calles =   controMod[func]
    arg[arg.length-1] = calles;
    return arg;
}





//使用路由 
let  routerFiles = fs.readdirSync('./routes')
routerFiles.forEach((file)=>{
    let fileRequire = require(`./routes/${file}`)
    fileRequire(app,middles)
})



app.use(router.routes())
app.listen(3000);






//定义一个new promise 读取文件
const fs = require('fs')
// function LsReadFile(path){
//     return new Promise((resolve,reject)=>{
//         fs.readFile(path,'utf-8',(err,data)=>{
//             if(err){
//                 reject(err)
//             }
//             resolve(data)
//         })
//     })
// }

// LsReadFile('./promise/mysql.conf').then((data)=>{
//     console.log(data)
// }).catch((err)=>{
//     console.log(err)
// })


function lsPromise(fn){
    var value = null;
    var callback= [];
    //将异步函数先放入队列
    this.then = function (onFulfilled){
        callback.push(onFulfilled)
        return this;
    }
    //成功会执行这个函数  然后会传入数据 最终代理到异步函数中去
    //变为同步执行
    function resolve(value){
        //settimeout 会放在主线程之后再执行 因此可以做到最尾队列
        setTimeout(function(){
            callback.forEach((backs)=>{
                backs(value)
            })
        },0)
    }
    fn(resolve)
}
/** 
1、调用then方法，将想要在Promise异步操作成功时执行的回调放入callbacks队列，其实也就是注册回调函数，可以向观察者模式方向思考；
2、创建Promise实例时传入的函数会被赋予一个函数类型的参数，即resolve，
   它接收一个参数value，代表异步操作返回的结果，当一步操作执行成功后，用户会调用resolve方法
   ，这时候其实真正执行的操作是将callbacks队列中的回调一一执行；
*/
function LsReadFile2(path){
    return new lsPromise((resolve,reject)=>{
        fs.readFile(path,'utf-8',(err,data)=>{
            // if(err){
            //     reject(err)
            // }
            resolve(data)
        })
    })
}

function getUserid(){
    return new lsPromise(function (resolve) {
        resolve(9876);
    });
}


// LsReadFile2('./promise/mysql.conf').then((data)=>{
//     console.log(data)
// }).then((data)=>{
//     console.log(data)
// })

getUserid().then((data)=>{
    console.log(data)
    getUserid().then((data)=>{
        console.log(data)
    })
})









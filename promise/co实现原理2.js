const fs = require('fs')
function lsPromise(fn){
    var state = 'pending';
    var value = null;
    var callbacks = [];
    // this.then = function (onFulfilled){
    //     //如果是发生在之前的 说明是回调 全部入队
    //     if ( state === 'pending' ) {
    //         callbacks.push(onFulfilled)
    //         return this
    //     }
    //     onFulfilled(value)
    //     return this
    // }
    this.then  = function(onFulfilled){
        return new lsPromise(function(resolve){
            handle({
                onFulfilled:onFulfilled || null,
                resolve:resolve
            })
        })
    }

    function handle(callback){
         if (state === 'pending' ){
             callbacks.push(callback)
             return ;
         }
         //如果then中没有传递任何东西
         if(!callback.onFulfilled) {
            callback.resolve(value);
            return;
        }
        var ret = callback.onFulfilled;
        callback.resolve(ret);
    }

    function resolve(newValue){
        if(newValue && (typeof newValue === 'object' || typeof newValue === 'function' )){
            var then = newValue.then;
            if (typeof then === 'function') {
                then.call(newValue, resolve);
                return;
            }
        }  
        state = 'fulfilled';
        value = newValue;
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0); 
    }




    // function resolve(newvalue) {
    //     value = newvalue
    //     state = 'fulfilled';
    //     //将其放入队尾 执行 
    //     setTimeout(function () {
    //         callbacks.forEach(function (callback) {
    //             callback(value);
    //         });
    //     }, 0);
    // }
    fn(resolve)
}

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

LsReadFile2('./promise/mysql.conf').then(  LsReadFile2('./promise/mysql.conf')  )
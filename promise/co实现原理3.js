// new Promise(fn1).then(function (val) {
//     console.log(val)
//     return new Promise(fn2)
// }).then(function (val2) {
//     console.log(val2)
//     return '333'
// }).then(function (val3) {
//     console.log(val3)
// })



///////////////////////////////////////
// //第一个版本
// function Promise(fn) {
//     //需要一个成功的回调
//     var callback;
//     //需要一个注册方法 用来注册异步时间
//     this.then = function (done) {
//         callback = done;
//     }
//     //需要提供一个resolve方法 来执行异步
//     function resolve() {
//         callback()
//     }
//     fn(resolve)
// }




//为了支持链式  需要执行多个方法 使用一个数组
//第二种实现
// function Promise2(fn) {
//     var promise = this; //防止this的乱指向
//     var value = null;
//     promise._resolves = []; //定义一个队列 用来存储 回调函数
//     this.then = function (onFulfilled) {
//         promise._resolves.push(onFulfilled) //将所有的回调函数的方法 放入这个队列中
//         return this; //返回this 实现链式调用
//     }
//     //这个value 是由外部调用的回调函数传入的
//     function resolve(value) {
//         //如果传入的函数是个同步的话  会先于then函数执行 这样的话 promise._resolves 队列为空 因为使用setTimeout 将他放入js的队尾
//         setTimeout(function () {
//             promise._resolves.forEach(function (callback) {
//                 value = callback(value)   //将上一个函数的返回值保留下来
//             })
//         }, 0)
//     }
//     //在一个线程里面 异步函数 会丢入事件处理器  
//     //肯定会晚于同步函数执行  
//     fn(resolve)
// }


//第三种实现
// function Promise2(fn) {
//     var promise = this; //防止this的乱指向
//     var value = null;
//     promise._resolves = []; //定义一个队列 用来存储 回调函数
//     promise._status = 'PENDING'; //定义一个状态

//     this.then = function (onFulfilled) {
//         if (promise._status === 'PENDING') {
//             promise._resolves.push(onFulfilled) //将所有的回调函数的方法 放入这个队列中
//             return this; //返回this 实现链式调用
//         }
//         onFulfilled(value);
//         return this;

//     }
//     //这个value 是由外部调用的回调函数传入的
//     function resolve(value) {
//         //如果传入的函数是个同步的话  会先于then函数执行 这样的话 promise._resolves 队列为空 因为使用setTimeout 将他放入js的队尾
//         setTimeout(function () {
//             promise._status = "FULFILLED"; //修改状态
//             promise._resolves.forEach(function (callback) {
//                 value = callback(value)   //将上一个函数的返回值保留下来
//             })
//         }, 0)
//     }
//     //在一个线程里面 异步函数 会丢入事件处理器  
//     //肯定会晚于同步函数执行  
//     fn(resolve)
// }

//第四种 加上对回调中返回 promise的处理 即 promise的串行处理
// function Promise2(fn) {
//     var promise = this; //防止this的乱指向
//     var value = null;
//     promise._resolves = []; //定义一个队列 用来存储 回调函数
//     promise._status = 'PENDING'; //定义一个状态

//     // this.then = function (onFulfilled) {
//     //     if (promise._status === 'PENDING') {
//     //         promise._resolves.push(onFulfilled) //将所有的回调函数的方法 放入这个队列中
//     //         return this; //返回this 实现链式调用
//     //     }
//     //     onFulfilled(value);
//     //     return this;
//     // }
//     /*
//     1. new Promise() 中匿名函数中的 promise （promise._resolves 中的 promise）
//     指向的都是上一个 promise 对象， 而不是当前这个刚刚创建的
//     2. handle 函数对上一个 promise 的 then 中回调进行了处理，并且调用了当前的 promise 中的 resolve 方法。
//     */
//     this.then = function (onFulfilled){
//         //返回的仍然是promise对象  链式依然还存在
//         return new Promise2(function(resolve){
//             function handle(value){
//                 var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
//                 //如果是一个 promise 对象，就会调用其 then 方法，形成一个嵌套，直到其不是promise对象为止
//                 if (ret && typeof ret ['then'] == 'function' ){
//                     ret.then(function(value){
//                         resolve(value);
//                      });
//                 }else{
//                     resolve(ret)
//                 }
//             }
//             //这里的promise指的是对上一个Promise来说的 而不是当前的
//             if(promise._status === 'PENDING'){
//                 promise._resolves.push(handle);
//             }else if (promise._status === 'FULFILLED'){
//                 handle(value)
//             }

//         })
//     }
//     //这个value 是由外部调用的回调函数传入的
//     function resolve(value) {
//         //如果传入的函数是个同步的话  会先于then函数执行 这样的话 promise._resolves 队列为空 因为使用setTimeout 将他放入js的队尾
//         setTimeout(function () {
//             promise._status = "FULFILLED"; //修改状态
//             promise._resolves.forEach(function (callback) {
//                 value = callback(value)   //将上一个函数的返回值保留下来
//             })
//         }, 0)
//     }
//     //在一个线程里面 异步函数 会丢入事件处理器  
//     //肯定会晚于同步函数执行  
//     fn(resolve)
// }


//第五种  加上错误处理
function Promise2(fn) {
    var promise = this; //防止this的乱指向
    var value = null;
    promise._resolves = []; //定义一个队列 用来存储 回调函数
    promise._rejects = [];  //定义一个队列
    promise._status = 'PENDING'; //定义一个状态
    /*
    1. new Promise() 中匿名函数中的 promise （promise._resolves 中的 promise）
    指向的都是上一个 promise 对象， 而不是当前这个刚刚创建的
    2. handle 函数对上一个 promise 的 then 中回调进行了处理，并且调用了当前的 promise 中的 resolve 方法。
    */
    this.then = function (onFulfilled,onRejected){
        //返回的仍然是promise对象  链式依然还存在
        return new Promise2(function(resolve,reject){
            function handle(value){
                var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
                //如果是一个 promise 对象，就会调用其 then 方法，形成一个嵌套，直到其不是promise对象为止
                if (ret && typeof ret ['then'] == 'function' ){
                    ret.then(function(value){
                        resolve(value);
                     });
                }else{
                    resolve(ret)
                }
            }
            function errback(reason){
                reason =  typeof onRejected ==='function' && onRejected(reason) || reason;
                reject(reason);
            }
            //这里的promise指的是对上一个Promise来说的 而不是当前的
            if(promise._status === 'PENDING'){
                promise._resolves.push(handle);//添加正常执行的函数
                promise._rejects.push(errback);//添加异常执行饿函数
            }else if (promise._status === 'FULFILLED'){
                handle(value)
            }else if (promise._status === 'REJECTED' ){
                errback(promise._reason);
            }

        })
    }
    //这个value 是由外部调用的回调函数传入的
    function resolve(value) {
        //如果传入的函数是个同步的话  会先于then函数执行 这样的话 promise._resolves 队列为空 因为使用setTimeout 将他放入js的队尾
        setTimeout(function () {
            promise._status = "FULFILLED"; //修改状态
            promise._resolves.forEach(function (callback) {
                value = callback(value)   //将上一个函数的返回值保留下来
            })
        }, 0)
    }
    function reject(value) {
        setTimeout(function(){
            promise._status = "REJECTED";
            promise._rejects.forEach(function (callback) {
                promise._reason = callback( value);
            })
        },0);
    }


    //在一个线程里面 异步函数 会丢入事件处理器  
    //肯定会晚于同步函数执行  
    fn(resolve,reject)
}




new Promise2(fn1).then(function (val) {
    console.log(val)
}).then(function (val2) {
    console.log(val2)
},function(data){
    console.log(data)
})


function fn1(resolve, reject) {
    setTimeout(function () {
        // console.log('步骤一:执行');
        reject('222222');
    }, 500)
}
function fn2(resolve, reject) {
    setTimeout(function () {
        console.log('步骤二:执行');
        resolve(2);
    }, 1000)
}
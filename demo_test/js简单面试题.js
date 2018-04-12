
// /*
//  js 关于执行顺序 和闭包的面试题 
// */
// for (var i = 0; i < 5; i++) {
//     console.log(i);  //输出0-4
// }
// for (var i = 0; i < 5; i++) {
//     setTimeout(function () {
//         console.log(i);
//     }, 1000 * i);  //输出 4 4 4 4 4 同步比异步先执行
// }

// for (var i = 0; i < 5; i++) {
//     (function (i) {
//         setTimeout(function () {
//             console.log(i);
//         }, i * 1000);
//     })(i);  //输出 0 1 2 3 4 使用闭包 可以接受变量
// }


// for (var i = 0; i < 5; i++) {
//     (function () {
//         setTimeout(function () {
//             console.log(i);
//         }, i * 1000);
//     })(i);  //5 5 5 5 5 内部的i 还是走的全局变量(变量提升)
// }

// for (var i = 0; i < 5; i++) {
//     setTimeout((function (i) {
//         console.log(i);
//     })(i), i * 1000); //函数会立即执行 输出 0 1 2 3 4 但是node里面setTimeout必须是callback 会报错
// }

// setTimeout(function () {
//     console.log(1)
// }, 0);
// new Promise(function executor(resolve) {
//     console.log(2);
//     for (var i = 0; i < 10000; i++) {
//         i == 9999 && resolve();
//     }
//     console.log(3);
// }).then(function () {
//     console.log(4);
// });
// console.log(5);  //2 3 5 4 1 Promise里面先执行 结果后执行

setTimeout(()=>{
    console.log(1)   
})
add().then((data)=>{
    console.log(4)
})
console.log(3)

function add(){
    return new Promise((resolve,reject)=>{
        console.log(2)
        resolve()
    })
}
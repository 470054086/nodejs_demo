
//nodejs的执行顺序
// setTimeout(() => console.log(1));  //1
// setImmediate(() => console.log(2));//2
// process.nextTick(() => console.log(3));//3
// Promise.resolve().then(() => console.log(4));//4
// (() => console.log(5))();//5
/*
步骤5 最先执行 同步的执行顺序都优先于异步
process.nextTick,Promise的回调都是在本轮循环中进行回调  因此 3 4 肯定先于 1 2 执行
setTimeout,setImmediate 再次轮循环的时候 执行

步骤3 再执行 process.nextTick这个名字有点误导，它是在本轮循环执行的，而且是所有异步任务里面最快执行的。
Node 执行完所有同步任务，接下来就会执行process.nextTick的任务队列 
基本上，如果你希望异步任务尽可能快地执行，那就使用process.nextTick。 

根据语言规格，Promise对象的回调函数，会进入异步任务里面的"微任务"（microtask）队列
微任务队列追加在process.nextTick队列的后面，也属于本轮循环。所以，下面的代码总是先输出3，再输出4

步骤4 在process.nextTick队列之后执行

setTimeout在timer阶段执行 setImmediate 在check阶段执行 
因此 步骤 1 2

最后的顺序为 5 3 4 1 2

*/
// process.nextTick(() => console.log(1));
// Promise.resolve().then(() => console.log(2));
// process.nextTick(() => console.log(3));
// Promise.resolve().then(() => console.log(4));



/**
 *  1. 脚本进入第一轮事件循环以后，没有到期的定时器，也没有已经可以执行的 I/O 回调函数，所以会进入 Poll 阶段，等待内核返回文件读取的结果。由于读取小文件一般不会超过 100ms，所以在定时器到期之前，Poll 阶段就会得到结果，因此就会继续往下执行。
    2. 第二轮事件循环，依然没有到期的定时器，但是已经有了可以执行的 I/O 回调函数，所以会进入 I/O callbacks 阶段，执行fs.readFile的回调函数。这个回调函数需要 200ms，也就是说，在它执行到一半的时候，100ms 的定时器就会到期。但是，必须等到这个回调函数执行完，才会离开这个阶段。
    3. 第三轮事件循环，已经有了到期的定时器，所以会在 timers 阶段执行定时器。最后输出结果大概是200多毫秒
 */
const fs = require('fs');
const timeoutScheduled = Date.now();

// 异步任务一：100ms 后执行的定时器
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms`);
}, 100);

// 异步任务二：文件读取后，有一个 200ms 的回调函数
fs.readFile('test.js', () => {
  const startCallback = Date.now();
  while (Date.now() - startCallback < 200) {
    // 什么也不做
  }
  console.log('我先执行')
})



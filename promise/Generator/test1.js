var fs = require('fs');
const co =require('co')
var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName,'utf-8', function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('./a.txt');
  var f2 = yield readFile('./a.txt');

};
// var g= gen()
// g.next().value.then((data)=>{
//     g.next(data).value.then((data2)=>{
//         console.log(data,data2)
//     })
// })

function run(gen){
    var g = gen();
    var arr = [];
    function next(data){
        var result = g.next(data)
        if(result.done) {
            return arr;
        }
        result.value.then((data)=>{
            arr.push(data)
            next(data)
        })
    }
    var data = next()
}

run(gen)
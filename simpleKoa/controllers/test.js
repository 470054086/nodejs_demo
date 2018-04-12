class test {
    async index(ctx){
        let res = {
            name: "xiaobaijun",
            age: 20,
        }
        console.log(res)
    }

    async add(ctx){
        let res = {
            add:'添加了'
        }
        console.log(res)
    }
}
module.exports = test
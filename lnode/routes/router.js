module.exports=(app,middles)=>{
    app.get('/xiaobai',middles.Logger,middles.ResponseTime,'test.test'),
    app.get('/xiaohong/:id','test.add'),
    app.post('/postty','test.postty')
}

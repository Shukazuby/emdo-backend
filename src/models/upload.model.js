module.exports = (sequelize,dataType) =>{
    const upload = sequelize.define('upload', {
        filename:{
            type: dataType.STRING,
            trim: true
        },
        path:{
            type: dataType.STRING
        }
    } )
    return upload
}
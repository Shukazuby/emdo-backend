module.exports = (sequelize, dataType) => {
    const bookmarks = sequelize.define('bookmarks', {
        id:{
            type: dataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
      
    });
    return bookmarks;
  };
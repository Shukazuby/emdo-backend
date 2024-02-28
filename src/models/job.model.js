module.exports = (sequelize,dataType)=>{
    const job = sequelize.define('job', {
        title: {
            type: dataType.STRING,
          },
          description: {
            type: dataType.TEXT,
          },
          location: {
            type: dataType.STRING,
          },
          noOfStaff: {
            type: dataType.INTEGER,
          },
          shiftStartDate: {
            type: dataType.DATE,
          },
          shiftEndDate: {
            type: dataType.DATE,
          },
          hourlyPay: {
            type: dataType.STRING,
          },
          status: {
            type: dataType.ENUM('active', 'ongoing', 'completed', 'cancelled'),
            defaultValue: 'active'
          }
    })
    
    return job
}
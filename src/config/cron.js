const cron = require('node-cron');
const { db } = require('../models');
const { Op } = require('sequelize');

cron.schedule('* * * * *', async () => {
        const currentDate = new Date();
        const jobs = await db.jobs.findAll({
            where: {
                shiftEndDate: {
                    [Op.lt]: currentDate
                }
            }
        });
        await Promise.all(jobs.map(async (job) => {
            await job.update({ status: 'completed' });
        }));
}, 

{
    scheduled: true,
    timezone: "Europe/London" 
});

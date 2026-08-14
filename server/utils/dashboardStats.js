const Patient = require("../models/Patient.js");
const Record = require("../models/Record.js");

const getDashboardStats = async () => {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [
    totalPatients,
    totalRecords,
    newPatientsThisMonth,
    todayRecords,
  ] = await Promise.all([
    Patient.countDocuments(),

    Record.countDocuments(),

    Patient.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),

    Record.countDocuments({
      createdAt: {
        $gte: startOfToday,
      },
    }),
  ]);

  return {
    totalPatients,
    totalRecords,
    newPatientsThisMonth,
    todayRecords,
  };
};

module.exports = getDashboardStats;
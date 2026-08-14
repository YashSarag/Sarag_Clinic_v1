const calculatePendingAmount = (records) => {
  return records.reduce((total, record) => {
    const fee = Number(record.fee || 0);
    const paidAmount = Number(record.paidAmount || 0);

    const pending = Math.max(
      fee - paidAmount,
      0
    );

    return total + pending;
  }, 0);
};

module.exports = {
  calculatePendingAmount,
};
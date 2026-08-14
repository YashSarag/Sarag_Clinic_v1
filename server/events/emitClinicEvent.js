const eventBus = require("./eventBus");

const emitClinicEvent = (payload) => {
  console.log(
    "📡 Sending realtime event:",
    payload.type
  );

  eventBus.emit("clinic-update", payload);
};

module.exports = emitClinicEvent;
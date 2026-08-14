// const Patient = require("../models/Patient.js");
// const Record = require("../models/Record.js");

// const getDashboardStats = require("../utils/dashboardStats.js");
// const emitClinicEvent = require("../events/emitClinicEvent.js");


// const {
//   calculatePendingAmount,
// } = require("../utils/patientStats.js");

// const resolvers = {
//   // =====================================================
//   // QUERIES
//   // =====================================================

//   Query: {
//     patients: async () => {
//       return await Patient.find()
//         .sort({ createdAt: -1 });
//     },

//     patient: async (_, { id }) => {
//       return await Patient.findById(id);
//     },

//     records: async () => {
//       return await Record.find()
//         .populate("patient")
//         .sort({ createdAt: -1 });
//     },

//     dashboardStats: async () => {
//       return await getDashboardStats();
//     },
//   },

//   // =====================================================
//   // PATIENT
//   // =====================================================

//   Patient: {
//     id: (parent) => {
//       return parent._id.toString();
//     },

//     records: async (parent) => {
//       return await Record.find({
//         patient: parent._id,
//       })
//         .populate("patient")
//         .sort({ createdAt: -1 });
//     },
//   },

//   // =====================================================
//   // RECORD
//   // =====================================================

//   Record: {
//     id: (parent) => {
//       return parent._id.toString();
//     },

//     patient: async (parent) => {
//       // Already populated
//       if (
//         parent.patient &&
//         parent.patient._id &&
//         parent.patient.fname
//       ) {
//         return parent.patient;
//       }

//       // Patient ObjectId exists
//       if (parent.patient) {
//         return await Patient.findById(
//           parent.patient
//         );
//       }

//       return null;
//     },
//   },

//   // =====================================================
//   // MUTATIONS
//   // =====================================================

//   Mutation: {
//     // ===================================================
//     // ADD RECORD
//     // ===================================================

//     addRecord: async (_, args) => {
//       console.log(
//         "📥 ADD RECORD REQUEST:",
//         args
//       );

//       const {
//         fname,
//         lname,
//         age,
//         sex,
//         village,
//         mobile,
//       } = args;

//       // -----------------------------------------------
//       // Validate
//       // -----------------------------------------------

//       if (
//         !fname?.trim() ||
//         !lname?.trim() ||
//         !age ||
//         !sex ||
//         !village?.trim() ||
//         !mobile?.trim()
//       ) {
//         throw new Error(
//           "All patient fields are required"
//         );
//       }

//       const numericAge = Number(age);

//       if (
//         !Number.isInteger(numericAge) ||
//         numericAge < 0
//       ) {
//         throw new Error(
//           "Invalid age"
//         );
//       }

//       // -----------------------------------------------
//       // Find existing patient by mobile
//       // -----------------------------------------------

//       let patient = await Patient.findOne({
//        fname,lname
//       });

//       let patientCreated = false;

//       // -----------------------------------------------
//       // Create patient if not exists
//       // -----------------------------------------------

//       if (!patient) {
//         patient = await Patient.create({
//           fname: fname.trim(),
//           lname: lname.trim(),
//           age: numericAge,
//           sex,
//           village: village.trim(),
//           mobile: mobile.trim(),
//           records: [],
//         });

//         patientCreated = true;

//         console.log(
//           "👤 Patient created:",
//           patient._id.toString()
//         );
//       } else {
//         console.log(
//           "👤 Existing patient:",
//           patient._id.toString()
//         );
//       }

//       patient.age = age;
//       await patient.save()

//       // -----------------------------------------------
//       // CREATE RECORD
//       // -----------------------------------------------

//       const record = await Record.create({
//         patient: patient._id,

//         fee: 0,

//         paidAmount: 0,

//         paymentNote: "",

//         feeStatus: false,
//       });

//       console.log(
//         "📝 Record created:",
//         record._id.toString()
//       );

//       // -----------------------------------------------
//       // Add record to patient
//       // -----------------------------------------------

//       await Patient.findByIdAndUpdate(
//         patient._id,
//         {
//           $push: {
//             records: record._id,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//       console.log(
//         "🔗 Record linked to patient"
//       );

//       // -----------------------------------------------
//       // Get complete record
//       // -----------------------------------------------

//       const completeRecord =
//         await Record.findById(
//           record._id
//         ).populate("patient");

//       if (!completeRecord) {
//         throw new Error(
//           "Record was created but could not be retrieved"
//         );
//       }

//       // -----------------------------------------------
//       // Dashboard stats
//       // -----------------------------------------------

//       const dashboardStats =
//         await getDashboardStats();

//       // -----------------------------------------------
//       // Realtime payload
//       // -----------------------------------------------

//       const realtimeRecord = {
//         id: completeRecord._id.toString(),

//         fee:
//           completeRecord.fee ?? 0,

//         paidAmount:
//           completeRecord.paidAmount ?? 0,

//         paymentNote:
//           completeRecord.paymentNote ?? "",

//         feeStatus:
//           completeRecord.feeStatus ?? false,

//         createdAt:
//           completeRecord.createdAt.getTime(),

//         updatedAt:
//           completeRecord.updatedAt.getTime(),

//         patient: {
//           id:
//             completeRecord.patient._id.toString(),

//           fname:
//             completeRecord.patient.fname,

//           lname:
//             completeRecord.patient.lname,

//           age:
//             completeRecord.patient.age,

//           sex:
//             completeRecord.patient.sex,

//           mobile:
//             completeRecord.patient.mobile,

//           village:
//             completeRecord.patient.village,
//         },
//       };

//       // -----------------------------------------------
//       // SSE
//       // -----------------------------------------------

//       emitClinicEvent({
//         type: "RECORD_CREATED",

//         entity: "record",

//         action: "created",

//         data: {
//           record: realtimeRecord,

//           patientCreated,

//           dashboardStats,
//         },
//       });

//       console.log(
//         "📡 RECORD_CREATED event emitted"
//       );

//       console.log(
//         "✅ ADD RECORD SUCCESS:",
//         completeRecord._id.toString()
//       );

//       // -----------------------------------------------
//       // Return complete GraphQL record
//       // -----------------------------------------------

//       return completeRecord;
//     },

//     // ===================================================
//     // UPDATE CHARGED FEE
//     // ===================================================

//     setChargedAmountFunc: async (
//       _,
//       { id, fee }
//     ) => {
//       const chargedFee = Number(fee);

//       if (
//         !Number.isFinite(chargedFee) ||
//         chargedFee < 0
//       ) {
//         throw new Error(
//           "Invalid charged fee"
//         );
//       }

//       const record =
//         await Record.findById(id);

//       if (!record) {
//         throw new Error(
//           "Record not found"
//         );
//       }

//       const paidAmount =
//         Number(record.paidAmount || 0);

//       if (paidAmount > chargedFee) {
//         throw new Error(
//           "Charged fee cannot be less than paid amount"
//         );
//       }

//       record.fee = chargedFee;

//       record.feeStatus =
//         chargedFee > 0 &&
//         paidAmount >= chargedFee;

//       await record.save();

//       emitClinicEvent({
//         type: "RECORD_UPDATED",

//         entity: "record",

//         action: "payment-updated",

//         data: {
//           id: record._id.toString(),

//           fee: record.fee,

//           paidAmount:
//             record.paidAmount,

//           paymentNote:
//             record.paymentNote,

//           feeStatus:
//             record.feeStatus,

//           createdAt:
//             record.createdAt.getTime(),

//           updatedAt:
//             record.updatedAt.getTime(),
//         },
//       });

//       return record;
//     },

//     // ===================================================
//     // UPDATE PAID AMOUNT
//     // ===================================================

//     setPaidAmountFunc: async (
//       _,
//       { id, paidAmount }
//     ) => {
//       const amountPaid =
//         Number(paidAmount);

//       if (
//         !Number.isFinite(amountPaid) ||
//         amountPaid < 0
//       ) {
//         throw new Error(
//           "Invalid paid amount"
//         );
//       }

//       const record =
//         await Record.findById(id);

//       if (!record) {
//         throw new Error(
//           "Record not found"
//         );
//       }

//       const chargedFee =
//         Number(record.fee || 0);

//       if (amountPaid > chargedFee) {
//         throw new Error(
//           "Paid amount cannot be greater than charged fee"
//         );
//       }

//       record.paidAmount =
//         amountPaid;

//       record.feeStatus =
//         chargedFee > 0 &&
//         amountPaid >= chargedFee;

//       await record.save();

//       emitClinicEvent({
//         type: "RECORD_UPDATED",

//         entity: "record",

//         action: "payment-updated",

//         data: {
//           id: record._id.toString(),

//           fee: record.fee,

//           paidAmount:
//             record.paidAmount,

//           paymentNote:
//             record.paymentNote,

//           feeStatus:
//             record.feeStatus,

//           createdAt:
//             record.createdAt.getTime(),

//           updatedAt:
//             record.updatedAt.getTime(),
//         },
//       });

//       return record;
//     },
//   },
// };

// module.exports = resolvers;



const Patient = require("../models/Patient.js");
const Record = require("../models/Record.js");

const getDashboardStats = require(
  "../utils/dashboardStats.js"
);

const emitClinicEvent = require(
  "../events/emitClinicEvent.js"
);

const {
  calculatePendingAmount,
} = require(
  "../utils/patientStats.js"
);


const resolvers = {

  // =====================================================
  // QUERIES
  // =====================================================

  Query: {

    // ---------------------------------------------------
    // PATIENTS
    // ---------------------------------------------------

    patients: async (_, { search }) => {

      let filter = {};

      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      if (search && search.trim()) {

        const searchText =
          search.trim();

        filter = {
          $or: [

            {
              fname: {
                $regex: searchText,
                $options: "i",
              },
            },

            {
              lname: {
                $regex: searchText,
                $options: "i",
              },
            },

            {
              mobile: {
                $regex: searchText,
                $options: "i",
              },
            },

            {
              village: {
                $regex: searchText,
                $options: "i",
              },
            },

          ],
        };
      }

      // -----------------------------------------------
      // GET PATIENTS
      // -----------------------------------------------

      return await Patient.find(filter)
        .sort({
          createdAt: -1,
        });
    },


    // ---------------------------------------------------
    // SINGLE PATIENT
    // ---------------------------------------------------

    patient: async (_, { id }) => {

      return await Patient.findById(id);

    },


    // ---------------------------------------------------
    // ALL RECORDS
    // ---------------------------------------------------

    records: async () => {

      return await Record.find()
        .populate("patient")
        .sort({
          createdAt: -1,
        });

    },


    // ---------------------------------------------------
    // DASHBOARD STATS
    // ---------------------------------------------------

    dashboardStats: async () => {

      return await getDashboardStats();

    },

  },


  // =====================================================
  // PATIENT FIELD RESOLVERS
  // =====================================================

  Patient: {

    // ---------------------------------------------------
    // ID
    // ---------------------------------------------------

    id: (parent) => {

      return parent._id.toString();

    },


    // ---------------------------------------------------
    // PATIENT RECORDS
    // ---------------------------------------------------

    records: async (parent) => {

      return await Record.find({
        patient: parent._id,
      })
        .populate("patient")
        .sort({
          createdAt: -1,
        });

    },


    // ---------------------------------------------------
    // TOTAL PENDING AMOUNT
    // ---------------------------------------------------

    pendingAmount: async (parent) => {

      const records =
        await Record.find({
          patient: parent._id,
        });

      return calculatePendingAmount(
        records
      );

    },

  },


  // =====================================================
  // RECORD FIELD RESOLVERS
  // =====================================================

  Record: {

    // ---------------------------------------------------
    // ID
    // ---------------------------------------------------

    id: (parent) => {

      return parent._id.toString();

    },


    // ---------------------------------------------------
    // PATIENT
    // ---------------------------------------------------

    patient: async (parent) => {

      // Already populated
      if (
        parent.patient &&
        typeof parent.patient === "object" &&
        parent.patient._id
      ) {

        return parent.patient;

      }


      // ObjectId
      if (parent.patient) {

        return await Patient.findById(
          parent.patient
        );

      }

      return null;

    },

  },


  // =====================================================
  // MUTATIONS
  // =====================================================

  Mutation: {

    // ===================================================
    // ADD RECORD
    // ===================================================

    addRecord: async (_, args) => {

      console.log(
        "📥 ADD RECORD REQUEST:",
        args
      );


      const {
        fname,
        lname,
        age,
        sex,
        village,
        mobile,
        fee,
        paidAmount,
        paymentNote,
      } = args;


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !fname?.trim() ||
        !lname?.trim() ||
        age === undefined ||
        age === null ||
        !sex ||
        !village?.trim() ||
        !mobile?.trim()
      ) {

        throw new Error(
          "All patient fields are required"
        );

      }


      const numericAge =
        Number(age);


      if (
        !Number.isInteger(
          numericAge
        ) ||
        numericAge < 0
      ) {

        throw new Error(
          "Invalid age"
        );

      }


      // -----------------------------------------------
      // PAYMENT VALUES
      // -----------------------------------------------

      const chargedFee =
        Number(fee || 0);

      const amountPaid =
        Number(paidAmount || 0);


      if (
        !Number.isFinite(
          chargedFee
        ) ||
        chargedFee < 0
      ) {

        throw new Error(
          "Invalid fee"
        );

      }


      if (
        !Number.isFinite(
          amountPaid
        ) ||
        amountPaid < 0
      ) {

        throw new Error(
          "Invalid paid amount"
        );

      }


      if (
        amountPaid >
        chargedFee
      ) {

        throw new Error(
          "Paid amount cannot be greater than charged fee"
        );

      }


      const feeStatus =
        chargedFee > 0 &&
        amountPaid >= chargedFee;


      // -----------------------------------------------
      // FIND EXISTING PATIENT
      // -----------------------------------------------

      let patient =
        await Patient.findOne({
          fname,lname
        });


      let patientCreated =
        false;


      // -----------------------------------------------
      // CREATE PATIENT
      // -----------------------------------------------

      if (!patient) {

        patient =
          await Patient.create({

            fname:
              fname.trim(),

            lname:
              lname.trim(),

            age:
              numericAge,

            sex,

            village:
              village.trim(),

            mobile:
              mobile.trim(),

            records: [],

          });


        patientCreated = true;


        console.log(
          "👤 Patient created:",
          patient._id.toString()
        );

      }

      // -----------------------------------------------
      // EXISTING PATIENT
      // -----------------------------------------------

      else {

        console.log(
          "👤 Existing patient:",
          patient._id.toString()
        );


        // Update patient information
        // in case something changed.

        patient.fname =
          fname.trim();

        patient.lname =
          lname.trim();

        patient.age =
          numericAge;

        patient.sex =
          sex;

        patient.village =
          village.trim();

        await patient.save();

      }


      // -----------------------------------------------
      // CREATE RECORD
      // -----------------------------------------------

      const record =
        await Record.create({

          patient:
            patient._id,

          fee:
            chargedFee,

          paidAmount:
            amountPaid,

          paymentNote:
            paymentNote?.trim() || "",

          feeStatus,

        });


      console.log(
        "📝 Record created:",
        record._id.toString()
      );


      // -----------------------------------------------
      // LINK RECORD TO PATIENT
      // -----------------------------------------------

      await Patient.findByIdAndUpdate(

        patient._id,

        {
          $push: {
            records:
              record._id,
          },
        },

        {
          new: true,
        }

      );


      console.log(
        "🔗 Record linked to patient"
      );


      // -----------------------------------------------
      // GET COMPLETE RECORD
      // -----------------------------------------------

      const completeRecord =
        await Record.findById(
          record._id
        ).populate("patient");


      if (!completeRecord) {

        throw new Error(
          "Record was created but could not be retrieved"
        );

      }


      // -----------------------------------------------
      // DASHBOARD STATS
      // -----------------------------------------------

      const dashboardStats =
        await getDashboardStats();


      // -----------------------------------------------
      // REALTIME RECORD PAYLOAD
      // -----------------------------------------------

      const realtimeRecord = {

        id:
          completeRecord._id.toString(),

        fee:
          completeRecord.fee ?? 0,

        paidAmount:
          completeRecord.paidAmount ?? 0,

        paymentNote:
          completeRecord.paymentNote ?? "",

        feeStatus:
          completeRecord.feeStatus ?? false,

        createdAt:
          completeRecord.createdAt.getTime(),

        updatedAt:
          completeRecord.updatedAt.getTime(),

        patient: {

          id:
            completeRecord.patient._id.toString(),

          fname:
            completeRecord.patient.fname,

          lname:
            completeRecord.patient.lname,

          age:
            completeRecord.patient.age,

          sex:
            completeRecord.patient.sex,

          mobile:
            completeRecord.patient.mobile,

          village:
            completeRecord.patient.village,

        },

      };


      // -----------------------------------------------
      // SSE EVENT
      // -----------------------------------------------

      emitClinicEvent({

        type:
          "RECORD_CREATED",

        entity:
          "record",

        action:
          "created",

        data: {

          record:
            realtimeRecord,

          patientCreated,

          patient: {

            id:
              patient._id.toString(),

            fname:
              patient.fname,

            lname:
              patient.lname,

            age:
              patient.age,

            sex:
              patient.sex,

            mobile:
              patient.mobile,

            village:
              patient.village,

          },

          dashboardStats,

        },

      });


      console.log(
        "📡 RECORD_CREATED event emitted"
      );


      console.log(
        "✅ ADD RECORD SUCCESS:",
        completeRecord._id.toString()
      );


      return completeRecord;

    },


    // ===================================================
    // UPDATE CHARGED FEE
    // ===================================================

    setChargedAmountFunc: async (
      _,
      { id, fee }
    ) => {

      const chargedFee =
        Number(fee);


      if (
        !Number.isFinite(
          chargedFee
        ) ||
        chargedFee < 0
      ) {

        throw new Error(
          "Invalid charged fee"
        );

      }


      const record =
        await Record.findById(id);


      if (!record) {

        throw new Error(
          "Record not found"
        );

      }


      const paidAmount =
        Number(
          record.paidAmount || 0
        );


      if (
        paidAmount >
        chargedFee
      ) {

        throw new Error(
          "Charged fee cannot be less than paid amount"
        );

      }


      record.fee =
        chargedFee;


      record.feeStatus =
        chargedFee > 0 &&
        paidAmount >=
          chargedFee;


      await record.save();


      // -----------------------------------------------
      // COMPLETE RECORD
      // -----------------------------------------------

      const completeRecord =
        await Record.findById(
          record._id
        ).populate("patient");


      // -----------------------------------------------
      // DASHBOARD
      // -----------------------------------------------

      const dashboardStats =
        await getDashboardStats();


      // -----------------------------------------------
      // PATIENT PENDING
      // -----------------------------------------------

      const patientRecords =
        await Record.find({
          patient:
            record.patient,
        });


      const pendingAmount =
        calculatePendingAmount(
          patientRecords
        );


      // -----------------------------------------------
      // SSE
      // -----------------------------------------------

      emitClinicEvent({

        type:
          "RECORD_UPDATED",

        entity:
          "record",

        action:
          "payment-updated",

        data: {

          record: {

            id:
              completeRecord._id.toString(),

            fee:
              completeRecord.fee,

            paidAmount:
              completeRecord.paidAmount,

            paymentNote:
              completeRecord.paymentNote,

            feeStatus:
              completeRecord.feeStatus,

            createdAt:
              completeRecord.createdAt.getTime(),

            updatedAt:
              completeRecord.updatedAt.getTime(),

            patient: {

              id:
                completeRecord.patient._id.toString(),

              fname:
                completeRecord.patient.fname,

              lname:
                completeRecord.patient.lname,

              age:
                completeRecord.patient.age,

              sex:
                completeRecord.patient.sex,

              mobile:
                completeRecord.patient.mobile,

              village:
                completeRecord.patient.village,

            },

          },

          pendingAmount,

          dashboardStats,

        },

      });


      return completeRecord;

    },


    // ===================================================
    // UPDATE PAID AMOUNT
    // ===================================================

    setPaidAmountFunc: async (
      _,
      { id, paidAmount }
    ) => {

      const amountPaid =
        Number(paidAmount);


      if (
        !Number.isFinite(
          amountPaid
        ) ||
        amountPaid < 0
      ) {

        throw new Error(
          "Invalid paid amount"
        );

      }


      const record =
        await Record.findById(id);


      if (!record) {

        throw new Error(
          "Record not found"
        );

      }


      const chargedFee =
        Number(
          record.fee || 0
        );


      if (
        amountPaid >
        chargedFee
      ) {

        throw new Error(
          "Paid amount cannot be greater than charged fee"
        );

      }


      record.paidAmount =
        amountPaid;


      record.feeStatus =
        chargedFee > 0 &&
        amountPaid >=
          chargedFee;


      await record.save();


      // -----------------------------------------------
      // COMPLETE RECORD
      // -----------------------------------------------

      const completeRecord =
        await Record.findById(
          record._id
        ).populate("patient");


      // -----------------------------------------------
      // DASHBOARD
      // -----------------------------------------------

      const dashboardStats =
        await getDashboardStats();


      // -----------------------------------------------
      // PATIENT PENDING
      // -----------------------------------------------

      const patientRecords =
        await Record.find({
          patient:
            record.patient,
        });


      const pendingAmount =
        calculatePendingAmount(
          patientRecords
        );


      // -----------------------------------------------
      // SSE
      // -----------------------------------------------

      emitClinicEvent({

        type:
          "RECORD_UPDATED",

        entity:
          "record",

        action:
          "payment-updated",

        data: {

          record: {

            id:
              completeRecord._id.toString(),

            fee:
              completeRecord.fee,

            paidAmount:
              completeRecord.paidAmount,

            paymentNote:
              completeRecord.paymentNote,

            feeStatus:
              completeRecord.feeStatus,

            createdAt:
              completeRecord.createdAt.getTime(),

            updatedAt:
              completeRecord.updatedAt.getTime(),

            patient: {

              id:
                completeRecord.patient._id.toString(),

              fname:
                completeRecord.patient.fname,

              lname:
                completeRecord.patient.lname,

              age:
                completeRecord.patient.age,

              sex:
                completeRecord.patient.sex,

              mobile:
                completeRecord.patient.mobile,

              village:
                completeRecord.patient.village,

            },

          },

          pendingAmount,

          dashboardStats,

        },

      });


      return completeRecord;

    },

  },

};


module.exports = resolvers;
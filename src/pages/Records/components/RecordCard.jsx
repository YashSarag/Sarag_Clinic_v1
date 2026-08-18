// import { useState } from "react";
// import { useMutation } from "@apollo/client/react";
// import { gql } from "@apollo/client";

// import { FaRegUser } from "react-icons/fa";
// import { FiEdit2 } from "react-icons/fi";

// const SET_CHARGED_AMOUNT = gql`
//   mutation setChargedAmountFunc($id: ID!, $fee: Float!) {
//     setChargedAmountFunc(id: $id, fee: $fee) {
//       id
//       fee
//       paidAmount
//       paymentNote
//       feeStatus
//       createdAt
//       updatedAt
//     }
//   }
// `;

// const SET_PAID_AMOUNT = gql`
//   mutation setPaidAmountFunc($id: ID!, $paidAmount: Float!) {
//     setPaidAmountFunc(id: $id, paidAmount: $paidAmount) {
//       id
//       fee
//       paidAmount
//       paymentNote
//       feeStatus
//       createdAt
//       updatedAt
//     }
//   }
// `;

// const RecordCard = ({ record, onBack, onPaymentUpdated, setSelectRecord }) => {
//   // ==========================================
//   // PAYMENT EDIT STATE
//   // ==========================================
//   console.log("RECORD_____", record);

//   const [chargeAmount, setChargeAmount] = useState({
//     value: record.fee || 0,
//     edit: false,
//   });
//   //   const [paidAmount, setPaidAmount] = useState({
//   //     value: record.paidAmount || 0,
//   //     edit: false
//   //   });
//   const [paymentNote, setPaymentNote] = useState({
//     value: record.paymentNote || 0,
//     edit: false,
//   });

// //   const [pendingAmount, setPendingAmount] = useState(
// //     chargeAmount.value - paidAmount.value || 0,
// //   );

//   //   const [paymentStatus, setPaymentStatus] = useState(record.fee != 0 && record.feeStatus)

//   const pendingAmount = Math.max(
//     Number(chargeAmount.value || 0) - Number(paidAmount.value || 0),
//     0,
//   );

//   const paymentStatus =
//     Number(chargeAmount.value || 0) > 0 &&
//     Number(paidAmount.value || 0) >= Number(chargeAmount.value || 0);

//   // ==========================================
//   // GRAPHQL MUTATION
//   // ==========================================

//   const [setChargedAmountFunc, { loading_charge }] =
//     useMutation(SET_CHARGED_AMOUNT);

//   const [setPaidAmountFunc, { loading_paid }] = useMutation(SET_PAID_AMOUNT);

//   // ==========================================
//   // DATE
//   // ==========================================

//   const formatDateTime = (timestamp) => {
//     const date = new Date(Number(timestamp));

//     if (Number.isNaN(date.getTime())) {
//       return "Invalid date";
//     }

//     return date.toLocaleString("en-GB", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="h-full overflow-y-auto bg-content p-4">
//       {/* ========================================
//           BACK
//       ========================================= */}

//       <button
//         onClick={onBack}
//         className="mb-4 text-sm font-medium text-slate-600 transition hover:text-slate-900"
//       >
//         ← Back to Records
//       </button>

//       {/* ========================================
//           MAIN CARD
//       ========================================= */}

//       <div className="bg-theme rounded-2xl p-[1px] shadow-lg mb-[70px]">
//         <div className="bg-content rounded-[15px] p-6">
//           {/* ======================================
//               PATIENT HEADER
//           ======================================= */}

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="bg-theme text-content flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl">
//                 <FaRegUser />
//               </div>

//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800">
//                   {record.patient.fname} {record.patient.lname}
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500">
//                   {record.patient.age} yrs • {record.patient.sex}
//                 </p>
//               </div>
//             </div>

//             {/* STATUS */}

//             {paymentStatus ? (
//               <span className="rounded-full bg-green-100 px-4 py-2 text-[10px] font-semibold text-green-700">
//                 Paid
//               </span>
//             ) : (
//               <span className="rounded-full bg-red-100 px-4 py-2 text-[10px] font-semibold text-red-600">
//                 Pending
//               </span>
//             )}
//           </div>

//           {/* ======================================
//               PATIENT INFORMATION
//           ======================================= */}

//           <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
//             <div>
//               <p className="text-xs text-slate-400">Mobile</p>

//               <p className="mt-1 font-medium text-slate-700">
//                 {record.patient.mobile}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-slate-400">Village</p>

//               <p className="mt-1 font-medium text-slate-700">
//                 {record.patient.village}
//               </p>
//             </div>
//           </div>

//           {/* ======================================
//               PAYMENT INFORMATION
//           ======================================= */}

//           <div className="mt-6 border-t border-slate-200 pt-5">
//             <form className="flex flex-col w-full gap-[15px]">
//               <div>
//                 <div className="text-xs text-slate-400">Charged Amount</div>
//                 <div className="relative">
//                   <input
//                     value={chargeAmount.value}
//                     readOnly={!chargeAmount.edit}
//                     onChange={(e) => {
//                       const amt = e.target.value;
//                       setChargeAmount((pre) => ({
//                         ...pre,
//                         value: e.target.value,
//                       }));

//                     //   setPendingAmount(amt - paidAmount.value);
//                     }}
//                     className="border-none outline-none shadow-md rounded-md h-[40px] px-[5px] w-full"
//                   />

//                   <div
//                     onClick={() =>
//                       setChargeAmount((pre) => ({ ...pre, edit: !pre.edit }))
//                     }
//                     className="absolute right-[10px] top-[50%] translate-y-[-50%] bg-content"
//                   >
//                     {!chargeAmount.edit ? (
//                       <FiEdit2 />
//                     ) : (
//                       <div
//                         onClick={async () => {
//                           try {
//                             const newFee = Number(chargeAmount.value);

//                             if (!Number.isFinite(newFee) || newFee < 0) {
//                               console.error("Invalid charged amount");
//                               return;
//                             }

//                             if (newFee < Number(paidAmount.value)) {
//                               console.error(
//                                 "Charged amount cannot be less than paid amount",
//                               );
//                               return;
//                             }

//                             const { data } = await setChargedAmountFunc({
//                               variables: {
//                                 id: record.id,
//                                 fee: newFee,
//                               },
//                             });

//                             const updatedRecord = data?.setChargedAmountFunc;

//                             if (!updatedRecord) return;

//                             // Update local RecordCard
//                             setChargeAmount({
//                               value: updatedRecord.fee ?? 0,
//                               edit: false,
//                             });

//                             // VERY IMPORTANT:
//                             // Send updated record to Patients page
//                             if (onPaymentUpdated) {
//                               onPaymentUpdated(updatedRecord);
//                             }
//                           } catch (error) {
//                             console.error(
//                               "Failed to update charged amount:",
//                               error,
//                             );
//                           }
//                         }}
//                         className="px-[8px] py-[3px] rounded-md bg-theme text-content text-[10px]"
//                       >
//                         Save
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="text-xs text-slate-400">Paid Amount</div>
//                 <div className="relative">
//                   <input
//                     value={paidAmount.value}
//                     readOnly={!paidAmount.edit}
//                     onChange={(e) => {
//                       const amt = e.target.value;
//                       setPaidAmount((pre) => ({
//                         ...pre,
//                         value: e.target.value,
//                       }));

//                     //   setPendingAmount(chargeAmount.value - amt);
//                     }}
//                     className="border-none outline-none shadow-md rounded-md h-[40px] px-[5px] w-full"
//                   />

//                   <div
//                     onClick={() =>
//                       setPaidAmount((pre) => ({ ...pre, edit: !pre.edit }))
//                     }
//                     className="absolute right-[10px] top-[50%] translate-y-[-50%] bg-content"
//                   >
//                     {!paidAmount.edit ? (
//                       <FiEdit2 />
//                     ) : (
//                       <div
//                         onClick={async () => {
//                           try {
//                             const newPaidAmount = Number(paidAmount.value);

//                             const currentFee = Number(chargeAmount.value || 0);

//                             if (
//                               !Number.isFinite(newPaidAmount) ||
//                               newPaidAmount < 0
//                             ) {
//                               console.error("Invalid paid amount");
//                               return;
//                             }

//                             if (newPaidAmount > currentFee) {
//                               console.error(
//                                 "Paid amount cannot be greater than charged amount",
//                               );
//                               return;
//                             }

//                             const { data } = await setPaidAmountFunc({
//                               variables: {
//                                 id: record.id,
//                                 paidAmount: newPaidAmount,
//                               },
//                             });

//                             const updatedRecord = data?.setPaidAmountFunc;

//                             if (!updatedRecord) return;

//                             // Update local RecordCard
//                             setPaidAmount({
//                               value: updatedRecord.paidAmount ?? 0,
//                               edit: false,
//                             });

//                             // VERY IMPORTANT:
//                             // Send updated record to Patients page
//                             if (onPaymentUpdated) {
//                               onPaymentUpdated(updatedRecord);
//                             }
//                           } catch (error) {
//                             console.error(
//                               "Failed to update paid amount:",
//                               error,
//                             );
//                           }
//                         }}
//                         className="px-[8px] py-[3px] rounded-md bg-theme text-content text-[10px]"
//                       >
//                         Save
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <div className="text-xs text-slate-400">Pending Amount</div>
//                 <div
//                   className={`${pendingAmount == 0 ? "text-green-400" : "text-red-500"} font-bold`}
//                 >
//                   {pendingAmount}
//                 </div>
//               </div>
//             </form>
//           </div>

//           {/* ======================================
//               RECORD INFORMATION
//           ======================================= */}

//           <div className="mt-6 border-t border-slate-200 pt-5">
//             <h3 className="font-semibold text-slate-800">Record Information</h3>

//             <div className="mt-4">
//               <p className="text-xs text-slate-400">Created</p>

//               <p className="mt-1 text-sm font-medium text-slate-700">
//                 {formatDateTime(record.createdAt)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordCard;


// import React, { useState } from "react";
// import { gql } from "@apollo/client";
// import { useMutation } from "@apollo/client/react";

// import {
//   FaCheckCircle,
//   FaClock,
//   FaRegUser,
// } from "react-icons/fa";


// // =====================================================
// // UPDATE CHARGED AMOUNT
// // =====================================================

// const SET_CHARGED_AMOUNT = gql`
//   mutation SetChargedAmountFunc(
//     $id: ID!
//     $fee: Float!
//   ) {
//     setChargedAmountFunc(
//       id: $id
//       fee: $fee
//     ) {
//       id
//       fee
//       paidAmount
//       paymentNote
//       feeStatus
//       createdAt
//       updatedAt
//       patient {
//         id
//         fname
//         lname
//         age
//         sex
//         mobile
//         village
//       }
//     }
//   }
// `;


// // =====================================================
// // UPDATE PAID AMOUNT
// // =====================================================

// const SET_PAID_AMOUNT = gql`
//   mutation SetPaidAmountFunc(
//     $id: ID!
//     $paidAmount: Float!
//   ) {
//     setPaidAmountFunc(
//       id: $id
//       paidAmount: $paidAmount
//     ) {
//       id
//       fee
//       paidAmount
//       paymentNote
//       feeStatus
//       createdAt
//       updatedAt
//       patient {
//         id
//         fname
//         lname
//         age
//         sex
//         mobile
//         village
//       }
//     }
//   }
// `;


// // =====================================================
// // COMPONENT
// // =====================================================

// const RecordCard = ({
//   record,
//   setSelectRecord,
//   onBack,
//   onPaymentUpdated,
// }) => {

//   // ===================================================
//   // SAFETY
//   // ===================================================

//   if (!record) {
//     return null;
//   }


//   // ===================================================
//   // DATABASE VALUES
//   // ===================================================

//   const initialFee = Number(record.fee || 0);

//   const initialPaidAmount =
//     Number(record.paidAmount || 0);


//   // ===================================================
//   // LOCAL EDIT VALUES
//   // ===================================================

//   const [feeInput, setFeeInput] =
//     useState(String(initialFee));

//   const [paidAmountInput, setPaidAmountInput] =
//     useState(String(initialPaidAmount));


//   // ===================================================
//   // SAVED VALUES
//   // IMPORTANT:
//   // These are changed ONLY after Save succeeds.
//   // ===================================================

//   const [savedFee, setSavedFee] =
//     useState(initialFee);

//   const [savedPaidAmount, setSavedPaidAmount] =
//     useState(initialPaidAmount);


//   // ===================================================
//   // ERROR / SUCCESS
//   // ===================================================

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState("");


//   // ===================================================
//   // MUTATIONS
//   // ===================================================

//   const [
//     setChargedAmount,
//     {
//       loading: updatingFee,
//     },
//   ] = useMutation(SET_CHARGED_AMOUNT);


//   const [
//     setPaidAmount,
//     {
//       loading: updatingPaidAmount,
//     },
//   ] = useMutation(SET_PAID_AMOUNT);


//   const saving =
//     updatingFee ||
//     updatingPaidAmount;


//   // ===================================================
//   // CURRENT STATUS
//   //
//   // This is based on SAVED values.
//   // Therefore typing in the input does NOT
//   // immediately change the status.
//   // ===================================================

//   const isPaid =
//     savedFee > 0 &&
//     savedPaidAmount >= savedFee;


//   // ===================================================
//   // PATIENT
//   // ===================================================

//   const patient = record.patient || {};


//   // ===================================================
//   // SAVE PAYMENT DETAILS
//   // ===================================================

//   const handleSave = async () => {

//     setError("");
//     setSuccess("");


//     // -------------------------------------------------
//     // Convert inputs
//     // -------------------------------------------------

//     const newFee =
//       Number(feeInput);

//     const newPaidAmount =
//       Number(paidAmountInput);


//     // -------------------------------------------------
//     // Validation
//     // -------------------------------------------------

//     if (
//       !Number.isFinite(newFee) ||
//       newFee < 0
//     ) {
//       setError(
//         "Please enter a valid charge amount."
//       );

//       return;
//     }


//     if (
//       !Number.isFinite(newPaidAmount) ||
//       newPaidAmount < 0
//     ) {
//       setError(
//         "Please enter a valid paid amount."
//       );

//       return;
//     }


//     if (
//       newPaidAmount > newFee
//     ) {
//       setError(
//         "Paid amount cannot be greater than the charged amount."
//       );

//       return;
//     }


//     try {

//       let updatedRecord = null;


//       // =================================================
//       // UPDATE CHARGED AMOUNT
//       // =================================================

//       if (
//         newFee !== savedFee
//       ) {

//         const response =
//           await setChargedAmount({
//             variables: {
//               id: record.id,
//               fee: newFee,
//             },
//           });


//         updatedRecord =
//           response?.data?.setChargedAmountFunc ||
//           null;
//       }


//       // =================================================
//       // UPDATE PAID AMOUNT
//       // =================================================

//       if (
//         newPaidAmount !== savedPaidAmount
//       ) {

//         const response =
//           await setPaidAmount({
//             variables: {
//               id: record.id,
//               paidAmount: newPaidAmount,
//             },
//           });


//         updatedRecord =
//           response?.data?.setPaidAmountFunc ||
//           updatedRecord;
//       }


//       // =================================================
//       // NOTHING CHANGED
//       // =================================================

//       if (!updatedRecord) {

//         setSuccess(
//           "No changes to save."
//         );

//         return;
//       }


//       // =================================================
//       // GET FINAL DATABASE VALUES
//       // =================================================

//       const finalFee =
//         Number(
//           updatedRecord.fee ?? newFee
//         );

//       const finalPaidAmount =
//         Number(
//           updatedRecord.paidAmount ??
//           newPaidAmount
//         );


//       // =================================================
//       // UPDATE LOCAL SAVED STATE
//       // =================================================

//       setSavedFee(finalFee);

//       setSavedPaidAmount(
//         finalPaidAmount
//       );


//       // Keep inputs synchronized with DB
//       setFeeInput(
//         String(finalFee)
//       );

//       setPaidAmountInput(
//         String(finalPaidAmount)
//       );


//       // =================================================
//       // UPDATE RECORD OBJECT
//       // =================================================

//       const updatedRecordForParent = {
//         ...record,

//         ...updatedRecord,

//         fee: finalFee,

//         paidAmount:
//           finalPaidAmount,

//         feeStatus:
//           finalFee > 0 &&
//           finalPaidAmount >= finalFee,
//       };


//       // =================================================
//       // SEND UPDATED RECORD TO PARENT
//       // =================================================

//       if (
//         typeof onPaymentUpdated ===
//         "function"
//       ) {
//         onPaymentUpdated(
//           updatedRecordForParent
//         );
//       }


//       // =================================================
//       // SUCCESS
//       // =================================================

//       setSuccess(
//         "Payment details updated successfully."
//       );

//     } catch (err) {

//       console.error(
//         "Payment update failed:",
//         err
//       );

//       setError(
//         err?.message ||
//         "Failed to update payment details."
//       );
//     }
//   };


//   // ===================================================
//   // BACK
//   // ===================================================

//   const handleBack = () => {

//     if (saving) {
//       return;
//     }

//     if (onBack) {
//       onBack();
//       return;
//     }

//     if (setSelectRecord) {
//       setSelectRecord(false);
//     }
//   };


//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <div className="min-h-full bg-content p-4 mb-[90px]">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="mb-4 flex items-center justify-between">

//         <button
//           type="button"
//           onClick={handleBack}
//           disabled={saving}
//           className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           ← Back
//         </button>


//         {/* -----------------------------------------------
//             PAYMENT STATUS
//         ----------------------------------------------- */}

//         <div
//           className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
//             isPaid
//               ? "bg-green-100 text-green-700"
//               : "bg-amber-100 text-amber-700"
//           }`}
//         >

//           {isPaid ? (
//             <>
//               <FaCheckCircle />
//               Paid
//             </>
//           ) : (
//             <>
//               <FaClock />
//               Pending
//             </>
//           )}

//         </div>

//       </div>


//       {/* =================================================
//           MAIN CARD
//       ================================================= */}

//       <div className="overflow-hidden rounded-2xl bg-white shadow-sm">


//         {/* =================================================
//             PATIENT HEADER
//         ================================================= */}

//         <div className="bg-theme text-content p-5">

//           <div className="flex items-center gap-4">

//             {/* Avatar */}

//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
//               <FaRegUser />
//             </div>


//             {/* Patient information */}

//             <div>

//               <h2 className="text-xl font-bold">
//                 {patient.fname || ""}{" "}
//                 {patient.lname || ""}
//               </h2>

//               <div className="mt-1 text-sm opacity-80">

//                 {patient.age
//                   ? `${patient.age} yrs`
//                   : ""}

//                 {patient.sex
//                   ? ` • ${patient.sex}`
//                   : ""}

//               </div>

//             </div>

//           </div>

//         </div>


//         {/* =================================================
//             PATIENT INFORMATION
//         ================================================= */}

//         <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

//           {/* Mobile */}

//           <div className="rounded-xl bg-slate-50 p-4">

//             <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
//               Mobile
//             </div>

//             <div className="mt-1 text-sm font-semibold text-slate-700">
//               {patient.mobile || "—"}
//             </div>

//           </div>


//           {/* Village */}

//           <div className="rounded-xl bg-slate-50 p-4">

//             <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
//               Village
//             </div>

//             <div className="mt-1 text-sm font-semibold text-slate-700">
//               {patient.village || "—"}
//             </div>

//           </div>

//         </div>


//         {/* =================================================
//             PAYMENT SECTION
//         ================================================= */}

//         <div className="border-t border-slate-100 p-5">

//           <h3 className="text-base font-bold text-slate-800">
//             Payment Details
//           </h3>

//           <p className="mt-1 text-xs text-slate-400">
//             Update the charged and paid amount.
//           </p>


//           {/* =================================================
//               INPUTS
//           ================================================= */}

//           <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">


//             {/* -----------------------------------------------
//                 CHARGED AMOUNT
//             ----------------------------------------------- */}

//             <div>

//               <label className="text-sm font-medium text-slate-600">
//                 Charged Amount
//               </label>

//               <div className="relative mt-1.5">

//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
//                   ₹
//                 </span>

//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={feeInput}
//                   onChange={(e) => {
//                     setFeeInput(
//                       e.target.value
//                     );

//                     setError("");
//                     setSuccess("");
//                   }}
//                   disabled={saving}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
//                 />

//               </div>

//             </div>


//             {/* -----------------------------------------------
//                 PAID AMOUNT
//             ----------------------------------------------- */}

//             <div>

//               <label className="text-sm font-medium text-slate-600">
//                 Paid Amount
//               </label>

//               <div className="relative mt-1.5">

//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
//                   ₹
//                 </span>

//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={paidAmountInput}
//                   onChange={(e) => {
//                     setPaidAmountInput(
//                       e.target.value
//                     );

//                     setError("");
//                     setSuccess("");
//                   }}
//                   disabled={saving}
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
//                 />

//               </div>

//             </div>

//           </div>


//           {/* =================================================
//               CURRENT PAYMENT SUMMARY
//           ================================================= */}

//           <div className="mt-5 grid grid-cols-2 gap-3">

//             {/* Charged */}

//             <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

//               <div className="text-xs text-slate-400">
//                 Charged
//               </div>

//               <div className="mt-1 text-lg font-bold text-slate-800">
//                 ₹{savedFee.toFixed(2)}
//               </div>

//             </div>


//             {/* Paid */}

//             <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

//               <div className="text-xs text-slate-400">
//                 Paid
//               </div>

//               <div className="mt-1 text-lg font-bold text-slate-800">
//                 ₹{savedPaidAmount.toFixed(2)}
//               </div>

//             </div>

//           </div>


//           {/* =================================================
//               PENDING AMOUNT
//           ================================================= */}

//           <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4">

//             <div className="flex items-center justify-between">

//               <div>

//                 <div className="text-xs font-medium text-amber-600">
//                   Pending Amount
//                 </div>

//                 <div className="mt-1 text-xl font-bold text-amber-700">
//                   ₹
//                   {Math.max(
//                     0,
//                     savedFee -
//                       savedPaidAmount
//                   ).toFixed(2)}
//                 </div>

//               </div>


//               <div
//                 className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
//                   isPaid
//                     ? "bg-green-100 text-green-700"
//                     : "bg-amber-100 text-amber-700"
//                 }`}
//               >
//                 {isPaid
//                   ? "Fully Paid"
//                   : "Payment Pending"}
//               </div>

//             </div>

//           </div>


//           {/* =================================================
//               ERROR
//           ================================================= */}

//           {error && (
//             <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}


//           {/* =================================================
//               SUCCESS
//           ================================================= */}

//           {success && (
//             <div className="mt-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
//               {success}
//             </div>
//           )}


//           {/* =================================================
//               SAVE BUTTON
//           ================================================= */}

//           <div className="mt-5 flex justify-end">

//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={saving}
//               className="bg-theme text-content rounded-xl px-6 py-3 text-sm font-semibold shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {saving
//                 ? "Saving..."
//                 : "Save Changes"}
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };


// export default RecordCard;




import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";

import {
  FaRegUser,
  FaArrowLeft,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";

// =====================================================
// UPDATE CHARGED FEE
// =====================================================

const SET_CHARGED_AMOUNT = gql`
  mutation SetChargedAmountFunc(
    $id: ID!
    $fee: Float!
  ) {
    setChargedAmountFunc(
      id: $id
      fee: $fee
    ) {
      id
      fee
      paidAmount
      paymentNote
      feeStatus
      createdAt
      updatedAt
    }
  }
`;

// =====================================================
// UPDATE PAID AMOUNT
// =====================================================

const SET_PAID_AMOUNT = gql`
  mutation SetPaidAmountFunc(
    $id: ID!
    $paidAmount: Float!
  ) {
    setPaidAmountFunc(
      id: $id
      paidAmount: $paidAmount
    ) {
      id
      fee
      paidAmount
      paymentNote
      feeStatus
      createdAt
      updatedAt
    }
  }
`;

// =====================================================
// COMPONENT
// =====================================================

const RecordCard = ({
  record,
  onBack,
  onPaymentUpdated,
}) => {

    const role = useSelector(state => state.auth)?.user.role;

  // ===================================================
  // PAYMENT STATE
  // ===================================================

  const [chargeAmount, setChargeAmount] =
    useState({
      value: Number(record?.fee || 0),
      edit: false,
    });

  const [paidAmount, setPaidAmount] =
    useState({
      value: Number(
        record?.paidAmount || 0
      ),
      edit: false,
    });

  const [paymentError, setPaymentError] =
    useState("");


  // ===================================================
  // KEEP LOCAL STATE IN SYNC WITH RECORD
  // ===================================================

  useEffect(() => {

    setChargeAmount({
      value: Number(
        record?.fee || 0
      ),
      edit: false,
    });

    setPaidAmount({
      value: Number(
        record?.paidAmount || 0
      ),
      edit: false,
    });

  }, [
    record?.id,
    record?.fee,
    record?.paidAmount,
  ]);


  // ===================================================
  // MUTATIONS
  // ===================================================

  const [
    setChargedAmountFunc,
    { loading: loadingCharge },
  ] = useMutation(
    SET_CHARGED_AMOUNT
  );

  const [
    setPaidAmountFunc,
    { loading: loadingPaid },
  ] = useMutation(
    SET_PAID_AMOUNT
  );


  // ===================================================
  // CALCULATED VALUES
  // ===================================================

  const fee =
    Number(
      chargeAmount.value || 0
    );

  const paid =
    Number(
      paidAmount.value || 0
    );

  const pendingAmount =
    Math.max(
      fee - paid,
      0
    );


  /*
   * IMPORTANT:
   *
   * fee = 0
   * paid = 0
   *
   * must remain Pending because the doctor
   * has not charged anything yet.
   *
   * Therefore fee > 0 is required for Paid.
   */

  const paymentStatus =
    fee > 0 &&
    paid >= fee;


  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDateTime = (
    timestamp
  ) => {

    const date =
      new Date(
        Number(timestamp)
      );

    return date.toLocaleString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ===================================================
  // SAVE CHARGED FEE
  // ===================================================

  const saveChargedAmount =
    async () => {

      setPaymentError("");

      const newFee =
        Number(
          chargeAmount.value
        );

      const currentPaid =
        Number(
          paidAmount.value || 0
        );


      if (
        !Number.isFinite(
          newFee
        ) ||
        newFee < 0
      ) {
        setPaymentError(
          "Please enter a valid charged amount."
        );

        return;
      }


      if (
        newFee < currentPaid
      ) {
        setPaymentError(
          "Charged amount cannot be less than paid amount."
        );

        return;
      }


      try {

        const { data } =
          await setChargedAmountFunc({
            variables: {
              id: record.id,
              fee: newFee,
            },
          });


        const updatedRecord =
          data?.setChargedAmountFunc;


        if (!updatedRecord) {
          throw new Error(
            "Updated record was not returned."
          );
        }


        // Update local card

        setChargeAmount({
          value:
            Number(
              updatedRecord.fee || 0
            ),
          edit: false,
        });


        setPaidAmount(
          (previous) => ({
            ...previous,

            value:
              Number(
                updatedRecord.paidAmount ||
                  0
              ),
          })
        );


        // Notify parent

        if (
          onPaymentUpdated
        ) {
          onPaymentUpdated(
            updatedRecord
          );
        }

      } catch (error) {

        console.error(
          "Failed to update charged amount:",
          error
        );

        setPaymentError(
          error.message ||
          "Failed to update charged amount."
        );
      }
    };


  // ===================================================
  // SAVE PAID AMOUNT
  // ===================================================

  const savePaidAmount =
    async () => {

      setPaymentError("");

      const newPaid =
        Number(
          paidAmount.value
        );

      const currentFee =
        Number(
          chargeAmount.value || 0
        );


      if (
        !Number.isFinite(
          newPaid
        ) ||
        newPaid < 0
      ) {
        setPaymentError(
          "Please enter a valid paid amount."
        );

        return;
      }


      if (
        newPaid > currentFee
      ) {
        setPaymentError(
          "Paid amount cannot be greater than charged amount."
        );

        return;
      }


      try {

        const { data } =
          await setPaidAmountFunc({
            variables: {
              id: record.id,
              paidAmount:
                newPaid,
            },
          });


        const updatedRecord =
          data?.setPaidAmountFunc;


        if (!updatedRecord) {
          throw new Error(
            "Updated record was not returned."
          );
        }


        // Update local card

        setPaidAmount({
          value:
            Number(
              updatedRecord.paidAmount ||
                0
            ),
          edit: false,
        });


        setChargeAmount(
          (previous) => ({
            ...previous,

            value:
              Number(
                updatedRecord.fee ||
                  0
              ),
          })
        );


        // Notify parent

        if (
          onPaymentUpdated
        ) {
          onPaymentUpdated(
            updatedRecord
          );
        }

      } catch (error) {

        console.error(
          "Failed to update paid amount:",
          error
        );

        setPaymentError(
          error.message ||
          "Failed to update paid amount."
        );
      }
    };


  // ===================================================
  // CANCEL CHARGED EDIT
  // ===================================================

  const cancelChargeEdit =
    () => {

      setChargeAmount({
        value:
          Number(
            record?.fee || 0
          ),
        edit: false,
      });

      setPaymentError("");
    };


  // ===================================================
  // CANCEL PAID EDIT
  // ===================================================

  const cancelPaidEdit =
    () => {

      setPaidAmount({
        value:
          Number(
            record?.paidAmount || 0
          ),
        edit: false,
      });

      setPaymentError("");
    };


  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-full bg-content p-4">

      {/* =================================================
          BACK
      ================================================= */}

      <button
        onClick={onBack}
        className="
          mb-4
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-600
          transition
          hover:text-slate-900
        "
      >
        <FaArrowLeft />
        Back
      </button>


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div
        className="
          rounded-2xl
          bg-theme
          p-[1px]
          shadow-lg
        "
      >

        <div
          className="
            rounded-[15px]
            bg-content
            p-6
          "
        >

          {/* =================================================
              PATIENT HEADER
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-theme
                  text-content
                  text-2xl
                "
              >
                <FaRegUser />
              </div>

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                >
                  {record.patient?.fname}{" "}
                  {record.patient?.lname}
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  {record.patient?.age} yrs
                  {" • "}
                  {record.patient?.sex}
                </p>

              </div>

            </div>


            {/* =================================================
                PAYMENT STATUS
            ================================================= */}

            {paymentStatus ? (

              <span
                className="
                  rounded-full
                  bg-green-100
                  px-4
                  py-2
                  text-[10px]
                  font-semibold
                  text-green-700
                "
              >
                Paid
              </span>

            ) : (

              <span
                className="
                  rounded-full
                  bg-red-100
                  px-4
                  py-2
                  text-[10px]
                  font-semibold
                  text-red-600
                "
              >
                Pending
              </span>

            )}

          </div>


          {/* =================================================
              PATIENT INFORMATION
          ================================================= */}

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-4
              border-t
              border-slate-200
              pt-5
              sm:grid-cols-2
            "
          >

            <div>

              <p className="text-xs text-slate-400">
                Mobile
              </p>

              <p
                className="
                  mt-1
                  font-medium
                  text-slate-700
                "
              >
                {record.patient?.mobile ||
                  "-"}
              </p>

            </div>


            <div>

              <p className="text-xs text-slate-400">
                Village
              </p>

              <p
                className="
                  mt-1
                  font-medium
                  text-slate-700
                "
              >
                {record.patient?.village ||
                  "-"}
              </p>

            </div>

          </div>


          {/* =================================================
              PAYMENT ERROR
          ================================================= */}

          {paymentError && (

            <div
              className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
              "
            >
              {paymentError}
            </div>

          )}


          {/* =================================================
              PAYMENT INFORMATION
          ================================================= */}

          { role === "admin" && <div
            className="
              mt-6
              border-t
              border-slate-200
              pt-5
            "
          >

            <h3
              className="
                font-semibold
                text-slate-800
              "
            >
              Payment Information
            </h3>


            <div
              className="
                mt-4
                grid
                grid-cols-1
                gap-4
                md:grid-cols-3
              "
            >

              {/* =================================================
                  CHARGED FEE
              ================================================= */}

              <div
                className="
                  rounded-xl
                  bg-slate-100
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Charged Fee
                  </p>


                  {!chargeAmount.edit && (

                    <button
                      onClick={() => {

                        setChargeAmount(
                          (previous) => ({
                            ...previous,
                            edit: true,
                          })
                        );

                        setPaymentError("");
                      }}
                      className="
                        rounded-md
                        p-1.5
                        text-slate-400
                        transition
                        hover:bg-white
                        hover:text-slate-700
                      "
                    >
                      <FaEdit />
                    </button>

                  )}

                </div>


                <div className="mt-2">

                  {chargeAmount.edit ? (

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <input
                        type="number"
                        min="0"
                        value={
                          chargeAmount.value
                        }
                        onChange={(e) => {

                          setChargeAmount(
                            (previous) => ({
                              ...previous,
                              value:
                                e.target.value,
                            })
                          );
                        }}
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          px-3
                          text-lg
                          font-bold
                          text-slate-800
                          outline-none
                          focus:border-slate-400
                        "
                      />


                      <button
                        onClick={
                          saveChargedAmount
                        }
                        disabled={
                          loadingCharge
                        }
                        className="
                          rounded-lg
                          bg-theme
                          p-2
                          text-content
                          disabled:opacity-50
                        "
                      >
                        <FaCheck />
                      </button>


                      <button
                        onClick={
                          cancelChargeEdit
                        }
                        disabled={
                          loadingCharge
                        }
                        className="
                          rounded-lg
                          bg-slate-200
                          p-2
                          text-slate-600
                          disabled:opacity-50
                        "
                      >
                        <FaTimes />
                      </button>

                    </div>

                  ) : (

                    <p
                      className="
                        text-xl
                        font-bold
                        text-slate-800
                      "
                    >
                      ₹{fee}
                    </p>

                  )}

                </div>

              </div>


              {/* =================================================
                  PAID AMOUNT
              ================================================= */}

              <div
                className="
                  rounded-xl
                  bg-slate-100
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Paid Amount
                  </p>


                  {!paidAmount.edit && (

                    <button
                      onClick={() => {

                        setPaidAmount(
                          (previous) => ({
                            ...previous,
                            edit: true,
                          })
                        );

                        setPaymentError("");
                      }}
                      className="
                        rounded-md
                        p-1.5
                        text-slate-400
                        transition
                        hover:bg-white
                        hover:text-slate-700
                      "
                    >
                      <FaEdit />
                    </button>

                  )}

                </div>


                <div className="mt-2">

                  {paidAmount.edit ? (

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <input
                        type="number"
                        min="0"
                        value={
                          paidAmount.value
                        }
                        onChange={(e) => {

                          setPaidAmount(
                            (previous) => ({
                              ...previous,
                              value:
                                e.target.value,
                            })
                          );
                        }}
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          px-3
                          text-lg
                          font-bold
                          text-green-600
                          outline-none
                          focus:border-slate-400
                        "
                      />


                      <button
                        onClick={
                          savePaidAmount
                        }
                        disabled={
                          loadingPaid
                        }
                        className="
                          rounded-lg
                          bg-theme
                          p-2
                          text-content
                          disabled:opacity-50
                        "
                      >
                        <FaCheck />
                      </button>


                      <button
                        onClick={
                          cancelPaidEdit
                        }
                        disabled={
                          loadingPaid
                        }
                        className="
                          rounded-lg
                          bg-slate-200
                          p-2
                          text-slate-600
                          disabled:opacity-50
                        "
                      >
                        <FaTimes />
                      </button>

                    </div>

                  ) : (

                    <p
                      className="
                        text-xl
                        font-bold
                        text-green-600
                      "
                    >
                      ₹{paid}
                    </p>

                  )}

                </div>

              </div>


              {/* =================================================
                  PENDING
              ================================================= */}

              <div
                className="
                  rounded-xl
                  bg-slate-100
                  p-4
                "
              >

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Pending Amount
                </p>

                <p
                  className={`
                    mt-2
                    text-xl
                    font-bold
                    ${
                      pendingAmount > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  `}
                >
                  ₹{pendingAmount}
                </p>

              </div>

            </div>


            {/* PAYMENT NOTE */}

            {record.paymentNote && (

              <div className="mt-5">

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Payment Note
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-700
                  "
                >
                  {record.paymentNote}
                </p>

              </div>

            )}

          </div>}

          {/* =================================================
              RECORD INFORMATION
          ================================================= */}

          <div
            className="
              mt-6
              border-t
              border-slate-200
              pt-5
            "
          >

            <h3
              className="
                font-semibold
                text-slate-800
              "
            >
              Record Information
            </h3>


            <div className="mt-4">

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Created
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                {formatDateTime(
                  record.createdAt
                )}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default RecordCard;
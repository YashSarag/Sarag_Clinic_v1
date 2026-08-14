// import { FaRegUser } from "react-icons/fa";

// const PatientCard = ({ patient, onClick }) => {
//   const pendingAmount = Number(patient.fee - patient.paidAmount || 0);
//   const chargedAmount = Number(patient.fee || 0);

//   return (
//     <div
//       onClick={onClick}
//       className="group flex cursor-pointer items-center justify-between bg-white p-4 transition-all duration-200 hover:bg-slate-50"
//     >
//       {/* Left side */}
//       <div className="flex items-center gap-3">

//         {/* Avatar */}
//         <div className="bg-theme text-content flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl">
//           <FaRegUser />
//         </div>

//         {/* Patient information */}
//         <div>
//           <h3 className="text-lg font-semibold text-slate-800">
//             {patient.fname} {patient.lname}
//           </h3>

//           <p className="mt-0.5 text-xs text-slate-400">
//             {patient.age} yrs • {patient.sex}
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             {patient.mobile}
//           </p>
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="text-right">

//         {/* Number of visits */}
//         <p className="text-xs text-slate-400">
//           {patient.records?.length || 0}{" "}
//           {patient.records?.length === 1
//             ? "record"
//             : "records"}
//         </p>

//         {/* Pending */}
//         {chargedAmount != 0 &&  pendingAmount > 0 ? (
//           <div className="mt-1">
//             <p className="text-xs text-slate-400">
//               Pending
//             </p>

//             <p className="font-semibold text-red-600">
//               ₹{pendingAmount}
//             </p>
//           </div>
//         ) : (
//           <div className="mt-1">
//             <p className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//               Paid
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientCard;



import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import {
  FaRegUser,
  FaArrowLeft,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

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

  // ===================================================
  // PAYMENT STATE
  // ===================================================

  const [chargeAmount, setChargeAmount] =
    useState({
      value: Number(record.fee || 0),
      edit: false,
    });

  const [paidAmount, setPaidAmount] =
    useState({
      value: Number(record.paidAmount || 0),
      edit: false,
    });

  const [paymentError, setPaymentError] =
    useState("");

  // ===================================================
  // MUTATIONS
  // ===================================================

  const [
    setChargedAmountFunc,
    { loading: loadingCharge },
  ] = useMutation(SET_CHARGED_AMOUNT);

  const [
    setPaidAmountFunc,
    { loading: loadingPaid },
  ] = useMutation(SET_PAID_AMOUNT);

  // ===================================================
  // CALCULATED VALUES
  // ===================================================

  const fee =
    Number(chargeAmount.value || 0);

  const paid =
    Number(paidAmount.value || 0);

  const pendingAmount =
    Math.max(fee - paid, 0);

  const paymentStatus =
    fee > 0 && paid >= fee;

  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDateTime = (timestamp) => {
    const date =
      new Date(Number(timestamp));

    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===================================================
  // SAVE CHARGED FEE
  // ===================================================

  const saveChargedAmount = async () => {
    setPaymentError("");

    const newFee =
      Number(chargeAmount.value);

    const currentPaid =
      Number(paidAmount.value || 0);

    if (
      !Number.isFinite(newFee) ||
      newFee < 0
    ) {
      setPaymentError(
        "Please enter a valid charged amount."
      );
      return;
    }

    if (newFee < currentPaid) {
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

      // Update this card
      setChargeAmount({
        value:
          Number(updatedRecord.fee || 0),
        edit: false,
      });

      setPaidAmount((prev) => ({
        ...prev,
        value:
          Number(
            updatedRecord.paidAmount || 0
          ),
      }));

      // =============================================
      // IMPORTANT
      // Send updated record to Patients page
      // =============================================

      if (onPaymentUpdated) {
        onPaymentUpdated(updatedRecord);
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

  const savePaidAmount = async () => {
    setPaymentError("");

    const newPaid =
      Number(paidAmount.value);

    const currentFee =
      Number(chargeAmount.value || 0);

    if (
      !Number.isFinite(newPaid) ||
      newPaid < 0
    ) {
      setPaymentError(
        "Please enter a valid paid amount."
      );
      return;
    }

    if (newPaid > currentFee) {
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
            paidAmount: newPaid,
          },
        });

      const updatedRecord =
        data?.setPaidAmountFunc;

      if (!updatedRecord) {
        throw new Error(
          "Updated record was not returned."
        );
      }

      // Update this card
      setPaidAmount({
        value:
          Number(
            updatedRecord.paidAmount || 0
          ),
        edit: false,
      });

      setChargeAmount((prev) => ({
        ...prev,
        value:
          Number(updatedRecord.fee || 0),
      }));

      // =============================================
      // IMPORTANT
      // Send updated record to Patients page
      // =============================================

      if (onPaymentUpdated) {
        onPaymentUpdated(updatedRecord);
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

  const cancelChargeEdit = () => {
    setChargeAmount({
      value: Number(record.fee || 0),
      edit: false,
    });

    setPaymentError("");
  };

  // ===================================================
  // CANCEL PAID EDIT
  // ===================================================

  const cancelPaidEdit = () => {
    setPaidAmount({
      value:
        Number(record.paidAmount || 0),
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

      <div className="rounded-2xl bg-theme p-[1px] shadow-lg">

        <div className="rounded-[15px] bg-content p-6">

          {/* =================================================
              PATIENT HEADER
          ================================================= */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

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

                <h2 className="text-2xl font-bold text-slate-800">
                  {record.patient?.fname}{" "}
                  {record.patient?.lname}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {record.patient?.age} yrs
                  {" • "}
                  {record.patient?.sex}
                </p>

              </div>

            </div>

            {/* PAYMENT STATUS */}

            {paymentStatus ? (

              <span
                className="
                  rounded-full
                  bg-green-100
                  px-4
                  py-2
                  text-sm
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
                  text-sm
                  font-semibold
                  text-red-600
                "
              >
                ₹{pendingAmount} Pending
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

              <p className="mt-1 font-medium text-slate-700">
                {record.patient?.mobile || "-"}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-400">
                Village
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {record.patient?.village || "-"}
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

          <div className="mt-6 border-t border-slate-200 pt-5">

            <h3 className="font-semibold text-slate-800">
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

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-400">
                    Charged Fee
                  </p>

                  {!chargeAmount.edit && (

                    <button
                      onClick={() => {
                        setChargeAmount(
                          (prev) => ({
                            ...prev,
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

                    <div className="flex items-center gap-2">

                      <input
                        type="number"
                        min="0"
                        value={
                          chargeAmount.value
                        }
                        onChange={(e) => {
                          setChargeAmount(
                            (prev) => ({
                              ...prev,
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
                        onClick={saveChargedAmount}
                        disabled={loadingCharge}
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
                        onClick={cancelChargeEdit}
                        disabled={loadingCharge}
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

                    <p className="text-xl font-bold text-slate-800">
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

                <div className="flex items-center justify-between">

                  <p className="text-xs text-slate-400">
                    Paid Amount
                  </p>

                  {!paidAmount.edit && (

                    <button
                      onClick={() => {
                        setPaidAmount(
                          (prev) => ({
                            ...prev,
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

                    <div className="flex items-center gap-2">

                      <input
                        type="number"
                        min="0"
                        value={
                          paidAmount.value
                        }
                        onChange={(e) => {
                          setPaidAmount(
                            (prev) => ({
                              ...prev,
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
                        onClick={savePaidAmount}
                        disabled={loadingPaid}
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
                        onClick={cancelPaidEdit}
                        disabled={loadingPaid}
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

                    <p className="text-xl font-bold text-green-600">
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

                <p className="text-xs text-slate-400">
                  Pending Amount
                </p>

                <p
                  className={`mt-2 text-xl font-bold ${
                    pendingAmount > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  ₹{pendingAmount}
                </p>

              </div>

            </div>

            {/* PAYMENT NOTE */}

            {record.paymentNote && (

              <div className="mt-5">

                <p className="text-xs text-slate-400">
                  Payment Note
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {record.paymentNote}
                </p>

              </div>

            )}

          </div>

          {/* =================================================
              RECORD INFORMATION
          ================================================= */}

          <div className="mt-6 border-t border-slate-200 pt-5">

            <h3 className="font-semibold text-slate-800">
              Record Information
            </h3>

            <div className="mt-4">

              <p className="text-xs text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
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
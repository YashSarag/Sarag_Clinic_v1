import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import RecordCard from "../Records/components/RecordCard";

import {
  FaRegUser,
  FaArrowLeft,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa";

// =====================================================
// GET PATIENTS
// =====================================================

const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      fname
      lname
      age
      sex
      mobile
      village

      records {
        id
        fee
        paidAmount
        paymentNote
        feeStatus
        createdAt
        updatedAt

        patient {
          id
          fname
          lname
          age
          sex
          mobile
          village
        }
      }
    }
  }
`;

// =====================================================
// COMPONENT
// =====================================================

const Patients = () => {
  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [search, setSearch] =
    useState("");

  // ===================================================
  // QUERY
  // ===================================================

  const {
    data,
    loading,
    error,
  } = useQuery(GET_PATIENTS, {
    fetchPolicy: "cache-and-network",
  });

  const patients =
    data?.patients || [];

  // ===================================================
  // SEARCH
  // ===================================================

  const filteredPatients =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return patients;
      }

      return patients.filter(
        (patient) => {

          const fullName =
            `${patient.fname} ${patient.lname}`
              .toLowerCase();

          return (
            fullName.includes(value) ||
            patient.mobile
              ?.toLowerCase()
              .includes(value) ||
            patient.village
              ?.toLowerCase()
              .includes(value)
          );
        }
      );

    }, [
      patients,
      search,
    ]);

  // ===================================================
  // PENDING
  // ===================================================

  const getPendingAmount = (
    record
  ) => {

    const fee =
      Number(record.fee || 0);

    const paid =
      Number(
        record.paidAmount || 0
      );

    return Math.max(
      fee - paid,
      0
    );
  };

  // ===================================================
  // PATIENT TOTAL PENDING
  // ===================================================

  const getPatientPending =
    (patient) => {

      return (
        patient.records || []
      ).reduce(
        (total, record) =>
          total +
          getPendingAmount(record),
        0
      );
    };

  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDateTime =
    (timestamp) => {

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
  // UPDATE RECORD AFTER RECORD CARD SAVE
  // ===================================================

  const handlePaymentUpdated =
    (updatedRecord) => {

      if (!updatedRecord) {
        return;
      }

      // -----------------------------------------------
      // Update selected patient
      // -----------------------------------------------

      setSelectedPatient(
        (previousPatient) => {

          if (!previousPatient) {
            return previousPatient;
          }

          const updatedRecords =
            (
              previousPatient.records ||
              []
            ).map(
              (record) => {

                if (
                  record.id ===
                  updatedRecord.id
                ) {
                  return {
                    ...record,
                    ...updatedRecord,
                  };
                }

                return record;
              }
            );

          return {
            ...previousPatient,
            records:
              updatedRecords,
          };
        }
      );

      // -----------------------------------------------
      // Update currently selected record
      // -----------------------------------------------

      setSelectedRecord(
        (previousRecord) => {

          if (
            !previousRecord ||
            previousRecord.id !==
              updatedRecord.id
          ) {
            return previousRecord;
          }

          return {
            ...previousRecord,
            ...updatedRecord,
          };
        }
      );
    };

  // ===================================================
  // LOADING
  // ===================================================

  if (
    loading &&
    !data
  ) {
    return (
      <div className="min-h-full bg-content p-5">

        <div className="mb-5 h-12 animate-pulse rounded-xl bg-slate-200" />

        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                mb-2
                h-20
                animate-pulse
                rounded-xl
                bg-slate-100
              "
            />
          )
        )}

      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (
      <div className="p-5">

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-red-600
          "
        >
          Failed to load patients.

          <p className="mt-1 text-xs">
            {error.message}
          </p>
        </div>

      </div>
    );
  }

  // ===================================================
  // RECORD CARD VIEW
  // ===================================================

  if (
    selectedPatient &&
    selectedRecord
  ) {

    return (
      <RecordCard
        record={selectedRecord}

        onBack={() => {
          setSelectedRecord(null);
        }}

        onPaymentUpdated={
          handlePaymentUpdated
        }
      />
    );
  }

  // ===================================================
  // PATIENT DETAILS
  // ===================================================

  if (selectedPatient) {

    const records =
      selectedPatient.records || [];

    const totalPending =
      getPatientPending(
        selectedPatient
      );

    return (
      <div
        className="
          min-h-full
          bg-content
          p-4
        "
      >

        {/* =============================================
            BACK
        ============================================= */}

        <button
          onClick={() => {
            setSelectedPatient(null);
          }}
          className="
            mb-4
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-600
            hover:text-slate-900
          "
        >
          <FaArrowLeft />
          Back to Patients
        </button>


        {/* =============================================
            PATIENT HEADER
        ============================================= */}

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

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              {/* PATIENT */}

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
                    {selectedPatient.fname}{" "}
                    {selectedPatient.lname}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    {selectedPatient.age} yrs
                    {" • "}
                    {selectedPatient.sex}
                  </p>

                </div>

              </div>


              {/* TOTAL PENDING */}

              <div
                className="
                  rounded-xl
                  bg-slate-100
                  px-5
                  py-3
                  text-right
                "
              >

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Total Pending
                </p>

                <p
                  className={`
                    text-xl
                    font-bold
                    ${
                      totalPending > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  `}
                >
                  ₹{totalPending}
                </p>

              </div>

            </div>


            {/* PATIENT INFO */}

            <div
              className="
                mt-6
                grid
                grid-cols-1
                gap-4
                border-t
                border-slate-200
                pt-5
                sm:grid-cols-3
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
                  {selectedPatient.mobile}
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
                  {selectedPatient.village}
                </p>

              </div>


              <div>

                <p className="text-xs text-slate-400">
                  Total Records
                </p>

                <p
                  className="
                    mt-1
                    font-medium
                    text-slate-700
                  "
                >
                  {records.length}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =============================================
            RECORD LIST
        ============================================= */}

        <div className="mt-6">

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >

            <h3
              className="
                text-lg
                font-bold
                text-slate-800
              "
            >
              Records
            </h3>

            <span
              className="
                text-sm
                text-slate-400
              "
            >
              {records.length} records
            </span>

          </div>


          {/* ===========================================
              NO RECORDS
          =========================================== */}

          {records.length === 0 ? (

            <div
              className="
                rounded-xl
                bg-white
                p-10
                text-center
                text-sm
                text-slate-400
              "
            >
              No records found for this patient.
            </div>

          ) : (

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              {records.map(
                (record) => {

                  const fee =
                    Number(
                      record.fee || 0
                    );

                  const paid =
                    Number(
                      record.paidAmount || 0
                    );

                  const pending =
                    getPendingAmount(
                      record
                    );

                  /*
                   * fee=0 means doctor hasn't
                   * charged yet, so it is Pending.
                   */

                  const isPaid =
                    fee > 0 &&
                    paid >= fee;

                  return (
                    <button
                      key={record.id}
                      onClick={() => {
                        setSelectedRecord(
                          record
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        bg-white
                        p-4
                        text-left
                        shadow-sm
                        transition
                        hover:bg-slate-50
                      "
                    >

                      {/* =================================
                          LEFT
                      ================================= */}

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >

                        {/* DATE ICON */}

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-sm
                            font-semibold
                            text-slate-600
                          "
                        >
                          {new Date(
                            Number(
                              record.createdAt
                            )
                          ).getDate()}
                        </div>


                        <div>

                          <p
                            className="
                              font-semibold
                              text-slate-800
                            "
                          >
                            Medical Record
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            {formatDateTime(
                              record.createdAt
                            )}
                          </p>

                        </div>

                      </div>


                      {/* =================================
                          PAYMENT INFO
                      ================================= */}

                      <div
                        className="
                          flex
                          items-center
                          gap-5
                        "
                      >

                        <div className="hidden text-right sm:block">

                          <p
                            className="
                              text-xs
                              text-slate-400
                            "
                          >
                            Charged
                          </p>

                          <p
                            className="
                              font-semibold
                              text-slate-700
                            "
                          >
                            ₹{fee}
                          </p>

                        </div>


                        <div className="hidden text-right sm:block">

                          <p
                            className="
                              text-xs
                              text-slate-400
                            "
                          >
                            Paid
                          </p>

                          <p
                            className="
                              font-semibold
                              text-green-600
                            "
                          >
                            ₹{paid}
                          </p>

                        </div>


                        <div className="text-right">

                          <p
                            className="
                              text-xs
                              text-slate-400
                            "
                          >
                            Pending
                          </p>

                          <p
                            className={`
                              font-bold
                              ${
                                pending > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            `}
                          >
                            ₹{pending}
                          </p>

                        </div>


                        {/* STATUS */}

                        <span
                          className={`
                            hidden
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            sm:inline-block
                            ${
                              isPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }
                          `}
                        >
                          {isPaid
                            ? "Paid"
                            : "Pending"}
                        </span>


                        <FaChevronRight
                          className="
                            text-xs
                            text-slate-300
                          "
                        />

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>
    );
  }


  // ===================================================
  // PATIENT LIST
  // ===================================================

  return (
    <div
      className="
        min-h-full
        bg-content
        p-5
      "
    >

      {/* HEADER */}

      <div className="mb-5">

        <h1
          className="
            text-2xl
            font-bold
            text-slate-800
          "
        >
          Patients
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          Search and view patient records
        </p>

      </div>


      {/* SEARCH */}

      <div className="relative mb-5">

        <FaSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            );
          }}
          placeholder="
            Search by name, mobile or village...
          "
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            py-3
            pl-11
            pr-4
            text-sm
            text-slate-800
            outline-none
            focus:border-slate-400
          "
        />

      </div>


      {/* PATIENT COUNT */}

      <p
        className="
          mb-3
          text-sm
          text-slate-400
        "
      >
        {filteredPatients.length} patients
      </p>


      {/* PATIENTS */}

      {filteredPatients.length === 0 ? (

        <div
          className="
            rounded-xl
            bg-white
            p-10
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
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

          <h3
            className="
              mt-4
              font-semibold
              text-slate-700
            "
          >
            No patients found
          </h3>

        </div>

      ) : (

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >

          {filteredPatients.map(
            (patient) => {

              const pending =
                getPatientPending(
                  patient
                );

              return (
                <button
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(
                      patient
                    );
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    bg-white
                    p-4
                    text-left
                    shadow-sm
                    transition
                    hover:bg-slate-50
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-theme
                        text-content
                      "
                    >
                      <FaRegUser />
                    </div>

                    <div>

                      <p
                        className="
                          font-semibold
                          text-slate-800
                        "
                      >
                        {patient.fname}{" "}
                        {patient.lname}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-400
                        "
                      >
                        {patient.age} yrs
                        {" • "}
                        {patient.sex}
                        {" • "}
                        {patient.mobile}
                      </p>

                    </div>

                  </div>


                  <div className="text-right">

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      {patient.records?.length || 0}{" "}
                      records
                    </p>

                    <p
                      className={`
                        mt-1
                        font-bold
                        ${
                          pending > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      `}
                    >
                      ₹{pending}
                    </p>

                  </div>

                </button>
              );
            }
          )}

        </div>

      )}

    </div>
  );
};

export default Patients;
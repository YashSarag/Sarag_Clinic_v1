import { gql } from "@apollo/client";

// =====================================================
// GRAPHQL FRAGMENTS
// =====================================================

const RECORD_FRAGMENT = gql`
  fragment RealtimeRecord on Record {
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
`;

const PATIENT_FRAGMENT = gql`
  fragment RealtimePatient on Patient {
    id
    fname
    lname
    age
    sex
    mobile
    village
  }
`;

// =====================================================
// HANDLE SSE EVENT
// =====================================================

const handleClinicEvent = (cache, payload) => {
  console.log("📡 Realtime event:", payload);

  switch (payload.type) {

  case "INITIAL_STATS":
    if (payload.data?.dashboardStats) {
      updateDashboardStats(
        cache,
        payload.data.dashboardStats
      );
    }
    break;

  case "RECORD_CREATED":
    handleRecordCreated(
      cache,
      payload.data
    );
    break;

  case "RECORD_UPDATED":
    handleRecordUpdated(
      cache,
      payload.data
    );
    break;

  default:
    console.log(
      "Unknown realtime event:",
      payload.type
    );
}
};

// =====================================================
// RECORD CREATED
// =====================================================

const handleRecordCreated = (
  cache,
  data
) => {
  const {
    record,
    patientCreated,
    dashboardStats,
  } = data;

  // -----------------------------------------------
  // Write Record into Apollo cache
  // -----------------------------------------------

  const recordRef =
    cache.writeFragment({
      data: {
        __typename: "Record",

        id: record.id,

        fee: record.fee,

        paidAmount:
          record.paidAmount,

        paymentNote:
          record.paymentNote,

        feeStatus:
          record.feeStatus,

        createdAt:
          String(record.createdAt),

        updatedAt:
          String(record.updatedAt),

        patient: {
          __typename: "Patient",

          id: record.patient.id,

          fname:
            record.patient.fname,

          lname:
            record.patient.lname,

          age:
            record.patient.age,

          sex:
            record.patient.sex,

          mobile:
            record.patient.mobile,

          village:
            record.patient.village,
        },
      },

      fragment:
        RECORD_FRAGMENT,
    });

  // -----------------------------------------------
  // Add record to records query
  // -----------------------------------------------

  cache.modify({
    id: "ROOT_QUERY",

    fields: {
      records(existingRecords = []) {
        const alreadyExists =
          existingRecords.some(
            (ref) =>
              ref.__ref ===
              recordRef.__ref
          );

        if (alreadyExists) {
          return existingRecords;
        }

        return [
          recordRef,
          ...existingRecords,
        ];
      },
    },
  });

  // -----------------------------------------------
  // If NEW patient, add to patients cache
  // -----------------------------------------------

  if (patientCreated) {
    const patientRef =
      cache.writeFragment({
        data: {
          __typename: "Patient",

          id: record.patient.id,

          fname:
            record.patient.fname,

          lname:
            record.patient.lname,

          age:
            record.patient.age,

          sex:
            record.patient.sex,

          mobile:
            record.patient.mobile,

          village:
            record.patient.village,
        },

        fragment:
          PATIENT_FRAGMENT,
      });

    cache.modify({
      id: "ROOT_QUERY",

      fields: {
        patients(existingPatients = []) {
          const alreadyExists =
            existingPatients.some(
              (ref) =>
                ref.__ref ===
                patientRef.__ref
            );

          if (alreadyExists) {
            return existingPatients;
          }

          return [
            patientRef,
            ...existingPatients,
          ];
        },
      },
    });
  }

  // -----------------------------------------------
  // Update dashboard
  // -----------------------------------------------

  if (dashboardStats) {
    updateDashboardStats(
      cache,
      dashboardStats
    );
  }
};

// =====================================================
// RECORD UPDATED
// =====================================================

const handleRecordUpdated = (
  cache,
  record
) => {
  /*
   * This is the important part for payments.
   *
   * Apollo already has Record:<id> in its cache.
   *
   * writeFragment() updates that exact record.
   */

  cache.writeFragment({
    data: {
      __typename: "Record",

      id: record.id,

      fee: record.fee,

      paidAmount:
        record.paidAmount,

      paymentNote:
        record.paymentNote,

      feeStatus:
        record.feeStatus,

      createdAt:
        String(record.createdAt),

      updatedAt:
        String(record.updatedAt),
    },

    fragment: gql`
      fragment UpdatedRecord on Record {
        id
        fee
        paidAmount
        paymentNote
        feeStatus
        createdAt
        updatedAt
      }
    `,
  });
};

// =====================================================
// PATIENT UPDATED
// =====================================================

const handlePatientUpdated = (
  cache,
  patient
) => {
  cache.writeFragment({
    data: {
      __typename: "Patient",

      id: patient.id,

      fname: patient.fname,

      lname: patient.lname,

      age: patient.age,

      sex: patient.sex,

      mobile: patient.mobile,

      village: patient.village,
    },

    fragment:
      PATIENT_FRAGMENT,
  });
};

// =====================================================
// DASHBOARD STATS
// =====================================================

const updateDashboardStats = (
  cache,
  stats
) => {
  cache.writeQuery({
    query: gql`
      query DashboardStats {
        dashboardStats {
          totalPatients
          totalRecords
          newPatientsThisMonth
          todayRecords
        }
      }
    `,

    data: {
      dashboardStats: {
        __typename:
          "DashboardStats",

        totalPatients:
          stats.totalPatients,

        totalRecords:
          stats.totalRecords,

        newPatientsThisMonth:
          stats.newPatientsThisMonth,

        todayRecords:
          stats.todayRecords,
      },
    },
  });
};

// =====================================================
// CONNECT SSE
// =====================================================

export const connectClinicEvents = (
  cache
) => {
  console.log(
    "🔌 Connecting to clinic SSE..."
  );

  const eventSource = new EventSource(
  import.meta.env.VITE_SSE_URL
);

  // -----------------------------------------------
  // Connected
  // -----------------------------------------------

  eventSource.addEventListener(
    "connected",
    (event) => {
      console.log(
        "✅ Clinic SSE connected",
        event.data
      );
    }
  );

  // -----------------------------------------------
  // Clinic updates
  // -----------------------------------------------

  eventSource.addEventListener(
    "clinic-update",
    (event) => {
      try {
        const payload =
          JSON.parse(event.data);

        handleClinicEvent(
          cache,
          payload
        );
      } catch (error) {
        console.error(
          "Invalid SSE payload:",
          error
        );
      }
    }
  );

  // -----------------------------------------------
  // Connection error
  // -----------------------------------------------

  eventSource.onerror = (error) => {
    console.error(
      "❌ Clinic SSE connection error",
      error
    );
  };

  return eventSource;
};
// import { gql } from "@apollo/client";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { useState } from "react";

// import RecordCard from "./components/RecordCard";
// import { FaRegUser } from "react-icons/fa";
// import { FiX, FiUserPlus } from "react-icons/fi";

// // =====================================================
// // GET ALL RECORDS
// // =====================================================

// export const GET_ALL_RECORDS = gql`
//   query GetAllRecords {
//     records {
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
// // ADD RECORD
// // =====================================================

// const ADD_RECORD = gql`
//   mutation AddRecord(
//     $fname: String!
//     $lname: String!
//     $age: Int!
//     $sex: String!
//     $mobile: String!
//     $village: String!
//   ) {
//     addRecord(
//       fname: $fname
//       lname: $lname
//       age: $age
//       sex: $sex
//       mobile: $mobile
//       village: $village
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

// const Records = () => {
//   const [selectRecord, setSelectRecord] = useState(false);

//   const [selectRecordData, setSelectRecordData] = useState(null);

//   const [showAddForm, setShowAddForm] = useState(false);

//   const [formData, setFormData] = useState({
//     fname: "",
//     lname: "",
//     age: "",
//     sex: "",
//     mobile: "",
//     village: "",
//   });

//   const [formError, setFormError] = useState("");

//   // ===================================================
//   // GET RECORDS
//   // ===================================================

//   const {
//     data,
//     loading,
//     error,
//   } = useQuery(GET_ALL_RECORDS);

//   // ===================================================
//   // ADD RECORD
//   // ===================================================

//   const [
//     addRecord,
//     { loading: addingRecord },
//   ] = useMutation(ADD_RECORD, {
//     update: (cache, { data }) => {
//       const newRecord = data?.addRecord;

//       if (!newRecord) {
//         console.warn(
//           "addRecord returned no record"
//         );

//         return;
//       }

//       console.log(
//         "✅ New record received:",
//         newRecord
//       );

//       // -------------------------------------------------
//       // Update GET_ALL_RECORDS cache
//       // -------------------------------------------------

//       cache.updateQuery(
//         {
//           query: GET_ALL_RECORDS,
//         },
//         (existingData) => {
//           if (!existingData?.records) {
//             return {
//               records: [newRecord],
//             };
//           }

//           // Prevent duplicate record
//           const alreadyExists =
//             existingData.records.some(
//               (record) =>
//                 record.id === newRecord.id
//             );

//           if (alreadyExists) {
//             return existingData;
//           }

//           return {
//             ...existingData,

//             records: [
//               newRecord,
//               ...existingData.records,
//             ],
//           };
//         }
//       );

//       console.log(
//         "📦 Apollo records cache updated"
//       );
//     },
//   });

//   // ===================================================
//   // LOADING
//   // ===================================================

//   if (loading) {
//     return (
//       <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
//         {[1, 2, 3, 4].map((item) => (
//           <div
//             key={item}
//             className="h-32 animate-pulse rounded-2xl bg-slate-100"
//           />
//         ))}
//       </div>
//     );
//   }

//   // ===================================================
//   // ERROR
//   // ===================================================

//   if (error) {
//     console.error(
//       "GET_ALL_RECORDS error:",
//       error
//     );

//     return (
//       <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
//         Failed to load records
//       </div>
//     );
//   }

//   const records = data?.records || [];

//   // ===================================================
//   // TIME FORMAT
//   // ===================================================

//   const formatTimeAgo = (timestamp) => {
//     const date = new Date(
//       Number(timestamp)
//     );

//     const now = new Date();

//     const diffMs = now - date;

//     const diffMinutes = Math.floor(
//       diffMs / (1000 * 60)
//     );

//     const diffHours = Math.floor(
//       diffMs / (1000 * 60 * 60)
//     );

//     const diffDays = Math.floor(
//       diffMs / (1000 * 60 * 60 * 24)
//     );

//     if (diffMinutes < 1) {
//       return "Just now";
//     }

//     if (diffMinutes < 60) {
//       return `${diffMinutes} min ago`;
//     }

//     if (diffHours < 24) {
//       return `${diffHours} hr${
//         diffHours > 1 ? "s" : ""
//       } ago`;
//     }

//     if (diffDays <= 2) {
//       return `${diffDays} day${
//         diffDays > 1 ? "s" : ""
//       } ago`;
//     }

//     return date.toLocaleDateString(
//       "en-GB",
//       {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // ===================================================
//   // FORM INPUT
//   // ===================================================

//   const handleInputChange = (e) => {
//     const {
//       name,
//       value,
//     } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setFormError("");
//   };

//   // ===================================================
//   // ADD RECORD
//   // ===================================================

//   const handleAddRecord = async (e) => {
//     e.preventDefault();

//     setFormError("");

//     const {
//       fname,
//       lname,
//       age,
//       sex,
//       mobile,
//       village,
//     } = formData;

//     // -------------------------------------------------
//     // Validation
//     // -------------------------------------------------

//     if (
//       !fname.trim() ||
//       !lname.trim() ||
//       !age ||
//       !sex ||
//       !mobile.trim() ||
//       !village.trim()
//     ) {
//       setFormError(
//         "Please fill in all the required fields."
//       );

//       return;
//     }

//     if (
//       !Number.isInteger(Number(age)) ||
//       Number(age) <= 0
//     ) {
//       setFormError(
//         "Please enter a valid age."
//       );

//       return;
//     }

//     if (
//       !/^[0-9]{10}$/.test(
//         mobile.trim()
//       )
//     ) {
//       setFormError(
//         "Please enter a valid 10-digit mobile number."
//       );

//       return;
//     }

//     // -------------------------------------------------
//     // Send to backend
//     // -------------------------------------------------

//     try {
//       const result = await addRecord({
//         variables: {
//           fname: fname.trim(),
//           lname: lname.trim(),
//           age: Number(age),
//           sex,
//           mobile: mobile.trim(),
//           village: village.trim(),
//         },
//       });

//       console.log(
//         "✅ Record created:",
//         result?.data?.addRecord
//       );

//       // -------------------------------------------------
//       // Reset form
//       // -------------------------------------------------

//       setFormData({
//         fname: "",
//         lname: "",
//         age: "",
//         sex: "",
//         mobile: "",
//         village: "",
//       });

//       setFormError("");

//       // -------------------------------------------------
//       // Close modal
//       // -------------------------------------------------

//       setShowAddForm(false);

//     } catch (error) {
//       console.error(
//         "❌ Failed to add record:",
//         error
//       );

//       setFormError(
//         error?.message ||
//           "Failed to add patient record."
//       );
//     }
//   };

//   // ===================================================
//   // CLOSE FORM
//   // ===================================================

//   const closeAddForm = () => {
//     if (addingRecord) {
//       return;
//     }

//     setShowAddForm(false);

//     setFormData({
//       fname: "",
//       lname: "",
//       age: "",
//       sex: "",
//       mobile: "",
//       village: "",
//     });

//     setFormError("");
//   };

//   // ===================================================
//   // OPEN RECORD
//   // ===================================================

//   const handleOpenRecord = (record) => {
//     setSelectRecord(true);
//     setSelectRecordData(record);
//   };

//   // ===================================================
//   // BACK
//   // ===================================================

//   const handleBack = () => {
//     setSelectRecord(false);
//     setSelectRecordData(null);
//   };

//   // ===================================================
//   // PAYMENT UPDATED
//   // ===================================================

//   const handlePaymentUpdated = (
//     updatedRecord
//   ) => {
//     setSelectRecordData(
//       (prev) => ({
//         ...prev,
//         ...updatedRecord,
//       })
//     );
//   };

//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <div className="relative min-h-full bg-content ">

//       {/* =================================================
//           RECORD LIST
//       ================================================= */}

//       {!selectRecord && (
//         <div>

//           {/* ADD RECORD BUTTON */}

//           <div className="flex justify-end px-4 pt-5">

//             <button
//               type="button"
//               onClick={() => {
//                 setShowAddForm(true);
//                 setFormError("");
//               }}
//               className="
//                 bg-theme
//                 text-content
//                 flex
//                 items-center
//                 gap-2
//                 rounded-xl
//                 px-4
//                 py-2.5
//                 text-sm
//                 font-semibold
//                 shadow-md
//                 transition
//                 duration-200
//                 hover:scale-[1.02]
//                 hover:opacity-95
//                 active:scale-[0.98]
//               "
//             >
//               <FiUserPlus className="text-base" />

//               Add Record
//             </button>

//           </div>


//           {/* RECORDS */}

//           <div className="mt-4 flex flex-col gap-[5px]">

//             {records.length === 0 ? (

//               <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

//                 <div className="bg-theme text-content flex h-16 w-16 items-center justify-center rounded-full text-2xl">
//                   <FaRegUser />
//                 </div>

//                 <h3 className="mt-4 text-lg font-semibold text-slate-700">
//                   No records yet
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-400">
//                   Add your first patient record to get started.
//                 </p>

//               </div>

//             ) : (

//               records.map(
//                 (record) => (

//                   <div
//                     key={record.id}
//                     className="
//                       flex
//                       cursor-pointer
//                       items-center
//                       justify-between
//                       bg-white
//                       p-[15px]
//                       transition
//                       duration-150
//                       hover:bg-slate-50
//                     "
//                     onClick={() =>
//                       handleOpenRecord(
//                         record
//                       )
//                     }
//                   >

//                     {/* PATIENT */}

//                     <div className="flex items-center gap-[10px]">

//                       <div className="
//                         bg-theme
//                         text-content
//                         flex
//                         h-10
//                         w-10
//                         items-center
//                         justify-center
//                         rounded-full
//                         text-xl
//                       ">
//                         <FaRegUser />
//                       </div>

//                       <div>

//                         <div className="text-lg font-semibold text-slate-800">

//                           {record.patient?.fname}{" "}

//                           {record.patient?.lname}

//                         </div>

//                         <div className="text-xs text-slate-400">

//                           {record.patient?.age} yrs
//                           {" "}•{" "}
//                           {record.patient?.sex}

//                         </div>

//                       </div>

//                     </div>


//                     {/* TIME */}

//                     <div className="text-sm text-slate-400">

//                       {formatTimeAgo(
//                         record.createdAt
//                       )}

//                     </div>

//                   </div>

//                 )
//               )

//             )}

//           </div>

//         </div>
//       )}


//       {/* =================================================
//           RECORD CARD
//       ================================================= */}

//       {selectRecord &&
//         selectRecordData && (

//           <RecordCard
//             record={
//               selectRecordData
//             }

//             setSelectRecord={
//               setSelectRecord
//             }

//             onBack={
//               handleBack
//             }

//             onPaymentUpdated={
//               handlePaymentUpdated
//             }
//           />

//         )}


//       {/* =================================================
//           ADD RECORD MODAL
//       ================================================= */}

//       {showAddForm &&
//         !selectRecord && (

//           <div className="
//             fixed
//             inset-0
//             z-[1000]
//             flex
//             items-center
//             justify-center
//             bg-slate-950/50
//             px-4
//             backdrop-blur-sm
//           ">

//             {/* MODAL */}

//             <div className="
//               w-full
//               max-w-lg
//               overflow-hidden
//               rounded-2xl
//               bg-white
//               shadow-2xl
//             ">

//               {/* HEADER */}

//               <div className="
//                 bg-theme
//                 text-content
//                 flex
//                 items-center
//                 justify-between
//                 px-6
//                 py-5
//               ">

//                 <div className="flex items-center gap-3">

//                   <div className="
//                     flex
//                     h-10
//                     w-10
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-white/10
//                     text-xl
//                   ">
//                     <FiUserPlus />
//                   </div>

//                   <div>

//                     <h2 className="text-lg font-bold">
//                       Add Patient Record
//                     </h2>

//                     <p className="mt-0.5 text-xs text-slate-300">
//                       Enter patient details
//                     </p>

//                   </div>

//                 </div>


//                 <button
//                   type="button"
//                   onClick={
//                     closeAddForm
//                   }
//                   disabled={
//                     addingRecord
//                   }
//                   className="
//                     rounded-lg
//                     p-2
//                     text-slate-300
//                     transition
//                     hover:bg-white/10
//                     hover:text-white
//                     disabled:opacity-50
//                   "
//                 >
//                   <FiX className="text-xl" />
//                 </button>

//               </div>


//               {/* FORM */}

//               <form
//                 onSubmit={
//                   handleAddRecord
//                 }
//                 className="
//                   max-h-[75vh]
//                   overflow-y-auto
//                   p-6
//                 "
//               >

//                 {/* NAME */}

//                 <div className="
//                   grid
//                   grid-cols-1
//                   gap-4
//                   sm:grid-cols-2
//                 ">

//                   {/* FIRST NAME */}

//                   <div>

//                     <label className="text-sm font-medium text-slate-600">
//                       First Name
//                     </label>

//                     <input
//                       type="text"
//                       name="fname"
//                       value={
//                         formData.fname
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       placeholder="Enter first name"
//                       autoComplete="off"
//                       className="
//                         mt-1.5
//                         w-full
//                         rounded-xl
//                         border
//                         border-slate-200
//                         bg-slate-50
//                         px-4
//                         py-3
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         transition
//                         placeholder:text-slate-400
//                         focus:border-slate-400
//                         focus:bg-white
//                       "
//                     />

//                   </div>


//                   {/* LAST NAME */}

//                   <div>

//                     <label className="text-sm font-medium text-slate-600">
//                       Last Name
//                     </label>

//                     <input
//                       type="text"
//                       name="lname"
//                       value={
//                         formData.lname
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       placeholder="Enter last name"
//                       autoComplete="off"
//                       className="
//                         mt-1.5
//                         w-full
//                         rounded-xl
//                         border
//                         border-slate-200
//                         bg-slate-50
//                         px-4
//                         py-3
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         transition
//                         placeholder:text-slate-400
//                         focus:border-slate-400
//                         focus:bg-white
//                       "
//                     />

//                   </div>

//                 </div>


//                 {/* AGE + GENDER */}

//                 <div className="
//                   mt-4
//                   grid
//                   grid-cols-1
//                   gap-4
//                   sm:grid-cols-2
//                 ">

//                   {/* AGE */}

//                   <div>

//                     <label className="text-sm font-medium text-slate-600">
//                       Age
//                     </label>

//                     <input
//                       type="number"
//                       name="age"
//                       min="1"
//                       max="150"
//                       value={
//                         formData.age
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       placeholder="Enter age"
//                       className="
//                         mt-1.5
//                         w-full
//                         rounded-xl
//                         border
//                         border-slate-200
//                         bg-slate-50
//                         px-4
//                         py-3
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         transition
//                         placeholder:text-slate-400
//                         focus:border-slate-400
//                         focus:bg-white
//                       "
//                     />

//                   </div>


//                   {/* GENDER */}

//                   <div>

//                     <label className="text-sm font-medium text-slate-600">
//                       Gender
//                     </label>

//                     <select
//                       name="sex"
//                       value={
//                         formData.sex
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       className="
//                         mt-1.5
//                         w-full
//                         rounded-xl
//                         border
//                         border-slate-200
//                         bg-slate-50
//                         px-4
//                         py-3
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         transition
//                         focus:border-slate-400
//                         focus:bg-white
//                       "
//                     >

//                       <option value="">
//                         Select gender
//                       </option>

//                       <option value="male">
//                         Male
//                       </option>

//                       <option value="female">
//                         Female
//                       </option>

//                     </select>

//                   </div>

//                 </div>


//                 {/* MOBILE */}

//                 <div className="mt-4">

//                   <label className="text-sm font-medium text-slate-600">
//                     Mobile Number
//                   </label>

//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={
//                       formData.mobile
//                     }
//                     onChange={
//                       handleInputChange
//                     }
//                     placeholder="10-digit mobile number"
//                     maxLength={10}
//                     inputMode="numeric"
//                     autoComplete="off"
//                     className="
//                       mt-1.5
//                       w-full
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       px-4
//                       py-3
//                       text-sm
//                       text-slate-800
//                       outline-none
//                       transition
//                       placeholder:text-slate-400
//                       focus:border-slate-400
//                       focus:bg-white
//                     "
//                   />

//                 </div>


//                 {/* VILLAGE */}

//                 <div className="mt-4">

//                   <label className="text-sm font-medium text-slate-600">
//                     Village
//                   </label>

//                   <input
//                     type="text"
//                     name="village"
//                     value={
//                       formData.village
//                     }
//                     onChange={
//                       handleInputChange
//                     }
//                     placeholder="Enter village"
//                     autoComplete="off"
//                     className="
//                       mt-1.5
//                       w-full
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       px-4
//                       py-3
//                       text-sm
//                       text-slate-800
//                       outline-none
//                       transition
//                       placeholder:text-slate-400
//                       focus:border-slate-400
//                       focus:bg-white
//                     "
//                   />

//                 </div>


//                 {/* ERROR */}

//                 {formError && (

//                   <div className="
//                     mt-4
//                     rounded-xl
//                     border
//                     border-red-100
//                     bg-red-50
//                     px-4
//                     py-3
//                     text-sm
//                     text-red-600
//                   ">
//                     {formError}
//                   </div>

//                 )}


//                 {/* BUTTONS */}

//                 <div className="
//                   mt-6
//                   flex
//                   justify-end
//                   gap-3
//                 ">

//                   <button
//                     type="button"
//                     onClick={
//                       closeAddForm
//                     }
//                     disabled={
//                       addingRecord
//                     }
//                     className="
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-white
//                       px-5
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-slate-600
//                       transition
//                       hover:bg-slate-50
//                       disabled:opacity-50
//                     "
//                   >
//                     Cancel
//                   </button>


//                   <button
//                     type="submit"
//                     disabled={
//                       addingRecord
//                     }
//                     className="
//                       bg-theme
//                       text-content
//                       rounded-xl
//                       px-6
//                       py-3
//                       text-sm
//                       font-semibold
//                       shadow-md
//                       transition
//                       hover:opacity-90
//                       disabled:cursor-not-allowed
//                       disabled:opacity-50
//                     "
//                   >

//                     {addingRecord
//                       ? "Adding..."
//                       : "Add Patient"}

//                   </button>

//                 </div>

//               </form>

//             </div>

//           </div>

//         )}

//     </div>
//   );
// };

// export default Records;




import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import RecordCard from "./components/RecordCard";
import { FaRegUser } from "react-icons/fa";
import { FiX, FiUserPlus } from "react-icons/fi";

// =====================================================
// GET ALL RECORDS
// =====================================================

export const GET_ALL_RECORDS = gql`
  query GetAllRecords {
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
`;

// =====================================================
// ADD RECORD
// =====================================================

const ADD_RECORD = gql`
  mutation AddRecord(
    $fname: String!
    $lname: String!
    $age: Int!
    $sex: String!
    $mobile: String!
    $village: String!
  ) {
    addRecord(
      fname: $fname
      lname: $lname
      age: $age
      sex: $sex
      mobile: $mobile
      village: $village
    ) {
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
`;

// =====================================================
// COMPONENT
// =====================================================

const Records = () => {
  const [selectRecord, setSelectRecord] = useState(false);

  const [selectRecordData, setSelectRecordData] =
    useState(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    age: "",
    sex: "",
    mobile: "",
    village: "",
  });

  const [formError, setFormError] = useState("");

  // ===================================================
  // GET RECORDS
  // ===================================================

  const {
    data,
    loading,
    error,
  } = useQuery(GET_ALL_RECORDS);

  // ===================================================
  // ADD RECORD
  // ===================================================

  const [
    addRecord,
    { loading: addingRecord },
  ] = useMutation(ADD_RECORD, {
    update: (cache, { data }) => {
      const newRecord = data?.addRecord;

      if (!newRecord) {
        console.warn(
          "addRecord returned no record"
        );

        return;
      }

      console.log(
        "✅ New record received:",
        newRecord
      );

      // -------------------------------------------------
      // Update GET_ALL_RECORDS Apollo cache
      // -------------------------------------------------

      cache.updateQuery(
        {
          query: GET_ALL_RECORDS,
        },
        (existingData) => {
          if (!existingData?.records) {
            return {
              records: [newRecord],
            };
          }

          // Prevent duplicate record
          const alreadyExists =
            existingData.records.some(
              (record) =>
                record.id === newRecord.id
            );

          if (alreadyExists) {
            return existingData;
          }

          return {
            ...existingData,

            records: [
              newRecord,
              ...existingData.records,
            ],
          };
        }
      );

      console.log(
        "📦 Apollo records cache updated"
      );
    },
  });

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    console.error(
      "GET_ALL_RECORDS error:",
      error
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load records
      </div>
    );
  }

  const records = data?.records || [];

  // ===================================================
  // TIME FORMAT
  // ===================================================

  const formatTimeAgo = (timestamp) => {
    const date = new Date(
      Number(timestamp)
    );

    const now = new Date();

    const diffMs = now - date;

    const diffMinutes = Math.floor(
      diffMs / (1000 * 60)
    );

    const diffHours = Math.floor(
      diffMs / (1000 * 60 * 60)
    );

    const diffDays = Math.floor(
      diffMs / (1000 * 60 * 60 * 24)
    );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    }

    if (diffHours < 24) {
      return `${diffHours} hr${
        diffHours > 1 ? "s" : ""
      } ago`;
    }

    if (diffDays <= 2) {
      return `${diffDays} day${
        diffDays > 1 ? "s" : ""
      } ago`;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ===================================================
  // FORM INPUT
  // ===================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  // ===================================================
  // ADD RECORD
  // ===================================================

  const handleAddRecord = async (e) => {
    e.preventDefault();

    setFormError("");

    const {
      fname,
      lname,
      age,
      sex,
      mobile,
      village,
    } = formData;

    // -------------------------------------------------
    // Validation
    // -------------------------------------------------

    if (
      !fname.trim() ||
      !lname.trim() ||
      !age ||
      !sex ||
      !mobile.trim() ||
      !village.trim()
    ) {
      setFormError(
        "Please fill in all the required fields."
      );

      return;
    }

    if (
      !Number.isInteger(Number(age)) ||
      Number(age) <= 0
    ) {
      setFormError(
        "Please enter a valid age."
      );

      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        mobile.trim()
      )
    ) {
      setFormError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    // -------------------------------------------------
    // Send to backend
    // -------------------------------------------------

    try {
      const result = await addRecord({
        variables: {
          fname: fname.trim(),
          lname: lname.trim(),
          age: Number(age),
          sex,
          mobile: mobile.trim(),
          village: village.trim(),
        },
      });

      console.log(
        "✅ Record created:",
        result?.data?.addRecord
      );

      // -------------------------------------------------
      // Reset form
      // -------------------------------------------------

      setFormData({
        fname: "",
        lname: "",
        age: "",
        sex: "",
        mobile: "",
        village: "",
      });

      setFormError("");

      // -------------------------------------------------
      // Close modal
      // -------------------------------------------------

      setShowAddForm(false);

    } catch (error) {
      console.error(
        "❌ Failed to add record:",
        error
      );

      setFormError(
        error?.message ||
          "Failed to add patient record."
      );
    }
  };

  // ===================================================
  // CLOSE FORM
  // ===================================================

  const closeAddForm = () => {
    if (addingRecord) {
      return;
    }

    setShowAddForm(false);

    setFormData({
      fname: "",
      lname: "",
      age: "",
      sex: "",
      mobile: "",
      village: "",
    });

    setFormError("");
  };

  // ===================================================
  // OPEN RECORD
  // ===================================================

  const handleOpenRecord = (record) => {
    setSelectRecord(true);
    setSelectRecordData(record);
  };

  // ===================================================
  // BACK
  // ===================================================

  const handleBack = () => {
    setSelectRecord(false);
    setSelectRecordData(null);
  };

  // ===================================================
  // PAYMENT UPDATED
  // ===================================================

  const handlePaymentUpdated = (
    updatedRecord
  ) => {
    setSelectRecordData(
      (prev) => ({
        ...prev,
        ...updatedRecord,
      })
    );
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="relative min-h-full bg-content">

      {/* =================================================
          RECORD LIST
      ================================================= */}

      {!selectRecord && (
        <div>

          {/* =================================================
              ADD RECORD BUTTON
          ================================================= */}

          <div className="flex justify-end px-4 pt-5">

            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setFormError("");
              }}
              className="
                bg-theme
                text-content
                flex
                items-center
                gap-2
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                shadow-md
                transition
                duration-200
                hover:scale-[1.02]
                hover:opacity-95
                active:scale-[0.98]
              "
            >
              <FiUserPlus className="text-base" />

              Add Record
            </button>

          </div>


          {/* =================================================
              RECORDS
          ================================================= */}

          <div className="mt-4 flex flex-col gap-[5px]">

            {records.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                <div className="
                  bg-theme
                  text-content
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  text-2xl
                ">
                  <FaRegUser />
                </div>

                <h3 className="
                  mt-4
                  text-lg
                  font-semibold
                  text-slate-700
                ">
                  No records yet
                </h3>

                <p className="
                  mt-1
                  text-sm
                  text-slate-400
                ">
                  Add your first patient record to get started.
                </p>

              </div>

            ) : (

              records.map(
                (record) => {

                  // -----------------------------------------
                  // RECORD NEEDS CHARGE
                  // -----------------------------------------

                  const needsCharge =
                    Number(record.fee || 0) === 0;

                  return (
                    <div
                      key={record.id}
                      className="
                        relative
                        flex
                        cursor-pointer
                        items-center
                        justify-between
                        bg-white
                        p-[15px]
                        transition
                        duration-150
                        hover:bg-slate-50
                      "
                      onClick={() =>
                        handleOpenRecord(
                          record
                        )
                      }
                    >

                      {/* =====================================
                          PATIENT
                      ===================================== */}

                      <div className="flex items-center gap-[10px]">

                        <div className="
                          bg-theme
                          text-content
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          text-xl
                        ">
                          <FaRegUser />
                        </div>

                        <div>

                          <div className="
                            text-lg
                            font-semibold
                            text-slate-800
                          ">
                            {record.patient?.fname}{" "}
                            {record.patient?.lname}
                          </div>

                          <div className="
                            text-xs
                            text-slate-400
                          ">
                            {record.patient?.age} yrs
                            {" "}•{" "}
                            {record.patient?.sex}
                          </div>

                        </div>

                      </div>


                      {/* =====================================
                          TIME
                      ===================================== */}

                      <div className="
                        text-sm
                        text-slate-400
                      ">
                        {formatTimeAgo(
                          record.createdAt
                        )}
                      </div>


                      {/* =====================================
                          CHARGE REQUIRED DOT
                      ===================================== */}

                      {needsCharge && (
                        <span
                          className="
                            absolute
                            bottom-2
                            right-2
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-red-500
                            shadow-sm
                          "
                          title="Charge amount not entered"
                        />
                      )}

                    </div>
                  );
                }
              )

            )}

          </div>

        </div>
      )}


      {/* =================================================
          RECORD CARD
      ================================================= */}

      {selectRecord &&
        selectRecordData && (

          <RecordCard
            record={
              selectRecordData
            }

            setSelectRecord={
              setSelectRecord
            }

            onBack={
              handleBack
            }

            onPaymentUpdated={
              handlePaymentUpdated
            }
          />

        )}


      {/* =================================================
          ADD RECORD MODAL
      ================================================= */}

      {showAddForm &&
        !selectRecord && (

          <div className="
            fixed
            inset-0
            z-[1000]
            flex
            items-center
            justify-center
            bg-slate-950/50
            px-4
            backdrop-blur-sm
          ">

            {/* =================================================
                MODAL
            ================================================= */}

            <div className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            ">


              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="
                bg-theme
                text-content
                flex
                items-center
                justify-between
                px-6
                py-5
              ">

                <div className="flex items-center gap-3">

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-xl
                  ">
                    <FiUserPlus />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold">
                      Add Patient Record
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-300">
                      Enter patient details
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closeAddForm
                  }
                  disabled={
                    addingRecord
                  }
                  className="
                    rounded-lg
                    p-2
                    text-slate-300
                    transition
                    hover:bg-white/10
                    hover:text-white
                    disabled:opacity-50
                  "
                >
                  <FiX className="text-xl" />
                </button>

              </div>


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={
                  handleAddRecord
                }
                className="
                  max-h-[75vh]
                  overflow-y-auto
                  p-6
                "
              >

                {/* =================================================
                    NAME
                ================================================= */}

                <div className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                ">

                  {/* FIRST NAME */}

                  <div>

                    <label className="
                      text-sm
                      font-medium
                      text-slate-600
                    ">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="fname"
                      value={
                        formData.fname
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter first name"
                      autoComplete="off"
                      className="
                        mt-1.5
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-slate-400
                        focus:bg-white
                      "
                    />

                  </div>


                  {/* LAST NAME */}

                  <div>

                    <label className="
                      text-sm
                      font-medium
                      text-slate-600
                    ">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lname"
                      value={
                        formData.lname
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter last name"
                      autoComplete="off"
                      className="
                        mt-1.5
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-slate-400
                        focus:bg-white
                      "
                    />

                  </div>

                </div>


                {/* =================================================
                    AGE + GENDER
                ================================================= */}

                <div className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                ">

                  {/* AGE */}

                  <div>

                    <label className="
                      text-sm
                      font-medium
                      text-slate-600
                    ">
                      Age
                    </label>

                    <input
                      type="number"
                      name="age"
                      min="1"
                      max="150"
                      value={
                        formData.age
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Enter age"
                      className="
                        mt-1.5
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-slate-400
                        focus:bg-white
                      "
                    />

                  </div>


                  {/* GENDER */}

                  <div>

                    <label className="
                      text-sm
                      font-medium
                      text-slate-600
                    ">
                      Gender
                    </label>

                    <select
                      name="sex"
                      value={
                        formData.sex
                      }
                      onChange={
                        handleInputChange
                      }
                      className="
                        mt-1.5
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                        text-sm
                        text-slate-800
                        outline-none
                        transition
                        focus:border-slate-400
                        focus:bg-white
                      "
                    >

                      <option value="">
                        Select gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                    </select>

                  </div>

                </div>


                {/* =================================================
                    MOBILE
                ================================================= */}

                <div className="mt-4">

                  <label className="
                    text-sm
                    font-medium
                    text-slate-600
                  ">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="off"
                    className="
                      mt-1.5
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-slate-400
                      focus:bg-white
                    "
                  />

                </div>


                {/* =================================================
                    VILLAGE
                ================================================= */}

                <div className="mt-4">

                  <label className="
                    text-sm
                    font-medium
                    text-slate-600
                  ">
                    Village
                  </label>

                  <input
                    type="text"
                    name="village"
                    value={
                      formData.village
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter village"
                    autoComplete="off"
                    className="
                      mt-1.5
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-slate-400
                      focus:bg-white
                    "
                  />

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {formError && (

                  <div className="
                    mt-4
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  ">
                    {formError}
                  </div>

                )}


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="
                  mt-6
                  flex
                  justify-end
                  gap-3
                ">

                  <button
                    type="button"
                    onClick={
                      closeAddForm
                    }
                    disabled={
                      addingRecord
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-slate-600
                      transition
                      hover:bg-slate-50
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={
                      addingRecord
                    }
                    className="
                      bg-theme
                      text-content
                      rounded-xl
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      shadow-md
                      transition
                      hover:opacity-90
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {addingRecord
                      ? "Adding..."
                      : "Add Patient"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

    </div>
  );
};

export default Records;
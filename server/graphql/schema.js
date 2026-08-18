const typeDefs = `#graphql

  type Patient {
    id: ID!
    fname: String!
    lname: String!
    age: Int!
    sex: String!
    mobile: String!
    village: String!

    records: [Record!]!
    pendingAmount: Float!
  }

  type Record {
    id: ID!
    patient: Patient!
    fee: Float
    paidAmount: Float
    paymentNote: String
    feeStatus: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type DashboardStats {
    totalPatients: Int!
    totalRecords: Int!
    newPatientsThisMonth: Int!
    todayRecords: Int!
  }

  type User{
    id: ID!
    fname: String!
    lname: String!
    role: String!
    password: String!
    mobile: String!
    email: String!
  }

  type signupResponse{
    message: String!
    data: User!
  }

  type loginResponse{
    message: String!
    token: String!
    user: User!
  }

  type Query {
    patients(search: String): [Patient!]!
    patient(id: ID!): Patient
    records: [Record!]!
    dashboardStats: DashboardStats!
  }

  type Mutation {
    addRecord(
      fname: String!
      lname: String!
      age: Int!
      sex: String!
      mobile: String!
      village: String!
      fee: Float
      paidAmount: Float
      paymentNote: String
    ): Record!

    setChargedAmountFunc(
      id: ID!
      fee: Float!
    ): Record!

    setPaidAmountFunc(
      id: ID!
      paidAmount: Float!
    ): Record!


    signup(
        fname: String!
        lname: String!
        role: String!
        password: String!
        confirmPassword: String!
        mobile: String!
        email: String!
    ): signupResponse!

    login(
        email: String!
        password: String!
    ): loginResponse!
  }

`;

module.exports = typeDefs;
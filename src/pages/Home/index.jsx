import DashboardStats from "./components/DashboardStats";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-slate-800">
        Dashboard
      </h1>

      <p className="mt-1 text-slate-500">
        Here's what's happening at Sarag Clinic.
      </p>

      <div className="mt-6">
        <DashboardStats />
      </div>
    </div>
  );
};

export default Home;
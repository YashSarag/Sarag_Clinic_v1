import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import {
  UsersRound,
  ClipboardList,
  UserPlus,
  CalendarDays,
} from "lucide-react";

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalPatients
      totalRecords
      newPatientsThisMonth
      todayRecords
    }
  }
`;

const DashboardStats = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const stats = data?.dashboardStats;

  const cards = [
    {
      title: "Total Patients",
      value: stats?.totalPatients ?? 0,
      icon: UsersRound,
    },
    {
      title: "Total Records",
      value: stats?.totalRecords ?? 0,
      icon: ClipboardList,
    },
    {
      title: "New Patients",
      value: stats?.newPatientsThisMonth ?? 0,
      subtitle: "This month",
      icon: UserPlus,
    },
    {
      title: "Today's Entries",
      value: stats?.todayRecords ?? 0,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>

                {card.subtitle && (
                  <p className="mt-1 text-xs text-slate-400">
                    {card.subtitle}
                  </p>
                )}
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100">
                <Icon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
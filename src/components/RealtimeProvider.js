import { useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";

import {
  connectClinicEvents,
} from "../realtime/clinicEvents";

const RealtimeProvider = ({
  children,
}) => {
  const client = useApolloClient();

  useEffect(() => {
    const eventSource =
      connectClinicEvents(
        client.cache
      );

    return () => {
      console.log(
        "🔌 Closing clinic SSE"
      );

      eventSource.close();
    };
  }, [client]);

  return children;
};

export default RealtimeProvider;
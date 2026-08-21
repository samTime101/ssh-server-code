import { Outlet } from "react-router-dom";
import SubscriptionGate from "@/components/user/SubscriptionGate";

const SubscriptionRoute = () => (
  <SubscriptionGate>
    <Outlet />
  </SubscriptionGate>
);

export default SubscriptionRoute;

import { Badge } from "@/components/ui/badge";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusUtils";

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return <Badge className={getStatusBadgeClass(status)}>{getStatusLabel(status)}</Badge>;
};

export default StatusBadge;

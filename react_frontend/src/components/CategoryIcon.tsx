import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCategoryIcon } from "@/constants/categoryIcons";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

interface CategoryIconProps {
  icon?: string | null;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

const CategoryIcon = ({ icon, size = "md", className }: CategoryIconProps) => {
  return (
    <FontAwesomeIcon
      icon={getCategoryIcon(icon)}
      className={cn("text-primary shrink-0", SIZE_CLASSES[size], className)}
      aria-hidden
    />
  );
};

export default CategoryIcon;

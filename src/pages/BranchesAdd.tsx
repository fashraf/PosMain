import { useLanguage } from "@/hooks/useLanguage";
import BranchFormPage from "@/components/branches/BranchFormPage";

export default function BranchesAdd() {
  const { t } = useLanguage();
  return <BranchFormPage title={t("branches.addBranch")} />;
}

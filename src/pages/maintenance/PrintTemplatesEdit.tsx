import { useParams } from "react-router-dom";
import { PrintTemplateFormPage } from "@/components/print-templates/PrintTemplateFormPage";

export default function PrintTemplatesEdit() {
  const { id } = useParams<{ id: string }>();
  return <PrintTemplateFormPage mode="edit" templateId={id} />;
}

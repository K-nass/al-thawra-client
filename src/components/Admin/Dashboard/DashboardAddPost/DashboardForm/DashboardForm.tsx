import { useLocation, useNavigate } from "react-router-dom";
import FormHeader from "./FormHeader";
import PostDetailsForm from "./PostDetailsForm";
import ContentEditor from "./ContentEditor";

import AdditionalImages from "./AdditionalImages";
import FileUpload from "./FileUpload";
import CategorySelect from "./CategorySelect";
import PublishSection from "./PublishSection";
import ImageUpload from "./ImageUpload";
import { useEffect } from "react";

export default function DashboardForm() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (!type) {
      navigate("/admin/post-format");
    }
  }, [type, navigate]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <FormHeader type={type} />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grow space-y-6">
          {/* left column */}
          <PostDetailsForm />
          <ContentEditor />
        </div>
        <div className="w-full lg:w-80 shrink space-y-6">
          {/* right column */}
          <ImageUpload />
          <AdditionalImages />
          <FileUpload />
          <CategorySelect />
          <PublishSection />
        </div>
      </div>
    </div>
  );
}

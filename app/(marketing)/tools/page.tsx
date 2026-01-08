// app/(marketing)/tools/page.tsx
import ToolsDirectory from "@/app/components/Tools/ToolsDirectory";

export const metadata = {
  title: "All Online Tools - Wrklyst",
  description: "Browse our collection of PDF, Image, and Text tools."
};

export default function AllToolsPage() {
  return (
    <div className="pt-20">
       <ToolsDirectory />
    </div>
  );
}
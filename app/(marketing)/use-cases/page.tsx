import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/Home/Footer";
import UseCaseGrid from "@/app/components/UseCases/UseCaseGrid";


export default function UseCasesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-[#1A1A1A] tracking-tighter mb-6">
          Tailored for your <span className="text-[#5D5FEF]">Workflow.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Discover how thousands of professionals use Wrklyst to simplify their digital file management.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-10 pb-32">
        <UseCaseGrid />
      </section>

 
    </main>
  );
}
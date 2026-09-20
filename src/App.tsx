import Header from "./components/Header";
import StudyForm from "./components/StudyForm";

function App() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#343044]">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <section className="mb-10">
          <p className="mb-2 text-sm font-medium">STUDYFLOW</p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Plan your study.
            <br />
            Make it realistic.
          </h1>

          <p className="mt-4 max-w-xl text-gray-600">
            Tell us what you're studying, how much time you have, and where you
            are right now.
          </p>
        </section>

        <StudyForm />
      </main>
    </div>
  );
}

export default App;

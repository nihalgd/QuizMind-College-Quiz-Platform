import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import { DUMMY_SUBJECTS, DUMMY_UNITS } from "../data/dummyData";

const AddQuizPage = () => {
  const { navigate, selectedSubject, showToast, currentUser } = useApp();
  const [subjectId, setSubjectId] = useState(selectedSubject?.id || "");
  const [unitId, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState("10");
  const [noteContent, setNoteContent] = useState("");
  const [generating, setGenerating] = useState(false);

  const assignedSubjects = DUMMY_SUBJECTS.filter(s => s.teacherId === currentUser?.id);
  const units = DUMMY_UNITS[parseInt(subjectId)] || [];

  const handleGenerate = () => {
    if (!subjectId || !unitId || !title) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showToast("Quiz generated successfully!", "success");
      navigate("teacher-quiz-editor", { quiz: { id: 7, title, subjectId: parseInt(subjectId), unitId: parseInt(unitId), subjectName: assignedSubjects.find(s => s.id === parseInt(subjectId))?.name, unitName: units.find(u => u.id === parseInt(unitId))?.name, difficulty, questionCount: parseInt(numQuestions), status: "draft" } });
    }, 2500);
  };

  return (
    <div className="fade-in max-w-3xl">
      <button onClick={() => navigate("teacher-dashboard")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <Icon name="arrow-left" className="w-4 h-4" /> Back to Dashboard
      </button>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Quiz</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
            <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setUnitId(""); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors">
              <option value="">Select Subject</option>
              {assignedSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit *</label>
            <select value={unitId} onChange={(e) => setUnitId(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors" disabled={!subjectId}>
              <option value="">Select Unit</option>
              {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quiz Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 1 Review Quiz" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
            <div className="flex gap-2">
              {["Easy", "Medium", "Hard"].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  difficulty === d
                    ? d === "Easy" ? "border-green-500 bg-green-50 text-green-700" : d === "Medium" ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Questions</label>
            <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} min="1" max="50" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="sparkles" className="w-5 h-5 text-purple-500" />
          AI Quiz Generation
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Notes</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-400 transition-colors cursor-pointer">
              <Icon name="upload-cloud" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag & drop or <span className="text-brand-600 font-medium">browse files</span></p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT (max 10MB)</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 border-t border-gray-200"></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">OR</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Paste Content</label>
            <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} rows="4" placeholder="Paste your notes or study material here..." className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors resize-none"></textarea>
          </div>
          <button onClick={handleGenerate} disabled={generating} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            {generating ? (
              <><Icon name="loader-2" className="w-4 h-4 animate-spin" /> Generating with AI...</>
            ) : (
              <><Icon name="sparkles" className="w-4 h-4" /> Generate Quiz with AI</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Icon name="pen-tool" className="w-5 h-5 text-gray-500" />
          Create Manually
        </h4>
        <p className="text-sm text-gray-500 mb-4">Build your quiz question by question from scratch.</p>
        <button onClick={() => showToast("Manual quiz editor opened", "info")} className="w-full border-2 border-gray-300 hover:border-brand-400 text-gray-700 hover:text-brand-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Icon name="plus" className="w-4 h-4" /> Create Manually
        </button>
      </div>
    </div>
  );
};

export default AddQuizPage;

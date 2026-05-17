import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { createId } from "../utils/id";

const blankQuestion = () => ({
  id: createId(),
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

const QuizEditor = () => {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const { currentUser, navigate, showToast } = useApp();
  const { subjects, quizzes, addQuiz, updateQuiz } = useQuiz();
  const assignedSubjects = useMemo(
    () => subjects.filter((subject) => Number(subject.assignedTeacherId) === Number(currentUser?.id)),
    [currentUser?.id, subjects],
  );
  const existingQuiz = quizzes.find((quiz) => Number(quiz.id) === Number(quizId));
  const defaultSubjectId = searchParams.get("subjectId") || assignedSubjects[0]?.id || "";

  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(defaultSubjectId);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState([]);
  const [questionDraft, setQuestionDraft] = useState(blankQuestion());
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (quizId && !existingQuiz) {
      navigate("teacher-my-quizzes");
      return;
    }

    if (existingQuiz && Number(existingQuiz.teacherId) !== Number(currentUser?.id)) {
      showToast("You can only edit your own quizzes", "error");
      navigate("teacher-my-quizzes");
      return;
    }

    if (existingQuiz) {
      setTitle(existingQuiz.title);
      setSubjectId(String(existingQuiz.subjectId));
      setDifficulty(existingQuiz.difficulty);
      setQuestions(existingQuiz.questions || []);
    } else {
      setTitle("");
      setSubjectId(String(defaultSubjectId));
      setDifficulty("Medium");
      setQuestions([]);
    }
  }, [currentUser?.id, defaultSubjectId, existingQuiz, navigate, quizId, showToast]);

  const updateDraftOption = (index, value) => {
    setQuestionDraft((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => (optionIndex === index ? value : option)),
    }));
  };

  const resetQuestionDraft = () => {
    setQuestionDraft(blankQuestion());
    setEditingQuestionId(null);
  };

  const validateQuestionDraft = () => {
    if (!questionDraft.question.trim()) return "Question text is required";
    if (questionDraft.options.some((option) => !option.trim())) return "All four options are required";
    return "";
  };

  const handleAddOrUpdateQuestion = () => {
    const error = validateQuestionDraft();
    if (error) {
      showToast(error, "error");
      return;
    }

    const cleanQuestion = {
      ...questionDraft,
      question: questionDraft.question.trim(),
      options: questionDraft.options.map((option) => option.trim()),
      correctAnswer: Number(questionDraft.correctAnswer),
    };

    setQuestions((current) =>
      editingQuestionId
        ? current.map((question) => (Number(question.id) === Number(editingQuestionId) ? cleanQuestion : question))
        : [...current, cleanQuestion],
    );
    resetQuestionDraft();
  };

  const editQuestion = (question) => {
    setQuestionDraft({
      ...question,
      options: [...question.options],
      correctAnswer: Number(question.correctAnswer),
    });
    setEditingQuestionId(question.id);
  };

  const deleteQuestion = (questionId) => {
    setQuestions((current) => current.filter((question) => Number(question.id) !== Number(questionId)));
    if (Number(editingQuestionId) === Number(questionId)) resetQuestionDraft();
  };

  const validateQuiz = (publish) => {
    if (!title.trim()) return "Quiz title is required";
    if (!subjectId) return "Select an assigned subject";
    if (!assignedSubjects.some((subject) => Number(subject.id) === Number(subjectId))) return "You can only create quizzes for assigned subjects";
    if ((publish || questions.length > 0) && questions.length === 0) return "Add at least one question";
    if (questions.length === 0) return "Add at least one question before saving";
    return "";
  };

  const handleSave = (publish) => {
    const error = validateQuiz(publish);
    setFormError(error);
    if (error) return;

    const payload = {
      title,
      subjectId,
      teacherId: currentUser.id,
      difficulty,
      questions,
      published: publish,
    };

    if (existingQuiz) {
      updateQuiz(existingQuiz.id, payload);
      showToast(publish ? "Quiz published" : "Quiz saved as draft", "success");
    } else {
      addQuiz(payload);
      showToast(publish ? "Quiz created and published" : "Quiz draft created", "success");
    }
    navigate("teacher-my-quizzes");
  };

  if (assignedSubjects.length === 0) {
    return (
      <div className="fade-in">
        <EmptyState
          icon="book-marked"
          title="No assigned subjects"
          description="An admin must assign subjects to your profile before you can create quizzes."
        />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader
        title={existingQuiz ? "Edit Quiz" : "Create Quiz"}
        description="Build quiz metadata, add questions, save drafts, and publish when ready."
      />

      {formError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <Icon name="alert-circle" className="h-4 w-4 flex-shrink-0" />
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Quiz Title">
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
                  placeholder="Unit 1 Review Quiz"
                />
              </FormField>

              <FormField label="Subject">
                <select
                  value={subjectId}
                  onChange={(event) => setSubjectId(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
                >
                  {assignedSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.subjectName} ({subject.subjectCode})</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="mt-4">
              <span className="mb-2 block text-sm font-medium text-gray-700">Difficulty</span>
              <div className="grid grid-cols-3 gap-2">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`rounded-lg border-2 py-2 text-sm font-medium transition-colors ${
                      difficulty === level
                        ? level === "Easy"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : level === "Medium"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-semibold text-gray-900">Questions</h4>
              <span className="text-xs font-medium text-gray-400">{questions.length} added</span>
            </div>

            {questions.length === 0 ? (
              <EmptyState icon="file-question" title="No questions yet" description="Use the question builder to add the first question." />
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-400">Q{index + 1}</span>
                        <p className="mt-1 text-sm font-semibold text-gray-900">{question.question}</p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => editQuestion(question)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                          title="Edit question"
                        >
                          <Icon name="pencil" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(question.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete question"
                        >
                          <Icon name="trash-2" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={`${question.id}-${optionIndex}`}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            Number(question.correctAnswer) === optionIndex
                              ? "border border-green-200 bg-green-50 font-medium text-green-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 xl:sticky xl:top-24">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-semibold text-gray-900">{editingQuestionId ? "Edit Question" : "Add Question"}</h4>
              {editingQuestionId && <StatusBadge status="draft" />}
            </div>

            <div className="space-y-4">
              <FormField label="Question">
                <textarea
                  value={questionDraft.question}
                  onChange={(event) => setQuestionDraft((current) => ({ ...current, question: event.target.value }))}
                  rows="3"
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
                  placeholder="Write the question here..."
                />
              </FormField>

              <div className="space-y-3">
                {questionDraft.options.map((option, index) => (
                  <FormField key={index} label={`Option ${String.fromCharCode(65 + index)}`}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(event) => updateDraftOption(index, event.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                      <button
                        type="button"
                        onClick={() => setQuestionDraft((current) => ({ ...current, correctAnswer: index }))}
                        className={`h-10 w-10 flex-shrink-0 rounded-lg border text-xs font-bold transition-colors ${
                          Number(questionDraft.correctAnswer) === index
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-300 text-gray-400 hover:bg-gray-50"
                        }`}
                        title="Mark correct answer"
                      >
                        <Icon name={Number(questionDraft.correctAnswer) === index ? "check" : "circle-dot"} className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  </FormField>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {editingQuestionId && (
                  <button
                    type="button"
                    onClick={resetQuestionDraft}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddOrUpdateQuestion}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  <Icon name={editingQuestionId ? "save" : "plus"} className="h-4 w-4" />
                  {editingQuestionId ? "Update Question" : "Add Question"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-gray-900">Publish State</span>
              {existingQuiz && <StatusBadge status={existingQuiz.published ? "published" : "draft"} />}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Icon name="save" className="h-4 w-4" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Icon name="send" className="h-4 w-4" />
                Publish Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;

"use client";

import React, { useState, useEffect } from "react";
import TeacherSidebarDemo from "../components/TeacherSidebar";
import NewHeader from "../components/NewHeader";
import SessionManager from "@/utils/sessionManager";

const CreateCoursePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get teacher data from session
  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const [formData, setFormData] = useState({
    description: "",
    board: "",
    class_level: "",
    subject: "",
    chapter: "",
    lesson: "",
    topic: "",
    level: "beginner",
    duration_hours: "",
    course_file: null,
  });

  const [teacherScope, setTeacherScope] = useState({
    boards: [],
    subjects: [],
    classes_taught: []
  });

  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);

  useEffect(() => {
    // Check if teacher is logged in and fetch their scope
    const session = JSON.parse(localStorage.getItem('eduyata_user_session') || '{}');
    if (!session.id || session.role !== 'teacher') {
      setMessage("You must be logged in as a teacher to create a course.");
      return;
    }

    // Fetch teacher's registered scope
    fetchTeacherScope(session.id);
  }, []);

  const fetchTeacherScope = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/teacher_scope/${teacherId}/`);
      const data = await response.json();
      
      if (response.ok) {
        setTeacherScope(data.teacher_scope);
      } else {
        setMessage("Error fetching teacher scope");
      }
    } catch (error) {
      console.error('Error fetching teacher scope:', error);
      setMessage("Error connecting to server");
    }
  };

  // Handle board selection - filter classes
  const handleBoardChange = (board) => {
    setFormData({ ...formData, board, class_level: "", subject: "", chapter: "", lesson: "" });
    setAvailableClasses(teacherScope.classes_taught);
    setAvailableSubjects([]);
    setAvailableChapters([]);
    setAvailableLessons([]);
  };

  // Handle class selection - filter subjects
  const handleClassChange = (classLevel) => {
    setFormData({ ...formData, class_level: classLevel, subject: "", chapter: "", lesson: "" });
    setAvailableSubjects(teacherScope.subjects);
    setAvailableChapters([]);
    setAvailableLessons([]);
  };

  // Handle subject selection - fetch chapters
  const handleSubjectChange = async (subject) => {
    const newFormData = { ...formData, subject, chapter: "", lesson: "" };
    setFormData(newFormData);
    setAvailableChapters([]);
    setAvailableLessons([]);
    
    if (newFormData.board && newFormData.class_level && subject) {
      try {
        console.log(`Fetching chapters for: ${newFormData.board}/${newFormData.class_level}/${subject}`);
        
        const response = await fetch(`http://localhost:8001/api/auth/chapters/${encodeURIComponent(newFormData.board)}/${encodeURIComponent(newFormData.class_level)}/${encodeURIComponent(subject)}/`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Chapters response:', data);
          setAvailableChapters(data.chapters || []);
        } else {
          console.error('API response not ok:', response.status);
          setAvailableChapters([]);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setAvailableChapters([]);
      }
    }
  };

  // Handle chapter selection - fetch lessons
  const handleChapterChange = async (chapter) => {
    const newFormData = { ...formData, chapter, lesson: "" };
    setFormData(newFormData);
    setAvailableLessons([]);
    
    if (newFormData.board && newFormData.class_level && newFormData.subject && chapter) {
      try {
        console.log(`Fetching lessons for: ${newFormData.board}/${newFormData.class_level}/${newFormData.subject}/${chapter}`);
        
        const response = await fetch(`http://localhost:8001/api/auth/lessons/${encodeURIComponent(newFormData.board)}/${encodeURIComponent(newFormData.class_level)}/${encodeURIComponent(newFormData.subject)}/${encodeURIComponent(chapter)}/`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Lessons response:', data);
          setAvailableLessons(data.lessons || []);
        } else {
          console.error('API response not ok:', response.status);
          setAvailableLessons([]);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setAvailableLessons([]);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData({ ...formData, [e.target.name]: fileInput.files?.[0] || null });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Get teacher ID from session
      const session = JSON.parse(localStorage.getItem('eduyata_user_session') || '{}');
      const teacherId = session.id;
      
      if (!teacherId) {
        setMessage("Error: Teacher ID not found. Please login again.");
        setLoading(false);
        return;
      }

      console.log('Creating course with data:', {
        ...formData,
        instructor_id: teacherId,
        duration_hours: parseInt(formData.duration_hours),
        price: 0,
        thumbnail_url: "",
      });

      const formDataToSend = new FormData();
      formDataToSend.append('title', `${formData.board} Class ${formData.class_level} ${formData.subject} - ${formData.chapter} - ${formData.lesson} - ${formData.topic}`);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('board', formData.board);
      formDataToSend.append('class_level', formData.class_level);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('chapter', formData.chapter);
      formDataToSend.append('lesson', formData.lesson);
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('instructor_id', teacherId.toString());
      formDataToSend.append('duration_hours', formData.duration_hours);
      formDataToSend.append('price', '0');
      formDataToSend.append('thumbnail_url', '');
      if (formData.course_file) {
        formDataToSend.append('course_file', formData.course_file);
      }

      const response = await fetch("http://localhost:8001/api/teacher/courses/create/", {
        method: "POST",
        body: formDataToSend,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setMessage("Course created successfully!");
        setFormData({
          description: "",
          board: "",
          class_level: "",
          subject: "",
          chapter: "",
          lesson: "",
          topic: "",
          level: "beginner",
          duration_hours: "",
          course_file: null,
        });
        setAvailableClasses([]);
        setAvailableSubjects([]);
        setAvailableChapters([]);
        setAvailableLessons([]);
        
        // Redirect to teacher dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/teacher-dashboard';
        }, 2000);
      } else {
        console.error('Course creation failed:', data);
        setMessage(`Error: ${data.message || "Failed to create course"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error: Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const sidebarWidth = sidebarOpen ? 250 : 60;

  return (
    <div className="flex">
      {/* Sidebar */}
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        style={{
          marginLeft: sidebarWidth + 16,
          flex: 1,
          transition: "all 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader 
            avatar={teacherData.avatar}
            name={teacherData.name}
            role={teacherData.role}
          />
        </div>

        {/* Page Content */}
        <div className="p-8 pt-32 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Course</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.includes("successfully") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg grid grid-cols-3 gap-6"
          >
            {/* Column 1 - Teaching Scope */}
            <div className="flex flex-col">
              <label className="font-medium mb-2">Board <span className="text-red-500">*</span></label>
              <select
                name="board"
                value={formData.board}
                onChange={(e) => handleBoardChange(e.target.value)}
                required
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select Board</option>
                {teacherScope?.boards?.map(board => (
                  <option key={board} value={board}>{board}</option>
                )) || []}
              </select>

              <label className="font-medium mt-4 mb-2">Class <span className="text-red-500">*</span></label>
              <select
                name="class_level"
                value={formData.class_level}
                onChange={(e) => handleClassChange(e.target.value)}
                required
                disabled={!formData.board}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select Class</option>
                {availableClasses?.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                )) || []}
              </select>

              <label className="font-medium mt-4 mb-2">Subject <span className="text-red-500">*</span></label>
              <select
                name="subject"
                value={formData.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
                disabled={!formData.class_level}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select Subject</option>
                {availableSubjects?.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                )) || []}
              </select>
            </div>

            {/* Column 2 - Curriculum Structure */}
            <div className="flex flex-col">
              <label className="font-medium mb-2">Chapter <span className="text-red-500">*</span></label>
              <select
                name="chapter"
                value={formData.chapter}
                onChange={(e) => handleChapterChange(e.target.value)}
                required
                disabled={!formData.subject}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select Chapter</option>
                {availableChapters?.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                )) || []}
              </select>

              <label className="font-medium mt-4 mb-2">Lesson <span className="text-red-500">*</span></label>
              <select
                name="lesson"
                value={formData.lesson}
                onChange={handleChange}
                required
                disabled={!formData.chapter}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select Lesson</option>
                {availableLessons?.map(lesson => (
                  <option key={lesson} value={lesson}>{lesson}</option>
                )) || []}
              </select>

              <label className="font-medium mt-4 mb-2">Topic <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                placeholder="Enter specific topic name"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              {/* Auto-generated title preview */}
              {formData.board && formData.class_level && formData.subject && formData.chapter && formData.lesson && formData.topic && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <label className="font-medium text-green-800 mb-2 block">Generated Course Title:</label>
                  <p className="text-sm text-green-700 font-medium">
                    {formData.board} Class {formData.class_level} {formData.subject} - {formData.chapter} - {formData.lesson} - {formData.topic}
                  </p>
                </div>
              )}

              <label className="font-medium mt-4 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe what students will learn..."
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Column 3 - Additional Settings */}
            <div className="flex flex-col">
              <label className="font-medium mb-2">Difficulty Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <label className="font-medium mt-4 mb-2">Duration (hours) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleChange}
                required
                min="1"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              <label className="font-medium mt-4 mb-2">Upload File</label>
              <input
                type="file"
                name="course_file"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              {/* Scope Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Your Teaching Scope:</h4>
                <p className="text-sm text-blue-600">
                  Boards: {teacherScope?.boards?.join(', ') || 'None'}<br/>
                  Classes: {teacherScope?.classes_taught?.join(', ') || 'None'}<br/>
                  Subjects: {teacherScope?.subjects?.join(', ') || 'None'}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.board || !formData.class_level || !formData.subject || !formData.chapter || !formData.lesson || !formData.topic || !formData.duration_hours}
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;

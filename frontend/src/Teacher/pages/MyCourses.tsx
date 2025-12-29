import React, { useState, useEffect } from "react";
import NewHeader from "@/components/NewHeader";
import { TeacherSidebarDemo } from "@/components/TeacherSidebar";
import MaterialManager from "../components/MaterialManager";
import "./TeacherDashboard.css";
import { useLocation } from "wouter";
import SessionManager from "@/utils/sessionManager";

const MyCourses: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();

  // Get teacher data from session
  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMaterialManager, setShowMaterialManager] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teacherId = session?.id;
        if (!teacherId) return;

        console.log('Fetching courses for teacher ID:', teacherId);
        const response = await fetch(`http://localhost:8001/api/teacher/courses/my-courses/?teacher_id=${teacherId}`);
        const result = await response.json();
        console.log('Courses response:', result);

        if (response.ok) {
          setMyCourses(result.data || []);
        } else {
          console.error('Failed to fetch courses:', result);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [session?.id]);

  const handleAddAssignment = (courseId: number) => {
    setLocation(`/create-assignment?courseId=${courseId}`);
  };

  const handleAddMaterial = (course: any) => {
    setSelectedCourse(course);
    setShowMaterialManager(true);
  };

  const handleCloseMaterialManager = () => {
    setShowMaterialManager(false);
    setSelectedCourse(null);
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={teacherData.avatar}
          name={teacherData.name}
          role={teacherData.role}
          searchPlaceholder="Search courses..."
        />

        {/* My Courses Section */}
        <div className="courses-section">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">📚 My Courses</h2>
            </div>
            <button className="create-course-btn" onClick={() => setLocation("/create-course")}>
              <span className="btn-icon">➕</span>
              Create New Course
            </button>
          </div>
          
          <div className="courses-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your courses...</p>
              </div>
            ) : myCourses.length > 0 ? (
              <div className="courses-grid-organized">
                {myCourses.map((course: any, index) => (
                  <div key={index} className="course-card-modern">
                    <div className="course-header">
                      <div className="course-category">{course.category}</div>
                      <div className="course-level">{course.level}</div>
                    </div>
                    
                    <div className="course-content">
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.description}</p>
                      
                      <div className="course-stats">
                        <div className="stat-item">
                          <span className="stat-icon">👥</span>
                          <span className="stat-text">{course.students_count} Students</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-icon">⏱️</span>
                          <span className="stat-text">{course.duration_hours}h Duration</span>
                        </div>
                      </div>
                      
                      <div className="course-materials">
                        <div className="material-item" onClick={() => handleAddMaterial(course)}>
                          <span className="material-icon">📚</span>
                          <span className="material-text">3 Ebooks</span>
                        </div>
                        <div className="material-item" onClick={() => handleAddMaterial(course)}>
                          <span className="material-icon">📄</span>
                          <span className="material-text">5 Articles</span>
                        </div>
                        <div className="material-item" onClick={() => handleAddMaterial(course)}>
                          <span className="material-icon">🔗</span>
                          <span className="material-text">2 References</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="course-actions-modern">
                      <button className="action-btn-modern primary" onClick={() => handleAddAssignment(course.id)}>
                        📝 Add Assignment
                      </button>
                      <button className="action-btn-modern secondary" onClick={() => handleAddMaterial(course)}>
                        📁 Add Material
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses yet</h3>
                <p>Start creating your first course to begin teaching</p>
                <button className="create-first-course-btn" onClick={() => setLocation("/create-course")}>
                  Create Your First Course
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showMaterialManager && selectedCourse && (
          <MaterialManager
            courseId={selectedCourse.id}
            courseTitle={selectedCourse.title}
            onClose={handleCloseMaterialManager}
          />
        )}
      </div>
    </div>
  );
};

export default MyCourses;

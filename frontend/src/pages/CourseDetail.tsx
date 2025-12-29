import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import NewHeader from '../components/NewHeader';
import SessionManager from '../utils/sessionManager';
import { getHeaderProps } from '../utils/headerUtils';
import './CourseStyles.css';

interface CourseDetail {
  id: number;
  course_id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_hours: number;
  price: number;
  thumbnail_url: string;
  instructor_name: string;
  qualification: string;
  experience_years: number;
  enrollment_count: number;
  is_enrolled: boolean;
  enrollment_data?: {
    enrollment_date: string;
    progress_percentage: number;
    status: string;
  };
}

interface CourseDetailProps {
  courseId: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const [, setLocation] = useLocation();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [studentSession] = useState(SessionManager.getSession());

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
    if (studentSession?.id) {
      loadUserTheme(studentSession.id);
    }
  }, [courseId, studentSession]);

  const loadUserTheme = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        applyTheme(data.data.theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8001/api/courses/get_courses/?student_id=${studentSession?.id || ''}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data.length > 0) {
        const courseData = data.data.find((c: any) => c.id.toString() === courseId || c.course_id === courseId);
        
        if (courseData) {
          setCourse({
            ...courseData,
            experience_years: 8,
            enrollment_count: courseData.students_count,
            enrollment_data: courseData.is_enrolled && courseData.enrollment_data ? {
              enrollment_date: courseData.enrollment_data.enrollment_date,
              progress_percentage: courseData.enrollment_data.progress_percentage,
              status: 'enrolled'
            } : null
          });
        } else {
          setError('Course not found');
        }
      } else {
        setError('Course not found');
      }
    } catch (err) {
      setError('Failed to fetch course details');
      console.error('Error fetching course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!studentSession) {
      alert('Please login to enroll in this course');
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      const response = await fetch('http://localhost:8001/api/courses/enroll_course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          course_id: course.id
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Successfully enrolled in course!');
        // Refresh course details to update enrollment status
        fetchCourseDetail();
      } else {
        alert(data.message || 'Failed to enroll in course');
      }
    } catch (err) {
      alert('Failed to enroll in course');
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Mathematics': '📐',
      'Science': '🔬',
      'English': '📚',
      'Computer Science': '💻',
      'History': '🏛️',
      'Arts': '🎨'
    };
    return icons[category] || '📖';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 course-detail-container">
        <NewHeader {...getHeaderProps()} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 course-detail-container">
        <NewHeader {...getHeaderProps()} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
            <button
              onClick={() => setLocation('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 course-detail-container">
      <NewHeader {...getHeaderProps()} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button 
                onClick={() => setLocation('/courses')}
                className="hover:text-blue-600"
              >
                Courses
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{course.title}</li>
          </ol>
        </nav>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {getCategoryIcon(course.category)} {course.category}
              </span>
            </div>
            {course.is_enrolled && (
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Enrolled
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium">
                    {course.instructor_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor_name}</p>
                  <p className="text-sm text-gray-500">{course.qualification}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>⏱️ {course.duration_hours} hours</span>
                <span>👥 {course.enrollment_count} students enrolled</span>
                <span>🎓 {course.experience_years} years experience</span>
              </div>
            </div>

            <div className="flex justify-end">
              {!course.is_enrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              ) : (
                <button
                  onClick={() => setLocation(`/course/${course.id}/learn`)}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Continue Learning
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Course</h2>
          <p className="text-gray-600 leading-relaxed">{course.description}</p>
        </div>

        {/* Enrollment Status */}
        {course.is_enrolled && course.enrollment_data && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {course.enrollment_data.progress_percentage}%
                </div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {course.enrollment_data.status}
                </div>
                <div className="text-sm text-gray-500">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(course.enrollment_data.enrollment_date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">Enrolled</div>
              </div>
            </div>
          </div>
        )}

        {/* What You'll Learn */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span className="text-gray-600">Master fundamental concepts and principles</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span className="text-gray-600">Apply knowledge to real-world scenarios</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span className="text-gray-600">Develop practical skills and techniques</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              <span className="text-gray-600">Build a strong foundation for advanced topics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 
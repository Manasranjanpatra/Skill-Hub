// CourseCard.tsx
import React from 'react';
import { useLocation } from 'wouter';
import {
  FaStar, FaClock, FaUser, FaGraduationCap, FaArrowRight, FaPlayCircle
} from 'react-icons/fa';
import './CourseCard.css';

interface CourseCardProps {
  course: {
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
    enrollment_count?: number;
    is_enrolled?: boolean;
    rating?: number;
    students_count?: number;
  };
  onEnroll?: (courseId: number) => void;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEnroll, 
  showEnrollButton = true 
}) => {
  const [, setLocation] = useLocation();

  const handleViewCourse = () => {
    setLocation(`/course/${course.course_id}`);
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  return (
    <div 
      className="course-card"
      onClick={handleViewCourse}
    >
      <div className="course-thumbnail" style={{ backgroundImage: `url(${course.thumbnail_url})` }}>
        <div className="course-overlay">
          <div className="course-category">{course.category}</div>
        </div>
      </div>
      
      <div className="course-content">
        <div className="course-header">
          <h3 className="course-title">{course.title}</h3>
          <div className="course-rating">
            <FaStar className="star-icon" />
            <span>{course.rating || 4.5}</span>
          </div>
        </div>
        
        <p className="course-instructor">By {course.instructor_name}</p>
        
        <div className="course-meta">
          <span className="meta-chip">
            <FaClock className="meta-icon" />
            {course.duration_hours}h
          </span>
          <span className="meta-chip">
            <FaGraduationCap className="meta-icon" />
            {course.level}
          </span>
          <span className="meta-chip">
            <FaUser className="meta-icon" />
            {course.students_count || 0} students
          </span>
        </div>
        
        <div className="course-footer">
          {course.is_enrolled ? (
            <button 
              className="continue-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleViewCourse();
              }}
            >
              <FaPlayCircle />
              Continue
            </button>
          ) : (
            <button 
              className="enroll-btn"
              onClick={handleEnroll}
            >
              <FaArrowRight />
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/Dashboard";
import PerformancePage from "@/pages/PerformancePage";
import StudentInfo from "@/pages/StudentInfo";
import Subject from "@/pages/Subject";
import TeacherDashboard from "@/Teacher/pages/TeacherDashboard";
import CreateAssignment from "@/pages/CreateAssignment";
import TeacherSubmissions from "@/pages/TeacherSubmissions";
import TeacherClasses from "@/pages/TeacherClasses";
import AssignmentsPage from "@/pages/AssignmentsPage";
import NotFound from "@/pages/not-found";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminStudents from "@/pages/AdminStudents";
import AdminTeachers from "@/pages/AdminTeachers";
import AdminTeacherProfile from "@/pages/AdminTeacherProfile";
import NormalAdminTeachers from "@/pages/NormalAdminTeachers";
import NormalAdminDashboard from "@/pages/NormalAdminDashboard";
import NormalAdminVerifyTeachers from "@/pages/NormalAdminVerifyTeachers";
import AdminCourses from "@/pages/AdminCourses";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminFinancialReports from "@/pages/AdminFinancialReports";
import AdminPerformance from "@/pages/AdminPerformance";
import AdminBackup from "@/pages/AdminBackup";
import AdminSettings from "@/pages/AdminSettings";
import AdminCategories from "@/pages/AdminCategories";
import AdminAssignments from "@/pages/AdminAssignments";
import AdminEnrollments from "@/pages/AdminEnrollments";
import AdminSchedulingTasks from "@/pages/AdminSchedulingTasks";
import AdminAnnouncements from "@/pages/AdminAnnouncements";
import AdminCollaborationTools from "@/pages/AdminCollaborationTools";
import SuperAdminManagement from "@/pages/SuperAdminManagement";
import AdminRoute from "@/components/AdminRoute";
import NormalAdminCourseDashboard from "@/pages/NormalAdminCourseDashboard";
import NormalAdminCourses from "@/pages/NormalAdminCourses";
import PerformanceDemo from "@/pages/PerformanceDemo";
import ProfileCompletion from "@/pages/ProfileCompletion";
import ProtectedRoute from "@/components/ProtectedRoute";
import FractionChefPage from "@/pages/FractionChef";
import MathMazePage from "@/pages/MathMaze";
import FractionBalloonPage from "@/pages/FractionBalloon";
import PerformanceDetail from "@/pages/PerformanceDetail";
import CreateCourse from "@/Teacher/pages/CreateCourse";
import TeacherRegisterPage from "@/Teacher/pages/TeacherRegister";
import TeacherRegistration from "@/pages/TeacherRegistration";
import CreativeTeacherRegister from "@/pages/CreativeTeacherRegister";
import MyCourses from "@/Teacher/pages/MyCourses";
import TeacherLMS from "@/Teacher/pages/TeacherLMS";
import TeacherPerformance from "@/Teacher/pages/TeacherPerformance";
import TeacherAssignments from "@/Teacher/pages/TeacherAssignments";
import TeacherStudents from "@/Teacher/pages/TeacherStudents";
import Settings from "@/pages/Settings";
import Collaboration from "@/pages/Collaboration";
import TeacherProjects from "@/pages/TeacherProjects";
import StudentProjects from "@/pages/StudentProjects";
import StudentChatPage from "@/pages/StudentChatPage";
import BadgesPage from "@/pages/BadgesPage";
import EndorsementsPage from "@/pages/EndorsementsPage";
import SkillAssessment from "@/pages/SkillAssessment";

import UnifiedAssistant from "@/components/UnifiedAssistant";
import SessionManager from "@/utils/sessionManager";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/teacher-register" component={TeacherRegisterPage} />
      <Route path="/teacher-registration" component={TeacherRegistration} />
      <Route path="/creative-teacher-register" component={CreativeTeacherRegister} />

      {/* Protected student routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/fraction-chef">
        <ProtectedRoute>
          <FractionChefPage />
        </ProtectedRoute>
      </Route>
      <Route path="/performance">
        <ProtectedRoute>
          <PerformancePage />
        </ProtectedRoute>
      </Route>
      <Route path="/performance-detail/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <PerformanceDetail />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/math-maze">
        <ProtectedRoute>
          <MathMazePage />
        </ProtectedRoute>
      </Route>
      <Route path="/fraction-balloon">
        <ProtectedRoute>
          <FractionBalloonPage />
        </ProtectedRoute>
      </Route>
      <Route path="/performance-demo">
        <ProtectedRoute>
          <PerformanceDemo />
        </ProtectedRoute>
      </Route>
      <Route path="/student-info">
        <ProtectedRoute>
          <StudentInfo />
        </ProtectedRoute>
      </Route>
      <Route path="/assignments">
        <ProtectedRoute>
          <AssignmentsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/collaboration">
        <ProtectedRoute>
          <Collaboration />
        </ProtectedRoute>
      </Route>
      <Route path="/student-chat">
        <ProtectedRoute>
          <StudentChatPage />
        </ProtectedRoute>
      </Route>
      <Route path="/badges">
        <ProtectedRoute>
          <BadgesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/endorsements">
        <ProtectedRoute>
          <EndorsementsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/skill-assessment">
        <ProtectedRoute>
          <SkillAssessment />
        </ProtectedRoute>
      </Route>

      {/* Teacher routes */}
      <Route path="/teacher-dashboard">
        <ProtectedRoute>
          <TeacherDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/create-assignment" component={CreateAssignment} />
      <Route path="/teacher-submissions" component={TeacherSubmissions} />
      <Route path="/teacher-classes" component={TeacherClasses} />
      <Route path="/create-course">
        <ProtectedRoute>
          <CreateCourse />
        </ProtectedRoute>
      </Route>
      <Route path="/my-courses">
        <ProtectedRoute>
          <MyCourses />
        </ProtectedRoute>
      </Route>
      <Route path="/teacher-lms">
        <ProtectedRoute>
          <TeacherLMS />
        </ProtectedRoute>
      </Route>
      <Route path="/teacher-performance">
        <ProtectedRoute>
          <TeacherPerformance />
        </ProtectedRoute>
      </Route>
      <Route path="/teacher-assignments">
        <ProtectedRoute>
          <TeacherAssignments />
        </ProtectedRoute>
      </Route>
      <Route path="/teacher-projects">
        <ProtectedRoute>
          <TeacherProjects />
        </ProtectedRoute>
      </Route>
      <Route path="/student-projects">
        <ProtectedRoute>
          <StudentProjects />
        </ProtectedRoute>
      </Route>
      <Route path="/teacher-students">
        <ProtectedRoute>
          <TeacherStudents />
        </ProtectedRoute>
      </Route>

      {/* Course routes */}
      <Route path="/courses">
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      </Route>
      <Route path="/course/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <CourseDetail courseId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/course/:id/learn">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <Subject courseId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>
      <Route path="/admin/students">
        <AdminRoute>
          <AdminStudents />
        </AdminRoute>
      </Route>
      <Route path="/admin/teachers">
        <AdminRoute>
          <AdminTeachers />
        </AdminRoute>
      </Route>
      <Route path="/admin/teacher/:id">
        <AdminRoute>
          <AdminTeacherProfile />
        </AdminRoute>
      </Route>
      <Route path="/admin/courses">
        <AdminRoute>
          <AdminCourses />
        </AdminRoute>
      </Route>
      <Route path="/admin/analytics">
        <AdminRoute>
          <AdminAnalytics />
        </AdminRoute>
      </Route>
      <Route path="/admin/financial-reports">
        <AdminRoute>
          <AdminFinancialReports />
        </AdminRoute>
      </Route>
      <Route path="/admin/performance">
        <AdminRoute>
          <AdminPerformance />
        </AdminRoute>
      </Route>
      <Route path="/admin/backup">
        <AdminRoute>
          <AdminBackup />
        </AdminRoute>
      </Route>
      <Route path="/admin/settings">
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      </Route>
      <Route path="/admin/categories">
        <AdminRoute>
          <AdminCategories />
        </AdminRoute>
      </Route>
      <Route path="/admin/assignments">
        <AdminRoute>
          <AdminAssignments />
        </AdminRoute>
      </Route>
      <Route path="/admin/enrollments">
        <AdminRoute>
          <AdminEnrollments />
        </AdminRoute>
      </Route>
      <Route path="/admin/scheduling-tasks">
        <AdminRoute>
          <AdminSchedulingTasks />
        </AdminRoute>
      </Route>
      <Route path="/admin/announcements">
        <AdminRoute>
          <AdminAnnouncements />
        </AdminRoute>
      </Route>
      <Route path="/admin/collaboration-tools">
        <AdminRoute>
          <AdminCollaborationTools />
        </AdminRoute>
      </Route>
      <Route path="/admin/admins">
        <AdminRoute>
          <SuperAdminManagement />
        </AdminRoute>
      </Route>
      <Route path="/normal-admin/dashboard">
        <AdminRoute>
          <NormalAdminDashboard />
        </AdminRoute>
      </Route>
      <Route path="/normal-admin/verify-teachers">
        <AdminRoute>
          <NormalAdminVerifyTeachers />
        </AdminRoute>
      </Route>
      <Route path="/normal-admin/teachers">
        <AdminRoute>
          <NormalAdminTeachers />
        </AdminRoute>
      </Route>
      <Route path="/normal-admin/courseDashboard">
        <AdminRoute>
          <NormalAdminCourseDashboard />
        </AdminRoute>
      </Route>
      <Route path="/normal-admin/courses">
        <AdminRoute>
          <NormalAdminCourses />
        </AdminRoute>
      </Route>
      <Route path="/profile-completion">
        <ProtectedRoute>
          <ProfileCompletion />
        </ProtectedRoute>
      </Route>
      
      <Route path="/subject/:courseCode">
        {(params: { courseCode: string }) => (
          <ProtectedRoute>
            <Subject mockCourseCode={params.courseCode} />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/profile-completion">
        <ProtectedRoute>
          <ProfileCompletion />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        {location !== "/login" && location !== "/" && (
          <UnifiedAssistant />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

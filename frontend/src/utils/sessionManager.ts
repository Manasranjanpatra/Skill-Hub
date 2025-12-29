// Session Manager for Student and Teacher Authentication
export interface StudentSession {
  id: number;
  student_id: string;
  name: string;
  phone: string;
  class: string;
  board: string;
  gender: string;
  profile_picture: string;
  profile_completed?: boolean;
  isLoggedIn: boolean;
  role?: string;
}

export interface TeacherSession {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
}

export interface AdminSession {
  id: number;
  admin_id: string;
  name: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
}

type UserSession = StudentSession | TeacherSession | AdminSession;

class SessionManager {
  private static STORAGE_KEY = 'eduyata_user_session';

  // Save session data (student or teacher)
  static saveSession(userData: any): void {
    let session: UserSession;
    
    if (userData.role === 'admin' || userData.admin_id) {
      // Admin session
      session = {
        id: userData.id,
        admin_id: userData.admin_id,
        name: userData.name,
        email: userData.email,
        role: 'admin',
        isLoggedIn: true
      } as AdminSession;
    } else if (userData.role === 'teacher' || userData.teacherId) {
      // Teacher session
      session = {
        id: userData.id,
        teacherId: userData.teacherId,
        name: userData.name,
        email: userData.email,
        role: 'teacher',
        isLoggedIn: true
      } as TeacherSession;
    } else {
      // Student session
      session = {
        id: userData.id,
        student_id: userData.student_id,
        name: userData.name,
        phone: userData.phone,
        class: userData.class,
        board: userData.board,
        gender: userData.gender || '',
        profile_picture: userData.profile_picture || '',
        profile_completed: userData.profile_completed || false,
        role: 'student',
        isLoggedIn: true
      } as StudentSession;
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    // Notify listeners that session has been updated
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sessionUpdated'));
    }
  }

  // Get current session
  static getSession(): UserSession | null {
    const sessionData = localStorage.getItem(this.STORAGE_KEY);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      return session.isLoggedIn ? session : null;
    }
    return null;
  }

  // Get user role
  static getUserRole(): string | null {
    const session = this.getSession();
    return session?.role || null;
  }

  // Check if user is teacher
  static isTeacher(): boolean {
    return this.getUserRole() === 'teacher';
  }

  // Check if user is student
  static isStudent(): boolean {
    return this.getUserRole() === 'student';
  }

  // Check if user is admin
  static isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // Alias for getSession for backward compatibility
  static getStudentSession = this.getSession;

  // Check if user is logged in
  static isLoggedIn(): boolean {
    const session = this.getSession();
    return session !== null && session.isLoggedIn;
  }

  // Clear session (logout)
  static clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    // Notify listeners that session has been cleared
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sessionUpdated'));
    }
  }

  // Get user name
  static getUserName(): string {
    const session = this.getSession();
    return session?.name || 'User';
  }

  // Get student name (backward compatibility)
  static getStudentName(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return session.name || 'Student';
    }
    return 'Student';
  }

  // Get student ID
  static getStudentId(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return (session as StudentSession).student_id || '';
    }
    return '';
  }

  // Get teacher ID
  static getTeacherId(): string {
    const session = this.getSession();
    if (session?.role === 'teacher') {
      return (session as TeacherSession).teacherId || '';
    }
    return '';
  }

  // Get student class
  static getStudentClass(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return (session as StudentSession).class || '';
    }
    return '';
  }

  // Get student board
  static getStudentBoard(): string {
    const session = this.getSession();
    if (session?.role === 'student') {
      return (session as StudentSession).board || '';
    }
    return '';
  }
}

export default SessionManager; 

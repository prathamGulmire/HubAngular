
type Role = 'user' | 'admin';

type NavigationItem = { path?: string, text: string, icon?: string, items?: NavigationItem[], roles?: Role[] };
export const navigation: NavigationItem[] = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home',
    roles: ['admin']
  },
  {
    text: 'Student',
    icon: 'user',
    roles: ['admin', 'user'],
    items: [
      {
        text: 'Profile',
        path: '/profile',
        // icon: 'card',
        roles: ['user', 'admin']
      },
      {
        text: 'StudentList',
        path: '/students',
        // icon: 'group',
        roles: ['admin']
      }
    ]
  },
  {
    text: 'Course',
    icon: 'product',
    roles: ['admin', 'user'],
    items: [
      {
        text: 'Add-Course',
        path: '/addCourse',
        roles: ['admin'],
      },
      {
        text: 'CourseList',
        path: '/courses',
        roles: ['admin'],
      },
      {
        text: 'My-Courses',
        path: '/my-courses',
        roles: ['user']
      },
      {
        text: 'Enroll-Course',
        path: '/enroll-course',
        roles: ['user']
      }
    ]
  },
  {
    text: 'ManageStudentCourse',
    icon: 'preferences',
    roles: ['admin'],
    items: [
      {
        text: 'Assign-Course',
        path: '/assignCourse',
        roles: ['admin'],
      },
      {
        text: 'Unassign',
        path: '/unassignCourse',
        roles: ['admin'],
      },
    ]
  },
  {
    text: 'Testing',
    icon: 'home',
    roles: ['admin'],
    items: [
      {
        text: 'Test',
        path: '/test'
      }
    ]
  }
];

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
    icon: 'folder',
    roles: ['admin', 'user'],
    items: [
      {
        text: 'Profile',
        path: '/profile',
        roles: ['user', 'admin']
      },
      {
        text: 'StudentList',
        path: '/students',
        roles: ['admin']
      }
    ]
  },
  {
    text: 'Course',
    icon: 'folder',
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
      }
    ]
  },
  {
    text: 'ManageStudentCourse',
    icon: 'folder',
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
  }
];
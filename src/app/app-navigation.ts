type NavigationItem = { path?: string, text: string, icon?: string, items?: NavigationItem[] };
export const navigation: NavigationItem[] = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Student',
    icon: 'folder',
    items: [
      {
        text: 'Profile',
        path: '/profile'
      },
      {
        text: 'StudentList',
        path: '/students'
      }
    ]
  }
];
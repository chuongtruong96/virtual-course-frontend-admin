// src/menuItems.js

const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'Dashboard', // Sử dụng icon từ MUI
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'Dashboard', // Sử dụng icon từ MUI
          url: '/app/dashboard/default',
        },
      ],
    },
    {
      id: 'ui-element',
      title: 'UI ELEMENT',
      type: 'group',
      icon: 'Widgets', // Sử dụng icon từ MUI
      children: [
        {
          id: 'component',
          title: 'Component',
          type: 'collapse',
          icon: 'Build', // Sử dụng icon từ MUI
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/app/ui-elements/basic/button',
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/app/ui-elements/basic/badges',
            },
            {
              id: 'breadcrumb',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/app/ui-elements/basic/breadcrumb-paging',
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/app/ui-elements/basic/collapse',
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/app/ui-elements/basic/tabs-pills',
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/app/ui-elements/basic/typography',
            },
          ],
        },
      ],
    },
    {
      id: 'instructor-management',
      title: 'INSTRUCTOR MANAGEMENT',
      type: 'group',
      icon: 'Group', // Sử dụng icon từ MUI
      children: [
        {
          id: 'instructor-list',
          title: 'Instructor List',
          type: 'item',
          icon: 'List',
          url: '/app/instructor/list-instructor',
        },
        {
          id: 'add-instructor',
          title: 'Add Instructor',
          type: 'item',
          icon: 'AddCircle',
          url: '/app/instructor/add-instructor/:accountId',
        },
      ],
    },
    {
      id: 'student-management',
      title: 'STUDENT MANAGEMENT',
      type: 'group',
      icon: 'School', // Sử dụng icon từ MUI
      children: [
        {
          id: 'student-list',
          title: 'Student List',
          type: 'item',
          icon: 'List',
          url: '/app/student/list-student',
        },
        {
          id: 'add-student',
          title: 'Add Student',
          type: 'item',
          icon: 'PersonAdd',
          url: '/app/student/add-student/:accountId',
        },
      ],
    },
    {
      id: 'category-management',
      title: 'CATEGORY MANAGEMENT',
      type: 'group',
      icon: 'Category', // Sử dụng icon từ MUI
      children: [
        {
          id: 'category-list',
          title: 'Category List',
          type: 'item',
          icon: 'List',
          url: '/app/category/list-category',
        },
        {
          id: 'add-category',
          title: 'Add Category',
          type: 'item',
          icon: 'AddCircle',
          url: '/app/category/add-category',
        },
      ],
    },
    {
      id: 'course-management',
      title: 'COURSE MANAGEMENT',
      type: 'group',
      icon: 'Book', // Sử dụng icon từ MUI
      children: [
        {
          id: 'course-list',
          title: 'Course List',
          type: 'item',
          icon: 'List',
          url: '/app/course/list-course',
        },
        {
          id: 'add-course',
          title: 'Add Course',
          type: 'item',
          icon: 'AddCircle',
          url: '/app/course/add-course/:accountId',
        },
      ],
    },
    {
      id: 'account',
      title: 'User Management',
      type: 'group',
      icon: 'Person', // Sử dụng icon từ MUI
      children: [
        {
          id: 'account-list',
          title: 'Account List',
          type: 'item',
          icon: 'List',
          url: '/app/account/list',
        },
        {
          id: 'role-list',
          title: 'Role List',
          type: 'item',
          icon: 'Security',
          url: '/app/usermanagement/roles/rolelist',
        },
      ],
    },
    {
      id: 'chart-maps',
      title: 'Chart & Maps',
      type: 'group',
      icon: 'BarChart', // Sử dụng icon từ MUI
      children: [
        {
          id: 'charts',
          title: 'Charts',
          type: 'item',
          icon: 'PieChart',
          url: '/app/charts/nvd3',
        },
        {
          id: 'maps',
          title: 'Maps',
          type: 'item',
          icon: 'Map',
          url: '/app/maps/google-map',
        },
      ],
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'Pages', // Sử dụng icon từ MUI
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'Lock',
          children: [
            {
              id: 'signup-1',
              title: 'Sign up',
              type: 'item',
              url: '/auth/signup/signup1',
            },
            {
              id: 'signin-1',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin',
            },
          ],
        },
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          icon: 'Pageview',
          url: '/app/sample-page',
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: 'Book',
          url: 'https://codedthemes.gitbook.io/datta/',
          external: true,
        },
        {
          id: 'menu-level',
          title: 'Menu Levels',
          type: 'collapse',
          icon: 'Menu',
          children: [
            {
              id: 'menu-level-1.1',
              title: 'Menu Level 1.1',
              type: 'item',
              url: '#!',
            },
            {
              id: 'menu-level-1.2',
              title: 'Menu Level 2.2',
              type: 'collapse',
              children: [
                {
                  id: 'menu-level-2.1',
                  title: 'Menu Level 2.1',
                  type: 'item',
                  url: '#',
                },
                {
                  id: 'menu-level-2.2',
                  title: 'Menu Level 2.2',
                  type: 'collapse',
                  children: [
                    {
                      id: 'menu-level-3.1',
                      title: 'Menu Level 3.1',
                      type: 'item',
                      url: '#',
                    },
                    {
                      id: 'menu-level-3.2',
                      title: 'Menu Level 3.2',
                      type: 'item',
                      url: '#',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          icon: 'Block',
          url: '#',
          disabled: true,
        },
      ],
    },
  ],
};

export default menuItems;

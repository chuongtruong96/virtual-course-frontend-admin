// src/menuItems.js

const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        }
      ]
    },
    {
      id: 'ui-element',
      title: 'UI ELEMENT',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'component',
          title: 'Component',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/basic/button'
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/basic/badges'
            },
            {
              id: 'breadcrumb',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/basic/breadcrumb-paging'
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/basic/collapse'
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/basic/tabs-pills'
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/basic/typography'
            }
          ]
        }
      ]
    },
    {
      id: 'instructor-management',
      title: 'INSTRUCTOR MANAGEMENT',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'instructor-list',
          title: 'Instructor List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/instructor/list-instructor'
        },
        
      ]
    },
    {
      id: 'student-management',
      title: 'STUDENT MANAGEMENT',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'student-list',
          title: 'Student List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/student/list-student'
        },
        
      ]
    },
    {
      id: 'category-management',
      title: 'CATEGORY MANAGEMENT',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'category-list',
          title: 'Category List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/category/list-category'
        },
        {
          id: 'add-category',
          title: 'Add Category',
          type: 'item',
          icon: 'feather icon-plus-circle',
          url: '/category/add-category'
        }
      ]
    },
    {
      id: 'course-management',
      title: 'COURSE MANAGEMENT',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'course-list',
          title: 'Course List',
          type: 'item',
          icon: 'feather icon-server',
          url: '/course/list-course'
        },
        {
          id: 'add-course',
          title: 'Add Course',
          type: 'item',
          icon: 'feather icon-plus-circle',
          url: '/course/add-course/:accountId'
        }
      ]
    },
    {
      id: 'account',
      title: 'User Management',
      type: 'group',
      icon: 'icon-user',
      children: [
        {
          id: 'account-list',
          title: 'Account List',
          type: 'item',
          icon: 'feather icon-users',
          url: '/account/list'  // URL displaying account list
        },
        {
          id: 'role-list',
          title: 'Role List',
          type: 'item',
          icon: 'feather icon-user-check',
          url: '/usermanagement/roles/rolelist'
        }
        // Optionally, handle 'Add Instructor' through account creation process
      ]
    },
    {
      id: 'chart-maps',
      title: 'Chart & Maps',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'charts',
          title: 'Charts',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/charts/nvd3'
        },
        {
          id: 'maps',
          title: 'Maps',
          type: 'item',
          icon: 'feather icon-map',
          url: '/maps/google-map'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          badge: {
            title: 'New',
            type: 'label-danger'
          },
          children: [
            {
              id: 'signup-1',
              title: 'Sign up',
              type: 'item',
              url: '/auth/signup-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-1',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin-1',
              target: true,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: 'feather icon-book',
          classes: 'nav-item',
          url: 'https://codedthemes.gitbook.io/datta/',
          target: true,
          external: true
        },
        {
          id: 'menu-level',
          title: 'Menu Levels',
          type: 'collapse',
          icon: 'feather icon-menu',
          children: [
            {
              id: 'menu-level-1.1',
              title: 'Menu Level 1.1',
              type: 'item',
              url: '#!'
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
                  url: '#'
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
                      url: '#'
                    },
                    {
                      id: 'menu-level-3.2',
                      title: 'Menu Level 3.2',
                      type: 'item',
                      url: '#'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'feather icon-power'
        }
      ]
    },
    
  ]
};

export default menuItems;

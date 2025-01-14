// src/menuItems.js

const menuItems = {
  items: [
    // Core Navigation
    {
      id: 'navigation',
      title: 'Core Navigation',
      type: 'group',
      icon: 'Dashboard',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'Dashboard',
          url: '/dashboard/default',
        },
      ],
    },

    // User Management
    {
      id: 'user-management',
      title: 'User Management',
      type: 'group',
      icon: 'Person',
      children: [
        {
          id: 'account-list',
          title: 'Account List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/account/list',
        },
        {
          id: 'role-list',
          title: 'Role List',
          type: 'item',
          icon: 'Security',
          url: '/dashboard/usermanagement/roles/rolelist',
        },
        {
          id: 'token-list',
          title: 'Check Token',
          type: 'item',
          icon: 'Lock', // Thay 'Token' bằng 'Lock'
          url: '/dashboard/account/checktoken',
        },
      ],
    },

    // Instructor Management
    {
      id: 'instructor-management',
      title: 'Instructor Management',
      type: 'group',
      icon: 'Group',
      children: [
        {
          id: 'instructor-list',
          title: 'Instructor List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/instructor/list-instructor',
        },
        {
          id: 'add-instructor',
          title: 'Add Instructor',
          type: 'item',
          icon: 'AddCircle',
          url: '/dashboard/instructor/add-instructor/:accountId',
        },
      ],
    },

    // Student Management
    {
      id: 'student-management',
      title: 'Student Management',
      type: 'group',
      icon: 'School',
      children: [
        {
          id: 'student-list',
          title: 'Student List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/student/list-student',
        },
        {
          id: 'add-student',
          title: 'Add Student',
          type: 'item',
          icon: 'PersonAdd',
          url: '/dashboard/student/add-student/:accountId',
        },
      ],
    },

    // Category Management
    {
      id: 'category-management',
      title: 'Category Management',
      type: 'group',
      icon: 'Category',
      children: [
        {
          id: 'category-list',
          title: 'Category List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/category/list-category',
        },
        {
          id: 'add-category',
          title: 'Add Category',
          type: 'item',
          icon: 'AddCircle',
          url: '/dashboard/category/add-category',
        },
      ],
    },

    // Course Management
    {
      id: 'course-management',
      title: 'Course Management',
      type: 'group',
      icon: 'Book',
      children: [
        {
          id: 'course-list',
          title: 'Course List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/course/list-course',
        },
        {
          id: 'add-course',
          title: 'Add Course',
          type: 'item',
          icon: 'AddCircle',
          url: '/dashboard/course/add-course/:accountId',
        },
      ],
    },

    // Operational Management
    {
      id: 'operational-management',
      title: 'Operational Management',
      type: 'group',
      icon: 'Build',
      children: [
        {
          id: 'review-management',
          title: 'Review Management',
          type: 'collapse',
          icon: 'RateReview',
          children: [
            {
              id: 'list-review',
              title: 'List Reviews',
              type: 'item',
              icon: 'List',
              url: '/dashboard/review/list/:courseId',
            },
            {
              id: 'add-review',
              title: 'Add Review',
              type: 'item',
              icon: 'AddCircle',
              url: '/dashboard/review/add/:courseId',
            },
          ],
        },
        {
          id: 'ticket-management',
          title: 'Ticket Management',
          type: 'collapse',
          icon: 'Support',
          children: [
            {
              id: 'list-ticket',
              title: 'List Tickets',
              type: 'item',
              icon: 'List',
              url: '/dashboard/ticket/list',
            },
            {
              id: 'add-ticket',
              title: 'Add Ticket',
              type: 'item',
              icon: 'AddCircle',
              url: '/dashboard/ticket/add',
            },
          ],
        },
      ],
    },

    // Bank Account Management
    {
      id: 'bank-account-management',
      title: 'Bank Account Management',
      type: 'group',
      icon: 'AccountBalance',
      children: [
        {
          id: 'list-bank-account',
          title: 'Bank Account List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/bank-account/list',
        },
        {
          id: 'add-bank-account',
          title: 'Add Bank Account',
          type: 'item',
          icon: 'AddCircle',
          url: '/dashboard/bank-account/add',
        },
        {
          id: 'edit-bank-account',
          title: 'Edit Bank Account',
          type: 'item',
          icon: 'Build', // Thay 'Edit' bằng 'Build'
          url: '/dashboard/bank-account/edit/:id',
        },
      ],
    },

    // Wallet Management
    {
      id: 'wallet-management',
      title: 'Wallet Management',
      type: 'group',
      icon: 'AccountBalanceWallet',
      children: [
        {
          id: 'wallet-list',
          title: 'Wallet List',
          type: 'item',
          icon: 'List',
          url: '/dashboard/wallet/list',
        },
        {
          id: 'transaction-history',
          title: 'Transaction History',
          type: 'item',
          icon: 'Pageview', // Thay 'History' bằng 'Pageview'
          url: '/dashboard/wallet/transaction-history/:walletId',
        },
      ],
    },

    // Notification Management
    {
      id: 'notification-management',
      title: 'Notification Management',
      type: 'group',
      icon: 'Notifications',
      children: [
        {
          id: 'notification-list',
          title: 'Notifications',
          type: 'item',
          icon: 'List',
          url: '/dashboard/notification/list',
        },
      ],
    },

    // Data Visualization
    {
      id: 'data-visualization',
      title: 'Data Visualization',
      type: 'group',
      icon: 'BarChart',
      children: [
        {
          id: 'charts',
          title: 'Charts',
          type: 'item',
          icon: 'PieChart',
          url: '/dashboard/charts/nvd3',
        },
        {
          id: 'maps',
          title: 'Maps',
          type: 'item',
          icon: 'Map',
          url: '/dashboard/maps/google-map',
        },
      ],
    },

    // UI Elements
    {
      id: 'ui-elements',
      title: 'UI Elements',
      type: 'group',
      icon: 'Widgets',
      children: [
        {
          id: 'component',
          title: 'Component',
          type: 'collapse',
          icon: 'Build',
          children: [
            { id: 'button', title: 'Button', type: 'item', icon: 'Build', url: '/dashboard/ui-elements/basic/button' },
            { id: 'badges', title: 'Badges', type: 'item', icon: 'Build', url: '/dashboard/ui-elements/basic/badges' },
            { id: 'breadcrumb', title: 'Breadcrumb & Pagination', type: 'item', icon: 'Build', url: '/dashboard/ui-elements/basic/breadcrumb-paging' },
            { id: 'collapse', title: 'Collapse', type: 'item', icon: 'Build', url: '/dashboard/ui-elements/basic/collapse' },
            { id: 'tabs-pills', title: 'Tabs & Pills', type: 'item', icon: 'Build', url: '/dashboard/ui-elements/basic/tabs-pills' },
            { id: 'typography', title: 'Typography', type: 'item', icon: 'Build', url: '/dashboard/ui-elements/basic/typography' },
          ],
        },
      ],
    },

    // Static Pages
    {
      id: 'static-pages',
      title: 'Static Pages',
      type: 'group',
      icon: 'Pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'Lock',
          children: [
            { id: 'signin', title: 'Sign In', type: 'item', icon: 'Lock', url: '/auth/signin' },
            { id: 'signup', title: 'Sign Up', type: 'item', icon: 'Lock', url: '/auth/signup/signup1' },
            { id: 'forgot-password', title: 'Forgot Password', type: 'item', icon: 'Lock', url: '/auth/forgot-password' },
            { id: 'reset-password', title: 'Reset Password', type: 'item', icon: 'Lock', url: '/auth/reset-password/:token' },
          ],
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: 'Book',
          url: 'https://codedthemes.gitbook.io/datta/',
          external: true,
        },
      ],
    },
  ],
};

export default menuItems;

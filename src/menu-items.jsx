const menuItems = {
  items: [
    // Dashboard
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'group',
      icon: 'home',
      children: [
        {
          id: 'default',
          title: 'Overview',
          type: 'item',
          icon: 'activity',
          url: '/dashboard/default',
        }
      ]
    },

    // User Management
    {
      id: 'user-management',
      title: 'User Management',
      type: 'group',
      icon: 'users',
      children: [
        {
          id: 'account-list',
          title: 'Accounts',
          type: 'item',
          icon: 'users',
          url: '/dashboard/account/list',
        },
        {
          id: 'instructor-management',
          title: 'Instructors',
          type: 'collapse',
          icon: 'user',
          children: [
            {
              id: 'instructor-list',
              title: 'All Instructors',
              type: 'item',
              url: '/dashboard/instructor/list',
            },
            {
              id: 'pending-instructors',
              title: 'Pending Approval',
              type: 'item',
              url: '/dashboard/instructor/pending',
            }
          ]
        },
        {
          id: 'student-list',
          title: 'Students',
          type: 'item',
          icon: 'user',
          url: '/dashboard/student/list-student',
        }
      ]
    },

    // Content Management
    {
      id: 'content-management',
      title: 'Content Management',
      type: 'group',
      icon: 'book',
      children: [
        {
          id: 'category-list',
          title: 'Categories',
          type: 'item',
          icon: 'grid',
          url: '/dashboard/category/list-category',
        },
        {
          id: 'course-management',
          title: 'Courses',
          type: 'collapse',
          icon: 'book-open',
          children: [
            {
              id: 'course-list',
              title: 'All Courses',
              type: 'item',
              url: '/dashboard/course/list-course',
            },
            {
              id: 'pending-courses',
              title: 'Pending Approval',
              type: 'item',
              url: '/dashboard/course/pending-approval',
            }
          ]
        },
        {
          id: 'review-management',
          title: 'Reviews',
          type: 'collapse',
          icon: 'star',
          children: [
            {
              id: 'review-list',
              title: 'All Reviews',
              type: 'item',
              url: '/dashboard/reviews',
            },
            {
              id: 'review-statistics',
              title: 'Review Statistics',
              type: 'item',
              url: '/dashboard/reviews/statistics',
            }
          ]
        }
      ]
    },

    // Support
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: 'headphones',
      children: [
        {
          id: 'ticket-list',
          title: 'Support Tickets',
          type: 'item',
          icon: 'life-buoy',
          url: '/dashboard/ticket/list',
        },
        {
          id: 'notification-list',
          title: 'Notifications',
          type: 'item',
          icon: 'bell',
          url: '/dashboard/notification/list',
        }
      ]
    }
  ]
};

export default menuItems;
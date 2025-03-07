// src/menu-items/index.js
import {
  Home,
  Users,
  BookOpen,
  Grid,
  Star,
  MessageSquare,
  Bell,
  DollarSign,
  CreditCard,
  Briefcase,
  Settings,
  Wallet,
  BarChart2  // Add this import

} from 'lucide-react';

const menuItems = {
  items: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'group',
      children: [
        {
          id: 'dashboard-default',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard/default',
          icon: Home,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      type: 'group',
      children: [
        {
          id: 'account-list',
          title: 'Account List',
          type: 'item',
          url: '/dashboard/account/list',
          icon: Users,
          breadcrumbs: false
        },
        {
          id: 'student-list',
          title: 'Student List',
          type: 'item',
          url: '/dashboard/student/list-student',
          icon: Users,
          breadcrumbs: false
        },
        {
          id: 'instructor-list',
          title: 'Instructor List',
          type: 'item',
          url: '/dashboard/instructor/list',
          icon: Users,
          breadcrumbs: false
        },
        {
          id: 'pending-instructors',
          title: 'Pending Instructors',
          type: 'item',
          url: '/dashboard/instructor/pending',
          icon: Users,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'content-management',
      title: 'Content Management',
      type: 'group',
      children: [
        {
          id: 'category-list',
          title: 'Category List',
          type: 'item',
          url: '/dashboard/category/list-category',
          icon: BookOpen,
          breadcrumbs: false
        },
        {
          id: 'course-list',
          title: 'Course List',
          type: 'item',
          url: '/dashboard/course/list-course',
          icon: BookOpen,
          breadcrumbs: false
        },
        {
          id: 'pending-courses',
          title: 'Pending Courses',
          type: 'item',
          url: '/dashboard/course/pending-approval',
          icon: BookOpen,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'reviews',
      title: 'Reviews',
      type: 'group',
      children: [
        {
          id: 'review-list',
          title: 'Review List',
          type: 'item',
          url: '/dashboard/reviews',
          icon: Star,
          breadcrumbs: false
        },
        {
          id: 'review-statistics',
          title: 'Review Statistics',
          type: 'item',
          url: '/dashboard/reviews/statistics',
          icon: Star,
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: 'support',
    //   title: 'Support',
    //   type: 'group',
    //   children: [
    //     {
    //       id: 'ticket-list',
    //       title: 'Ticket List',
    //       type: 'item',
    //       url: '/dashboard/ticket/list',
    //       icon: MessageSquare,
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: 'notifications',
      title: 'Notifications',
      type: 'group',
      children: [
        {
          id: 'notification-list',
          title: 'Notifications',
          type: 'item',
          url: '/dashboard/notification/list',
          icon: Bell,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'financial-management',
      title: 'Financial Management',
      type: 'group',
      children: [
        {
          id: 'transaction-dashboard',
          title: 'Transaction Dashboard',
          type: 'item',
          url: '/dashboard/finance/transactions/dashboard',
          icon: BarChart2,  // This is commented out
          breadcrumbs: false
        },
        {
          id: 'student-transaction-list',
          title: 'Student Transactions',
          type: 'item',
          url: '/dashboard/finance/transactions/student-list',
          
          breadcrumbs: false
        },
        {
          id: 'transaction-statistics',
          title: 'Transaction Analytics',
          type: 'item',
          url: '/dashboard/finance/transactions/statistics',
          icon: Briefcase,
          breadcrumbs: false
        },
        {
          id: 'wallet-management',
          title: 'Wallet Management',
          type: 'item',
          url: '/dashboard/finance/wallets',
          icon: Wallet, // Use Wallet instead of AccountBalanceWallet
          breadcrumbs: false
        },
        {
          id: 'withdrawal-requests',
          title: 'Withdrawal Requests',
          type: 'item',
          url: '/dashboard/finance/withdrawals',
          icon: DollarSign, // Changed to DollarSign
          breadcrumbs: false
        },
        {
          id: 'payment-settings',
          title: 'Payment Settings',
          type: 'item',
          url: '/dashboard/finance/payment-settings',
          icon: Settings,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default menuItems;
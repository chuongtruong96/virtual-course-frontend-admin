// Model-specific colors and configurations
export const MODEL_COLORS = {
    accounts: {
      primary: 'rgba(54, 162, 235, 0.6)',    // Blue
      border: 'rgba(54, 162, 235, 1)',
      gradient: ['rgba(54, 162, 235, 0.6)', 'rgba(54, 162, 235, 0.2)'],
      icon: '👥',
      label: 'Accounts'
    },
    instructors: {
      primary: 'rgba(255, 99, 132, 0.6)',    // Red
      border: 'rgba(255, 99, 132, 1)',
      gradient: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 99, 132, 0.2)'],
      icon: '👨‍🏫',
      label: 'Instructors'
    },
    students: {
      primary: 'rgba(75, 192, 192, 0.6)',    // Teal
      border: 'rgba(75, 192, 192, 1)',
      gradient: ['rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.2)'],
      icon: '👨‍🎓',
      label: 'Students'
    },
    courses: {
      primary: 'rgba(255, 206, 86, 0.6)',    // Yellow
      border: 'rgba(255, 206, 86, 1)',
      gradient: ['rgba(255, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.2)'],
      icon: '📚',
      label: 'Courses'
    },
    categories: {
      primary: 'rgba(153, 102, 255, 0.6)',   // Purple
      border: 'rgba(153, 102, 255, 1)',
      gradient: ['rgba(153, 102, 255, 0.6)', 'rgba(153, 102, 255, 0.2)'],
      icon: '🏷️',
      label: 'Categories'
    }
  };
  
  // Colors for pie charts
  export const COLORS = [
    'rgba(54, 162, 235, 0.8)',   // Blue (Accounts)
    'rgba(255, 99, 132, 0.8)',   // Red (Instructors)
    'rgba(75, 192, 192, 0.8)',   // Teal (Students)
    'rgba(255, 206, 86, 0.8)',   // Yellow (Courses)
    'rgba(153, 102, 255, 0.8)',  // Purple (Categories)
    'rgba(255, 159, 64, 0.8)'    // Orange (Extra)
  ];
  
  export const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
        labels: {
          padding: 20,
          boxWidth: 10,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Statistics Overview',
        font: {
          size: 16,
          weight: 'bold',
          family: 'system-ui'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };
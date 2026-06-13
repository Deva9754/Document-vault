import {
  FiHome,
  FiFolder,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiCreditCard,
  FiRepeat,
  FiUser,
  FiSettings,
  FiInfo,
} from 'react-icons/fi'

export const mainNav = [{ label: 'Dashboard', path: '/dashboard', icon: FiHome }]

export const navGroups = [
  {
    label: 'Documents',
    icon: FiFolder,
    children: [
      { label: 'All Documents', path: '/documents', icon: FiFileText },
      { label: 'Aadhaar', path: '/documents/aadhaar', icon: FiFileText },
      { label: 'PAN', path: '/documents/pan', icon: FiFileText },
      { label: 'Passport', path: '/documents/passport', icon: FiFileText },
      {
        label: 'Driving License',
        path: '/documents/driving-license',
        icon: FiFileText,
      },
    ],
  },
  {
    label: 'Family',
    icon: FiUsers,
    children: [
      { label: 'Father', path: '/family/father', icon: FiUser },
      { label: 'Mother', path: '/family/mother', icon: FiUser },
      { label: 'Sister', path: '/family/sister', icon: FiUser },
    ],
  },
  {
    label: 'Finance',
    icon: FiDollarSign,
    children: [
      { label: 'Payslips', path: '/finance/payslips', icon: FiCreditCard },
      {
        label: 'Bank Statements',
        path: '/finance/bank-statements',
        icon: FiFileText,
      },
      {
        label: 'Transactions',
        path: '/finance/transactions',
        icon: FiRepeat,
      },
    ],
  },
]

export const bottomNav = [
  { label: 'Settings', path: '/settings', icon: FiSettings },
  { label: 'Info', path: '/settings', icon: FiInfo },
]

// Flattened list of all routable child items (for generating routes).
export const allNavItems = [
  ...mainNav,
  ...navGroups.flatMap((group) =>
    group.children.map((child) => ({ ...child, group: group.label }))
  ),
]

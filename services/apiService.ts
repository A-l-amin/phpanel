
import {
  WebsiteSettings,
  Banner,
  User,
  Subscription,
  FAQ,
  // Feedback removed
  GeneralSystemSettings,
  AppSettings,
  Server,
  DashboardStats,
  ChartDataPoint,
  ProtocolType,
  AuthUser, // Import AuthUser
} from '../types';
import { API_BASE_URL, DEFAULT_THEME } from '../constants';

const API_DELAY = 800; // Simulate network latency

// --- Mock Data Store ---
// mockWebsiteSettings removed as requested

let mockBanners: Banner[] = [
  { id: '1', imageUrl: 'https://picsum.photos/800/200?random=banner1', title: 'Summer Sale', description: 'Get 50% off all premium plans!', isActive: true },
  { id: '2', imageUrl: 'https://picsum.photos/800/200?random=banner2', title: 'New Server Locations', description: 'Experience faster speeds with our new servers.', isActive: false },
];

let mockUsers: User[] = [
  {
    id: 'user1', username: 'john.doe', email: 'john@example.com', subscriptionType: 'Premium', subscriptionEndDate: '2025-01-01', status: 'active',
    loginHistory: [{ timestamp: '2024-07-20 10:00', ipAddress: '192.168.1.1', device: 'Windows PC', location: 'USA' }],
    deviceInfo: [{ id: 'dev1', deviceType: 'PC', os: 'Windows 10', lastUsed: '2024-07-20' }]
  },
  {
    id: 'user2', username: 'jane.smith', email: 'jane@example.com', subscriptionType: 'Free', status: 'active',
    loginHistory: [{ timestamp: '2024-07-20 11:30', ipAddress: '10.0.0.5', device: 'Android Phone', location: 'Canada' }],
    deviceInfo: [{ id: 'dev2', deviceType: 'Mobile', os: 'Android 12', lastUsed: '2024-07-20' }]
  },
];

let mockSubscriptions: Subscription[] = [
  { id: 'sub1', name: 'Free Plan', duration: 'Free', price: 0, connectionLimit: 1, allowedProtocols: [ProtocolType.VMESS] },
  { id: 'sub2', name: 'Premium 30 Days', duration: '30 days', price: 5.99, connectionLimit: 5, allowedProtocols: [ProtocolType.VMESS, ProtocolType.WIREGUARD] },
  { id: 'sub3', name: 'Premium 1 Year', duration: '1 year', price: 49.99, connectionLimit: 10, allowedProtocols: Object.values(ProtocolType) },
];

let mockFAQs: FAQ[] = [
  { id: 'faq1', question: 'How do I connect?', answer: 'You can connect using our client application available for all major platforms.', order: 1 },
  { id: 'faq2', question: 'What protocols do you support?', answer: 'We support VMESS, WireGuard, IPSec EAP, IPSec PSK, OpenVPN UDP, and OpenVPN TCP.', order: 2 },
];

// mockFeedbacks removed as requested

let mockGeneralSettings: GeneralSystemSettings = {
  logoUrl: DEFAULT_THEME.logoUrl,
  primaryColor: DEFAULT_THEME.primaryColor,
  accentColor: DEFAULT_THEME.accentColor,
  apiBaseUrl: 'https://client-api.dxvpn.com', // API base URL for client app
  systemEmail: 'admin@dxvpn.com',
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpUsername: 'admin@example.com',
  smtpPassword: 'smtp_password_123',
  smtpEncryption: 'tls',
  maintenanceMode: false,
};

let mockAppSettings: AppSettings = {
  version: '1.0.0',
  updateNotes: 'Initial release with core VPN functionality.',
  forceUpdate: false,
  colorTheme: 'dark',
  appName: 'DX VPN Client',
};

let mockServers: Server[] = [
  {
    id: 'server1',
    name: 'USA - New York',
    location: 'USA',
    ipAddress: '1.1.1.1',
    hostname: 'us-ny.dxvpn.com',
    expiration: '2025-12-31',
    status: 'Online',
    isActive: true,
    protocols: {
      [ProtocolType.VMESS]: { uuid: 'vmess-ny-1', port: 443, alterId: 0, security: 'auto', network: 'ws', tls: true },
      [ProtocolType.WIREGUARD]: { publicKey: 'wg-pub-ny-1', privateKey: 'wg-priv-ny-1', endpoint: '1.1.1.1:51820', port: 51820, allowedIPs: '0.0.0.0/0' },
    },
  },
  {
    id: 'server2',
    name: 'Germany - Frankfurt',
    location: 'Germany',
    ipAddress: '2.2.2.2',
    hostname: 'de-fr.dxvpn.com',
    expiration: '2026-06-30',
    status: 'Online',
    isActive: true,
    protocols: {
      [ProtocolType.OPENVPN_UDP]: { port: 1194, protocol: 'udp', caCert: 'ca_cert_germany', serverCert: 'server_cert_germany', serverKey: 'server_key_germany', dhParams: 'dh_params_germany', clientToClient: true },
    },
  },
  {
    id: 'server3',
    name: 'Japan - Tokyo',
    location: 'Japan',
    ipAddress: '3.3.3.3',
    hostname: 'jp-tk.dxvpn.com',
    expiration: '2025-09-15',
    status: 'Offline',
    isActive: false,
    protocols: {
      [ProtocolType.IPSEC_EAP]: { username: 'ipsec-tokyo-user', password: 'ipsec-tokyo-pass', serverAddress: '3.3.3.3', secret: 'ipsec-tokyo-secret' },
    },
  },
];

// --- Mock Authentication State ---
let mockAuthUser: AuthUser | null = null;
const MOCK_ADMIN_USERNAME = 'admin';
const MOCK_ADMIN_PASSWORD = 'admin'; // Changed from 'password' to 'admin'
// In a real app, this would be hashed

// --- Generic API Helper ---
const simulateApiCall = <T>(data: T, success = true): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(JSON.parse(JSON.stringify(data))); // Deep clone to prevent mutation issues
      } else {
        reject(new Error('API call failed.'));
      }
    }, API_DELAY);
  });
};

const generateId = (): string => Math.random().toString(36).substring(2, 11);

// --- Auth API ---
export const login = async (username: string, password: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.trim() === MOCK_ADMIN_USERNAME && password.trim() === MOCK_ADMIN_PASSWORD) {
        const user: AuthUser = { id: 'admin-id-1', username: MOCK_ADMIN_USERNAME, token: 'mock-jwt-token' };
        mockAuthUser = user;
        localStorage.setItem('dxVpnAdminAuth', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, API_DELAY);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAuthUser = null;
      localStorage.removeItem('dxVpnAdminAuth');
      resolve();
    }, API_DELAY);
  });
};

export const checkAuth = async (): Promise<AuthUser | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockAuthUser) {
        resolve(mockAuthUser);
      } else {
        const storedAuth = localStorage.getItem('dxVpnAdminAuth');
        if (storedAuth) {
          mockAuthUser = JSON.parse(storedAuth);
          resolve(mockAuthUser);
        } else {
          resolve(null);
        }
      }
    }, API_DELAY / 2); // Faster check for initial load
  });
};


// --- Dashboard API ---
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const stats: DashboardStats = {
    totalUsers: mockUsers.length,
    activePremiumUsers: mockUsers.filter(u => u.subscriptionType === 'Premium' && u.status === 'active').length,
    freeUsers: mockUsers.filter(u => u.subscriptionType === 'Free' && u.status === 'active').length,
    totalServers: mockServers.length,
    onlineServers: mockServers.filter(s => s.status === 'Online').length,
    offlineServers: mockServers.filter(s => s.status === 'Offline').length,
    totalConnections: 12345, // Mock value
  };
  return simulateApiCall(stats);
};

export const getActiveConnectionsToday = async (): Promise<ChartDataPoint[]> => {
  const data: ChartDataPoint[] = [
    { name: '08:00', value: 150 },
    { name: '09:00', value: 220 },
    { name: '10:00', value: 300 },
    { name: '11:00', value: 280 },
    { name: '12:00', value: 350 },
    { name: '13:00', value: 420 },
    { name: '14:00', value: 390 },
    { name: '15:00', value: 450 },
    { name: '16:00', value: 500 },
    { name: '17:00', value: 480 },
  ];
  return simulateApiCall(data);
};

export const getNewUsersThisWeek = async (): Promise<ChartDataPoint[]> => {
  const data: ChartDataPoint[] = [
    { name: 'Mon', value: 5 },
    { name: 'Tue', value: 8 },
    { name: 'Wed', value: 12 },
    { name: 'Thu', value: 7 },
    { name: 'Fri', value: 15 },
    { name: 'Sat', value: 10 },
    { name: 'Sun', value: 18 },
  ];
  return simulateApiCall(data);
};

// --- Website Manage API (Removed as requested) ---
// export const getWebsiteSettings = async (): Promise<WebsiteSettings> => { /* ... */ };
// export const updateWebsiteSettings = async (settings: WebsiteSettings): Promise<WebsiteSettings> => { /* ... */ };

// --- Banner API ---
export const getBanners = async (): Promise<Banner[]> => {
  return simulateApiCall(mockBanners);
};

export const addBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
  const newBanner: Banner = { ...banner, id: generateId() };
  mockBanners.push(newBanner);
  return simulateApiCall(newBanner);
};

export const updateBanner = async (updatedBanner: Banner): Promise<Banner> => {
  mockBanners = mockBanners.map(b => (b.id === updatedBanner.id ? updatedBanner : b));
  return simulateApiCall(updatedBanner);
};

export const deleteBanner = async (id: string): Promise<void> => {
  mockBanners = mockBanners.filter(b => b.id !== id);
  return simulateApiCall(undefined);
};

// --- User API ---
export const getUsers = async (): Promise<User[]> => {
  return simulateApiCall(mockUsers);
};

export const addUser = async (user: Omit<User, 'id' | 'loginHistory' | 'deviceInfo'>): Promise<User> => {
  const newUser: User = { ...user, id: generateId(), loginHistory: [], deviceInfo: [] };
  mockUsers.push(newUser);
  return simulateApiCall(newUser);
};

export const updateUser = async (updatedUser: User): Promise<User> => {
  mockUsers = mockUsers.map(u => (u.id === updatedUser.id ? updatedUser : u));
  return simulateApiCall(updatedUser);
};

export const deleteUser = async (id: string): Promise<void> => {
  mockUsers = mockUsers.filter(u => u.id !== id);
  return simulateApiCall(undefined);
};

export const resetUserPassword = async (userId: string): Promise<void> => {
  console.log(`Simulating password reset for user: ${userId}`);
  return simulateApiCall(undefined);
};

export const getUserLogs = async (userId: string): Promise<User['loginHistory']> => {
  const user = mockUsers.find(u => u.id === userId);
  return simulateApiCall(user ? user.loginHistory : []);
};

export const getUserDevices = async (userId: string): Promise<User['deviceInfo']> => {
  const user = mockUsers.find(u => u.id === userId);
  return simulateApiCall(user ? user.deviceInfo : []);
};

// --- Subscription API ---
export const getSubscriptions = async (): Promise<Subscription[]> => {
  return simulateApiCall(mockSubscriptions);
};

export const addSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const newSubscription: Subscription = { ...subscription, id: generateId() };
  mockSubscriptions.push(newSubscription);
  return simulateApiCall(newSubscription);
};

export const updateSubscription = async (updatedSubscription: Subscription): Promise<Subscription> => {
  mockSubscriptions = mockSubscriptions.map(s => (s.id === updatedSubscription.id ? updatedSubscription : s));
  return simulateApiCall(updatedSubscription);
};

export const deleteSubscription = async (id: string): Promise<void> => {
  mockSubscriptions = mockSubscriptions.filter(s => s.id !== id);
  return simulateApiCall(undefined);
};

// --- FAQ API ---
export const getFAQs = async (): Promise<FAQ[]> => {
  return simulateApiCall([...mockFAQs].sort((a, b) => a.order - b.order));
};

export const addFAQ = async (faq: Omit<FAQ, 'id' | 'order'>): Promise<FAQ> => {
  const newFAQ: FAQ = { ...faq, id: generateId(), order: mockFAQs.length + 1 };
  mockFAQs.push(newFAQ);
  return simulateApiCall(newFAQ);
};

export const updateFAQ = async (updatedFAQ: FAQ): Promise<FAQ> => {
  mockFAQs = mockFAQs.map(f => (f.id === updatedFAQ.id ? updatedFAQ : f));
  return simulateApiCall(updatedFAQ);
};

export const deleteFAQ = async (id: string): Promise<void> => {
  mockFAQs = mockFAQs.filter(f => f.id !== id);
  // Re-order remaining FAQs
  mockFAQs.forEach((f, index) => f.order = index + 1);
  return simulateApiCall(undefined);
};

export const updateFAQOrder = async (faqs: FAQ[]): Promise<FAQ[]> => {
  mockFAQs = faqs.map((faq, index) => ({ ...faq, order: index + 1 }));
  return simulateApiCall(mockFAQs);
};

// --- Feedback API (Removed as requested) ---
// export const getFeedbacks = async (): Promise<Feedback[]> => { /* ... */ };
// export const updateFeedback = async (updatedFeedback: Feedback): Promise<Feedback> => { /* ... */ };
// export const deleteFeedback = async (id: string): Promise<void> => { /* ... */ };

// --- General Settings API ---
export const getGeneralSettings = async (): Promise<GeneralSystemSettings> => {
  return simulateApiCall(mockGeneralSettings);
};

export const updateGeneralSettings = async (settings: GeneralSystemSettings): Promise<GeneralSystemSettings> => {
  mockGeneralSettings = { ...settings };
  return simulateApiCall(mockGeneralSettings);
};

// --- App API ---
export const getAppSettings = async (): Promise<AppSettings> => {
  return simulateApiCall(mockAppSettings);
};

export const updateAppSettings = async (settings: AppSettings): Promise<AppSettings> => {
  mockAppSettings = { ...settings };
  return simulateApiCall(mockAppSettings);
};

// --- Server API ---
export const getServers = async (): Promise<Server[]> => {
  return simulateApiCall(mockServers);
};

export const addServer = async (server: Omit<Server, 'id'>): Promise<Server> => {
  const newServer: Server = {
    ...server,
    id: generateId(),
    status: server.status || 'Offline', // Ensure default status
    isActive: server.isActive ?? true,   // Ensure default isActive
    protocols: server.protocols || {},   // Ensure default protocols object
    hostname: server.hostname || '',     // Ensure default hostname
    expiration: server.expiration || '', // Ensure default expiration
  };
  mockServers.push(newServer);
  return simulateApiCall(newServer);
};

export const updateServer = async (updatedServer: Server): Promise<Server> => {
  mockServers = mockServers.map(s => (s.id === updatedServer.id ? updatedServer : s));
  return simulateApiCall(updatedServer);
};

export const deleteServer = async (id: string): Promise<void> => {
  mockServers = mockServers.filter(s => s.id !== id);
  return simulateApiCall(undefined);
};

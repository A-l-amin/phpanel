export enum Page {
  Dashboard = 'Dashboard',
  // WebsiteManage removed as requested
  Banner = 'Banner', // Renamed from BannerManagement
  User = 'User', // Renamed from UserManagement
  Subscription = 'Subscription', // Renamed from SubscriptionManagement
  FAQ = 'FAQ', // Renamed from FAQManager
  // FeedbackManager removed as requested
  Settings = 'Settings', // Renamed from GeneralSettings
  App = 'App', // Renamed from AppManage
  Server = 'Server', // Renamed from ServerManagement
  Login = 'Login', // New page for admin login
}

export interface ThemeSettings {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  subscriptionType: 'Free' | 'Premium';
  subscriptionEndDate?: string;
  status: 'active' | 'inactive';
  loginHistory: UserLog[];
  deviceInfo: UserDeviceInfo[];
}

export interface UserLog {
  timestamp: string;
  ipAddress: string;
  device: string;
  location: string;
}

export interface UserDeviceInfo {
  id: string;
  deviceType: string;
  os: string;
  lastUsed: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  duration: '7 days' | '30 days' | '90 days' | '180 days' | '1 year' | 'Free';
  price: number; // 0 for free
  connectionLimit: number;
  allowedProtocols: ProtocolType[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Feedback {
  id: string;
  userId: string;
  username: string;
  feedbackText: string;
  date: string;
  isResolved: boolean;
}

export enum ProtocolType {
  VMESS = 'VMESS',
  WIREGUARD = 'WIREGUARD',
  IPSEC_EAP = 'IPSEC EAP',
  IPSEC_PSK = 'IPSEC PSK',
  OPENVPN_UDP = 'OPENVPN UDP',
  OPENVPN_TCP = 'OPENVPN TCP',
}

export interface VmessConfig {
  uuid: string;
  port: number;
  alterId: number;
  security: string;
  network: string;
  host?: string;
  path?: string;
  tls: boolean;
}

export interface WireguardConfig {
  publicKey: string;
  privateKey: string;
  endpoint: string;
  port: number;
  allowedIPs: string;
  dns?: string;
}

export interface IpsecEapConfig {
  username: string;
  password: string;
  serverAddress: string;
  secret: string;
}

export interface IpsecPskConfig {
  psk: string;
  serverAddress: string;
}

export interface OpenvpnConfig {
  port: number;
  protocol: 'udp' | 'tcp';
  caCert: string;
  serverCert: string;
  serverKey: string;
  dhParams: string;
  clientToClient: boolean;
}

export interface Server {
  id: string;
  name: string;
  location: string; // Used for Country
  ipAddress: string;
  hostname?: string; // New field for server hostname
  expiration?: string; // New field for server expiration date (e.g., 'YYYY-MM-DD')
  status: 'Online' | 'Offline';
  isActive: boolean;
  protocols: {
    [ProtocolType.VMESS]?: VmessConfig;
    [ProtocolType.WIREGUARD]?: WireguardConfig;
    [ProtocolType.IPSEC_EAP]?: IpsecEapConfig;
    [ProtocolType.IPSEC_PSK]?: IpsecPskConfig;
    [ProtocolType.OPENVPN_UDP]?: OpenvpnConfig;
    [ProtocolType.OPENVPN_TCP]?: OpenvpnConfig;
  };
}

export interface WebsiteSettings {
  homeTitle: string;
  homeDescription: string;
  footerText: string;
  contactEmail: string;
  termsAndPrivacy: string;
}

export interface GeneralSystemSettings {
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  apiBaseUrl: string;
  systemEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: 'none' | 'tls' | 'ssl';
  maintenanceMode: boolean;
}

export interface AppSettings {
  version: string;
  updateNotes: string;
  forceUpdate: boolean;
  colorTheme: string; // e.g., 'dark', 'light', 'blue-neon'
  appName: string;
}

// Stats for Dashboard
export interface DashboardStats {
  totalUsers: number;
  activePremiumUsers: number;
  freeUsers: number;
  totalServers: number;
  onlineServers: number;
  offlineServers: number;
  totalConnections: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface AuthUser {
  id: string;
  username: string;
  token: string;
}

import { Page, ProtocolType } from './types';

export const API_BASE_URL = 'http://localhost:8000/api'; // Placeholder for PHP backend API

export const DEFAULT_THEME = {
  isDarkMode: true,
  primaryColor: '#8b5cf6', // Purple 500
  accentColor: '#00BFFF', // Neon Cyan
  logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTYwIDMwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9ImN1cnJlbnRDb2xvciI+PHRleHQgeD0iMCIgeT0iMjQiIGZvbnQtZmFtaWx5PSJJbnRlciwg sans-serif\" font-size=\"24\" font-weight=\"bold\">DX VPN</text></svg>', // DX VPN Logo SVG
};

export const MENU_ITEMS = [
  { name: Page.Dashboard, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-.375a1.125 1.125 0 0 0-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125H12M12 16.5h8.25c.621 0 1.125-.504 1.125-1.125V3.75c0-.621-.504-1.125-1.125-1.125H12M12 16.5L10.5 19.5h11.25M12 16.5l-6.75 3.75h11.25"/></svg>` },
  // WebsiteManage is removed
  { name: Page.Banner, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0h.008v.008h-.008ZM12 7.5h.008v.008H12Zm-.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>` },
  { name: Page.User, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>` },
  { name: Page.Subscription, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659L9 9.182m5.75 1.0605a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"/></svg>` },
  { name: Page.FAQ, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712L12 15l-2.121-2.121c-1.172-1.025-1.172-2.687 0-3.712ZM9.375 16.299V18c0 .414.336.75.75.75h4.75a.75.75 0 0 0 .75-.75v-1.701M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>` },
  // FeedbackManager is removed
  { name: Page.Settings, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.17.992c.032.185.17.34.34.44l.805.483c.413.247.608.769.48 1.213l-.274.914a1.25 1.25 0 0 1-.76 1.064l-.63.378c-.18.108-.293.308-.293.52v.83c0 .212.113.412.293.52l.63.378c.35.21.56.59.49.988l-.275.914c-.12.444-.516.766-.929.983l-.805.483c-.17.1-.307.255-.34.44l-.17.992c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.17-.992a1.104 1.104 0 0 0-.34-.44l-.805-.483c-.413-.247-.608-.769-.48-1.213l.274-.914a1.25 1.25 0 0 0 .76-1.064l.63-.378a.95.95 0 0 0 .293-.52v-.83a.95.95 0 0 0-.293-.52l-.63-.378a1.25 1.25 0 0 0-.76-1.064l-.275-.914c-.12-.444-.02-1.02.49-.988l.805.483a1.104 1.104 0 0 0 .34-.44l.17-.992ZM12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"/></svg>` },
  { name: Page.App, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5H13.5m-3 0V3m0-1.5h3m-3 0h3M9 18.75h3"/></svg>` },
  { name: Page.Server, icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>` },
];

export const PROTOCOL_OPTIONS = [
  { label: 'VMESS', value: ProtocolType.VMESS },
  { label: 'WireGuard', value: ProtocolType.WIREGUARD },
  { label: 'IPSec EAP', value: ProtocolType.IPSEC_EAP },
  { label: 'IPSec PSK', value: ProtocolType.IPSEC_PSK },
  { label: 'OpenVPN UDP', value: ProtocolType.OPENVPN_UDP },
  { label: 'OpenVPN TCP', value: ProtocolType.OPENVPN_TCP },
];

export const SUBSCRIPTION_DURATIONS = ['Free', '7 days', '30 days', '90 days', '180 days', '1 year'];
export const SMTP_ENCRYPTION_OPTIONS = ['none', 'tls', 'ssl'];

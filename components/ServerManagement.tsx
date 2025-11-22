import React, { useState, useEffect } from 'react';
import { Server, ProtocolType, VmessConfig, WireguardConfig, IpsecEapConfig, IpsecPskConfig, OpenvpnConfig } from '../types';
import { getServers, addServer, updateServer, deleteServer } from '../services/apiService';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Card } from './common/Card';
import { Toggle } from './common/Toggle';
import { PROTOCOL_OPTIONS } from '../constants';

// Rename component from 'Server' to 'ServerPage' to avoid name collision with 'Server' interface
export const ServerPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<Partial<Server> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const fetchedServers = await getServers();
      setServers(fetchedServers);
    } catch (err) {
      setError('Failed to fetch servers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddServer = () => {
    setCurrentServer({
      name: '',
      location: '', // For Country
      ipAddress: '',
      hostname: '', // New field
      expiration: '', // New field
      status: 'Offline',
      isActive: true,
      protocols: {},
    });
    setIsModalOpen(true);
  };

  const handleEditServer = (server: Server) => {
    setCurrentServer(server);
    setIsModalOpen(true);
  };

  const handleDeleteServer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      try {
        await deleteServer(id);
        fetchServers();
      } catch (err) {
        setError('Failed to delete server.');
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentServer(null);
    setSaving(false);
  };

  const handleProtocolToggle = (protocol: ProtocolType, checked: boolean) => {
    setCurrentServer(prev => {
      if (!prev) return prev;
      const newProtocols = { ...prev.protocols };
      if (checked) {
        // Initialize with default/empty config
        switch (protocol) {
          case ProtocolType.VMESS:
            newProtocols[protocol] = { uuid: '', port: 443, alterId: 0, security: 'auto', network: 'ws', tls: true };
            break;
          case ProtocolType.WIREGUARD:
            newProtocols[protocol] = { publicKey: '', privateKey: '', endpoint: '', port: 51820, allowedIPs: '0.0.0.0/0' };
            break;
          case ProtocolType.IPSEC_EAP:
            newProtocols[protocol] = { username: '', password: '', serverAddress: '', secret: '' };
            break;
          case ProtocolType.IPSEC_PSK:
            newProtocols[protocol] = { psk: '', serverAddress: '' };
            break;
          case ProtocolType.OPENVPN_UDP:
          case ProtocolType.OPENVPN_TCP:
            newProtocols[protocol] = { port: 1194, protocol: protocol === ProtocolType.OPENVPN_UDP ? 'udp' : 'tcp', caCert: '', serverCert: '', serverKey: '', dhParams: '', clientToClient: false };
            break;
        }
      } else {
        delete newProtocols[protocol];
      }
      return { ...prev, protocols: newProtocols };
    });
  };

  const handleProtocolConfigChange = (protocol: ProtocolType, field: string, value: string | number | boolean) => {
    setCurrentServer(prev => {
      if (!prev || !prev.protocols?.[protocol]) return prev;
      const newProtocols = {
        ...prev.protocols,
        [protocol]: {
          ...prev.protocols[protocol],
          [field]: value,
        },
      };
      return { ...prev, protocols: newProtocols };
    });
  };


  const handleSaveServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentServer?.name || !currentServer?.location || !currentServer?.ipAddress || !currentServer?.hostname) {
      alert('Name, Country, IP Address, and Hostname are required.');
      return;
    }
    setSaving(true);
    try {
      const serverToSave = {
        ...currentServer,
        status: currentServer.status || 'Offline',
        isActive: currentServer.isActive ?? true,
        protocols: currentServer.protocols || {},
      } as Server;

      if (serverToSave.id) {
        await updateServer(serverToSave);
      } else {
        await addServer(serverToSave);
      }
      fetchServers();
      handleModalClose();
    } catch (err) {
      setError('Failed to save server.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-darkText">
        Loading Servers...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-darkText">Server</h2>

      <div className="flex justify-end mb-6">
        <Button onClick={handleAddServer} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add New Server
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-darkBorder">
            <thead className="bg-darkBg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Country
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Hostname
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Expiration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Protocols
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {servers.map((server) => (
                <tr key={server.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{server.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{server.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{server.ipAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{server.hostname || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-darkText">{server.expiration || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        server.status === 'Online' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}
                    >
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        server.isActive ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                    >
                      {server.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(server.protocols).map(p => (
                        <span key={p} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                          {p.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="secondary" size="sm" onClick={() => handleEditServer(server)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteServer(server.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={currentServer?.id ? 'Edit Server' : 'Add New Server'}
        size="xl"
        footer={
          <Button type="submit" loading={saving} form="server-form">
            {saving ? 'Saving...' : 'Save Server'}
          </Button>
        }
      >
        <form id="server-form" onSubmit={handleSaveServer}>
          <h3 className="text-xl font-semibold mb-4 text-darkText">Server Details</h3>
          <Input
            id="name"
            label="Server Name"
            value={currentServer?.name || ''}
            onChange={(e) => setCurrentServer({ ...currentServer, name: e.target.value })}
            placeholder="e.g., USA - New York"
            required
          />
          <Input
            id="location"
            label="Country"
            value={currentServer?.location || ''}
            onChange={(e) => setCurrentServer({ ...currentServer, location: e.target.value })}
            placeholder="e.g., United States"
            required
          />
          <Input
            id="ipAddress"
            label="IP Address"
            value={currentServer?.ipAddress || ''}
            onChange={(e) => setCurrentServer({ ...currentServer, ipAddress: e.target.value })}
            placeholder="e.g., 1.1.1.1"
            required
          />
          <Input
            id="hostname"
            label="Hostname"
            value={currentServer?.hostname || ''}
            onChange={(e) => setCurrentServer({ ...currentServer, hostname: e.target.value })}
            placeholder="e.g., us-ny.dxvpn.com"
            required
          />
          <Input
            id="expiration"
            label="Expiration Date"
            type="date"
            value={currentServer?.expiration || ''}
            onChange={(e) => setCurrentServer({ ...currentServer, expiration: e.target.value })}
          />
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-darkText">
              Status
            </label>
            <select
              id="status"
              value={currentServer?.status || 'Offline'}
              onChange={(e) => setCurrentServer({ ...currentServer, status: e.target.value as 'Online' | 'Offline' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-darkCard dark:border-darkBorder dark:text-darkText"
              required
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <Toggle
            id="isActive"
            label="Active Server"
            checked={currentServer?.isActive ?? true}
            onChange={(checked) => setCurrentServer({ ...currentServer, isActive: checked })}
            className="mt-4 mb-6"
          />

          <h3 className="text-xl font-semibold mb-4 text-darkText">Protocol Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROTOCOL_OPTIONS.map(protocolOption => {
              const protocolType = protocolOption.value;
              const protocolEnabled = currentServer?.protocols?.[protocolType] !== undefined;
              const config = currentServer?.protocols?.[protocolType];

              return (
                <div key={protocolType} className="border border-darkBorder rounded-lg p-4 bg-darkBg">
                  <Toggle
                    id={`toggle-${protocolType}`}
                    label={protocolOption.label}
                    checked={protocolEnabled}
                    onChange={(checked) => handleProtocolToggle(protocolType, checked)}
                    className="mb-4"
                  />
                  {protocolEnabled && (
                    <div className="space-y-3">
                      {protocolType === ProtocolType.VMESS && (config as VmessConfig) && (
                        <>
                          <Input label="UUID (Username)" id={`vmess-uuid`} value={config.uuid} onChange={(e) => handleProtocolConfigChange(protocolType, 'uuid', e.target.value)} />
                          <Input label="Port" id={`vmess-port`} type="number" value={config.port} onChange={(e) => handleProtocolConfigChange(protocolType, 'port', parseInt(e.target.value))} />
                          <Input label="Alter ID (Password part)" id={`vmess-alterId`} type="number" value={config.alterId} onChange={(e) => handleProtocolConfigChange(protocolType, 'alterId', parseInt(e.target.value))} />
                          <Input label="Security" id={`vmess-security`} value={config.security} onChange={(e) => handleProtocolConfigChange(protocolType, 'security', e.target.value)} />
                          <Input label="Network" id={`vmess-network`} value={config.network} onChange={(e) => handleProtocolConfigChange(protocolType, 'network', e.target.value)} />
                          <Input label="Host (Optional)" id={`vmess-host`} value={config.host || ''} onChange={(e) => handleProtocolConfigChange(protocolType, 'host', e.target.value)} />
                          <Input label="Path (Optional)" id={`vmess-path`} value={config.path || ''} onChange={(e) => handleProtocolConfigChange(protocolType, 'path', e.target.value)} />
                          <Toggle label="TLS Enabled" id={`vmess-tls`} checked={config.tls} onChange={(checked) => handleProtocolConfigChange(protocolType, 'tls', checked)} />
                        </>
                      )}
                      {protocolType === ProtocolType.WIREGUARD && (config as WireguardConfig) && (
                        <>
                          <Input label="Public Key (Certificate)" id={`wg-publicKey`} value={config.publicKey} onChange={(e) => handleProtocolConfigChange(protocolType, 'publicKey', e.target.value)} />
                          <Input label="Private Key" id={`wg-privateKey`} value={config.privateKey} onChange={(e) => handleProtocolConfigChange(protocolType, 'privateKey', e.target.value)} />
                          <Input label="Endpoint (Server Address)" id={`wg-endpoint`} value={config.endpoint} onChange={(e) => handleProtocolConfigChange(protocolType, 'endpoint', e.target.value)} />
                          <Input label="Port" id={`wg-port`} type="number" value={config.port} onChange={(e) => handleProtocolConfigChange(protocolType, 'port', parseInt(e.target.value))} />
                          <Input label="Allowed IPs" id={`wg-allowedIPs`} value={config.allowedIPs} onChange={(e) => handleProtocolConfigChange(protocolType, 'allowedIPs', e.target.value)} />
                          <Input label="DNS (Optional)" id={`wg-dns`} value={config.dns || ''} onChange={(e) => handleProtocolConfigChange(protocolType, 'dns', e.target.value)} />
                        </>
                      )}
                      {(protocolType === ProtocolType.OPENVPN_UDP || protocolType === ProtocolType.OPENVPN_TCP) && (config as OpenvpnConfig) && (
                        <>
                          <Input label="Port" id={`ovpn-port`} type="number" value={config.port} onChange={(e) => handleProtocolConfigChange(protocolType, 'port', parseInt(e.target.value))} />
                          <Input label="CA Certificate" id={`ovpn-caCert`} value={config.caCert} onChange={(e) => handleProtocolConfigChange(protocolType, 'caCert', e.target.value)} />
                          <Input label="Server Certificate" id={`ovpn-serverCert`} value={config.serverCert} onChange={(e) => handleProtocolConfigChange(protocolType, 'serverCert', e.target.value)} />
                          <Input label="Server Key" id={`ovpn-serverKey`} value={config.serverKey} onChange={(e) => handleProtocolConfigChange(protocolType, 'serverKey', e.target.value)} />
                          <Input label="DH Params" id={`ovpn-dhParams`} value={config.dhParams} onChange={(e) => handleProtocolConfigChange(protocolType, 'dhParams', e.target.value)} />
                          <Toggle label="Client to Client" id={`ovpn-clientToClient`} checked={config.clientToClient} onChange={(checked) => handleProtocolConfigChange(protocolType, 'clientToClient', checked)} />
                        </>
                      )}
                      {protocolType === ProtocolType.IPSEC_EAP && (config as IpsecEapConfig) && (
                        <>
                          <Input label="Username" id={`ipsec-eap-username`} value={config.username} onChange={(e) => handleProtocolConfigChange(protocolType, 'username', e.target.value)} />
                          <Input label="Password" id={`ipsec-eap-password`} type="password" value={config.password} onChange={(e) => handleProtocolConfigChange(protocolType, 'password', e.target.value)} />
                          <Input label="Server Address" id={`ipsec-eap-serverAddress`} value={config.serverAddress} onChange={(e) => handleProtocolConfigChange(protocolType, 'serverAddress', e.target.value)} />
                          <Input label="Secret" id={`ipsec-eap-secret`} value={config.secret} onChange={(e) => handleProtocolConfigChange(protocolType, 'secret', e.target.value)} />
                        </>
                      )}
                      {protocolType === ProtocolType.IPSEC_PSK && (config as IpsecPskConfig) && (
                        <>
                          <Input label="PSK (Pre-Shared Key)" id={`ipsec-psk-psk`} value={config.psk} onChange={(e) => handleProtocolConfigChange(protocolType, 'psk', e.target.value)} />
                          <Input label="Server Address" id={`ipsec-psk-serverAddress`} value={config.serverAddress} onChange={(e) => handleProtocolConfigChange(protocolType, 'serverAddress', e.target.value)} />
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </form>
      </Modal>
    </div>
  );
};
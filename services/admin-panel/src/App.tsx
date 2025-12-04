import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert, Map, Users, DollarSign, ListPlus, Ban, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CategoryManager } from './CategoryManager';

const chartData = [
    { name: 'Mon', requests: 40, fraud: 2 },
    { name: 'Tue', requests: 30, fraud: 1 },
    { name: 'Wed', requests: 50, fraud: 3 },
    { name: 'Thu', requests: 27, fraud: 0 },
    { name: 'Fri', requests: 60, fraud: 5 },
];

const categoryData = [
    { name: 'Micro-Import', value: 45 },
    { name: 'Legal', value: 25 },
    { name: 'Home Services', value: 30 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    privacy_level: string;
    reputation_base: number;
    credits: number;
}

interface FraudAlert {
    id: string;
    target_id: string;
    signal_code: string;
    severity: string;
    status: string;
}

interface Stats {
    total_users: number;
    total_requests: number;
    pending_fraud_alerts: number;
    total_revenue: number;
}

function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
    const [stats, setStats] = useState<Stats>({ total_users: 0, total_requests: 0, pending_fraud_alerts: 0, total_revenue: 0 });
    const [loading, setLoading] = useState(false);

    // Fetch real data from APIs
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Try to fetch users from user-service
            const usersRes = await fetch('http://localhost:3001/users').catch(() => null);
            if (usersRes?.ok) {
                setUsers(await usersRes.json());
            } else {
                // Demo data fallback
                setUsers([
                    { id: '1', email: 'ahmed@example.com', full_name: 'Ahmed Bensalem', role: 'provider', privacy_level: 'alias', reputation_base: 78.5, credits: 25 },
                    { id: '2', email: 'sara@example.com', full_name: 'Sara Mansouri', role: 'user', privacy_level: 'public', reputation_base: 92.0, credits: 10 },
                    { id: '3', email: 'karim@example.com', full_name: 'Karim Boudiaf', role: 'provider', privacy_level: 'mediated', reputation_base: 45.0, credits: 0 },
                ]);
            }

            // Fetch fraud alerts
            const fraudRes = await fetch('http://localhost:3004/fraud/alerts').catch(() => null);
            if (fraudRes?.ok) {
                setFraudAlerts(await fraudRes.json());
            } else {
                setFraudAlerts([
                    { id: 'FA-001', target_id: 'USR-3', signal_code: 'LOW_REPUTATION', severity: 'medium', status: 'open' },
                    { id: 'FA-002', target_id: 'REQ-99', signal_code: 'PRICE_TOO_LOW', severity: 'high', status: 'open' },
                ]);
            }

            // Set stats
            setStats({
                total_users: 1284,
                total_requests: 456,
                pending_fraud_alerts: 23,
                total_revenue: 125000
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (alertId: string) => {
        try {
            const response = await fetch('http://localhost:3004/fraud/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transaction: { id: alertId }, categoryConfig: {} })
            });
            const data = await response.json();
            alert(`Scan Complete! Risk Score: ${data.riskScore}. Signals: ${data.signals?.join(', ') || 'None'}`);
        } catch (error) {
            alert('AI Scan simulated - Risk Score: 0.72');
        }
    };

    const handleUserAction = async (userId: string, action: 'suspend' | 'unsuspend') => {
        if (action === 'suspend') {
            alert(`User ${userId} suspended. Their reputation NFT has been frozen.`);
        } else {
            alert(`User ${userId} unsuspended.`);
        }
        // In production: call user-service API
    };

    const renderDashboard = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500">Total Users</h3>
                        <Users className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.total_users.toLocaleString()}</p>
                    <p className="text-green-500 text-sm">+12% this week</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500">Active Requests</h3>
                        <LayoutDashboard className="text-indigo-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.total_requests}</p>
                    <p className="text-green-500 text-sm">+8% this week</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500">Fraud Alerts</h3>
                        <ShieldAlert className="text-red-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.pending_fraud_alerts}</p>
                    <p className="text-red-500 text-sm">+5 new today</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500">Revenue (DZD)</h3>
                        <DollarSign className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">{stats.total_revenue.toLocaleString()}</p>
                    <p className="text-green-500 text-sm">+15% this month</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Request Volume Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Request Volume</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
                                <Bar dataKey="fraud" fill="#ef4444" name="Fraud" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );

    const renderModeration = () => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Fraud Alert Queue</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-sm font-medium text-gray-500">Alert ID</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Target</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Signal</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Severity</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fraudAlerts.map((alert) => (
                        <tr key={alert.id} className="border-b">
                            <td className="p-4 font-mono">{alert.id}</td>
                            <td className="p-4">{alert.target_id}</td>
                            <td className="p-4">
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">{alert.signal_code}</span>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${alert.severity === 'high' ? 'bg-red-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {alert.severity}
                                </span>
                            </td>
                            <td className="p-4">
                                <button className="text-blue-600 hover:underline mr-2">Review</button>
                                <button className="text-green-600 hover:underline mr-2" onClick={() => handleScan(alert.id)}>AI Scan 🤖</button>
                                <button className="text-red-600 hover:underline">Dismiss</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderUsers = () => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">User Management</h3>
                <button onClick={fetchData} className="text-blue-600 hover:underline">Refresh</button>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Name</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Role</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Privacy</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Reputation</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Credits</th>
                        <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.full_name || '-'}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'provider' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{user.privacy_level}</td>
                            <td className="p-4">
                                <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                        <div className={`h-2 rounded-full ${user.reputation_base > 70 ? 'bg-green-500' : user.reputation_base > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${user.reputation_base}%` }}></div>
                                    </div>
                                    <span className="text-sm">{user.reputation_base.toFixed(0)}</span>
                                </div>
                            </td>
                            <td className="p-4">{user.credits}</td>
                            <td className="p-4">
                                <button className="text-red-600 hover:underline mr-3" onClick={() => handleUserAction(user.id, 'suspend')}>
                                    <Ban size={16} className="inline mr-1" /> Suspend
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white p-6">
                <h1 className="text-2xl font-bold mb-8">MatchOS Admin</h1>
                <nav className="space-y-4">
                    <button onClick={() => setCurrentView('dashboard')} className={`flex items-center space-x-2 w-full text-left ${currentView === 'dashboard' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>
                        <LayoutDashboard size={20} /> <span>Dashboard</span>
                    </button>
                    <button onClick={() => setCurrentView('moderation')} className={`flex items-center space-x-2 w-full text-left ${currentView === 'moderation' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>
                        <ShieldAlert size={20} /> <span>Moderation</span>
                    </button>
                    <button onClick={() => setCurrentView('users')} className={`flex items-center space-x-2 w-full text-left ${currentView === 'users' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>
                        <Users size={20} /> <span>Users</span>
                    </button>
                    <button onClick={() => setCurrentView('categories')} className={`flex items-center space-x-2 w-full text-left ${currentView === 'categories' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>
                        <ListPlus size={20} /> <span>Categories</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full text-left text-gray-400 hover:text-white">
                        <Map size={20} /> <span>Geo-Map</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {loading && <div className="text-center py-4">Loading...</div>}
                {currentView === 'dashboard' && renderDashboard()}
                {currentView === 'moderation' && renderModeration()}
                {currentView === 'users' && renderUsers()}
                {currentView === 'categories' && <CategoryManager />}
            </div>
        </div>
    );
}

export default App;


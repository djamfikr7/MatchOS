import React, { useState } from 'react';
import { LayoutDashboard, ShieldAlert, Map, Users, DollarSign, ListPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoryManager } from './CategoryManager';

const data = [
    { name: 'Mon', requests: 40, fraud: 2 },
    { name: 'Tue', requests: 30, fraud: 1 },
    { name: 'Wed', requests: 50, fraud: 3 },
    { name: 'Thu', requests: 27, fraud: 0 },
    { name: 'Fri', requests: 60, fraud: 5 },
];

function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [transactions, setTransactions] = useState([
        { id: '#REQ-9921', type: 'Transaction', signal: 'PRICE_TOO_LOW', riskScore: 0.85 },
        { id: '#USR-1102', type: 'Provider', signal: 'LOW_REPUTATION', riskScore: 0.60 }
    ]);

    const handleScan = async (txId: string) => {
        try {
            // Call AI Core Fraud Agent
            const response = await fetch('http://localhost:3004/fraud/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transaction_id: txId })
            });
            const data = await response.json();

            // Update local state with risk score
            setTransactions(transactions.map(t =>
                t.id === txId ? { ...t, riskScore: data.risk_score } : t
            ));

            alert(`Scan Complete! Risk Score: ${data.risk_score}. Flags: ${data.flags.join(', ')}`);
        } catch (error) {
            console.error("Scan failed:", error);
            // Fallback for demo if API is down
            alert("Failed to connect to Fraud Agent (Is AI Core running?). Simulating scan...");
            setTransactions(transactions.map(t =>
                t.id === txId ? { ...t, riskScore: Math.random() } : t
            ));
        }
    };

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
                    <button onClick={() => setCurrentView('categories')} className={`flex items-center space-x-2 w-full text-left ${currentView === 'categories' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>
                        <ListPlus size={20} /> <span>Categories</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full text-left text-gray-400 hover:text-white">
                        <Map size={20} /> <span>Geo-Map</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full text-left text-gray-400 hover:text-white">
                        <Users size={20} /> <span>Users</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {currentView === 'categories' ? (
                    <CategoryManager />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500">Total Requests</h3>
                                    <LayoutDashboard className="text-blue-500" />
                                </div>
                                <p className="text-3xl font-bold">1,284</p>
                                <p className="text-green-500 text-sm">+12% from last week</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500">Fraud Alerts</h3>
                                    <ShieldAlert className="text-red-500" />
                                </div>
                                <p className="text-3xl font-bold">23</p>
                                <p className="text-red-500 text-sm">+5 new today</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500">Revenue (Est)</h3>
                                    <DollarSign className="text-green-500" />
                                </div>
                                <p className="text-3xl font-bold">$12,450</p>
                                <p className="text-green-500 text-sm">+8% from last month</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Request Volume</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="requests" fill="#3b82f6" />
                                            <Bar dataKey="fraud" fill="#ef4444" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Geo Heatmap Placeholder */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Live Activity Map</h3>
                                <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                                    <div className="text-center">
                                        <Map className="mx-auto text-blue-400 mb-2" size={32} />
                                        <p className="text-blue-500">Geo-Heatmap Visualization</p>
                                        <p className="text-sm text-gray-400">(Requires Mapbox Key)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Moderation Queue */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold">Moderation Queue</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-sm font-medium text-gray-500">ID</th>
                                        <th className="p-4 text-sm font-medium text-gray-500">Type</th>
                                        <th className="p-4 text-sm font-medium text-gray-500">Signal</th>
                                        <th className="p-4 text-sm font-medium text-gray-500">Risk Score</th>
                                        <th className="p-4 text-sm font-medium text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b">
                                            <td className="p-4">{tx.id}</td>
                                            <td className="p-4">{tx.type}</td>
                                            <td className="p-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">{tx.signal}</span></td>
                                            <td className="p-4">{tx.riskScore.toFixed(2)}</td>
                                            <td className="p-4">
                                                <button className="text-blue-600 hover:underline mr-2">Review</button>
                                                <button
                                                    className="text-red-600 hover:underline"
                                                    onClick={() => handleScan(tx.id)}
                                                >
                                                    AI Scan 🤖
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;

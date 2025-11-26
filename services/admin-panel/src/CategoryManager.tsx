import React, { useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

const mockCategories = [
    { id: 1, name: 'Drone Repair', parent: 'Tech Services', status: 'pending', risk: 'low' },
    { id: 2, name: 'Quantum Healing', parent: 'Wellness', status: 'pending', risk: 'high' },
    { id: 3, name: 'Urban Farming', parent: 'Agriculture', status: 'approved', risk: 'low' },
];

export function CategoryManager() {
    const [categories, setCategories] = useState(mockCategories);

    const handleApprove = (id: number) => {
        setCategories(categories.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    };

    const handleReject = (id: number) => {
        setCategories(categories.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Emergent Category Manager</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Category Name</th>
                            <th className="p-4 font-medium text-gray-500">Parent Category</th>
                            <th className="p-4 font-medium text-gray-500">Risk Assessment</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b last:border-0">
                                <td className="p-4 font-medium">{category.name}</td>
                                <td className="p-4 text-gray-600">{category.parent}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${category.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {category.risk.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${category.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                            category.status === 'rejected' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {category.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {category.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(category.id)}
                                                className="p-1 hover:bg-green-50 text-green-600 rounded"
                                                title="Approve"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(category.id)}
                                                className="p-1 hover:bg-red-50 text-red-600 rounded"
                                                title="Reject"
                                            >
                                                <X size={20} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

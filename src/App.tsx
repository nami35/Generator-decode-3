import React, { useState } from 'react';
import BaseConverter from './components/BaseConverter';
import CryptoTools from './components/CryptoTools';
import OpReturnGen from './components/OpReturnGen';
import CloudStorage from './components/CloudStorage';
import { Calculator, Shield, Database, Cloud } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('converter');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Crypto & Cloud Toolkit</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 space-y-1">
              <NavItem
                icon={<Calculator className="w-5 h-5" />}
                label="Base Converter"
                active={activeTab === 'converter'}
                onClick={() => setActiveTab('converter')}
              />
              <NavItem
                icon={<Shield className="w-5 h-5" />}
                label="Cryptography"
                active={activeTab === 'crypto'}
                onClick={() => setActiveTab('crypto')}
              />
              <NavItem
                icon={<Database className="w-5 h-5" />}
                label="OP_RETURN Gen"
                active={activeTab === 'opreturn'}
                onClick={() => setActiveTab('opreturn')}
              />
              <NavItem
                icon={<Cloud className="w-5 h-5" />}
                label="Cloud Storage"
                active={activeTab === 'cloud'}
                onClick={() => setActiveTab('cloud')}
              />
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'converter' && <BaseConverter />}
            {activeTab === 'crypto' && <CryptoTools />}
            {activeTab === 'opreturn' && <OpReturnGen />}
            {activeTab === 'cloud' && <CloudStorage />}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

import React, { useState } from 'react';
import { Cloud, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

type Provider = 'aws' | 'gcp' | 'azure';

const isFileTypeAccepted = (file: File, acceptedTypes: string) => {
  if (!acceptedTypes.trim()) return true;
  const types = acceptedTypes.split(',').map(t => t.trim().toLowerCase());
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return types.some(type => {
    if (type.startsWith('.')) {
      return fileName.endsWith(type);
    }
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      return fileType.startsWith(`${baseType}/`);
    }
    return fileType === type;
  });
};

export default function CloudStorage() {
  const [provider, setProvider] = useState<Provider>('aws');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null);

  // AWS State
  const [awsRegion, setAwsRegion] = useState('');
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  const [awsBucket, setAwsBucket] = useState('');

  // GCP State
  const [gcpProjectId, setGcpProjectId] = useState('');
  const [gcpClientEmail, setGcpClientEmail] = useState('');
  const [gcpPrivateKey, setGcpPrivateKey] = useState('');
  const [gcpBucket, setGcpBucket] = useState('');

  // Azure State
  const [azureConnString, setAzureConnString] = useState('');
  const [azureContainer, setAzureContainer] = useState('');

  const [acceptedMimeTypes, setAcceptedMimeTypes] = useState('');

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleUpload = async () => {
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      setResult({ success: false, error: 'File size exceeds the 50MB limit.' });
      return;
    }

    if (acceptedMimeTypes.trim() && !isFileTypeAccepted(file, acceptedMimeTypes)) {
      setResult({ success: false, error: `Invalid file type. Accepted types: ${acceptedMimeTypes}` });
      return;
    }

    if (provider === 'aws' && (!awsRegion.trim() || !awsAccessKey.trim() || !awsSecretKey.trim() || !awsBucket.trim())) {
      setResult({ success: false, error: 'Please fill in all AWS credentials.' });
      return;
    }

    if (provider === 'gcp' && (!gcpProjectId.trim() || !gcpClientEmail.trim() || !gcpPrivateKey.trim() || !gcpBucket.trim())) {
      setResult({ success: false, error: 'Please fill in all Google Cloud credentials.' });
      return;
    }

    if (provider === 'azure' && (!azureConnString.trim() || !azureContainer.trim())) {
      setResult({ success: false, error: 'Please fill in all Azure credentials.' });
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    if (provider === 'aws') {
      formData.append('region', awsRegion);
      formData.append('accessKeyId', awsAccessKey);
      formData.append('secretAccessKey', awsSecretKey);
      formData.append('bucket', awsBucket);
    } else if (provider === 'gcp') {
      formData.append('projectId', gcpProjectId);
      formData.append('clientEmail', gcpClientEmail);
      formData.append('privateKey', gcpPrivateKey);
      formData.append('bucket', gcpBucket);
    } else if (provider === 'azure') {
      formData.append('connectionString', azureConnString);
      formData.append('containerName', azureContainer);
    }

    try {
      const res = await fetch(`/api/upload/${provider}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, url: data.url });
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-800">Cloud Storage Tester</h2>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
        {(['aws', 'gcp', 'azure'] as Provider[]).map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              provider === p ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {p === 'aws' ? 'AWS S3' : p === 'gcp' ? 'Google Cloud' : 'Azure Blob'}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        {provider === 'aws' && (
          <>
            <Input label="Region" value={awsRegion} onChange={setAwsRegion} placeholder="us-east-1" />
            <Input label="Access Key ID" value={awsAccessKey} onChange={setAwsAccessKey} />
            <Input label="Secret Access Key" value={awsSecretKey} onChange={setAwsSecretKey} type="password" />
            <Input label="Bucket Name" value={awsBucket} onChange={setAwsBucket} />
          </>
        )}

        {provider === 'gcp' && (
          <>
            <Input label="Project ID" value={gcpProjectId} onChange={setGcpProjectId} />
            <Input label="Client Email" value={gcpClientEmail} onChange={setGcpClientEmail} />
            <Input label="Private Key" value={gcpPrivateKey} onChange={setGcpPrivateKey} type="password" placeholder="-----BEGIN PRIVATE KEY-----\n..." />
            <Input label="Bucket Name" value={gcpBucket} onChange={setGcpBucket} />
          </>
        )}

        {provider === 'azure' && (
          <>
            <Input label="Connection String" value={azureConnString} onChange={setAzureConnString} type="password" />
            <Input label="Container Name" value={azureContainer} onChange={setAzureContainer} />
          </>
        )}

        <div className="pt-4 mt-2 border-t border-gray-100">
          <Input 
            label="Accepted MIME Types (Optional)" 
            value={acceptedMimeTypes} 
            onChange={setAcceptedMimeTypes} 
            placeholder="e.g., image/png, application/pdf, audio/*" 
          />
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6 hover:bg-gray-50 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedMimeTypes || undefined}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Click to select a file'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {acceptedMimeTypes ? `Accepted: ${acceptedMimeTypes}` : 'Any file type'} (Max 50MB)
          </span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2"
      >
        {loading ? 'Uploading...' : 'Upload to Cloud'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {result.success ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <div>
            <h4 className="font-medium">{result.success ? 'Upload Successful' : 'Upload Failed'}</h4>
            {result.success ? (
              <a href={result.url} target="_blank" rel="noreferrer" className="text-sm underline mt-1 break-all">
                {result.url}
              </a>
            ) : (
              <p className="text-sm mt-1">{result.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

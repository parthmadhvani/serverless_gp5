import React, { useState } from 'react';
import { UploadIcon } from '@radix-ui/react-icons';
import StatusBar from './StatusBar';

export default function NamedEntity() {
  const [isProccessing, setIsProccessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const token = localStorage.getItem('accessToken');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFileContent(reader.result.toString());
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading file. Please try again.');
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!fileContent || !file) {
      alert('Please select a file to upload.');
      return;
    }

    const fileName = encodeURIComponent(file.name);
    let endpoint = `https://anhkqltatb3fydz3lxrahlr2bm0pjzoh.lambda-url.us-east-1.on.aws/`;

    try {
      setIsProccessing(true);
      setProcessingComplete(false); // Reset processing state

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify({ content: fileContent }),
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);

    //   alert('File uploaded successfully! Processing will begin.');
      setProcessingComplete(true); // Mark processing as complete
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    } finally {
      setIsProccessing(false);
    }
  };

  const showWordCloud = () => {
    console.log('Show word cloud');
  };

  return (
    <>
      <StatusBar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Upload Your File</h1>
        <p className="text-xl text-gray-600 text-center mb-8 max-w-md">Extract NamedEntities from “txt” file</p>
        <div className="w-full max-w-xs">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center px-4 py-2 border border-black rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500 cursor-pointer transition-colors duration-200"
          >
            <UploadIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
            <span>{file ? file.name : 'Choose file'}</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              aria-label="Choose file to upload"
            />
          </label>
        </div>
        {file && (
          <p className="mt-4 text-sm text-gray-500">
            Selected file: {file.name}
          </p>
        )}
        {!isProccessing && !processingComplete && (
          <button
            onClick={handleUpload}
            className="mt-4 px-4 py-2 text-white bg-black rounded-md shadow hover:bg-gray-800 transition-colors duration-200"
          >
            Upload File
          </button>
        )}
        {isProccessing && (
          <button
            disabled
            className="mt-4 px-4 py-2 text-white bg-black rounded-md shadow opacity-50 cursor-not-allowed flex items-center justify-center"
          >
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing...
          </button>
        )}
        {processingComplete && (
          <button
            onClick={showWordCloud}
            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition-colors duration-200"
          >
            To Word Cloud
          </button>
        )}
      </div>
    </>
  );
}
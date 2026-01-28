/**
 * InputSelection Component - File Upload & Contract Scanning Interface
 */
import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { fetchPackageCode } from '../../services/sui';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';

interface InputSelectionProps {
    onCodeLoaded: (code: string, source: string) => void;
}

export default function InputSelection({ onCodeLoaded }: InputSelectionProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [packageId, setPackageId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper for class merging
    const cn = (...inputs: (string | undefined | null | false)[]) => {
        return twMerge(clsx(inputs));
    };

    // File Upload Handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await processFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        if (!file.name.endsWith('.move') && !file.name.endsWith('.txt')) {
            setError('Please upload a .move or .txt file');
            return;
        }

        try {
            const text = await file.text();
            onCodeLoaded(text, `File: ${file.name}`);
        } catch (err) {
            setError('Failed to read file');
            console.error(err);
        }
    };

    // Contract Scanning Handler
    const handleScan = async () => {
        if (!packageId.trim()) {
            setError('Please enter a Package ID');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const code = await fetchPackageCode(packageId);
            onCodeLoaded(code, `Package: ${packageId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch package code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-black/50 overflow-y-auto">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Analyze Contracts</h2>
                    <p className="text-zinc-400">Security & dependency analysis for Sui Move</p>
                </div>

                {/* File Upload Zone */}
                <div
                    className={cn(
                        "relative border-2 border-dashed p-12 text-center transition-all cursor-pointer group",
                        isDragging
                            ? "border-sui-blue bg-sui-blue/5"
                            : "border-zinc-800 hover:border-sui-blue/50 hover:bg-zinc-900/50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".move,.txt"
                        onChange={handleFileSelect}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className={cn(
                            "w-16 h-16 flex items-center justify-center transition-colors",
                            isDragging ? "bg-sui-blue/20" : "bg-zinc-900 group-hover:bg-sui-blue/10"
                        )}>
                            <CloudArrowUpIcon className={cn(
                                "w-8 h-8 transition-colors",
                                isDragging ? "text-sui-blue" : "text-zinc-500 group-hover:text-sui-blue"
                            )} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-white group-hover:text-sui-blue transition-colors">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-zinc-500 mt-1">Move files (.move) only</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black text-zinc-500">OR</span>
                    </div>
                </div>

                {/* Deployed Contract Scan */}
                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-white">Scan Deployed Contract</h3>
                        <p className="text-xs text-zinc-500 mt-1">Fetch and analyze bytecode from Mainnet</p>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={packageId}
                                onChange={(e) => setPackageId(e.target.value)}
                                placeholder="0x..."
                                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 pl-10 text-sm text-white placeholder-zinc-500 focus:border-sui-blue focus:outline-none transition-colors"
                                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                            />
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        </div>
                        <Button
                            onClick={handleScan}
                            disabled={isLoading || !packageId.trim()}
                        >
                            {isLoading ? 'Scanning...' : 'Scan'}
                        </Button>
                    </div>
                </div>

                {/* Status/Error Messages */}
                {isLoading && (
                    <div className="flex justify-center pt-4">
                        <LoadingSpinner text="Fetching package..." />
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Application Constants
 */
import type { SeverityLevel, VulnerabilityType } from '../types';

export const SEVERITY_LEVELS: Record<string, SeverityLevel> = {
    CRITICAL: 'Critical' as const,
    HIGH: 'High' as const,
    MEDIUM: 'Medium' as const,
    LOW: 'Low' as const,
};

export const VULNERABILITY_TYPES: VulnerabilityType[] = [
    'Capability Leak',
    'Shared Object Issues',
    'Object Wrapping Bugs',
    'Transfer Policy Violations',
    'Witness Pattern Misuse',
    'Access Control Flaws',
    'Timestamp Manipulation',
    'Integer Overflow/Underflow',
];

export const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string; score: string }> = {
    critical: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500',
        score: '#ef4444',
    },
    high: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500',
        score: '#f97316',
    },
    medium: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500',
        score: '#eab308',
    },
    low: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500',
        score: '#3b82f6',
    },
};

export const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
    Critical: 30,
    High: 20,
    Medium: 10,
    Low: 5,
};

/**
 * Google Gemini API Configuration
 */
export const API_CONFIG = {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: 'gemini-3-flash-preview',
    maxTokens: 8192,
};

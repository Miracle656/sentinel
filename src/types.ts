/**
 * TypeScript type definitions for Sentinel
 */

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type VulnerabilityType =
    | 'Capability Leak'
    | 'Shared Object Issues'
    | 'Object Wrapping Bugs'
    | 'Transfer Policy Violations'
    | 'Witness Pattern Misuse'
    | 'Access Control Flaws'
    | 'Timestamp Manipulation'
    | 'Integer Overflow/Underflow';

export interface Vulnerability {
    severity: SeverityLevel;
    type: VulnerabilityType;
    location: string;
    title: string;
    description: string;
    code_snippet?: string;
    attack_scenario?: string;
    mermaid_diagram?: string;
    fix?: string;
    confidence?: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResults {
    score: number;
    vulnerabilities: Vulnerability[];
    summary: string;
    recommendations: string[];
    attack_diagram?: string;
    timestamp: string;
}

export interface DemoContract {
    name: string;
    description: string;
    code: string;
    expectedIssues: string[];
}

export type AnalysisState = 'empty' | 'loading' | 'results' | 'error';

export interface ApiConfig {
    endpoint: string;
    model: string;
    apiVersion: string;
    maxTokens: number;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'info';

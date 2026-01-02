/**
 * AttackDiagram Component - Mermaid.js diagram renderer
 */
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid with dark theme
mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#0284FE',
        primaryTextColor: '#fff',
        primaryBorderColor: '#0284FE',
        lineColor: '#3b82f6',
        secondaryColor: '#1a1a1a',
        tertiaryColor: '#2a2a2a',
        background: '#0a0a0a',
        mainBkg: '#1a1a1a',
        secondBkg: '#2a2a2a',
        textColor: '#ffffff',
        border1: '#3a3a3a',
        border2: '#4a4a4a',
    },
    flowchart: {
        curve: 'basis',
        padding: 20,
    },
});

interface AttackDiagramProps {
    diagram: string;
}

export default function AttackDiagram({ diagram }: AttackDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!diagram || !containerRef.current) return;

            try {
                setError(null);
                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, diagram);
                setSvg(svg);
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render attack diagram');
            }
        };

        renderDiagram();
    }, [diagram]);

    if (error) {
        return (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 overflow-x-auto">
            <div className="mb-3">
                <h4 className="text-sm font-semibold text-zinc-300">Attack Flow Diagram</h4>
            </div>
            <div
                ref={containerRef}
                className="mermaid-container flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}

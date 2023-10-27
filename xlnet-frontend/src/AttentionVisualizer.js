import React, { useState } from 'react';
import HeatMap from 'react-heatmap-grid';

function AttentionVisualizer({ attentions }) {
    const [selectedLayer, setSelectedLayer] = useState(0);
    const [selectedHead, setSelectedHead] = useState(0);

    // Check if attentions has data
    if (!attentions || attentions.length === 0) {
        return <div>No attention data available.</div>;
    }

    const numLayers = attentions.length;
    const numHeads = attentions[0].length;

    const data = attentions[selectedLayer][selectedHead];

    return (
        <div>
            <div>
                <label>Layer: 
                    <select value={selectedLayer} onChange={(e) => setSelectedLayer(Number(e.target.value))}>
                        {Array.from({ length: numLayers }, (_, i) => 
                            <option key={i} value={i}>Layer {i+1}</option>
                        )}
                    </select>
                </label>
                <label>Head: 
                    <select value={selectedHead} onChange={(e) => setSelectedHead(Number(e.target.value))}>
                        {Array.from({ length: numHeads }, (_, i) => 
                            <option key={i} value={i}>Head {i+1}</option>
                        )}
                    </select>
                </label>
            </div>
            <HeatMap
                xLabels={Array(data.length).fill(0).map((_, i) => i.toString())}
                yLabels={Array(data.length).fill(0).map((_, i) => i.toString())}
                data={data}
            />
        </div>
    );
}

export default AttentionVisualizer;

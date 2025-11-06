import { useRef } from "react";

export default function Settings() {
    const fileRef = useRef();

    const exportPreset = () => {
        const controls = JSON.parse(localStorage.getItem("controls") || "{}");
        const blob = new Blob([JSON.stringify(controls, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "strudel_reactor_preset.json"; a.click();
        URL.revokeObjectURL(url);
    };

    const importPreset = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        try {
            const json = JSON.parse(text);
            localStorage.setItem("controls", JSON.stringify(json));
            alert("Preset imported! Refresh Dashboard to apply it.");
        } catch {
            alert("Invalid JSON file.");
        }
    };

    return (
        <div>
            <h2>Settings</h2>
            <div className="card p-3 d-flex flex-row gap-2">
                <button className="btn btn-primary" onClick={exportPreset}>Export Preset</button>
                <input ref={fileRef} type="file" accept="application/json" hidden onChange={importPreset} />
                <button className="btn btn-outline-secondary" onClick={() => fileRef.current?.click()}>Import Preset</button>
            </div>
        </div>
    );
}

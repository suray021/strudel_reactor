import "../App.css";
import { useEffect, useMemo, useState } from "react";
import { stranger_tune } from "../tunes";
import console_monkey_patch from "../console-monkey-patch";
import useStrudel from "../hooks/useStrudel";
import { preprocess } from "../lib/preprocess";

export default function Dashboard() {
    const [controls, setControls] = useState({ p1: "on", tempo: 120, volume: 70 });
    const [editorText, setEditorText] = useState("");
    const [autoPlay, setAutoPlay] = useState(true);

    const { editorDivRef, canvasRef, setCode, play, stop, isReady } = useStrudel();

    useEffect(() => {
        console_monkey_patch();
        setEditorText(`all(x => x.postgain(<VOLUME>)) \n\n` + stranger_tune);
    }, []);

    const processed = useMemo(() => preprocess(editorText, controls), [editorText, controls]);

    useEffect(() => {
        if (!isReady()) return;

        if (processed && processed.trim().length > 0) {
            setCode(processed);
            if (autoPlay) play();
        }
    }, [processed, autoPlay, isReady, setCode, play]);

    const proc = () => {
        if (!isReady() || !processed || !processed.trim()) return;
        setCode(processed);
    };

    const procAndPlay = () => {
        if (!isReady() || !processed || !processed.trim()) return;
        setCode(processed);
        play();
    };

    useEffect(() => {
        const saved = localStorage.getItem("controls");
        if (saved) {
            try { setControls(JSON.parse(saved)); } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("controls", JSON.stringify(controls));
    }, [controls]);


    return (
        <div>
            <h2>Dashboard</h2>
            <main className="container-fluid">
                <div className="row g-3">
                    {/* Editor */}
                    <div className="col-md-8">
                        <label className="form-label">Text to preprocess:</label>
                        <textarea
                            className="form-control"
                            rows="15"
                            value={editorText}
                            onChange={(e) => setEditorText(e.target.value)}
                            aria-label="Editor with tags"
                        />
                    </div>

                    {/* Transport + Controls */}
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">Transport</div>
                            <div className="card-body d-flex flex-wrap gap-2" role="toolbar" aria-label="Transport">
                                <button className="btn btn-outline-primary" onClick={proc}>Preprocess</button>
                                <button className="btn btn-outline-primary" onClick={procAndPlay}>Proc &amp; Play</button>
                                <button className="btn btn-outline-primary" onClick={play}>Play</button>
                                <button className="btn btn-outline-primary" onClick={stop}>Stop</button>
                            </div>
                        </div>

                        {/* Playback Status */}
                        <div className="alert alert-info mt-3 py-2 text-center" role="alert">
                            Now Playing: updated Strudel sequence {autoPlay ? "(Auto Mode)" : "(Manual Mode)"}
                        </div>

                        <div className="card mt-3">
                            <div className="card-header">Controls</div>
                            <div className="card-body">

                                <div className="accordion mt-3" id="controlAccordion">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                            >
                                                Sound Controls
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse show">
                                            <div className="accordion-body d-flex flex-column gap-3">

                                                {/* P1 radio */}
                                                <div>
                                                    <label className="form-label me-2 mb-1">P1</label>
                                                    <div className="btn-group" role="group" aria-label="p1 radio">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="p1"
                                                            id="p1on"
                                                            checked={controls.p1 === "on"}
                                                            onChange={() => setControls((c) => ({ ...c, p1: "on" }))}
                                                        />
                                                        <label className="btn btn-outline-primary" htmlFor="p1on">On</label>

                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="p1"
                                                            id="p1hush"
                                                            checked={controls.p1 === "hush"}
                                                            onChange={() => setControls((c) => ({ ...c, p1: "hush" }))}
                                                        />
                                                        <label className="btn btn-outline-primary" htmlFor="p1hush">Hush</label>
                                                    </div>
                                                </div>

                                                {/* Tempo */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <label htmlFor="tempo" className="form-label mb-0">Tempo</label>
                                                    <input
                                                        id="tempo"
                                                        type="range"
                                                        className="form-range"
                                                        min="60" max="180" step="1"
                                                        value={controls.tempo}
                                                        onChange={(e) => setControls((c) => ({ ...c, tempo: Number(e.target.value) }))}
                                                        style={{ width: 200 }}
                                                    />
                                                    <span className="badge text-bg-secondary">{controls.tempo} bpm</span>
                                                </div>

                                                {/* Volume */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <label htmlFor="volume" className="form-label mb-0">Volume</label>
                                                    <input
                                                        id="volume"
                                                        type="range"
                                                        className="form-range"
                                                        min="0" max="100" step="1"
                                                        value={controls.volume}
                                                        onChange={(e) => setControls((c) => ({ ...c, volume: Number(e.target.value) }))}
                                                        style={{ width: 200 }}
                                                        aria-label="Master volume"
                                                    />
                                                    <span className="badge text-bg-secondary">{controls.volume}</span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Auto Proc & Play Switch */}
                                <div className="form-check form-switch ms-auto mt-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="autoPlaySwitch"
                                        checked={autoPlay}
                                        onChange={(e) => setAutoPlay(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="autoPlaySwitch">
                                        Auto Proc & Play
                                    </label>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Strudel output */}
                    <div className="col-md-8">
                        <div id="editor" ref={editorDivRef} />
                        <div id="output" />
                    </div>
                    <div className="col-md-4">
                        <canvas id="roll" ref={canvasRef} />
                    </div>
                </div>
            </main>
        </div>
    );
}

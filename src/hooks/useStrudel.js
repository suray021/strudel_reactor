import { useEffect, useRef } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import { registerSoundfonts } from "@strudel/soundfonts";

export default function useStrudel() {
    const editorDivRef = useRef(null);
    const canvasRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const mount = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;

            const drawTime = [-2, 2];

            const sm = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: editorDivRef.current,
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick();
                    const loadModules = evalScope(
                        import("@strudel/core"),
                        import("@strudel/draw"),
                        import("@strudel/mini"),
                        import("@strudel/tonal"),
                        import("@strudel/webaudio")
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });

            if (isMounted) editorRef.current = sm;
        };

        mount();
        return () => { isMounted = false; editorRef.current = null; };
    }, []);

    return {
        editorDivRef,
        canvasRef,
        setCode: (code) => editorRef.current?.setCode(code ?? ""),
        play: () => editorRef.current?.evaluate(),
        stop: () => editorRef.current?.stop(),
        isReady: () => !!editorRef.current,
    };
}


function uiToGain(vol) {
    const v = Math.max(0, Math.min(100, Number(vol) || 0)) / 100;
    return +(v * v).toFixed(3);
}

export function preprocess(source, controls) {
    let out = source ?? "";
    out = out.replaceAll("<p1_Radio>", controls.p1 === "hush" ? "_" : "");
    out = out.replaceAll("<tempo>", String(controls.tempo ?? 120));
    if (typeof controls.volume === "number") {
        out = out.replaceAll("<volume>", `# gain ${uiToGain(controls.volume)}`);
    }
    return out;
}

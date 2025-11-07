// Map UI 0..100 -> audio 0..1 (perceptual)
function uiToGain(vol) {
    const v = Math.max(0, Math.min(100, Number(vol) || 0)) / 100;
    // perceptual curve: feels natural across the range
    const g = Math.pow(v, 1.6);
    return +g.toFixed(3);
}

export function preprocess(source, controls) {
    let out = source ?? "";

    // p1 radio
    out = out.replaceAll("<p1_Radio>", controls.p1 === "hush" ? "_" : "");

    // tempo
    const tempo = typeof controls.tempo === "number" ? controls.tempo : 120;
    out = out.replaceAll("<tempo>", String(tempo));

    // volume
    if (typeof controls.volume === "number") {
        const volNum = uiToGain(controls.volume);

        // New style: replace <VOLUME> with a NUMBER (for all(x => x.postgain(<VOLUME>)))
        out = out.replaceAll("<VOLUME>", String(volNum));

        // Backward compatibility: if someone still uses <volume>, turn it into a master line.
        // (You can remove this block once you've fully moved to <VOLUME>.)
        if (out.includes("<volume>")) {
            out = out.replaceAll("<volume>", `all(x => x.postgain(${volNum}))`);
        }
    } else {
        // If volume unknown, be safe
        out = out.replaceAll("<VOLUME>", "1");
        out = out.replaceAll("<volume>", "all(x => x.postgain(1))");
    }

    return out;
}

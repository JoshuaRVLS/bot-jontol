import ffmpeg from "@ffmpeg-installer/ffmpeg";

// Set FFmpeg path immediately
if (ffmpeg && ffmpeg.path) {
    process.env.FFMPEG_PATH = ffmpeg.path;
    console.log(`[Config] FFmpeg path set to: ${ffmpeg.path}`);
} else {
    console.warn("[Config] @ffmpeg-installer/ffmpeg failed to provide a path.");
}




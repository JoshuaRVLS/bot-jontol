import { Client } from "discord.js";
import { DisTube } from "distube";
import { YouTubePlugin } from "@distube/youtube";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";

let distube: DisTube | null = null;
const COOKIE_PATH = path.join(process.cwd(), "cookies.txt");

export function getDistube(client: Client): DisTube {
    if (!distube) {
        // Parse cookies into the format DisTube's YouTube plugin expects
        let cookiesArray: any[] | undefined = undefined;
        if (fs.existsSync(COOKIE_PATH)) {
            try {
                const content = fs.readFileSync(COOKIE_PATH, "utf-8");
                cookiesArray = content
                    .split("\n")
                    .filter(line => line.trim() && !line.startsWith("#"))
                    .map(line => {
                        const parts = line.split("\t");
                        if (parts.length < 7) return null;
                        return {
                            domain: parts[0],
                            path: parts[2],
                            secure: parts[3] === "TRUE",
                            expirationDate: parseInt(parts[4]),
                            name: parts[5],
                            value: parts[6].trim()
                        };
                    })
                    .filter(c => c !== null);
                console.log(`[DisTube] Parsed ${cookiesArray.length} cookies for playback.`);
            } catch (err) {
                console.error("[DisTube] Cookie parse error:", err);
            }
        }

        distube = new DisTube(client, {
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            ffmpeg: {
                path: ffmpeg.path
            },
            plugins: [
                new SpotifyPlugin(),
                new YouTubePlugin({
                    cookies: cookiesArray
                }),
                new SoundCloudPlugin(),
                // yt-dlp is the "Heavy Duty" fallback when everything else fails
                new YtDlpPlugin({
                    update: true
                })
            ]
        });

        // @ts-ignore
        distube.on("playSong", (queue, song) => {
            console.log(`[DisTube] Playing: ${song.name} via ${song.source}`);
        });

        // @ts-ignore
        distube.on("error", (error, queue, song) => {
            console.error(`[DisTube] Error:`, error.message || error);
        });

        console.log("[DisTube] Initialized with Spotify, YouTube (Cookies), SoundCloud, and yt-dlp Fallback");
    }
    return distube;
}

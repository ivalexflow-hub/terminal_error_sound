declare module 'sound-play' {
	/**
	 * Plays an audio file at the given path.
	 * @param filePath Absolute path to the audio file (mp3, wav, etc.)
	 * @param volume Volume level between 0 and 1 (default: 1)
	 */
	export function play(filePath: string, volume?: number): Promise<void>;
}

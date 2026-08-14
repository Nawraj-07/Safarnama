type YouTubePlayerState = -1 | 0 | 1 | 2 | 3 | 5;

interface YouTubePlayer {
  loadPlaylist(playlist: string | string[], index?: number, startSeconds?: number): void;
  cuePlaylist(playlist: string | string[], index?: number, startSeconds?: number): void;
  loadVideoById(videoId: string, startSeconds?: number): void;
  cueVideoById(videoId: string, startSeconds?: number): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  nextVideo(): void;
  previousVideo(): void;
  playVideoAt(index: number): void;
  getPlaylist(): string[] | undefined;
  getPlaylistIndex(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): YouTubePlayerState;
  getVideoData(): {
    video_id?: string;
    title?: string;
    author?: string;
  };
  destroy(): void;
}

interface YTNamespace {
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
  Player: new (
    elementId: string | HTMLElement,
    options: {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: Record<string, unknown>;
      events?: {
        onReady?: (event: { target: YouTubePlayer }) => void;
        onStateChange?: (event: { target: YouTubePlayer; data: YouTubePlayerState }) => void;
        onError?: (event: { target: YouTubePlayer; data: number }) => void;
      };
    }
  ) => YouTubePlayer;
}

interface Window {
  YT?: YTNamespace;
  onYouTubeIframeAPIReady?: () => void;
}

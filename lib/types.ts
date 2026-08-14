export type Track = {
  id: string;
  title: string;
  artist: string;
  film?: string;
  year?: number;
  duration?: string;
  videoId: string;
};

export type Playlist = {
  id: string;
  name: string;
  subtitle: string;
  youtubePlaylistId: string;
  featuredVideoId?: string;
  closingVideoId?: string;
};

export type PlayerStatus = "idle" | "loading" | "ready" | "error";

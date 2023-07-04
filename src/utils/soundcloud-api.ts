import { Favorites } from "@/interfaces/favorites";
import { User } from "@/interfaces/user";
import { PlaylistWithTracks } from "@/interfaces/playlist-with-tracks";
import { CapacitorHttp } from "@capacitor/core";
import { Track } from "@/interfaces/track";

const API_URL = "https://api-v2.soundcloud.com";
const soundcloudOptions = {
  headers: {
    Origin: "https://soundcloud.com",
    Referer: "https://soundcloud.com",
  },
};

export async function getFavorites(
  apiKey: string,
  profileId: string
): Promise<Favorites> {
  return new Promise((resolve, reject) => {
    const options = {
      ...soundcloudOptions,
      url: `${API_URL}/users/${profileId}/likes?client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getPlaylistWithTracks(
  apiKey: string,
  playlistId: number
): Promise<PlaylistWithTracks> {
  return new Promise((resolve, reject) => {
    const options = {
      ...soundcloudOptions,
      url: `${API_URL}/playlists/${playlistId}?client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getTrack(apiKey: string, id: number): Promise<Track> {
  return new Promise((resolve, reject) => {
    const options = {
      ...soundcloudOptions,
      url: `${API_URL}/tracks/${id}?client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getMultipleTracks(
  apiKey: string,
  ids: number[]
): Promise<Track[]> {
  return new Promise((resolve, reject) => {
    const joinedIds = ids.join(",");
    const options = {
      ...soundcloudOptions,
      url: `${API_URL}/tracks?ids=${encodeURIComponent(
        joinedIds
      )}&client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getProfileInfos(
  apiKey: string,
  profileId: string
): Promise<User> {
  return new Promise((resolve, reject) => {
    const options = {
      ...soundcloudOptions,
      url: `${API_URL}/users/${profileId}?client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getNextFavorites(
  apiKey: string,
  nextUrl: string
): Promise<Favorites> {
  return new Promise((resolve, reject) => {
    const options = {
      ...soundcloudOptions,
      url: `${nextUrl}&client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getMediaFinalUrl(
  apiKey: string,
  audioUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      ...soundcloudOptions,
      url: `${audioUrl}?client_id=${apiKey}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results) {
          resolve(results);
        } else {
          reject(results);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

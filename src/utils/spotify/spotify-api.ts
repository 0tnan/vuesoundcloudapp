import { Playlists } from "@/interfaces/spotify/playlists";
import { SavedTracks } from "@/interfaces/spotify/saved-tracks";
import { User } from "@/interfaces/spotify/user";
import { CapacitorHttp } from "@capacitor/core";

const API_URL = "https://api.spotify.com/v1/me";

export async function getUser(authorization: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      url: `${API_URL}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results && response.status === 200) {
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

export async function getPlaylists(authorization: string): Promise<Playlists> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      url: `${API_URL}/playlists`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results && response.status === 200) {
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

export async function getPlaylistsNextPageItems(
  authorization: string,
  next: string
): Promise<Playlists> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      url: `${next}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results && response.status === 200) {
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

export async function getSavedTracks(
  authorization: string
): Promise<SavedTracks> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      url: `${API_URL}/tracks`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results && response.status === 200) {
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

export async function getSavedTracksNextPageItems(
  authorization: string,
  next: string
): Promise<SavedTracks> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      url: `${next}`,
    };
    CapacitorHttp.get(options)
      .then((response) => {
        const results = response.data;
        if (results && response.status === 200) {
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

import { CapacitorHttp } from "@capacitor/core";

const API_URL = "https://api-v2.soundcloud.com";

export async function getFavorites(apiKey: string, profileId: string) {
  return new Promise((resolve, reject) => {
    const options = {
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

export async function getProfileInfos(apiKey: string, profileId: string) {
  return new Promise((resolve, reject) => {
    const options = {
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

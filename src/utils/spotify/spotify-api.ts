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

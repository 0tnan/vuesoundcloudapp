import { CapacitorHttp } from "@capacitor/core";
import { AccessTokenRequestBody } from "@/interfaces/spotify/access-token-request-body";
import { AccessTokenResponse } from "@/interfaces/spotify/access-token-response";
import { RefreshTokenRequestBody } from "@/interfaces/spotify/refresh-token-request-body";

export async function getSpotifyAccessToken(
  data: AccessTokenRequestBody
): Promise<AccessTokenResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    CapacitorHttp.post(options)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("HTTP status " + response.status);
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
        console.error("An error occured", error);
      });
  });
}

export async function refreshToken(
  data: RefreshTokenRequestBody
): Promise<AccessTokenResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    CapacitorHttp.post(options)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("HTTP status " + response.status);
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
        console.error("An error occured", error);
      });
  });
}

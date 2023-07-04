import { CapacitorHttp } from "@capacitor/core";

export default async function getProfile(profileUrl: string) {
  return new Promise((resolve, reject) => {
    const options = {
      url: profileUrl,
    };
    CapacitorHttp.get(options)
      .then((r) => {
        const res = r.data.split("soundcloud://users:");
        const urls = [] as string[];
        res.forEach((item: string) => {
          urls.push(item);
        });
        const soundcloudId = urls[1].split('"')[0];
        if (soundcloudId) {
          resolve(soundcloudId);
        } else {
          reject(soundcloudId);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

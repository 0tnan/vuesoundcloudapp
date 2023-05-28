import { CapacitorHttp } from "@capacitor/core";

export default async function fetchKey() {
  return new Promise((resolve, reject) => {
    const options = {
      url: "https://m.soundcloud.com",
    };
    CapacitorHttp.get(options)
      .then((r) => {
        const res = r.data.split('clientId":"');
        const urls = [] as string[];
        res.forEach((item: string) => {
          urls.push(item);
        });
        const key = urls[1].split('"')[0];
        if (key) {
          resolve(key);
        } else {
          reject("Error: no key founded");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// import ImageKit from "@imagekit/nodejs";
// import { config } from "../config/config.js";

// const client = new ImageKit({
//   publicKey: config.IMAGEKIT_PUBLIC_KEY,
//   privateKey: config.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
// });

// export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
//   console.log(Buffer.isBuffer(buffer));
//   console.log(fileName);
//   console.log(buffer?.length);
//   if (!buffer) {
//     throw new Error("Buffer is missing");
//   }

//   // const result = await client.files.upload({
//   //     file: buffer, // ✅ direct buffer
//   //     fileName,
//   //     folder,
//   // });
//   console.log(file);
//   const result = await client.files.upload({

//     file: await ImageKit.toFile(Buffer.from("my bytes"), "file"),
//     fileName: "fileName",
//   });
//   console.log(result);

//   return result;
// }

import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
  try {

    if (!buffer) {
      throw new Error("Buffer is missing");
    }
const base64File = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    const result = await client.files.upload({
      file: base64File,
      fileName,
      folder,
    });

    return result;
  } catch (error) {
    console.log("IMAGEKIT UPLOAD ERROR");
    console.log(error);

    throw error;
  }
}

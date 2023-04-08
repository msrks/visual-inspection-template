/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
// import * as v2 from "firebase-functions/v2";
import { Animal } from "./_types";

const apis = {
  dog: "https://dog.ceo/api/breeds/image/random",
  cat: "https://api.thecatapi.com/v1/images/search",
};

const getImageUrl = {
  dog: (res: any): string => res.data.message,
  cat: (res: any): string => res.data[0].url,
};

export const getRandomAnimal = (): Animal => (Math.random() > 0.5 ? "dog" : "cat");

export const getUrl = async (animal: Animal): Promise<string> => {
  const res = await axios.get(apis[animal]);
  const imgUrl = getImageUrl[animal](res);
  // v2.logger.info(imgUrl);
  return imgUrl;
};

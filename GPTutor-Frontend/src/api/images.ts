import { GeneratedImage, GenerateImageRequest } from "$/entity/image/types";
import { ErrorResponseType, Pageable } from "$/entity/common";

const BACKEND_HOST = env.REACT_APP_BACKEND_HOST;

export function generateImage(
  params: GenerateImageRequest,
  controller: AbortController
): Promise<GeneratedImage[] & ErrorResponseType> {
  return fetch(`${BACKEND_HOST}image`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + location.href,
      "Content-Type": "application/json",
    },
    signal: controller.signal,
    body: JSON.stringify(params),
  }).then((res) => res.json());
}

export function saveImage(
  imageId: string
): Promise<GeneratedImage & ErrorResponseType> {
  return fetch(`${BACKEND_HOST}image/${imageId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + location.href,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export function getImages(
  pageNumber: number
): Promise<Pageable<GeneratedImage>> {
  return fetch(`${BACKEND_HOST}image?pageNumber=${pageNumber}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + location.href,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

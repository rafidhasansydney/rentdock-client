import { accountRequest } from "./auth-client";
export const maxImageBytes = 3 * 1024 * 1024;
export const imageTypes = ["image/jpeg", "image/png", "image/webp"];
export async function uploadImage(file: File, authenticated: boolean) {
  if (!imageTypes.includes(file.type) || file.size > maxImageBytes || file.size === 0) throw new Error("Choose a JPG, PNG or WebP image up to 3 MB.");
  if (authenticated) return accountRequest<{ url: string; id: string }>("/uploads/image", { method: "POST", headers: { "Content-Type": file.type }, body: file });
  const response = await fetch("/api/uploads/image", { method: "POST", headers: { "Content-Type": file.type }, credentials: "include", body: file });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "The image could not be uploaded. Please try again.");
  return result as { url: string; id: string };
}

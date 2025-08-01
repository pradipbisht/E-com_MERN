import ImageKit from "imagekit";
import dotenv from "dotenv";

// Load environment variables from .env file
// Why: ImageKit credentials must be kept secure and not hardcoded
dotenv.config();

/**
 * ImageKit CDN configuration for image uploads
 * How: Initializes ImageKit client with credentials from environment variables
 * Why: Using a CDN provides fast image delivery worldwide and reduces server storage needs
 */
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY, // Public key for client-side uploads
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // Private key for server-side operations
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, // CDN endpoint for serving images
});

export default imagekit;

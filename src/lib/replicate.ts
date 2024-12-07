import Replicate from 'replicate';
import type { Prediction } from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const MODEL_VERSION = "konieshadow/fooocus-api:fda927242b1db6affa1ece4f54c37f19b964666bf23b0d06ae2439067cd344a4";
const PREDICTION_TIMEOUT = 30000;

interface FooocusInput {
  prompt: string;
  cn_img1?: string;
  cn_type1?: "ImagePrompt" | "FaceSwap" | "PyraCanny" | "CPDS";
  sharpness?: number;
  image_seed?: number;
  image_number?: number;
  guidance_scale?: number;
  refiner_switch?: number;
  negative_prompt?: string;
  style_selections?: string;
  performance_selection?: "Speed" | "Quality" | "Extreme Speed";
}

export interface RemixResponse {
  status: number;
  prediction_id?: string;
  image_url?: string;
  error?: string;
  details?: string;
  predictions?: Prediction[];
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

async function runWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}

export async function createPrediction(imageUrl: string, prompt: string = ''): Promise<RemixResponse> {
  try {
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(imageUrl)) {
      return {
        error: 'Invalid image URL format',
        status: 400
      };
    }

    const input: FooocusInput = {
      prompt: prompt || "remix this image",
      cn_img1: imageUrl,
      cn_type1: "ImagePrompt",
      sharpness: 2,
      image_seed: -1,
      image_number: 1,
      guidance_scale: 7.5,
      refiner_switch: 0.5,
      negative_prompt: "ugly, blurry, low quality, deformed",
      style_selections: "Fooocus V2,Fooocus Enhance,Fooocus Sharp",
      performance_selection: "Speed"
    };

    try {
      const output = await runWithTimeout(
        replicate.run(MODEL_VERSION, { input }),
        PREDICTION_TIMEOUT
      );

      if (Array.isArray(output) && output.length > 0) {
        return {
          image_url: output[0],
          status: 200
        };
      }

      throw new Error('Unexpected output format from Replicate');

    } catch (error) {
      if (error instanceof Error && error.message === 'Operation timed out') {
        return {
          error: 'Prediction timed out',
          details: 'Request took longer than 30 seconds',
          status: 408
        };
      }
      throw error;
    }

  } catch (error) {
    console.error('Error creating prediction:', error);
    return {
      error: 'Failed to create prediction',
      details: formatError(error),
      status: 500
    };
  }
}

export async function listPredictions(): Promise<RemixResponse> {
  try {
    const predictions = await replicate.predictions.list();
    return {
      status: 200,
      predictions: predictions.results
    };
  } catch (error) {
    console.error('Error listing predictions:', error);
    return {
      error: 'Failed to list predictions',
      details: formatError(error),
      status: 500
    };
  }
}
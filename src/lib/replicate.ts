import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const MODEL_VERSION = "konieshadow/fooocus-api:fda927242b1db6affa1ece4f54c37f19b964666bf23b0d06ae2439067cd344a4";
const PREDICTION_TIMEOUT = 30000; // 30 seconds

export interface RemixResponse {
  status: number;
  prediction_id?: string;
  image_url?: string;
  error?: string;
  details?: string;
  predictions?: any[];
}

async function waitForPrediction(predictionId: string): Promise<RemixResponse> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < PREDICTION_TIMEOUT) {
    const prediction = await replicate.predictions.get(predictionId);
    
    if (prediction.status === 'succeeded' && prediction.output) {
      const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      return {
        prediction_id: predictionId,
        image_url: imageUrl,
        status: 200
      };
    }
    
    if (prediction.status === 'failed') {
      return {
        error: 'Prediction failed',
        details: prediction.error?.toString(), // Convert unknown error to string
        status: 400
      };
    }
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Prediction timeout');
}

export async function createPrediction(imageUrl: string, prompt: string = ''): Promise<RemixResponse> {
  try {
    // Validate the image URL
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(imageUrl)) {
      return {
        error: 'Invalid image URL format',
        status: 400
      };
    }

    // Set up the model parameters with sensible defaults
    const input = {
      prompt: prompt || "remix this image",
      cn_img1: imageUrl,
      cn_type1: "ImagePrompt",
      sharpness: 2,
      image_seed: -1, // random seed
      image_number: 1,
      guidance_scale: 7.5,
      refiner_switch: 0.5,
      negative_prompt: "ugly, blurry, low quality, deformed",
      style_selections: "Fooocus V2,Fooocus Enhance,Fooocus Sharp",
      performance_selection: "Speed",
      uov_method: "Disabled",
    };

    // Create prediction
    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
      input
    });

    // Wait for result with timeout
    try {
      const result = await waitForPrediction(prediction.id);
      if (result.status === 200) {
        return result;
      }
    } catch (timeoutError) {
      // If we timeout, return the prediction ID so client can check later
      return {
        prediction_id: prediction.id,
        status: 202,
        details: 'Prediction still processing. Please check back with the prediction ID.'
      };
    }

    return {
      prediction_id: prediction.id,
      status: 202
    };

  } catch (error) {
    console.error('Error creating prediction:', error);
    return {
      error: 'Failed to create prediction',
      details: error instanceof Error ? error.message : String(error),
      status: 500
    };
  }
}

export async function getPrediction(predictionId: string): Promise<RemixResponse> {
  try {
    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === 'succeeded' && prediction.output) {
      const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      return {
        prediction_id: predictionId,
        image_url: imageUrl,
        status: 200
      };
    }

    if (prediction.status === 'failed') {
      return {
        error: 'Prediction failed',
        details: prediction.error?.toString() || 'Unknown error',
        status: 400
      };
    }

    // Still processing
    return {
      prediction_id: predictionId,
      status: 202
    };

  } catch (error) {
    console.error('Error getting prediction:', error);
    return {
      error: 'Failed to get prediction',
      details: error instanceof Error ? error.message : String(error),
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
      details: error instanceof Error ? error.message : String(error),
      status: 500
    };
  }
}
export interface CreateShortLinkRequest {
  url: string;
  captchaToken: string;
}

export interface CreateShortLinkResponse {
  id: string;
  slug: string;
  original_url: string;
  created_at: string;
  expires_at?: string;
  short_url: string;
  qr_code_url: string;
}

export async function createShortLink(
  request: CreateShortLinkRequest
): Promise<CreateShortLinkResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL environment variable is not configured"
    );
  }

  const response = await fetch(`${apiBaseUrl}/api/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: request.url,
      captcha_token: request.captchaToken,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    let errorMessage = "Failed to create short link";

    if (status === 400) {
      errorMessage = "Invalid request. Please check your URL.";
    } else if (status === 403) {
      errorMessage = "CAPTCHA verification failed. Please try again.";
    } else if (status === 409) {
      errorMessage = "Slug collision occurred. Please try again.";
    } else if (status === 500) {
      errorMessage = "Server error. Please try again later.";
    }

    throw new Error(errorMessage);
  }

  return response.json();
}


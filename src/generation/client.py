import os
import time
from dotenv import load_dotenv
from groq import Groq, RateLimitError, APIConnectionError, APIStatusError, AuthenticationError

load_dotenv()

_api_key = os.getenv("GROQ_API_KEY")
if not _api_key:
    raise RuntimeError(
        "GROQ_API_KEY not found. Create a .env file in the project root with:\n"
        "GROQ_API_KEY=your-key-here\n"
        "Get a free key at https://console.groq.com/keys"
    )

client = Groq(api_key=_api_key)

DEFAULT_MODEL = "openai/gpt-oss-120b"  


def call_llm(prompt: str, max_tokens: int = 800, model: str = DEFAULT_MODEL,
             max_retries: int = 3) -> str:
    """
    Calls the Groq API with real error handling:
    - AuthenticationError: bad/expired key -> fail fast with a clear message, no point retrying
    - RateLimitError: back off and retry (free tier has real per-minute limits)
    - APIConnectionError: network issue -> retry
    - APIStatusError: other API errors (bad model name, server error, etc.)
    """
    last_error = None
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                max_tokens=max_tokens,
                messages=[{"role": "user", "content": prompt}],
            )
            text = response.choices[0].message.content
            if not text or not text.strip():
                raise ValueError("Groq API returned an empty response.")
            return text.strip()

        except AuthenticationError as e:
            raise RuntimeError(f"Groq API authentication failed — check your GROQ_API_KEY: {e}") from e

        except RateLimitError as e:
            last_error = e
            wait = 2 ** attempt  # 1s, 2s, 4s
            print(f"Rate limited by Groq (attempt {attempt + 1}/{max_retries}), waiting {wait}s...")
            time.sleep(wait)

        except APIConnectionError as e:
            last_error = e
            wait = 2 ** attempt
            print(f"Network error reaching Groq (attempt {attempt + 1}/{max_retries}), waiting {wait}s...")
            time.sleep(wait)

        except APIStatusError as e:
            raise RuntimeError(f"Groq API error (status {e.status_code}): {e.message}") from e

    raise RuntimeError(f"Groq API call failed after {max_retries} attempts. Last error: {last_error}")
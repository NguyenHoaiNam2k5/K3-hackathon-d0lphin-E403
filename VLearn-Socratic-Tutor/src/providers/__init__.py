from __future__ import annotations

import os
from typing import Final

from providers.anthropic_provider import AnthropicProvider
from providers.base import Provider
from providers.deepseek_provider import DeepSeekProvider
from providers.gemini_provider import GeminiProvider
from providers.openai_provider import OpenAIProvider
from providers.openrouter_provider import OpenRouterProvider

DEFAULT_PROVIDER: Final = "deepseek"
LLM_PROVIDER_ENV: Final = "LLM_PROVIDER"
PROVIDER_FACTORIES: Final = {
    "openai": OpenAIProvider,
    "openrouter": OpenRouterProvider,
    "anthropic": AnthropicProvider,
    "gemini": GeminiProvider,
    "deepseek": DeepSeekProvider,
}


def configured_provider_name(explicit_provider: str | None = None) -> str:
    provider_name = explicit_provider or os.getenv(LLM_PROVIDER_ENV) or DEFAULT_PROVIDER
    return provider_name.strip().lower() or DEFAULT_PROVIDER


def make_provider(name: str) -> Provider:
    provider_factory = PROVIDER_FACTORIES.get(name)
    if provider_factory is None:
        raise ValueError(f"Unknown provider: {name}")
    return provider_factory()

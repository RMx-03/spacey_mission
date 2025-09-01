import os

import sentry_sdk
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from app.core.config import get_settings


def init_observability() -> None:
    settings = get_settings()
    # Sentry
    if settings.sentry_dsn:
        sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.1)

    # OpenTelemetry
    otlp_endpoint = os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT")
    if otlp_endpoint:
        provider = TracerProvider(resource=Resource.create({"service.name": settings.app_name}))
        processor = BatchSpanProcessor(OTLPSpanExporter(endpoint=otlp_endpoint))
        provider.add_span_processor(processor)
        trace.set_tracer_provider(provider)



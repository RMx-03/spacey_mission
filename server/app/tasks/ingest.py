from app.celery_app import celery_app


@celery_app.task(name="tasks.ingest.index_document")
def index_document(document_id: str) -> dict:
    # TODO: load document, chunk, embed, store vectors
    return {"document_id": document_id, "status": "queued"}



from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Çökme Korumalı Connection Pool (Bağlantı Havuzu)
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, # Kopan bağlantıları otomatik yeniler
    pool_size=20,       # Maksimum eşzamanlı aktif bağlantı
    max_overflow=10,    # Ekstra yük bindiğinde açılacak yedek bağlantı sayısı
    echo=False
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False, 
    autoflush=False
)

async def get_db():
    """FastAPI Endpoint'leri için güvenli session generator"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

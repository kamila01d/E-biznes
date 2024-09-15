FROM python:3.10-slim
# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie pliku requirements.txt
COPY openai_backend/requirements.txt .

# Instalacja zależności
RUN pip install -r requirements.txt

# Kopiowanie wszystkich plików aplikacji
COPY /openai_backend .

# Ustawienie portu, na którym Flask nasssłuchuje
EXPOSE 8080

# Komenda uruchamiająca aplikację
CMD ["python", "app.py"]
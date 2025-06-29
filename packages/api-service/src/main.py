from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/api/health")
def read_root():
    return {"status": "Companion API is healthy!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
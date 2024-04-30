from flask import Flask, Response, request

from images.sd import textToImage
from llm.index import create_completions, models

app = Flask(__name__)


@app.post('/llm')
def llm_post():
    return Response(
        create_completions(
            request.json["model"],
            request.json["messages"]
        ),
        mimetype='text/event-stream;charset=UTF-8'
    )


@app.get('/llm')
def llm_get():
    return models


@app.post("/image")
def image():
    print(request.json["loraModel"])
    return textToImage(
        prompt=request.json["prompt"],
        model_id=request.json["modelId"],
        negative_prompt=request.json["negativePrompt"],
        scheduler=request.json["scheduler"],
        guidance_scale=request.json["guidanceScale"],
        seed=request.json["seed"],
        width=request.json["width"],
        height=request.json["height"],
        num_inference_steps=request.json["numInferenceSteps"],
        upscale=request.json["upscale"],
        samples=request.json["samples"],
        lora_model=request.json["loraModel"]
    )


if __name__ == '__main__':
    app.run(debug=False, port=1337, host="0.0.0.0")

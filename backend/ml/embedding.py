import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np


# =========================
# IMAGE PREPROCESSING
# =========================
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =========================
# LOAD MODEL (ONCE)
# =========================
def get_model():
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

    # remove classification layer
    model = torch.nn.Sequential(*list(model.children())[:-1])

    model.eval()
    return model


model = None


# =========================
# GENERATE EMBEDDING
# =========================
def get_embedding(image_bytes):
    global model

    if model is None:
        model = get_model()

    # load image
    image = Image.open(image_bytes).convert("RGB")

    # preprocess
    image = transform(image).unsqueeze(0)

    # forward pass
    with torch.no_grad():
        embedding = model(image)

    # flatten to 1D
    embedding = embedding.flatten().numpy()

    # =========================
    # 🔥 NORMALIZATION (VERY IMPORTANT)
    # =========================
    norm = np.linalg.norm(embedding)

    if norm != 0:
        embedding = embedding / norm

    return embedding
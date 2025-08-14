from flask import Flask, request, jsonify
from PIL import Image
import io
from ultralytics import YOLO

app = Flask(__name__)

MODEL_FILE = 'lapor_cepat_model.pt'

try:
    model = YOLO(MODEL_FILE)
    print(f"✅ Model '{MODEL_FILE}' berhasil dimuat.")
except Exception as e:
    print(f"❌ Error memuat model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Request harus menyertakan file gambar'}), 400

    image_file = request.files['image']
    try:
        img = Image.open(io.BytesIO(image_file.read()))
        results = model(img) # Lakukan prediksi

        # Proses hasilnya
        detected_objects = []
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                label_name = result.names[class_id]
                detected_objects.append(label_name)

        print(f"Objek terdeteksi oleh YOLO: {detected_objects}")
        return jsonify({'detections': detected_objects})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
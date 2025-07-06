from flask import Flask, render_template, request, send_file
from PIL import Image
import os
import zipfile
import io

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")  # Your HTML file (index.html)

@app.route("/crop", methods=["POST"])
def crop_images():
    x = int(request.form.get("x", 320))
    y = int(request.form.get("y", 0))
    width = int(request.form.get("width", 640))
    height = int(request.form.get("height", 752))

    images = request.files.getlist("images")
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w") as zip_file:
        for idx, img_file in enumerate(images, start=1):
            img = Image.open(img_file)
            cropped_img = img.crop((x, y, x + width, y + height))

            img_io = io.BytesIO()

            # Preserve original format and quality
            original_format = img.format  # E.g., 'JPEG', 'PNG', 'WEBP'
            ext = original_format.lower()

            if original_format == 'JPEG':
                cropped_img.save(img_io, format=original_format, quality=100)
            elif original_format == 'PNG':
                cropped_img.save(img_io, format=original_format, compress_level=0)
            else:
                cropped_img.save(img_io, format=original_format)

            img_io.seek(0)
            zip_file.writestr(f"SMTA_{idx:03d}.{ext}", img_io.read())

    zip_buffer.seek(0)
    return send_file(
        zip_buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="Cropped Images.zip"
    )

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

from PIL import Image

# Load the uploaded image
input_image_path = 'inputimage.png'
output_icon_path = 'output.ico'

# Open the image and resize it for common icon sizes
image = Image.open(input_image_path)
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

# Save as .ico file with multiple sizes
image.save(output_icon_path, format='ICO', sizes=icon_sizes)

output_icon_path

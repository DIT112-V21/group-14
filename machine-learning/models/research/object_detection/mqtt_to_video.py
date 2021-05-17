import paho.mqtt.client as mqtt
import numpy as np
from PIL import Image
import os
from object_detection.utils import label_map_util
import tensorflow.compat.v1 as tf
import sys
from object_detection.utils import visualization_utils as vis_util
sys.path.append("..")
MODEL_NAME = 'new_graph' 


PATH_TO_CKPT = MODEL_NAME + '/frozen_inference_graph.pb'

PATH_TO_LABELS = os.path.join('data', 'object-detection.pbtxt')  

NUM_CLASSES = 1  

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("/smartcar/sensors/camera")

def on_message(client, userdata, msg):
    img = Image.new('RGB', (640, 480))
    width = 640
    height = 480
    srcIndex = 0

    for y in range(480):
        for x in range(640):
            img.putpixel((x, y), (msg.payload[srcIndex], msg.payload[srcIndex+1], msg.payload[srcIndex+2]))
            srcIndex += 3
 
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')
    label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
    categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)

    def load_image_into_numpy_array(image):
        (im_width, im_height) = image.size
        return np.array(image.getdata()).reshape(
            (im_height, im_width, 3)).astype(np.uint8)
    IMAGE_SIZE = (12, 8)


    with detection_graph.as_default():
        with tf.Session(graph=detection_graph) as sess:
            image_np = load_image_into_numpy_array(img)
            image_np_expanded = np.expand_dims(image_np, axis=0)
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
            boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            scores = detection_graph.get_tensor_by_name('detection_scores:0')
            classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')
            (boxes, scores, classes, num_detections) = sess.run(
                [boxes, scores, classes, num_detections],
                feed_dict={image_tensor: image_np_expanded})
            vis_util.visualize_boxes_and_labels_on_image_array(
                image_np,
                np.squeeze(boxes),
                np.squeeze(classes).astype(np.int32),
                np.squeeze(scores),
                category_index,
                use_normalized_coordinates=True)

        client.publish('/smartcar/sensors/camera_ai', str(image_np.ravel()))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)
client.loop_forever()
    
#include <Smartcar.h>

const int TRIGGER_PIN           = 6; 
const int ECHO_PIN              = 7; 
const unsigned int MAX_DISTANCE = 200;
const int FRONT_PIN = 0;

ArduinoRuntime arduinoRuntime;
SR04 front(arduinoRuntime, TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
GP2Y0A21 frontIR(arduinoRuntime, FRONT_PIN); 
BrushedMotor leftMotor(arduinoRuntime, smartcarlib::pins::v2::leftMotorPins);
BrushedMotor rightMotor(arduinoRuntime, smartcarlib::pins::v2::rightMotorPins);
DifferentialControl control(leftMotor, rightMotor);

SimpleCar car(control);

void setup()
{
    Serial.begin(9600);
    car.setSpeed(30);
}

void loop()
{
  if(front.getDistance() > 170)
  {
    car.setAngle(90);
    car.setSpeed(15);
    delay(3000);
    car.setAngle(0);
    car.setSpeed(30);
  }
  if (frontIR.getDistance() > 30)
  {
    car.setSpeed(0);
  }
}

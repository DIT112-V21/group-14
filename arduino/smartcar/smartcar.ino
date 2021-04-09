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
    car.setSpeed(20);
}

void loop()
{
  if(front.getDistance() > 150)
  {
    car.setAngle(30);
    delay(2500);
    car.setAngle(0);
  }
  if (frontIR.getDistance() > 35)
  {
    car.setSpeed(0);
  }
}

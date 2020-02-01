#include <Servo.h>

char val;
int servoPin = 9;
Servo servo;

void setup() {
  // put your setup code here, to run once:
  servo.attach(9);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available()) {
    val = Serial.read();   
  }
  if (val == '1') {
    servo.write(180);
  } else {
    servo.write(0);
  }
  delay(10);
}

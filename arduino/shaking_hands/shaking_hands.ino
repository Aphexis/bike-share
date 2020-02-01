#include <Servo.h>

char val;
int servoPin = 9;
Servo servo;
bool b = true;


void setup() {
  // put your setup code here, to run once:
  servo.attach(9);
  Serial.begin(9600);
  establishContact();
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available() > 0) {
    val = Serial.read();
    if (val == '1') {
      if (b) {
        servo.write(0);
      } else {
        servo.write(180);
      }
    }
    delay(100);    
  } else {
    Serial.println("Hello, world!");
    delay(50);
  }
}

void establishContact() {
  while (Serial.available() <= 0) {
    Serial.println("A");
    delay(300);
  }
}

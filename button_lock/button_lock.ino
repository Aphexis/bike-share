#include <Servo.h>;

const int  buttonPin = 8;    // the pin that the pushbutton is attached to
const int servoPin = 9;
// Variables will change:
int buttonPushCounter = 0;   // counter for the number of button presses
int buttonState = 0;         // current state of the button
int lastButtonState = 0;     // previous state of the button
Servo servo;
int pos = 20;

void setup() {
  // initialize the button pin as a input:
  pinMode(buttonPin, INPUT);
  servo.attach(servoPin);
  
  // initialize serial communication:
  Serial.begin(9600);
  servo.write(pos);
}


void loop() {
  // read the pushbutton input pin:
  buttonState = digitalRead(buttonPin);

  // compare the buttonState to its previous state
  if (buttonState != lastButtonState) {
    // if the state has changed, increment the counter
    if (buttonState == HIGH) {
      // if the current state is HIGH then the button went from off to on:
      buttonPushCounter++;
      Serial.println("on");
      Serial.print("number of button pushes: ");
      Serial.println(buttonPushCounter);
      if (pos == 0) {
        pos = 180;
      } else {
        pos = 0;
      }
      servo.write(pos);
    } else {
      // if the current state is LOW then the button went from on to off:
      Serial.println("off");
    }
    // Delay a little bit to avoid bouncing
    delay(50);
  }
  // save the current state as the last state, for next time through the loop
  lastButtonState = buttonState;

}

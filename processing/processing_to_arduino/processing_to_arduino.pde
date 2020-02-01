import processing.serial.*;

Serial myPort;

void setup() {
  size(200, 200);
  String portName = Serial.list()[0];
  myPort = new Serial(this, portName, 9600);
}

void draw() {
  if (mousePressed) {
    myPort.write('1');
    println("1");
  } else {
    println("0");
    myPort.write('0');  
  }
}

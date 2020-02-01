import processing.serial.*;

Serial myPort;
String val;
boolean firstContact = false;

void setup() {
  size(200, 200);
  myPort = new Serial(this, Serial.list()[0], 9600);
  myPort.bufferUntil('\n');
}

void draw(){
  
}

void serialEvent(Serial myPort) {
  val = myPort.readStringUntil('\n');
  if (val != null) {
    val = trim(val);
    println(val);
    if (!firstContact) {
      if (val.equals("A")) {
        myPort.clear();
        firstContact = true;
        myPort.write("A");
        println("contact");
      }
    } else {
      println(val);
      if (mousePressed) {
        myPort.write('1');
        println("1");
      } else {
        myPort.write('0');
        println("0");
      }
      myPort.write("A");
    }
  }
}

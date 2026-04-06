#include <SoftwareSerial.h>

SoftwareSerial bluetooth(10, 11);

const int FSR_PIN = A0;
const int LED_PIN = 13;
const int THRESHOLD = 8;

unsigned long lastTriggerTime = 0;
const unsigned long DEBOUNCE_DELAY = 1000;

void setup() {
  Serial.begin(9600);
  bluetooth.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("System Ready");
}

void loop() {
  int fsrValue = analogRead(FSR_PIN);

  Serial.print("FSR Value: ");
  Serial.println(fsrValue);

  if (fsrValue > THRESHOLD) {
    unsigned long currentTime = millis();

    if (currentTime - lastTriggerTime > DEBOUNCE_DELAY) {
      lastTriggerTime = currentTime;

      Serial.println("TRIGGER DETECTED");
      bluetooth.print("ALERT! Pressure detected. Value: ");
      bluetooth.println(fsrValue);

      digitalWrite(LED_PIN, HIGH);
      delay(200);
      digitalWrite(LED_PIN, LOW);
    }
  }

  delay(100);
}

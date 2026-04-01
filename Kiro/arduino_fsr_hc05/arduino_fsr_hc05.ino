/*
  Arduino FSR Sensor with HC-05 Bluetooth Module
  
  Hardware Connections:
  - FSR Sensor: One leg to 5V, other leg to A0 and 10K resistor to GND
  - HC-05 Bluetooth:
    * VCC -> 5V
    * GND -> GND
    * TX -> Pin 10 (Arduino RX via SoftwareSerial)
    * RX -> Pin 11 (Arduino TX via SoftwareSerial) through voltage divider
  
  Note: HC-05 RX needs 3.3V, use voltage divider (1K + 2K resistors)
*/

#include <SoftwareSerial.h>

// HC-05 Bluetooth Module
SoftwareSerial bluetooth(10, 11); // RX, TX

// FSR Sensor Configuration
const int FSR_PIN = A0;
const int THRESHOLD = 500;  // Adjust based on your FSR sensitivity
const int LED_PIN = 13;     // Built-in LED for visual feedback

// Debounce variables
unsigned long lastTriggerTime = 0;
const unsigned long DEBOUNCE_DELAY = 2000; // 2 seconds between triggers

void setup() {
  // Initialize Serial for debugging
  Serial.begin(9600);
  Serial.println("Arduino FSR + HC-05 Bluetooth System");
  Serial.println("====================================");
  
  // Initialize Bluetooth
  bluetooth.begin(9600);
  Serial.println("Bluetooth initialized at 9600 baud");
  
  // Initialize LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  // Initialize FSR pin
  pinMode(FSR_PIN, INPUT);
  
  Serial.println("System ready!");
  Serial.println("Waiting for FSR trigger...");
  Serial.println("");
}

void loop() {
  // Read FSR value
  int fsrValue = analogRead(FSR_PIN);
  
  // Check if FSR is pressed beyond threshold
  if (fsrValue > THRESHOLD) {
    unsigned long currentTime = millis();
    
    // Debounce check
    if (currentTime - lastTriggerTime > DEBOUNCE_DELAY) {
      lastTriggerTime = currentTime;
      
      // Trigger detected!
      Serial.println("========================================");
      Serial.println("🚨 FSR TRIGGER DETECTED!");
      Serial.print("FSR Value: ");
      Serial.println(fsrValue);
      Serial.println("Sending alert via Bluetooth...");
      
      // Send alert via Bluetooth
      bluetooth.print("FSR_TRIGGER:");
      bluetooth.println(fsrValue);
      
      // Visual feedback
      blinkLED(3);
      
      Serial.println("Alert sent successfully!");
      Serial.println("========================================");
      Serial.println("");
    }
  }
  
  // Small delay for stability
  delay(100);
}

// Blink LED for visual feedback
void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}

// Optional: Function to test Bluetooth connection
void testBluetoothConnection() {
  Serial.println("Testing Bluetooth connection...");
  bluetooth.println("TEST_CONNECTION");
  delay(1000);
  
  if (bluetooth.available()) {
    Serial.println("Bluetooth connection OK!");
  } else {
    Serial.println("No response from Bluetooth module");
  }
}
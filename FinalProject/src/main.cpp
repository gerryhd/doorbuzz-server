/*
 Basic ESP8266 MQTT example
 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.
 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off
 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same cmult without blocking the main loop.
 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"
*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include "Led.h"
#include "Button.h"
#include <Pir.h>
#include <MagneticSensor.h>

#define MagnetSensor 6
#define PirSensor 5
#define LEDG 4
#define LEDR 2
#define LEDB 3
#define BTN 0

Led ledR;
Led ledG;
Led ledB;
Button btn;

Pir pir;
MagneticSensor magneticSensor;
// Update these with values suitable for your network.

const char* ssid = "Moto Gerry";
const char* password = "";
const char* mqtt_server = "192.168.43.100";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == 'R') {
    if((char)payload[1] == '1'){
    //digitalWrite(BUILTIN_LED, HIGH);
      // Turn the LED on (Note that LOW is the voltage level
      ledR.set(true);
    // but actually the LED is on; this is because
    // it is acive low on the ESP-01)
  }else{
    ledR.set(false);
  }
  } else if ((char)payload[0] == 'G'){
    if((char)payload[1] == '1'){
    //digitalWrite(BUILTIN_LED, HIGH);
     // Turn the LED off by making the voltage HIGH
    ledG.set(true);
  }else{
    ledG.set(false);
  }
  } else if ((char)payload[0] == 'B'){
    if((char)payload[1] == '1'){
      ledB.set(true);
    }else{
      ledB.set(false);
    }
  }

}



void setup() {
  ledB.begin(LEDB);
  btn.begin(BTN);
  ledR.begin(LEDR);
  ledG.begin(LEDG);

  pir.begin(PirSensor);
  magneticSensor.begin(MagnetSensor);

  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  Serial.print('what');
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266ClientMario";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("Mario/btn", "Yolo");
      // ... and resubscribe
      //client.subscribe("inTopic");
      client.subscribe("Mario/led");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  bool armed=true;

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  if(btn.pressed()){
    client.publish("Mario/btn", "Yolo");
  }
  if(armed==true){
  pir.loop();
  magneticSensor.loop();
}
  /*
  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    snprintf (msg, 75, "Mello world #%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("Mario/btn", msg);
  }
  */
}

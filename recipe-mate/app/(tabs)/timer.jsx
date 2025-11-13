import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";

const END_SOUND = require("../../assets/sounds/timer-end.mp3");

export default function TimerScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const soundRef = useRef(null);

  // audio mode
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.log("Audio mode error:", e);
      }
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playEndSound = async () => {
    try {
      console.log("Playing end sound...");
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(END_SOUND);
        soundRef.current = sound;
        await sound.playAsync();
      }
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  useEffect(() => {
    let interval;

    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (remaining === 0 && isRunning) {
      setIsRunning(false);
      playEndSound();

      if (Platform.OS === "web") {
        alert("⏱️ Timer finished!");
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remaining]);

  const handleStart = () => {
    const totalSeconds =
      Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (totalSeconds === 0) return;
    setRemaining(totalSeconds);
    setIsRunning(true);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setRemaining(0);
  };

  
  let displayH, displayM, displayS;

  if (remaining === 0 && !isRunning) {
    displayH = String(hours).padStart(2, "0");
    displayM = String(minutes).padStart(2, "0");
    displayS = String(seconds).padStart(2, "0");
  } else {
    const hoursPart = Math.floor(remaining / 3600);
    const minutesPart = Math.floor((remaining % 3600) / 60);
    const secondsPart = remaining % 60;

    displayH = String(hoursPart).padStart(2, "0");
    displayM = String(minutesPart).padStart(2, "0");
    displayS = String(secondsPart).padStart(2, "0");
  }

  const renderHourInput = () => {
    if (Platform.OS === "ios") {
    
      return (
        <TextInput
          style={styles.inputBox}
          keyboardType="number-pad"
          maxLength={2}
          value={String(hours)}
          onChangeText={(text) => {
            const n = parseInt(text || "0", 10);
            if (!isNaN(n) && n >= 0 && n <= 23) setHours(n);
            else if (text === "") setHours(0);
          }}
        />
      );
    }

    
    return (
      <Picker
        selectedValue={hours}
        onValueChange={(value) => setHours(Number(value))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        mode={Platform.OS === "android" ? "dropdown" : "dialog"}
      >
        {Array.from({ length: 24 }, (_, i) => (
          <Picker.Item key={i} label={`${i}`} value={i} />
        ))}
      </Picker>
    );
  };

  const renderMinuteInput = () => {
    if (Platform.OS === "ios") {
      return (
        <TextInput
          style={styles.inputBox}
          keyboardType="number-pad"
          maxLength={2}
          value={String(minutes)}
          onChangeText={(text) => {
            const n = parseInt(text || "0", 10);
            if (!isNaN(n) && n >= 0 && n <= 59) setMinutes(n);
            else if (text === "") setMinutes(0);
          }}
        />
      );
    }

    return (
      <Picker
        selectedValue={minutes}
        onValueChange={(value) => setMinutes(Number(value))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        mode={Platform.OS === "android" ? "dropdown" : "dialog"}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <Picker.Item key={i} label={`${i}`} value={i} />
        ))}
      </Picker>
    );
  };

  const renderSecondInput = () => {
    if (Platform.OS === "ios") {
      return (
        <TextInput
          style={styles.inputBox}
          keyboardType="number-pad"
          maxLength={2}
          value={String(seconds)}
          onChangeText={(text) => {
            const n = parseInt(text || "0", 10);
            if (!isNaN(n) && n >= 0 && n <= 59) setSeconds(n);
            else if (text === "") setSeconds(0);
          }}
        />
      );
    }

    return (
      <Picker
        selectedValue={seconds}
        onValueChange={(value) => setSeconds(Number(value))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        mode={Platform.OS === "android" ? "dropdown" : "dialog"}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <Picker.Item key={i} label={`${i}`} value={i} />
        ))}
      </Picker>
    );
  };

  const handleTestSound = () => {
    playEndSound();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Timers</Text>

      <Text style={styles.timeText}>
        {displayH}:{displayM}:{displayS}
      </Text>

      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          {renderHourInput()}
          <Text style={styles.pickerLabel}>hours</Text>
        </View>

        <View style={styles.pickerContainer}>
          {renderMinuteInput()}
          <Text style={styles.pickerLabel}>min</Text>
        </View>

        <View style={styles.pickerContainer}>
          {renderSecondInput()}
          <Text style={styles.pickerLabel}>sec</Text>
        </View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startText}>
            {isRunning ? "Restart" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
        <TouchableOpacity style={styles.testButton} onPress={handleTestSound}>
          <Text style={styles.testText}>Test sound</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFB",
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2e573a",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2e573a",
    textAlign: "center",
    marginVertical: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    flex: 1,
    alignItems: "center",
  },

  picker: {
    width: "100%",
    height: 160,
  },
  pickerItem: {
    fontSize: 18,
  },
 
  inputBox: {
    width: "85%",
    height: 60,
    borderRadius: 18,
    backgroundColor: "#f4f1ee",
    textAlign: "center",
    fontSize: 24,
    color: "#2e573a",
  },
  pickerLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 999,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  startButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 999,
    paddingVertical: 14,
    backgroundColor: "#F8a91f",
    alignItems: "center",
  },
  cancelText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 16,
  },
  startText: {
    color: "#fde3cf",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  testButton: {
    borderRadius: 999,
    paddingVertical: 12,
    backgroundColor: "#2e573a",
    alignItems: "center",
  },
  testText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});

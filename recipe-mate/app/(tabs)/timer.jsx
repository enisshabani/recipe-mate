import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const SOUND_OPTIONS = [
  { id: "classic", label: "Classic", file: require("../../assets/sounds/timer-end.mp3") },
  { id: "beep", label: "Beep", file: require("../../assets/sounds/timer-end1.mp3") },
  { id: "soft", label: "Soft chime", file: require("../../assets/sounds/timer-end2.mp3") },
];

export default function TimerScreen() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedSoundId, setSelectedSoundId] = useState(SOUND_OPTIONS[0].id);

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
  }, []);

  const playEndSound = async () => {
    try {
      const option = SOUND_OPTIONS.find(o => o.id === selectedSoundId) || SOUND_OPTIONS[0];
      const { sound } = await Audio.Sound.createAsync(option.file);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  useEffect(() => {
    let interval;

    if (isRunning && !isPaused && remaining > 0) {
      interval = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } else if (remaining === 0 && isRunning) {
      setIsRunning(false);
      playEndSound();
      if (Platform.OS === "web") alert("⏱️ Timer finished!");
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, remaining]);

  const handleStart = () => {
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (totalSeconds === 0) return;

    setRemaining(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  const handleRestart = () => {
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (totalSeconds === 0) return;

    setRemaining(totalSeconds);
    setIsPaused(false);
    setIsRunning(true);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemaining(0);
  };

  const handleTimePress = () => {
    if (!isRunning && !isPaused) return handleStart(); // start
    if (isRunning && !isPaused) return handleStop();   // stop
    if (!isRunning && isPaused) return handleResume(); // resume
  };

  let displayH, displayM, displayS;

  if (remaining === 0 && !isRunning && !isPaused) {
    displayH = String(hours).padStart(2, "0");
    displayM = String(minutes).padStart(2, "0");
    displayS = String(seconds).padStart(2, "0");
  } else {
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    displayH = String(h).padStart(2, "0");
    displayM = String(m).padStart(2, "0");
    displayS = String(s).padStart(2, "0");
  }

  const renderHourInput = () => {
    if (Platform.OS === "ios") {
      return (
        <TextInput
          style={styles.inputBox}
          keyboardType="number-pad"
          maxLength={2}
          value={String(hours)}
          onChangeText={text => {
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
        onValueChange={value => setHours(Number(value))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
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
          onChangeText={text => {
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
        onValueChange={value => setMinutes(Number(value))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
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
          onChangeText={text => {
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
        onValueChange={value => setSeconds(Number(value))}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <Picker.Item key={i} label={`${i}`} value={i} />
        ))}
      </Picker>
    );
  };

  const handleTestSound = () => playEndSound();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timer</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <TouchableOpacity 
          style={styles.displayCard}
          activeOpacity={0.7}
          onPress={handleTimePress}
        >
          <Text style={styles.timeText}>
            {displayH}:{displayM}:{displayS}
          </Text>
        </TouchableOpacity>

        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>{renderHourInput()}<Text style={styles.pickerLabel}>hours</Text></View>
          <View style={styles.pickerContainer}>{renderMinuteInput()}<Text style={styles.pickerLabel}>min</Text></View>
          <View style={styles.pickerContainer}>{renderSecondInput()}<Text style={styles.pickerLabel}>sec</Text></View>
        </View>

        <View style={styles.buttonsRow}>

          {isRunning && !isPaused ? (
            <TouchableOpacity style={styles.cancelButton} onPress={handleStop} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Stop</Text>
            </TouchableOpacity>
          ) : isPaused ? (
            <TouchableOpacity style={styles.cancelButton} onPress={handleRestart} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Reset Timer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {!isRunning && !isPaused ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.7}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          ) : null}

          {!isRunning && isPaused ? (
            <TouchableOpacity style={styles.startButton} onPress={handleResume} activeOpacity={0.7}>
              <Text style={styles.startText}>Resume</Text>
            </TouchableOpacity>
          ) : null}

        </View>

        <View style={styles.soundCard}>
          <Text style={styles.soundLabel}>Timer sound</Text>

          <View style={styles.soundPickerWrapper}>
            <Picker
              selectedValue={selectedSoundId}
              onValueChange={value => setSelectedSoundId(value)}
              style={styles.soundPicker}
            >
              {SOUND_OPTIONS.map(opt => (
                <Picker.Item key={opt.id} label={opt.label} value={opt.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.testButton} onPress={handleTestSound} activeOpacity={0.7}>
            <Ionicons name="volume-high" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.testText}>Test sound</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const BOX_WIDTH = 110;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 38,
    backgroundColor: "#2e573a",
    borderBottomWidth: 1,
    borderBottomColor: "#2e573a",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fde3cf",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  displayCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F4A300",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  timeText: {
    fontSize: 56,
    fontWeight: "800",
    color: "#2e573a",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    letterSpacing: 2,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  pickerContainer: {
    width: BOX_WIDTH,
    alignItems: "center",
    marginHorizontal: 8,
  },
  picker: {
    width: "100%",
    height: 80,
  },
  pickerItem: {
    fontSize: 20,
  },
  inputBox: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#2e573a",
  },
  pickerLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 28,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F4A300",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  startButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: "#F4A300",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  cancelText: {
    color: "#2e573a",
    fontWeight: "700",
    fontSize: 16,
  },
  startText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  soundCard: {
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F4A300",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  soundLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e573a",
    marginBottom: 12,
  },
  soundPickerWrapper: {
    borderRadius: 8,
    backgroundColor: "#FFFCFB",
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    marginBottom: 12,
  },
  soundPicker: {
    height: 44,
    width: "100%",
  },
  testButton: {
    flexDirection: "row",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2e573a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  testText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
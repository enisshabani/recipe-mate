
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconSymbol from "@/components/ui/icon-symbol";


export default function ProfileScreen() {
  const backgroundColor = "#FFFCFB";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2e573a";
  const textSecondary = "#666666";
  const deepAccent = "#2e573a";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
          <View style={[styles.avatar, { backgroundColor: deepAccent }]}>
            <IconSymbol name="person.fill" size={48} color="#FFFCFB" />
          </View>
          <Text style={[styles.name, { color: textPrimary }]}>Recipe Chef</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>Cooking enthusiast since 2024</Text>
        </View>

        {/* Your Stats Section */}
        <View style={[styles.statsCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#fde3cf" }]}>
                <IconSymbol name="book.fill" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>3</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Total Recipes</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#fde3cf" }]}>
                <IconSymbol name="heart.fill" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>1</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Favorites</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#fde3cf" }]}>
                <IconSymbol name="clock.fill" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>2h 15m</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Cooking Time</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={[styles.menuCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Menu</Text>
          
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: "#FFFCFB" }]}>
                <IconSymbol name="heart.fill" size={20} color={deepAccent} />
              </View>
              <Text style={[styles.menuItemText, { color: textPrimary }]}>My Favorites</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={deepAccent} />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: "#FFFCFB" }]}>
                <IconSymbol name="gear" size={20} color={deepAccent} />
              </View>
              <Text style={[styles.menuItemText, { color: textPrimary }]}>Settings</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={deepAccent} />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, styles.menuItemLast, pressed && styles.menuItemPressed]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: "#FFFCFB" }]}>
                <IconSymbol name="questionmark.circle.fill" size={20} color={deepAccent} />
              </View>
              <Text style={[styles.menuItemText, { color: textPrimary }]}>Help & Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={deepAccent} />
          </Pressable>
        </View>

        {/* Footer Section */}
        <View style={[styles.footerCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.footerTitle, { color: textPrimary }]}>Recipe Mate</Text>
          <Text style={[styles.footerVersion, { color: textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.footerDescription, { color: textSecondary }]}>
            Your personal recipe collection and cooking companion
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  
  // Profile Card
  profileCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },

  // Stats Card
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0d5ba',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Menu Card
  menuCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFCFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: '#000',
    borderColor: '#F4A300',
    borderWidth: 3,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  menuItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  menuItemLast: {
    marginBottom: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e573a',
  },

  // Footer Card
  footerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

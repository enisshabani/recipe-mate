
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";

export default function ProfileScreen() {
  const theme = useTheme();
  const backgroundColor = '#F5F5DC'; // Beige background
  const cardBackground = '#FFFFFF';
  const textPrimary = '#333333';
  const textSecondary = '#666666';
  const accentColor = '#A0522D'; // Brown accent

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
          <View style={[styles.avatar, { backgroundColor: accentColor }]}>
            <IconSymbol name="person.fill" size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.name, { color: textPrimary }]}>Recipe Chef</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>Cooking enthusiast since 2024</Text>
        </View>

        {/* Your Stats Section */}
        <View style={[styles.statsCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF5E6' }]}>
                <IconSymbol name="book.fill" size={24} color={accentColor} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>3</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Total Recipes</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFE6E6' }]}>
                <IconSymbol name="heart.fill" size={24} color="#D2691E" />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>1</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Favorites</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF5E6' }]}>
                <IconSymbol name="clock.fill" size={24} color={accentColor} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>2h 15m</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Cooking Time</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={[styles.menuCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Menu</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#FFE6E6' }]}>
                <IconSymbol name="heart.fill" size={20} color="#D2691E" />
              </View>
              <Text style={[styles.menuItemText, { color: textPrimary }]}>My Favorites</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#FFF5E6' }]}>
                <IconSymbol name="gear" size={20} color={accentColor} />
              </View>
              <Text style={[styles.menuItemText, { color: textPrimary }]}>Settings</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={textSecondary} />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.menuItemLast]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#FFF5E6' }]}>
                <IconSymbol name="questionmark.circle.fill" size={20} color={accentColor} />
              </View>
              <Text style={[styles.menuItemText, { color: textPrimary }]}>Help & Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={textSecondary} />
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
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Footer Card
  footerCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
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


import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
// import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
// import { IconSymbol } from '@/components/ui/icon-symbol';
import IconSymbol from "@/components/ui/icon-symbol";

import { useTheme } from '@react-navigation/native';

export interface TabBarItem {
  route: string;
  label: string;
  icon: string;
  activeIcon?: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = useSharedValue(0);

  const handleTabPress = (route: string) => {
    console.log('Tab pressed:', route);
    router.push(route as any);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: withSpring(activeIndex.value * tabWidth, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
      width: tabWidth,
    };
  });

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => pathname.includes(tab.route));
    if (index !== -1) {
      activeIndex.value = index;
    }
  }, [pathname, tabs]);

  const tabWidth = containerWidth / tabs.length;

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { marginBottom: bottomMargin }]}
    >
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius,
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            elevation: 8,
          },
        ]}
      >
        {tabs.map((tab, index) => {
          const isActive = pathname.includes(tab.route);
          const iconColor = isActive ? '#A0522D' : '#999999';

          return (
            <TouchableOpacity
              key={tab.route}
              style={[styles.tab, { width: tabWidth }]}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
                size={24}
                color={iconColor}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: iconColor,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { PrimaryActionButton, TabHeader } from '../../components';
import { strings } from '../../utils/strings';
import { useSettings } from './Settings.hook';
import { styles } from './styles';
import { spacing } from '../../theme';
import { useTabBarSpacing } from '../../hooks/useTabBarSpacing';

const SettingsScreen = () => {
  const { clearStatus, handleClearDatabase } = useSettings();
  const tabBarSpacing = useTabBarSpacing(spacing.lg);

  return (
    <View style={styles.container}>
      <TabHeader
        title={strings.settings.title}
        subtitle={strings.settings.subtitle}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpacing }]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.settings.devToolsTitle}</Text>
          <Text style={styles.sectionDescription}>
            {strings.settings.devToolsDescription}
          </Text>
          <PrimaryActionButton
            label={strings.settings.clearDatabaseButton}
            onPress={handleClearDatabase}
            isLoading={clearStatus === 'loading'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

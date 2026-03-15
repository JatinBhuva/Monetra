import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryActionButton } from '../../components';
import { strings } from '../../utils/strings';
import { useSettings } from './Settings.hook';
import { styles } from './styles';

const SettingsScreen = () => {
  const { clearStatus, handleClearDatabase } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.settings.title}</Text>
      <Text style={styles.subtitle}>{strings.settings.subtitle}</Text>
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
    </View>
  );
};

export default SettingsScreen;
